"use client"
// components/BlockCard.tsx

import Link from "next/link"
import { useState } from "react"

interface Block {
  id: string
  title: string
  description: string | null
  question_count: number
  user_attempts: number
  user_correct: number
}

export default function BlockCard({ block, index, slug }: {
  block: Block; index: number; slug: string
}) {
  const [hovered, setHovered] = useState(false)
  const done = block.user_attempts > 0
  const acc  = done ? Math.round((block.user_correct / block.user_attempts) * 100) : null
  const pct  = block.question_count > 0 && done
    ? Math.min(100, Math.round((block.user_correct / block.question_count) * 100))
    : 0

  return (
    <Link
      href={`/qbank/${slug}/block/${block.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        background: "#fff",
        border: `1.5px solid ${hovered ? "#a5b4fc" : "#e8eaed"}`,
        borderRadius: 14, padding: "16px 20px",
        textDecoration: "none",
        boxShadow: hovered ? "0 4px 16px rgba(79,70,229,.1)" : "none",
        transition: "border-color .15s, box-shadow .15s",
      }}
    >
      {/* Index / done indicator */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: done ? "#f0fdf4" : "#eef2ff",
        color: done ? "#16a34a" : "#4f46e5",
        fontWeight: 700, fontSize: 13,
      }}>
        {done
          ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          : String(index + 1).padStart(2, "0")
        }
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 15, fontWeight: 600,
          color: hovered ? "#4f46e5" : "#111827",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color .15s",
        }}>
          {block.title}
        </p>
        {block.description && (
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {block.description}
          </p>
        )}
        {done && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 3, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", width: 160 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 60 ? "#22c55e" : "#f59e0b", borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
              {block.user_correct}/{block.user_attempts} correct ·{" "}
              <span style={{ color: acc! >= 60 ? "#16a34a" : "#d97706", fontWeight: 600 }}>{acc}%</span>
            </p>
          </div>
        )}
      </div>

      {/* Right badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "4px 10px", borderRadius: 99 }}>
          {block.question_count} Q
        </span>
        {done && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 9px", borderRadius: 99 }}>
            Done ✓
          </span>
        )}
        <svg width="16" height="16" fill="none" stroke={hovered ? "#a5b4fc" : "#d1d5db"} strokeWidth="2" viewBox="0 0 24 24" style={{ transition: "stroke .15s" }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </Link>
  )
}
