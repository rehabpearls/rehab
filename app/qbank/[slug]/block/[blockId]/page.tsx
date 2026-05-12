// app/qbank/[slug]/block/[blockId]/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
// ── Types ──────────────────────────────────────────────────────────
interface Question {
  id: string
  question: string
  options: Record<string, string>
  correct_answers: string[]
  explanation: string | null
  difficulty: "easy" | "medium" | "hard"
  image_url: string | null
}

interface BlockInfo {
  id: string
  title: string
  description: string | null
  category_id: string
}

type Mode = "quiz" | "results"

// ── Difficulty config ──────────────────────────────────────────────
const DIFF_CFG: Record<string, { bg: string; color: string }> = {
  easy:   { bg: "#f0fdf4", color: "#16a34a" },
  medium: { bg: "#fffbeb", color: "#b45309" },
  hard:   { bg: "#fff1f2", color: "#dc2626" },
}

// ══════════════════════════════════════════════════════════════════════
export default function BlockQuizPage() {
  const router  = useRouter()
  const params  = useParams()
  const slug    = params["slug"]    as string
  const blockId = params["blockId"] as string

  const [loading,   setLoading]   = useState(true)
  const [block,     setBlock]     = useState<BlockInfo | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userId,    setUserId]    = useState<string | null>(null)

  // Quiz state
  const [current,  setCurrent]  = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers,  setAnswers]  = useState<Record<string, string>>({}) // qId → chosen key
  const [mode,     setMode]     = useState<Mode>("quiz")
  const [saving,   setSaving]   = useState(false)

  // ── Init ───────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      setLoading(true)

      // Auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace(`/login?next=/qbank/${slug}/block/${blockId}`)
        return
      }
      setUserId(session.user.id)

      // Block info
      const { data: blockData } = await supabase
        .from("qbank_blocks")
        .select("id, title, description, category_id")
        .eq("id", blockId)
        .single()

      if (!blockData) { router.replace(`/qbank/${slug}`); return }
      setBlock(blockData)

      // Get question IDs for this block
      const { data: bqRows } = await supabase
        .from("qbank_block_questions")
        .select("question_id")
        .eq("block_id", blockId)

      const ids = (bqRows || []).map((r: any) => r.question_id)
      if (!ids.length) { setLoading(false); return }

      // Fetch questions
      const { data: qData } = await supabase
        .from("questions")
        .select("id, question, options, correct_answers, explanation, difficulty, image_url")
        .in("id", ids)
        .eq("status", "approved")

      setQuestions(qData || [])
      setLoading(false)
    }
    init()
  }, [blockId, slug, router])

  // ── Derived ────────────────────────────────────────────────────
  const q        = questions[current]
  const totalQ   = questions.length
  const isLast   = current === totalQ - 1
  const progress = totalQ > 0
    ? Math.round(((current + (revealed ? 1 : 0)) / totalQ) * 100)
    : 0

  // ── Quiz handlers ──────────────────────────────────────────────
  function handleSelect(key: string) {
    if (revealed) return
    setSelected(key)
  }

  function handleReveal() {
    if (!selected || !q) return
    setRevealed(true)
    setAnswers(prev => ({ ...prev, [q.id]: selected }))
  }

  function handleNext() {
    if (isLast) {
      finishBlock()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // ── Finish: save progress ──────────────────────────────────────
  const finishBlock = useCallback(async () => {
    if (!userId || !block) { setMode("results"); return }
    setSaving(true)

    // Count final answer for current question if not yet in answers
    const finalAnswers = { ...answers }
    if (q && selected && !finalAnswers[q.id]) {
      finalAnswers[q.id] = selected
    }

    const correctCount = questions.filter((qq) => {
  const answer = finalAnswers[qq.id]
  return !!answer && qq.correct_answers.includes(answer)
}).length

    const attempted = Object.keys(finalAnswers).length

    // Save block progress
    await supabase.rpc("upsert_block_progress", {
      p_user_id:  userId,
      p_block_id: block.id,
      p_attempts: attempted,
      p_correct:  correctCount,
    })

    // Update category stats
    await supabase.rpc("upsert_category_stats", {
      p_user_id:     userId,
      p_category_id: block.category_id,
      p_attempts:    attempted,
      p_correct:     correctCount,
    })

    setAnswers(finalAnswers)
    setSaving(false)
    setMode("results")
  }, [userId, block, answers, questions, q, selected])

  // ── Score ──────────────────────────────────────────────────────
  const scoreCorrect = questions.filter((qq) => {
  const answer = answers[qq.id]
  return !!answer && qq.correct_answers.includes(answer)
}).length
  // ── Restart ────────────────────────────────────────────────────
  function restart() {
    setCurrent(0); setSelected(null)
    setRevealed(false); setAnswers({})
    setMode("quiz")
  }

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f8fa" }}>
      <div style={{ width:32, height:32, borderRadius:"50%", border:"2.5px solid #e5e7eb", borderTopColor:"#4f46e5", animation:"spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!totalQ) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"#f7f8fa" }}>
      <p style={{ fontSize:20, fontWeight:600, color:"#6b7280" }}>No questions in this block yet.</p>
      <Link href={`/qbank/${slug}`} style={{ color:"#4f46e5", fontSize:14, textDecoration:"none", fontWeight:500 }}>← Back to {slug}</Link>
    </div>
  )

  // ── RESULTS VIEW ──────────────────────────────────────────────
  if (mode === "results") {
    const pct = totalQ > 0 ? Math.round((scoreCorrect / totalQ) * 100) : 0
    const grade = pct >= 80 ? "Excellent! 🏆" : pct >= 60 ? "Good Work! ✅" : "Keep Practicing 📚"
    const gradeColor = pct >= 80 ? "#16a34a" : pct >= 60 ? "#b45309" : "#dc2626"

    return (
      <div style={{ minHeight:"100vh", background:"#f7f8fa", fontFamily:"'Inter',system-ui,sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 24px" }}>

          {/* Score card */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:24, padding:"40px 32px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,.06)", marginBottom:28 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background: pct>=60?"#f0fdf4":"#fff1f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 18px" }}>
              {pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "📚"}
            </div>
            <p style={{ fontSize:48, fontWeight:800, color:"#111827", letterSpacing:"-0.03em", marginBottom:4 }}>{pct}%</p>
            <p style={{ fontSize:18, fontWeight:700, color:gradeColor, marginBottom:6 }}>{grade}</p>
            <p style={{ fontSize:14, color:"#9ca3af" }}>{scoreCorrect} correct out of {totalQ} questions</p>

            <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:28 }}>
              <button onClick={restart}
                style={{ padding:"11px 24px", background:"#4f46e5", border:"none", borderRadius:12, color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                Retry Block
              </button>
              <Link href={`/qbank/${slug}`}
                style={{ padding:"11px 24px", background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, color:"#374151", fontWeight:600, fontSize:14, textDecoration:"none", display:"inline-flex", alignItems:"center" }}>
                ← Back to Category
              </Link>
            </div>
          </div>

          {/* Answer review */}
          <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Review Answers</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {questions.map((qq, i) => {
              const chosen  = answers[qq.id]
              const correct = chosen && qq.correct_answers.includes(chosen)
              return (
                <div key={qq.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:18, overflow:"hidden" }}>
                  {/* Question */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px 20px", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ width:24, height:24, borderRadius:"50%", background:correct?"#dcfce7":"#fee2e2", color:correct?"#16a34a":"#dc2626", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      {correct ? "✓" : "✗"}
                    </span>
                    <p style={{ fontSize:14, fontWeight:500, color:"#1f2937", lineHeight:1.5, flex:1 }}>
                      <span style={{ color:"#9ca3af", marginRight:8 }}>Q{i+1}.</span>{qq.question}
                    </p>
                  </div>

                  {/* Options grid */}
                  <div style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {Object.entries(qq.options).filter(([,v]) => String(v).trim()).map(([key, val]) => {
                      const isCorrectOpt = qq.correct_answers.includes(key)
                      const isChosen     = key === chosen
                      const bg     = isCorrectOpt ? "#f0fdf4" : (isChosen && !correct ? "#fff1f2" : "#f9fafb")
                      const border = isCorrectOpt ? "#86efac" : (isChosen && !correct ? "#fca5a5" : "#e5e7eb")
                      const txtC   = isCorrectOpt ? "#166534" : (isChosen && !correct ? "#991b1b" : "#374151")
                      const ltrBg  = isCorrectOpt ? "#22c55e" : "#e5e7eb"
                      const ltrC   = isCorrectOpt ? "#fff"    : "#9ca3af"
                      return (
                        <div key={key} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:bg, border:`1px solid ${border}`, borderRadius:10 }}>
                          <span style={{ width:24, height:24, borderRadius:7, background:ltrBg, color:ltrC, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{key}</span>
                          <span style={{ fontSize:13, color:txtC, flex:1, lineHeight:1.4 }}>{String(val)}</span>
                          {isCorrectOpt && <span style={{ fontSize:10, color:"#16a34a", fontWeight:700, whiteSpace:"nowrap" }}>✓ Correct</span>}
                          {isChosen && !correct && <span style={{ fontSize:10, color:"#dc2626", fontWeight:600, whiteSpace:"nowrap" }}>Your answer</span>}
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {qq.explanation && (
                    <div style={{ margin:"0 20px 16px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px" }}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#b45309", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Explanation</p>
                      <p style={{ fontSize:13, color:"#78350f", lineHeight:1.55 }}>{qq.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
if (!q) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f8fa" }}>
      <p style={{ fontSize:16, color:"#6b7280" }}>Question not found.</p>
    </div>
  )
}
  // ── QUIZ VIEW ──────────────────────────────────────────────────
  const isCorrect = revealed && selected && q.correct_answers.includes(selected)
  const isWrong   = revealed && selected && !q.correct_answers.includes(selected)
  const diffCfg = DIFF_CFG[q.difficulty] ?? DIFF_CFG["medium"]!

  return (
    <div style={{ minHeight:"100vh", background:"#f7f8fa", display:"flex", flexDirection:"column", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        button:disabled { opacity:.4; cursor:not-allowed !important; }
      `}</style>

      {/* ── TOP BAR ── */}
      <header style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, zIndex:30 }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"0 24px", height:56, display:"flex", alignItems:"center", gap:16 }}>
          <Link href={`/qbank/${slug}`} style={{ color:"#9ca3af", display:"flex", flexShrink:0, textDecoration:"none" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>

          <div style={{ flex:1 }}>
            <p style={{ fontSize:12, color:"#9ca3af", marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {block?.title}
            </p>
            {/* Progress bar */}
            <div style={{ height:4, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"#4f46e5", borderRadius:99, transition:"width .3s ease" }} />
            </div>
          </div>

          <span style={{ fontSize:13, fontWeight:600, color:"#6b7280", flexShrink:0, fontVariantNumeric:"tabular-nums" }}>
            {current + 1} / {totalQ}
          </span>
        </div>
      </header>

      {/* ── QUESTION AREA ── */}
      <div style={{ flex:1, maxWidth:760, margin:"0 auto", width:"100%", padding:"28px 24px", display:"flex", flexDirection:"column", gap:18, animation:"fadeUp .2s ease" }}>

        {/* Diff badge */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:99, background:diffCfg.bg, color:diffCfg.color }}>
            {q.difficulty}
          </span>
          {q.image_url && (
            <span style={{ fontSize:12, color:"#9ca3af", display:"flex", alignItems:"center", gap:4 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              Image attached
            </span>
          )}
        </div>

        {/* Question card */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, padding:"24px 28px", boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
          {q.image_url && (
            <img
              src={q.image_url}
              alt="Question image"
              style={{ width:"100%", borderRadius:12, marginBottom:18, maxHeight:280, objectFit:"cover" }}
            />
          )}
          <p style={{ fontSize:17, fontWeight:600, color:"#111827", lineHeight:1.6 }}>{q.question}</p>
        </div>

        {/* Options */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {Object.entries(q.options)
            .filter(([, v]) => String(v).trim())
            .map(([key, val]) => {
              const isCorrectOpt = q.correct_answers.includes(key)
              const isChosen     = key === selected

              // Compute styles without mixing border/borderColor
              let borderColor = "#e5e7eb"
              let bgColor     = "#fff"
              let textColor   = "#374151"
              let ltrBg       = "#f3f4f6"
              let ltrColor    = "#9ca3af"

              if (!revealed) {
                if (isChosen) {
                  borderColor = "#4f46e5"; bgColor = "#eef2ff"
                  textColor = "#3730a3"; ltrBg = "#4f46e5"; ltrColor = "#fff"
                }
              } else {
                if (isCorrectOpt) {
                  borderColor = "#86efac"; bgColor = "#f0fdf4"
                  textColor = "#166534"; ltrBg = "#22c55e"; ltrColor = "#fff"
                } else if (isChosen) {
                  borderColor = "#fca5a5"; bgColor = "#fff1f2"
                  textColor = "#991b1b"; ltrBg = "#ef4444"; ltrColor = "#fff"
                } else {
                  bgColor = "#fafafa"; textColor = "#9ca3af"
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={revealed}
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"14px 18px", borderRadius:16,
                    border:`1.5px solid ${borderColor}`,
                    background:bgColor, color:textColor,
                    cursor: revealed ? "default" : "pointer",
                    textAlign:"left", width:"100%",
                    transition:"all .12s",
                  }}
                >
                  <span style={{ width:32, height:32, borderRadius:9, background:ltrBg, color:ltrColor, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {key}
                  </span>
                  <span style={{ fontSize:14, fontWeight:500, flex:1, lineHeight:1.45 }}>{String(val)}</span>
                  {revealed && isCorrectOpt && (
                    <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {revealed && isChosen && !isCorrectOpt && (
                    <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                </button>
              )
            })}
        </div>

        {/* Result banner */}
        {revealed && (
          <div style={{
            display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
            background: isCorrect ? "#f0fdf4" : "#fff1f2",
            border: `1px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
            borderRadius:14, animation:"fadeUp .15s ease",
          }}>
            <span style={{ fontSize:22 }}>{isCorrect ? "✅" : "❌"}</span>
            <div>
              <p style={{ fontWeight:700, fontSize:14, color: isCorrect ? "#166534" : "#991b1b" }}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              {isWrong && (
                <p style={{ fontSize:12, color:"#dc2626", marginTop:2 }}>
                  Correct answer: {q.correct_answers.join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Explanation */}
        {revealed && q.explanation && (
          <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:16, padding:"16px 20px", animation:"fadeUp .15s ease" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#b45309", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Explanation</p>
            <p style={{ fontSize:14, color:"#78350f", lineHeight:1.6 }}>{q.explanation}</p>
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div style={{ background:"#fff", borderTop:"1px solid #e5e7eb", position:"sticky", bottom:0 }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, color:"#9ca3af", fontVariantNumeric:"tabular-nums" }}>
            {Object.keys(answers).length} / {totalQ} answered
          </span>

          {!revealed ? (
            <button
              onClick={handleReveal}
              disabled={!selected}
              style={{ padding:"11px 28px", background:"#4f46e5", border:"none", borderRadius:12, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", letterSpacing:"0.01em" }}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={saving}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", background:"#111827", border:"none", borderRadius:12, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}
            >
              {saving ? (
                <>
                  <div style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }} />
                  Saving…
                </>
              ) : isLast ? "Finish & See Results →" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}