import React from "react"

export default function Badge({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
      {children}
    </span>
  )
}