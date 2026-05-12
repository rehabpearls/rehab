// app/api/ai/import-questions/route.ts
// ALL-IN-ONE: parse chunk + save to DB server-side
// Browser sends text chunks, server does Gemini + Supabase inserts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 120

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-2.5-flash",
  "gemini-flash-latest",
]

async function callGemini(text: string, chunkIndex: number, totalChunks: number): Promise<string> {
  const prompt = `Extract ALL multiple-choice questions from this text. Return ONLY valid JSON, no markdown.

{"blocks":[{"blockName":"Topic (auto-detect from content)","questions":[{"question":"Full question text","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answers":["B"],"explanation":"Why this answer is correct (1-2 sentences)","difficulty":"easy|medium|hard"}]}]}

Rules:
- Extract EVERY question, skip nothing
- Group into logical topic blocks
- correct_answers = array of correct option letter(s)
- difficulty: easy=recall, medium=apply, hard=analyze
- Generate a brief explanation if none exists
- This is part ${chunkIndex + 1} of ${totalChunks}

TEXT:
${text}`

  let lastError = ""
  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env["GEMINI_API_KEY"]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 65536 },
        }),
      }
    )
    const data = await res.json()
    if (res.ok) return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    lastError = data.error?.message ?? `${model} failed`
    const isModelError = lastError.includes("not found") || lastError.includes("not supported")
    const isQuota = lastError.includes("quota") || lastError.includes("RESOURCE_EXHAUSTED")
    if (!isModelError && !isQuota) throw new Error(lastError)
  }
  throw new Error(lastError)
}

function parseGeminiJSON(raw: string): { blockName: string; questions: any[] }[] {
  let text = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  const start = text.indexOf("{")
  if (start === -1) throw new Error("No JSON found in Gemini response")
  text = text.slice(start)

  // Try direct parse first
  try {
    return JSON.parse(text).blocks ?? []
  } catch {
    // Try removing last incomplete item
    const fixes = [
      () => { // cut at last complete difficulty field
        const last = text.lastIndexOf('"difficulty"')
        if (last === -1) throw new Error("no difficulty field")
        const close = text.indexOf("}", last)
        return JSON.parse(text.slice(0, close + 1) + "\n]}]}").blocks ?? []
      },
      () => { // cut at last ,"{ 
        const last = text.lastIndexOf(',{"question"')
        if (last === -1) throw new Error("no question boundary")
        return JSON.parse(text.slice(0, last) + "\n]}]}").blocks ?? []
      },
      () => { // cut at last complete "}
        const last = text.lastIndexOf('"}')
        if (last === -1) throw new Error("no closing")
        return JSON.parse(text.slice(0, last + 2) + "\n]}]}").blocks ?? []
      },
    ]
    for (const fix of fixes) {
      try { return fix() } catch { continue }
    }
    throw new Error("Cannot parse Gemini JSON after all repair attempts")
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    if (!process.env["GEMINI_API_KEY"]) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 })

    const { text, chunkIndex, totalChunks, categoryId, blockOverrides } = await req.json()
    // blockOverrides: optional map of blockName → customName

    // 1. Parse with Gemini
    const raw = await callGemini(text, chunkIndex, totalChunks)
    const blocks = parseGeminiJSON(raw)

    // 2. Save to DB — batch insert per block
    let saved = 0
    const blockResults: { blockName: string; count: number }[] = []

    for (const block of blocks) {
      if (!block.questions?.length) continue

      const blockName = blockOverrides?.[block.blockName] ?? block.blockName ?? "General"

      // Find or create block
      let blockId: string
      const { data: existing } = await supabase
        .from("qbank_blocks").select("id")
        .eq("category_id", categoryId).ilike("title", blockName).maybeSingle()

      if (existing) {
        blockId = existing.id
      } else {
        const { data: nb, error: bErr } = await supabase
          .from("qbank_blocks")
          .insert({ title: blockName, category_id: categoryId, order_index: 0 })
          .select("id").single()
        if (bErr || !nb) continue
        blockId = nb.id
      }

      // Batch insert questions (50 at a time)
      const validQuestions = block.questions.filter((q: any) => q?.question?.trim())
      const BATCH = 50

      for (let i = 0; i < validQuestions.length; i += BATCH) {
        const batch = validQuestions.slice(i, i + BATCH)
        const rows = batch.map((q: any) => ({
          question: q.question.trim(),
          options: q.options ?? {},
          correct_answers: q.correct_answers ?? [],
          explanation: q.explanation ?? "",
          difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium",
          category_id: categoryId,
          status: "approved",
          image_url: "",
        }))

        const { data: inserted, error: qErr } = await supabase
          .from("questions").insert(rows).select("id")

        if (qErr || !inserted?.length) continue

        // Link questions to block
        const links = inserted.map((q: any) => ({ block_id: blockId, question_id: q.id }))
        await supabase.from("qbank_block_questions").insert(links)
        saved += inserted.length
      }

      blockResults.push({ blockName, count: validQuestions.length })
    }

    return NextResponse.json({
      saved,
      blocks: blockResults,
      chunkIndex,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
