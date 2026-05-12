// app/api/test/save-elapsed/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, elapsed } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await supabase
      .from("test_sessions")
      .update({ elapsed_time: elapsed })
      .eq("id", sessionId)
      .eq("user_id", user.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
