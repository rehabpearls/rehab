"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Block {
  id: string; title: string; description?: string
  order_index: number; question_count?: number
}
interface Category {
  id: string; name: string; slug: string; description?: string
}

const DIFF_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  easy:   { bg: "#ecfdf5", color: "#059669", label: "Beginner" },
  medium: { bg: "#fffbeb", color: "#d97706", label: "Intermediate" },
  hard:   { bg: "#fef2f2", color: "#dc2626", label: "Advanced" },
}

function getBlockDifficulty(index: number) {
  if (index < 3) return "easy"
  if (index < 7) return "medium"
  return "hard"
}

export default function QBankCategoryClient({ category, blocks, totalQuestions }: {
  category: Category
  blocks: Block[]
  totalQuestions: number
}) {
  const router = useRouter()
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

  const totalBlocks = blocks.length
  const hasContent  = totalBlocks > 0

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .block-card { transition: all .18s ease; }
        .block-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1) !important; border-color: #a5b4fc !important; }
        .start-btn:hover { box-shadow: 0 6px 20px rgba(79,70,229,.45) !important; transform: translateY(-1px); }
        .start-btn { transition: all .15s; }
        .breadcrumb-link:hover { color: #4f46e5 !important; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px", animation: "fadeUp .3s ease" }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
          <Link href="/" className="breadcrumb-link" style={{ color: "#9ca3af", textDecoration: "none", transition: "color .15s" }}>Home</Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <Link href="/qbank" className="breadcrumb-link" style={{ color: "#9ca3af", textDecoration: "none", transition: "color .15s" }}>QBank</Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <span style={{ color: "#374151", fontWeight: 600 }}>{category.name}</span>
        </nav>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
          borderRadius: 20, padding: "32px 36px", marginBottom: 32,
          position: "relative", overflow: "hidden",
          boxShadow: "0 4px 24px rgba(79,70,229,.25)",
        }}>
          {/* BG blobs */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
          <div style={{ position: "absolute", bottom: -50, left: 100, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Category tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>QBank Category</span>
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1.2 }}>
              {category.name}
            </h1>

            {category.description && (
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: 20, maxWidth: 540, lineHeight: 1.6 }}>
                {category.description}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Questions", value: totalQuestions, icon: "📝" },
                { label: "Blocks",    value: totalBlocks,    icon: "📦" },
                { label: "Format",    value: "Board-style",  icon: "🎯" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, padding: "10px 18px", backdropFilter: "blur(8px)" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.icon} {s.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {!hasContent ? (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "64px 32px", background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Content Coming Soon</h2>
            <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
              We're preparing high-quality {category.name} practice questions. Check back soon!
            </p>
            <Link href="/qbank" style={{ display: "inline-block", padding: "12px 28px", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", borderRadius: 11, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              ← Browse Other Categories
            </Link>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Study Blocks</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Choose a topic block to start practicing</p>
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", background: "#f3f4f6", padding: "6px 14px", borderRadius: 99, fontWeight: 500 }}>
                {totalBlocks} blocks available
              </div>
            </div>

            {/* Block grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {blocks.map((block, idx) => {
                const diff     = getBlockDifficulty(idx)
                const diffCfg = DIFF_COLORS[diff] ?? {
  bg: "#fffbeb",
  color: "#d97706",
  label: "Intermediate",
}
                const qCount   = block.question_count || 0
                const isHov    = hoveredBlock === block.id

                return (
                  <Link
                    key={block.id}
                    href={`/qbank/${category.slug}/${block.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="block-card"
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 16,
                        padding: "22px",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {/* Block header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                          background: isHov ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#eef2ff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, transition: "all .18s",
                        }}>
                          {isHov ? "▶" : "📖"}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: diffCfg.bg, color: diffCfg.color }}>
                          {diffCfg.label}
                        </span>
                      </div>

                      {/* Title */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.35, marginBottom: 6 }}>
                          {block.title}
                        </h3>
                        {block.description && (
                          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>{block.description}</p>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>📝</span>
                          <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                            {qCount} question{qCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700, color: isHov ? "#4f46e5" : "#9ca3af",
                          transition: "color .15s", display: "flex", alignItems: "center", gap: 4,
                        }}>
                          Start {isHov ? "→" : "›"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div style={{
              marginTop: 32, background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
              border: "1px solid #c7d2fe", borderRadius: 16, padding: "24px 28px",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#3730a3", marginBottom: 4 }}>
                  Ready to practice all {totalQuestions} questions?
                </p>
                <p style={{ fontSize: 13, color: "#6366f1" }}>
                  Start a custom session with questions from all {totalBlocks} blocks
                </p>
              </div>
              <button
                className="start-btn"
                onClick={() => router.push(`/qbank/${category.slug}/practice`)}
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  border: "none", borderRadius: 11,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(79,70,229,.3)",
                  whiteSpace: "nowrap",
                }}
              >
                🚀 Start Full Practice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}