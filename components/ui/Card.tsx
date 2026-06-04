import React from "react"

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition ${className}`}
    >
      {children}
    </div>
  )
}