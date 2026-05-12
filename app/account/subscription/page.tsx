'use client'

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
export default function SubscriptionPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSubs = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)

      setSubs(data || [])
      setLoading(false)
    }
    getSubs()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Your Subscriptions</h1>
      {subs.map((s) => (
        <div key={s.id} className="mt-4 border p-4 rounded-lg bg-white shadow">
          <p>Plan: {s.plan}</p>
          <p>Status: {s.status}</p>
          <p>Valid until: {new Date(s.end_date).toLocaleDateString()}</p>
        </div>
      ))}
      <Link
        href="/pricing"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Go to Pricing
      </Link>
    </div>
  )
}

