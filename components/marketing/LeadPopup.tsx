"use client"

import { useState } from "react"

export default function LeadPopup() {
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 🔥 Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-indigo-700 transition z-50"
      >
        🚀 Get Free Access
      </button>

      {/* 🔥 Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative">

            <h2 className="text-2xl font-bold mb-4">
              Get Free Practice Access
            </h2>

            {success ? (
              <div className="text-green-600 font-medium">
                ✅ Check your email to confirm your subscription.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error && (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Join Now"}
                </button>
              </>
            )}

            {/* Close */}
            <button
              onClick={() => {
                setOpen(false)
                setSuccess(false)
                setError("")
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

