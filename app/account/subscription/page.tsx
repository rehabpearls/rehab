'use client'

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

type Subscription = {
  id: string
  plan: string
  status: "active" | "canceled" | "expired" | string
  end_date: string | null
  created_at?: string
}

export default function SubscriptionPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData?.session?.user

        if (!user) {
          setLoading(false)
          return
        }

        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        setSubs(data || [])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const formatDate = (date?: string | null) => {
    if (!date) return "—"

    const d = new Date(date)
    if (isNaN(d.getTime())) return "Invalid date"

    return d.toLocaleDateString()
  }

  const getStatus = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200"
      case "canceled":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "expired":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const activePlan = subs.find(s => s.status === "active")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading your subscription...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-16">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-extrabold text-indigo-700">
          Subscription Dashboard
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Manage your RehabPearls plan, billing and access
        </p>
      </div>

      {/* OVERVIEW CARD */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="bg-white border shadow-lg rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-gray-500 text-sm">Current Plan</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {activePlan?.plan || "No active plan"}
            </h2>

            <p className="text-gray-500 mt-2">
              {activePlan
                ? `Valid until ${formatDate(activePlan.end_date)}`
                : "Upgrade to unlock full access"}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              href="/pricing"
              className="inline-flex bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
            >
              Upgrade Plan
            </Link>
          </div>

        </div>
      </div>

      {/* EMPTY STATE */}
      {subs.length === 0 && (
        <div className="max-w-3xl mx-auto bg-white border rounded-3xl p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-800">
            No subscription found
          </h2>
          <p className="text-gray-600 mt-3">
            You currently don’t have any active plan.
          </p>

          <Link
            href="/pricing"
            className="inline-flex mt-6 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
          >
            View Pricing
          </Link>
        </div>
      )}

      {/* SUBSCRIPTIONS LIST */}
      {subs.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6">

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Billing History
          </h3>

          {subs.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-3xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >

              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  {s.plan} Plan
                </h4>

                <p className="text-gray-500 mt-1">
                  Started: {formatDate(s.created_at)}
                </p>

                <p className="text-gray-500">
                  Expires: {formatDate(s.end_date)}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <span
                  className={`px-4 py-2 rounded-full text-sm border font-semibold ${getStatus(
                    s.status
                  )}`}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* FOOT CTA */}
      <div className="max-w-5xl mx-auto mt-14 text-center">
        <p className="text-gray-600 mb-4">
          Need more access to QBank & Clinical Cases?
        </p>

        <Link
          href="/pricing"
          className="inline-flex bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          Upgrade Your Plan
        </Link>
      </div>

    </main>
  )
}