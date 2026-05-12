// app/qbank/[slug]/practice/page.tsx
// Redirects to Test Builder with all blocks pre-selected

import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PracticePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect(`/login?next=/qbank/${slug}/practice`)

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single()

  if (!category) return notFound()

  // Redirect to Test Builder — the proper entry point
  redirect(`/qbank/${slug}/test/new`)
}