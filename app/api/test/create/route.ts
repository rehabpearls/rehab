// app/api/test/create/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { categoryId, blockIds, qFilter, qCount, mode, timeLimit } = await req.json()

    // ── Вибираємо питання ────────────────────────────────────────
    let query = supabase
      .from("qbank_block_questions")
      .select("question_id, questions!inner(id, status, category_id)")
      .in("block_id", blockIds)
      .eq("questions.status", "approved")
      .eq("questions.category_id", categoryId)

    const { data: blockQs } = await query
    let questionIds = [...new Set((blockQs || []).map((r: any) => r.question_id))] as string[]

    // Фільтр по статусу
    if (qFilter !== "all" && questionIds.length > 0) {
      if (qFilter === "unused") {
        // Питання яких немає в user_question_status або status = unused
        const { data: seenQs } = await supabase
          .from("user_question_status")
          .select("question_id")
          .eq("user_id", user.id)
          .neq("status", "unused")
        const seenIds = new Set((seenQs || []).map((r: any) => r.question_id))
        questionIds = questionIds.filter(id => !seenIds.has(id))
      } else {
        const statusFilter = qFilter === "incorrect" ? "status" : "is_marked"
        const statusValue  = qFilter === "incorrect" ? "incorrect" : true
        const { data: filteredQs } = await supabase
          .from("user_question_status")
          .select("question_id")
          .eq("user_id", user.id)
          .eq(statusFilter, statusValue)
          .in("question_id", questionIds)
        questionIds = (filteredQs || []).map((r: any) => r.question_id)
      }
    }

    if (questionIds.length === 0) {
      return NextResponse.json({ error: "No questions match your filters" }, { status: 400 })
    }

    // Shuffle + limit
    const shuffled = questionIds.sort(() => Math.random() - 0.5).slice(0, qCount)

    // ── Створюємо сесію ──────────────────────────────────────────
    const { data: session, error: sErr } = await supabase
      .from("test_sessions")
      .insert({
        user_id:    user.id,
        category_id: categoryId,
        status:     "active",
        mode,
        time_limit: timeLimit,
        total_q:    shuffled.length,
      })
      .select("id").single()

    if (sErr || !session) throw new Error("Failed to create session")

    // ── Вставляємо питання в сесію ───────────────────────────────
    const sessionQs = shuffled.map((qId, i) => ({
      session_id:  session.id,
      question_id: qId,
      position:    i + 1,
    }))

    const { error: sqErr } = await supabase
      .from("test_session_questions")
      .insert(sessionQs)

    if (sqErr) throw new Error("Failed to add questions to session")

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
