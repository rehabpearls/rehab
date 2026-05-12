// app/qbank/[slug]/test/[sessionId]/results/page.tsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import TestResultsClient from "./TestResultsClient"

export default async function TestResultsPage({
  params,
}: {
  params: Promise<{ slug: string; sessionId: string }>
}) {
  const { slug, sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: session } = await supabase
    .from("test_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) notFound()

 const { data: sessionQuestions } = await supabase
  .from("test_session_questions")
  .select(`
    id, position, selected, is_correct, is_marked, time_spent,
    question:questions(id, question, options, correct_answers, explanation, difficulty)
  `)
  .eq("session_id", sessionId)
  .order("position")

const normalizedSessionQuestions = (sessionQuestions ?? []).map((sq: any) => ({
  ...sq,
  question: Array.isArray(sq.question) ? sq.question[0] : sq.question,
}))

return (
  <TestResultsClient
    session={session}
    sessionQuestions={normalizedSessionQuestions}
    slug={slug}
  />
)
}