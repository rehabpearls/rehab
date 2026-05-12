"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  question: string
  options: Record<string, string>
  correct_answers: string[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

interface SessionQuestion {
  id: string
  position: number
  selected: string[] | null
  is_correct: boolean | null
  is_marked: boolean
  time_spent: number
  question: Question
}

interface Session {
  id: string
  mode: string
  total_q: number
  answered_q: number
  correct_q: number
  time_spent: number
  created_at: string
  completed_at: string
}

export default function TestResultsClient({
  session,
  sessionQuestions,
  slug,
}: {
  session: Session
  sessionQuestions: SessionQuestion[]
  slug: string
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect" | "marked">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const score = session.answered_q > 0
    ? Math.round((session.correct_q / session.answered_q) * 100)
    : 0

  const scoreColor = score >= 70 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626"
  const scoreBg = score >= 70 ? "#ecfdf5" : score >= 50 ? "#fffbeb" : "#fef2f2"

  const filtered = sessionQuestions.filter(q => {
    if (filter === "correct") return q.is_correct === true
    if (filter === "incorrect") return q.is_correct === false
    if (filter === "marked") return q.is_marked
    return true
  })

  const formatTime = (s: number) => {
    if (!s) return "—"
    const m = Math.floor(s / 60)
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
  }

  const diffColor = (d: string) =>
    d === "easy" ? "#059669" : d === "medium" ? "#d97706" : "#dc2626"
  const diffBg = (d: string) =>
    d === "easy" ? "#ecfdf5" : d === "medium" ? "#fffbeb" : "#fef2f2"

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.push(`/qbank/${slug}`)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 14, fontWeight: 600 }}>
          ← Back to QBank
        </button>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Test Results</div>
        <button
          onClick={() => router.push(`/qbank/${slug}/test/new`)}
          style={{
            padding: "7px 16px", background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
          New Test
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>

        {/* Score card */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb",
          padding: "32px", marginBottom: 24, textAlign: "center",
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px",
            background: scoreBg, border: `4px solid ${scoreColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: scoreColor,
          }}>
            {score}%
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>
            {score >= 70 ? "Great work! 🎉" : score >= 50 ? "Good effort! 💪" : "Keep practicing! 📚"}
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            {session.correct_q} correct out of {session.answered_q} answered
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            {[
              { label: "Score", value: `${score}%`, color: scoreColor, bg: scoreBg },
              { label: "Correct", value: session.correct_q, color: "#059669", bg: "#ecfdf5" },
              { label: "Incorrect", value: session.answered_q - session.correct_q, color: "#dc2626", bg: "#fef2f2" },
              { label: "Unanswered", value: session.total_q - session.answered_q, color: "#6b7280", bg: "#f3f4f6" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 20px", background: s.bg, borderRadius: 12, minWidth: 80,
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["all", "correct", "incorrect", "marked"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === f ? "#111827" : "#fff",
              color: filter === f ? "#fff" : "#6b7280",
              border: `1px solid ${filter === f ? "#111827" : "#e5e7eb"}`,
            }}>
              {f === "all" ? `All (${sessionQuestions.length})` :
               f === "correct" ? `✅ Correct (${sessionQuestions.filter(q => q.is_correct).length})` :
               f === "incorrect" ? `❌ Incorrect (${sessionQuestions.filter(q => q.is_correct === false).length})` :
               `🔖 Marked (${sessionQuestions.filter(q => q.is_marked).length})`}
            </button>
          ))}
        </div>

        {/* Questions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((sq, i) => (
            <div key={sq.id} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
              overflow: "hidden",
              borderLeft: `4px solid ${sq.is_correct === true ? "#059669" : sq.is_correct === false ? "#dc2626" : "#e5e7eb"}`,
            }}>
              {/* Question header (always visible) */}
              <div
                onClick={() => setExpandedId(expandedId === sq.id ? null : sq.id)}
                style={{
                  padding: "14px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: sq.is_correct === true ? "#ecfdf5" : sq.is_correct === false ? "#fef2f2" : "#f3f4f6",
                  border: `2px solid ${sq.is_correct === true ? "#6ee7b7" : sq.is_correct === false ? "#fca5a5" : "#e5e7eb"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  color: sq.is_correct === true ? "#059669" : sq.is_correct === false ? "#dc2626" : "#9ca3af",
                }}>
                  {sq.is_correct === true ? "✓" : sq.is_correct === false ? "✗" : sq.position}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 500, color: "#111827",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0,
                  }}>
                    {sq.question.question}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99,
                      background: diffBg(sq.question.difficulty), color: diffColor(sq.question.difficulty),
                    }}>
                      {sq.question.difficulty}
                    </span>
                    {sq.is_marked && <span style={{ fontSize: 10, color: "#d97706" }}>🔖 marked</span>}
                    {sq.time_spent > 0 && <span style={{ fontSize: 10, color: "#9ca3af" }}>⏱ {formatTime(sq.time_spent)}</span>}
                  </div>
                </div>
                <span style={{ fontSize: 18, color: "#9ca3af" }}>{expandedId === sq.id ? "∧" : "∨"}</span>
              </div>

              {/* Expanded: full Q&A */}
              {expandedId === sq.id && (
                <div style={{ borderTop: "1px solid #f3f4f6", padding: "18px 18px 18px 60px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#111827", marginBottom: 16 }}>
                    {sq.question.question}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {Object.entries(sq.question.options).map(([key, value]) => {
                      const correct = sq.question.correct_answers.includes(key)
                      const chosen = sq.selected?.includes(key)
                      return (
                        <div key={key} style={{
                          padding: "10px 14px", borderRadius: 9, fontSize: 13,
                          background: correct ? "#f0fdf4" : chosen ? "#fef2f2" : "#f9fafb",
                          border: `1.5px solid ${correct ? "#6ee7b7" : chosen ? "#fca5a5" : "#f3f4f6"}`,
                          display: "flex", gap: 10, alignItems: "flex-start",
                          color: "#374151",
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            background: correct ? "#059669" : chosen ? "#dc2626" : "#e5e7eb",
                            color: "#fff", fontSize: 10, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {correct ? "✓" : chosen ? "✗" : key}
                          </span>
                          {value}
                        </div>
                      )
                    })}
                  </div>
                  {sq.question.explanation && (
                    <div style={{
                      padding: "12px 16px", background: "#fffbeb",
                      borderRadius: 10, borderLeft: "3px solid #f59e0b",
                      fontSize: 13, lineHeight: 1.7, color: "#374151",
                    }}>
                      <span style={{ fontWeight: 700, color: "#d97706" }}>Explanation: </span>
                      {sq.question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
          <button
            onClick={() => router.push(`/qbank/${slug}/test/new`)}
            style={{
              padding: "12px 28px", background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
            New Test
          </button>
          <button
            onClick={() => router.push(`/qbank/${slug}`)}
            style={{
              padding: "12px 24px", background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
            Back to QBank
          </button>
        </div>
      </div>
    </div>
  )
}