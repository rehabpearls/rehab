// app/qbank/[slug]/test/new/page.tsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import TestBuilderClient from "./TestBuilderClient"

export default async function TestBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/qbank/${slug}/test/new`)

  // Category
  const { data: category } = await supabase
    .from("categories").select("id, name, slug").eq("slug", slug).single()
  if (!category) notFound()

  // Blocks з кількістю питань
  const { data: blocks } = await supabase
    .from("qbank_blocks")
    .select("id, title, order_index, qbank_block_questions(count)")
    .eq("category_id", category.id)
    .order("order_index")

  const blocksWithCount = (blocks || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    question_count: b.qbank_block_questions?.[0]?.count ?? 0,
  }))

  // Статистика юзера для фільтрів
  const { count: unusedCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("category_id", category.id)
    .eq("status", "approved")
    .not("id", "in",
      `(SELECT question_id FROM user_question_status WHERE user_id = '${user.id}' AND status != 'unused')`
    )

  const { count: incorrectCount } = await supabase
    .from("user_question_status")
    .select("question_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "incorrect")

  const { count: markedCount } = await supabase
    .from("user_question_status")
    .select("question_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_marked", true)

  const { count: totalCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("category_id", category.id)
    .eq("status", "approved")

  return (
    <TestBuilderClient
      category={category}
      blocks={blocksWithCount}
      stats={{
        total: totalCount || 0,
        unused: unusedCount || 0,
        incorrect: incorrectCount || 0,
        marked: markedCount || 0,
      }}
    />
  )
}