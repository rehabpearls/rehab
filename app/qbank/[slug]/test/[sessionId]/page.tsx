// app/qbank/[slug]/test/[sessionId]/page.tsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import TestActiveClient from "./TestActiveClient"

export default async function TestActivePage({
  params,
}: {
  params: Promise<{ slug: string; sessionId: string }>
}) {
  const { slug, sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Load session
  const { data: session } = await supabase
    .from("test_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) notFound()
  if (session.status === "completed") {
    redirect(`/qbank/${slug}/test/${sessionId}/results`)
  }

  // Load session question IDs first
  const { data: sessionQRows, error: sqError } = await supabase
    .from("test_session_questions")
    .select("id, position, selected, is_correct, is_marked, time_spent, question_id")
    .eq("session_id", sessionId)
    .order("position")

  if (sqError) console.error("sessionQ error:", sqError)
  if (!sessionQRows?.length) return notFound()

  // Load full question data separately
  const questionIds = sessionQRows.map((r: any) => r.question_id)
  const { data: questionsData, error: qError } = await supabase
    .from("questions")
    .select("id, question, options, correct_answers, explanation, difficulty")
    .in("id", questionIds)

  if (qError) console.error("questions error:", qError)

  const questionsMap: Record<string, any> = {}
  ;(questionsData || []).forEach((q: any) => { questionsMap[q.id] = q })

  const sessionQuestions = sessionQRows.map((r: any) => ({
    ...r,
    question: questionsMap[r.question_id] ?? null,
  }))

  return (
    <TestActiveClient
      session={session}
      sessionQuestions={sessionQuestions}
      slug={slug}
    />
  )
}