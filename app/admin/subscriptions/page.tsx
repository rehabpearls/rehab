'use client'

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Завантаження підписок
  const fetchSubscriptions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`id, user_id, plan, status, start_date, end_date, profiles(email)`)
      .order("start_date", { ascending: false })
      .limit(100)

    if (error) {
      console.error(error)
      setError("Error loading subscriptions")
    } else {
      setSubscriptions(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  // Зміна статусу підписки
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      console.error("Status update error:", error)
      alert("Failed to update status")
    } else {
      fetchSubscriptions()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin — Subscriptions</h1>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p>Loading subscriptions...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Plan</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Start Date</th>
                <th className="border px-3 py-2">End Date</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="border px-3 py-2">{sub.profiles?.email}</td>
                  <td className="border px-3 py-2">{sub.plan}</td>
                  <td className="border px-3 py-2">{sub.status}</td>
                  <td className="border px-3 py-2">
                    {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => updateStatus(sub.id, "active")}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => updateStatus(sub.id, "canceled")}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscriptions.length === 0 && (
            <p className="mt-4 text-gray-600">No subscriptions found</p>
          )}
        </div>
      )}
    </div>
  )
}

