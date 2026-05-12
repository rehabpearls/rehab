// app/api/ai/extract-pdf/route.ts
// Витягує текст з PDF без зовнішніх пакетів — через Anthropic API

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60 // збільшуємо timeout для великих файлів

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { base64, startPage, endPage } = body

    if (!base64) return NextResponse.json({ error: "No PDF data" }, { status: 400 })
    if (!process.env["ANTHROPIC_API_KEY"]) {
  return NextResponse.json({ error: "No API key" }, { status: 500 })
}

    // Відправляємо PDF + просимо тільки витягнути текст (без AI аналізу)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // Haiku — дешевше і швидше для витягування тексту
        max_tokens: 8000,
        messages: [{
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            },
            {
              type: "text",
              text: `Extract ALL questions from pages ${startPage} to ${endPage} of this document. 
Return ONLY valid JSON, no markdown, no explanation.

{"blocks":[{"blockName":"Topic name","questions":[{"question":"Full question text","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answers":["B"],"explanation":"Brief explanation","difficulty":"easy|medium|hard"}]}]}

Rules:
- Extract every single question on these pages
- Group by topic  
- Generate short explanation if missing
- difficulty: easy=recall, medium=apply, hard=analyze`
            }
          ]
        }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Anthropic error" }, { status: response.status })
    }

    return NextResponse.json(data)

  } catch (err: any) {
    console.error("extract-pdf error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
