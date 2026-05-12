// app/api/ai/parse-questions/route.ts
// Отримує вже витягнутий ТЕКСТ (не base64 PDF) — набагато менше токенів

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    if (!process.env["GEMINI_API_KEY"]) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 })

    const { text: pdfText, chunkIndex, totalChunks } = await req.json()

    const prompt = `Extract ALL questions from this text. Return ONLY valid JSON — no markdown, no backticks.

{"blocks":[{"blockName":"Topic name (auto-detect)","questions":[{"question":"Full question text","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answers":["B"],"explanation":"Why correct (1-2 sentences)","difficulty":"easy|medium|hard"}]}]}

Rules: extract every question, group by topic, generate explanation if missing.
${totalChunks > 1 ? `This is part ${chunkIndex + 1} of ${totalChunks}.` : ""}

Text:
${pdfText}`

    const models = ["gemini-2.5-flash-lite-preview-09-2025", "gemini-2.5-flash", "gemini-flash-latest"]
    let lastError = ""

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env["GEMINI_API_KEY"]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 65536 }
          })
        }
      )

      const data = await response.json()
      if (response.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        return NextResponse.json({ text, model })
      }

      lastError = data.error?.message || `${model} failed`
      if (!lastError.includes("not found") && !lastError.includes("not supported") && !lastError.includes("quota")) break
    }

    return NextResponse.json({ error: lastError }, { status: 429 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
