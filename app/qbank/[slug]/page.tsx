// app/qbank/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import BlockCard from "@/components/BlockCard"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ slug: string }> }

interface Block {
  id: string; title: string; description: string | null
  order_index: number; question_count: number
  user_attempts: number; user_correct: number
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from("categories").select("name, description").eq("slug", slug).single()
  if (!cat) return { title: "Not Found | RehabPearls" }
  const url = `${process.env["NEXT_PUBLIC_SITE_URL"]}/qbank/${slug}`
  const title = `${cat.name} Practice Questions | RehabPearls QBank`
  const description = cat.description || `Practice ${cat.name} board-style questions with detailed explanations.`
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "RehabPearls", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect(`/login?next=/qbank/${slug}`)
  const userId = session.user.id

  const { data: category } = await supabase
    .from("categories").select("id, name, description, slug").eq("slug", slug).single()
  if (!category) return notFound()

  const { data: blocksRaw } = await supabase
    .from("qbank_blocks")
    .select(`id, title, description, order_index, qbank_block_questions ( count )`)
    .eq("category_id", category.id)
    .order("order_index", { ascending: true })

  const blockIds = (blocksRaw || []).map((b: any) => b.id)

  const { data: progressRows } = blockIds.length > 0
    ? await supabase.from("user_block_progress").select("block_id, attempts, correct")
        .eq("user_id", userId).in("block_id", blockIds)
    : { data: [] }

  const progressMap: Record<string, { attempts: number; correct: number }> = {}
  ;(progressRows || []).forEach((r: any) => {
    progressMap[r.block_id] = { attempts: r.attempts, correct: r.correct }
  })

  const blocks: Block[] = (blocksRaw || []).map((b: any) => ({
    id: b.id, title: b.title, description: b.description,
    order_index: b.order_index,
    question_count: b.qbank_block_questions?.[0]?.count ?? 0,
    user_attempts: progressMap[b.id]?.attempts ?? 0,
    user_correct: progressMap[b.id]?.correct ?? 0,
  }))

  const { count: totalQuestions } = await supabase
    .from("questions").select("id", { count: "exact", head: true })
    .eq("category_id", category.id).eq("status", "approved")

  const { data: catStats } = await supabase
    .from("user_category_stats").select("attempts, correct")
    .eq("user_id", userId).eq("category_id", category.id).maybeSingle()

  const totalAttempts   = catStats?.attempts ?? 0
  const totalCorrect    = catStats?.correct ?? 0
  const accuracy        = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null
  const completedBlocks = blocks.filter(b => b.user_attempts > 0).length
  const totalQ          = totalQuestions ?? 0

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>

      {/* HEADER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px 24px" }}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
            <Link href="/dashboard" style={{ color: "#9ca3af", textDecoration: "none" }}>Dashboard</Link>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            <Link href="/qbank" style={{ color: "#9ca3af", textDecoration: "none" }}>QBank</Link>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ color: "#111827", fontWeight: 600 }}>{category.name}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>{category.name}</h1>
              {category.description && (
                <p style={{ marginTop: 6, color: "#6b7280", fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
                  {category.description}
                </p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                <Chip icon="📚" text={`${totalQ} questions`} />
                <Chip icon="🗂️" text={`${blocks.length} blocks`} />
                {completedBlocks > 0 && <Chip icon="✅" text={`${completedBlocks}/${blocks.length} done`} green />}
              </div>
            </div>

            {totalAttempts > 0 && (
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <StatBox value={totalAttempts} label="Answered" />
                <StatBox value={totalCorrect} label="Correct" green />
                <StatBox value={`${accuracy}%`} label="Accuracy" green={accuracy != null && accuracy >= 60} amber={accuracy != null && accuracy < 60} />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <Link href={`/qbank/${slug}/test/new`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px",
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14,
              textDecoration: "none", boxShadow: "0 4px 14px rgba(79,70,229,.3)",
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Practice
            </Link>
            <Link href={`/qbank/${slug}/test/new?mode=timed`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", background: "#fff",
              border: "1.5px solid #e8eaed", color: "#374151",
              borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              ⏱ Timed Mode
            </Link>
          </div>
        </div>
      </div>

      {/* BLOCKS */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px" }}>
        {blocks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#fff", borderRadius: 16, border: "2px dashed #e8eaed" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "#6b7280" }}>No blocks yet</p>
            <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>Content is being prepared.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              Study Blocks · {blocks.length} total
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {blocks.map((block, i) => (
                <BlockCard key={block.id} block={block} index={i} slug={slug} />
              ))}
            </div>

            {totalQ > 0 && (
              <div style={{
                marginTop: 24,
                background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
                border: "1.5px solid #c7d2fe", borderRadius: 16,
                padding: "22px 24px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                gap: 16, flexWrap: "wrap",
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#312e81", fontSize: 16, margin: 0 }}>
                    Ready to practice all {totalQ} questions?
                  </p>
                  <p style={{ fontSize: 13, color: "#6366f1", margin: "4px 0 0" }}>
                    Build a custom test across all {blocks.length} blocks
                  </p>
                </div>
                <Link href={`/qbank/${slug}/test/new`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  color: "#fff", borderRadius: 10, fontWeight: 700,
                  fontSize: 14, textDecoration: "none", flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(79,70,229,.3)",
                }}>
                  🚀 Build Test
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Chip({ icon, text, green }: { icon: string; text: string; green?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 13, fontWeight: 500, padding: "4px 12px", borderRadius: 99,
      background: green ? "#f0fdf4" : "#f3f4f6",
      color: green ? "#16a34a" : "#6b7280",
    }}>{icon} {text}</span>
  )
}

function StatBox({ value, label, green, amber }: { value: string | number; label: string; green?: boolean; amber?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 14, padding: "14px 18px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.05)", minWidth: 72 }}>
      <p style={{ fontSize: 24, fontWeight: 800, color: green ? "#16a34a" : amber ? "#d97706" : "#111827", margin: 0 }}>{value}</p>
      <p style={{ fontSize: 10, color: "#9ca3af", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</p>
    </div>
  )
}