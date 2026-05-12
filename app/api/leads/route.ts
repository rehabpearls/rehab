import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("leads")
      .insert([{ email }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

