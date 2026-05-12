// app/api/ai/list-models/route.ts
// Тимчасовий route щоб побачити які моделі доступні
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env["GEMINI_API_KEY"]}`
  )
  const data = await res.json()
  const models = (data.models || [])
    .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m: any) => m.name)
  return NextResponse.json({ models })
}
