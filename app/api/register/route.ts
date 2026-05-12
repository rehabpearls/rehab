import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || "",
      },
    },
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    user: data.user,
  })
}