import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const body = await req.json()

  const { error } = await supabase
    .from("questions")
    .insert([
      {
        question_text: body.question_text,
        category: body.category,
        option_a: body.option_a,
        option_b: body.option_b,
        option_c: body.option_c,
        option_d: body.option_d,
        correct_answer: body.correct_answer,
      },
    ])

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}