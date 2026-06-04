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
  end_date: string
}

export default function SubscriptionPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSubs = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error(error)
        }

        setSubs(data || [])
      } finally {
        setLoading(false)
      }
    }

    getSubs()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "canceled":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "expired":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading subscriptions...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700">
          Your Subscriptions
        </h1>
        <p className="text-gray-600 mt-3">
          Manage your RehabPearls plan and billing history
        </p>
      </div>

      {/* EMPTY STATE */}
      {subs.length === 0 && (
        <div className="max-w-2xl mx-auto bg-white border rounded-3xl p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No active subscriptions
          </h2>
          <p className="text-gray-600 mb-6">
            You don’t have any subscription yet. Choose a plan to unlock full access.
          </p>

          <Link
            href="/pricing"
            className="inline-flex bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition"
          >
            View Pricing Plans
          </Link>
        </div>
      )}

      {/* LIST */}
      {subs.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {subs.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-3xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              
              {/* LEFT */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {s.plan} Plan
                </h2>

                <p className="text-gray-600 mt-1">
                  Valid until{" "}
                  <span className="font-medium">
                    {new Date(s.end_date).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* RIGHT */}
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                
                <span
                  className={`px-3 py-1 rounded-full text-sm border font-medium ${getStatusColor(
                    s.status
                  )}`}
                >
                  {s.status}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <Link
          href="/pricing"
          className="inline-flex bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition shadow"
        >
          Upgrade Plan
        </Link>

        <p className="text-gray-500 mt-3 text-sm">
          Need help? Contact support anytime
        </p>
      </div>

    </main>
  )
}