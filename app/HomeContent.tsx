'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
export default function HomeContent() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <main className="min-h-screen overflow-x-hidden font-sans bg-white text-gray-800">
      {/* Твої UI компоненти тут… */}
    </main>
  )
}
