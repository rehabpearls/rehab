'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { hasActiveSubscription } from "@/lib/subscription"
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setLoading(false)
        return
      }

      const ok = await hasActiveSubscription(session.user.id)
      setHasAccess(ok)

      if (ok) {
        const { data: qs } = await supabase
          .from("questions")
          .select("*")
          .order("created_at", { ascending: false })
        setQuestions(qs || [])
      }
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <p className="text-center p-8">Loading...</p>

  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Access Required</h2>
        <p className="mt-4 text-gray-600">
          To access exam questions, you need an active subscription.
        </p>
        <Link
          href="/pricing"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          View Plans
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Questions Bank</h1>
      {questions.map((q) => (
        <div key={q.id} className="border p-4 rounded-lg bg-white shadow">
          <p className="font-semibold">{q.question}</p>
        </div>
      ))}
    </div>
  )
}

