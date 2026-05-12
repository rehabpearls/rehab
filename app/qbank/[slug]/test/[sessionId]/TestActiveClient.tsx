"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

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
  mode: "tutor" | "timed" | "untimed"
  time_limit: number | null
  elapsed_time: number | null   // ← added
  total_q: number
  answered_q: number
  correct_q: number
  status: string
}

export default function TestActiveClient({
  session,
  sessionQuestions,
  slug,
}: {
  session: Session
  sessionQuestions: SessionQuestion[]
  slug: string
}) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [questions, setQuestions] = useState<SessionQuestion[]>(sessionQuestions ?? [])
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [finishing, setFinishing] = useState(false)

  // ── Timer ────────────────────────────────────────────────────────
  const initialTimeLeft = (() => {
    if (!session || session.mode !== "timed" || !session.time_limit) return null
    const elapsed = session.elapsed_time ?? 0
    return Math.max(0, session.time_limit - elapsed)
  })()

  // Store timeLeft in a ref — avoids stale closures in intervals
  const timeLeftRef = useRef<number | null>(initialTimeLeft)
  const [timeLeftDisplay, setTimeLeftDisplay] = useState<number | null>(initialTimeLeft)

  const questionStartRef = useRef(Date.now())
  const [qTime, setQTime] = useState(0)
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
const elapsedSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const q = questions[current]

  // Tick every second
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setQTime(p => p + 1)

      if (timeLeftRef.current !== null) {
        timeLeftRef.current = Math.max(0, timeLeftRef.current - 1)
        setTimeLeftDisplay(timeLeftRef.current)

       if (timeLeftRef.current <= 0) {
  if (timerRef.current) {
    clearInterval(timerRef.current)
  }

  handleFinish()
}
      }
    }, 1000)
   return () => {
  if (timerRef.current) {
    clearInterval(timerRef.current)
  }
}
  }, []) // run once — no stale closure because we use ref

  // Save elapsed_time to DB every 5s + on unload/visibility
  useEffect(() => {
    if (session.mode !== "timed" || !session.time_limit) return

    const saveElapsed = () => {
      const elapsed = (session.time_limit ?? 0) - (timeLeftRef.current ?? 0)
      // Use sendBeacon for unload (non-blocking)
      navigator.sendBeacon(
        `/api/test/save-elapsed`,
        JSON.stringify({ sessionId: session.id, elapsed })
      )
    }

    const saveElapsedAsync = async () => {
      const elapsed = (session.time_limit ?? 0) - (timeLeftRef.current ?? 0)
      await supabase
        .from("test_sessions")
        .update({ elapsed_time: elapsed })
        .eq("id", session.id)
    }

    elapsedSaveRef.current = setInterval(saveElapsedAsync, 5_000)

    window.addEventListener("beforeunload", saveElapsed)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveElapsedAsync()
    })

    return () => {
      if (elapsedSaveRef.current) {
  clearInterval(elapsedSaveRef.current)
}
      window.removeEventListener("beforeunload", saveElapsed)
    }
  }, [])

  // Reset per-question state when navigating
  useEffect(() => {
    if (!q) return
    questionStartRef.current = Date.now()
    setQTime(0)
    setSelected(q.selected ?? [])
    setSubmitted(q.selected !== null)
    setShowExplanation(false)
  }, [current])

  if (!q) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f8fa", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #e8eaed", borderTopColor: "#4f46e5", animation: "spin .7s linear infinite" }} />
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading questions…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const isAnswered = q.selected !== null
  const isTutor = session.mode === "tutor"
  const answeredCount = questions.filter(q => q.selected !== null).length
  const correctCount = questions.filter(q => q.is_correct === true).length

  async function handleSubmit() {
    if (!q || !selected.length || submitted) return
    const correct = q.question.correct_answers
    const isCorrect = selected.length === correct.length && selected.every(a => correct.includes(a))
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000)

    setQuestions(prev => prev.map((sq, i) =>
      i === current ? { ...sq, selected, is_correct: isCorrect } : sq
    ))
    setSubmitted(true)
    if (isTutor) setShowExplanation(true)

    await supabase
      .from("test_session_questions")
      .update({ selected, is_correct: isCorrect, time_spent: elapsed, answered_at: new Date().toISOString() })
      .eq("id", q.id)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from("user_question_status")
        .upsert({
          user_id: user.id,
          question_id: q.question.id,
          status: isCorrect ? "correct" : "incorrect",
          last_seen_at: new Date().toISOString(),
        }, { onConflict: "user_id,question_id" })
    }

    await supabase
      .from("test_sessions")
      .update({ answered_q: answeredCount + 1, correct_q: correctCount + (isCorrect ? 1 : 0) })
      .eq("id", session.id)
  }

  async function toggleMark() {
      if (!q) return

    const newMarked = !q.is_marked
    setQuestions(prev => prev.map((sq, i) =>
      i === current ? { ...sq, is_marked: newMarked } : sq
    ))
    await supabase
      .from("test_session_questions")
      .update({ is_marked: newMarked })
      .eq("id", q.id)
  }

  async function handleFinish() {
    if (finishing) return
    setFinishing(true)
    // Save final elapsed before finishing
    if (session.mode === "timed" && session.time_limit) {
      const elapsed = session.time_limit - (timeLeftRef.current ?? 0)
      await supabase.from("test_sessions").update({ elapsed_time: elapsed }).eq("id", session.id)
    }
    await supabase
      .from("test_sessions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", session.id)
    router.push(`/qbank/${slug}/test/${session.id}/results`)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`
  const diffColor = (d: string) => d === "easy" ? "#059669" : d === "medium" ? "#d97706" : "#dc2626"
  const diffBg   = (d: string) => d === "easy" ? "#ecfdf5" : d === "medium" ? "#fffbeb" : "#fef2f2"

  const optionState = (key: string) => {
    if (!submitted) return selected.includes(key) ? "selected" : "idle"
    const correct = q.question.correct_answers.includes(key)
    const chosen  = (q.selected ?? selected).includes(key)
    if (correct) return "correct"
    if (chosen && !correct) return "wrong"
    return "idle"
  }

  const optionStyle = (key: string): React.CSSProperties => {
    const s = optionState(key)
    return {
      width: "100%", textAlign: "left", padding: "13px 16px", borderRadius: 10, border: "2px solid",
      borderColor: s === "correct" ? "#059669" : s === "wrong" ? "#dc2626" : s === "selected" ? "#4f46e5" : "#e5e7eb",
      background: s === "correct" ? "#f0fdf4" : s === "wrong" ? "#fef2f2" : s === "selected" ? "#eef2ff" : "#fff",
      cursor: submitted ? "default" : "pointer",
      display: "flex", alignItems: "flex-start", gap: 12,
      transition: "all .15s", fontSize: 14, color: "#111827", fontFamily: "inherit",
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push(`/qbank/${slug}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 20, padding: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Question {current + 1} <span style={{ color: "#9ca3af" }}>/ {questions.length}</span></div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>{answeredCount} answered · {correctCount} correct</div>
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: 320, margin: "0 24px" }}>
          <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${(answeredCount / questions.length) * 100}%`, background: "linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius: 99, transition: "width .3s ease" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {timeLeftDisplay !== null && (
            <div style={{ padding: "5px 12px", borderRadius: 8, background: timeLeftDisplay < 60 ? "#fef2f2" : "#f3f4f6", color: timeLeftDisplay < 60 ? "#dc2626" : "#374151", fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              ⏱ {formatTime(timeLeftDisplay)}
            </div>
          )}
          <div style={{ padding: "4px 10px", borderRadius: 6, background: session.mode === "tutor" ? "#eff6ff" : "#f0fdf4", color: session.mode === "tutor" ? "#2563eb" : "#059669", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {session.mode}
          </div>
          <button onClick={handleFinish} disabled={finishing} style={{ padding: "7px 16px", background: "#111827", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {finishing ? "Saving..." : "End Test"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 24 }}>
          <div>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "28px 32px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: diffBg(q.question.difficulty), color: diffColor(q.question.difficulty) }}>{q.question.difficulty}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>#{current + 1}</span>
                </div>
                <button onClick={toggleMark} style={{ background: q.is_marked ? "#fffbeb" : "none", border: `1px solid ${q.is_marked ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: q.is_marked ? "#d97706" : "#9ca3af", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  {q.is_marked ? "🔖 Marked" : "🔖 Mark"}
                </button>
              </div>

              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#111827", fontWeight: 500, marginBottom: 24 }}>{q.question.question}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(q.question.options).map(([key, value]) => (
                  <button key={key} onClick={() => { if (submitted) return; setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]) }} style={optionStyle(key)}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: optionState(key) === "idle" ? "#f3f4f6" : optionState(key) === "selected" ? "#4f46e5" : optionState(key) === "correct" ? "#059669" : "#dc2626", color: optionState(key) === "idle" ? "#6b7280" : "#fff", fontSize: 12, fontWeight: 700 }}>
                      {optionState(key) === "correct" ? "✓" : optionState(key) === "wrong" ? "✗" : key}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.5 }}>{value}</span>
                  </button>
                ))}
              </div>

              {!submitted && (
                <button onClick={handleSubmit} disabled={!selected.length} style={{ marginTop: 20, width: "100%", padding: "13px", background: !selected.length ? "#e5e7eb" : "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "none", borderRadius: 10, color: !selected.length ? "#9ca3af" : "#fff", fontSize: 14, fontWeight: 700, cursor: !selected.length ? "not-allowed" : "pointer" }}>
                  Submit Answer
                </button>
              )}
            </div>

            {submitted && (isTutor || showExplanation) && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "24px 32px", borderLeft: `4px solid ${q.is_correct ? "#059669" : "#dc2626"}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: q.is_correct ? "#059669" : "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
                  {q.is_correct ? "✅ Correct!" : "❌ Incorrect"}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Correct answer: {q.question.correct_answers.join(", ")}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{q.question.explanation || "No explanation available."}</p>
              </div>
            )}

            {submitted && !isTutor && !showExplanation && (
              <button onClick={() => setShowExplanation(true)} style={{ padding: "10px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151", marginTop: 0 }}>
                Show Explanation
              </button>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <button onClick={() => { if (current > 0) setCurrent(p => p - 1) }} disabled={current === 0} style={{ padding: "10px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: current === 0 ? "not-allowed" : "pointer", color: current === 0 ? "#d1d5db" : "#374151" }}>← Previous</button>
              {current < questions.length - 1
                ? <button onClick={() => setCurrent(p => p + 1)} style={{ padding: "10px 20px", background: "#111827", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>Next →</button>
                : <button onClick={handleFinish} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#059669,#0891b2)", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>Finish Test ✓</button>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 72 }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Questions</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
                {questions.map((sq, i) => {
                  const isCur = i === current
                  const answered = sq.selected !== null
                  const isCorr = sq.is_correct === true
                  return (
                    <button key={i} onClick={() => setCurrent(i)} style={{ width: "100%", aspectRatio: "1", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `2px solid ${isCur ? "#4f46e5" : answered ? (isCorr ? "#6ee7b7" : "#fca5a5") : "#e5e7eb"}`, background: isCur ? "#4f46e5" : answered ? (isCorr ? "#ecfdf5" : "#fef2f2") : "#f9fafb", color: isCur ? "#fff" : answered ? (isCorr ? "#059669" : "#dc2626") : "#6b7280", cursor: "pointer", position: "relative" }}>
                      {i + 1}
                      {sq.is_marked && <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", border: "1.5px solid #fff" }} />}
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
                {[{ color: "#ecfdf5", border: "#6ee7b7", label: "Correct" }, { color: "#fef2f2", border: "#fca5a5", label: "Incorrect" }, { color: "#f9fafb", border: "#e5e7eb", label: "Unanswered" }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: `1.5px solid ${l.border}` }} />
                    <span style={{ fontSize: 11, color: "#6b7280" }}>{l.label}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%" }} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>Marked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}