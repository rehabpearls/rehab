// app/qbank/[slug]/test/new/TestBuilderClient.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

interface Block { id: string; title: string; question_count: number }
interface Props {
  category: { id: string; name: string; slug: string }
  blocks: Block[]
  stats: { total: number; unused: number; incorrect: number; marked: number }
}

type QFilter   = "all" | "unused" | "incorrect" | "marked"
type TestMode  = "tutor" | "timed" | "untimed"

export default function TestBuilderClient({ category, blocks, stats }: Props) {
  const router = useRouter()
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(blocks.map(b => b.id))
  const [qFilter,        setQFilter]        = useState<QFilter>("all")
  const [qCount,         setQCount]         = useState(40)
  const [mode,           setMode]           = useState<TestMode>("tutor")
  const [timePerQ,       setTimePerQ]       = useState(90) // секунди
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState("")

  const allSelected = selectedBlocks.length === blocks.length

  function toggleBlock(id: string) {
    setSelectedBlocks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }
  function toggleAll() {
    setSelectedBlocks(allSelected ? [] : blocks.map(b => b.id))
  }

  const filterCount = qFilter === "unused" ? stats.unused
    : qFilter === "incorrect" ? stats.incorrect
    : qFilter === "marked" ? stats.marked
    : stats.total

  const maxQ = Math.min(filterCount, 120)

  async function startTest() {
    if (selectedBlocks.length === 0) { setError("Select at least one block"); return }
    if (qCount < 1) { setError("At least 1 question"); return }
    setLoading(true); setError("")

    try {
      const res = await fetch("/api/test/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: category.id,
          blockIds: selectedBlocks,
          qFilter,
          qCount,
          mode,
          timeLimit: mode === "timed" ? qCount * timePerQ : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create test")
      router.push(`/qbank/${category.slug}/test/${data.sessionId}`)
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/qbank" className="hover:text-gray-700">QBank</Link>
          <span>›</span>
          <Link href={`/qbank/${category.slug}`} className="hover:text-gray-700">{category.name}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">New Test</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Build Your Test</h1>

        <div className="space-y-4">

          {/* Question source */}
          <Section title="Question Pool">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {([
                { val: "all",       label: "All",       count: stats.total,     color: "indigo" },
                { val: "unused",    label: "Unused",    count: stats.unused,    color: "gray"   },
                { val: "incorrect", label: "Incorrect", count: stats.incorrect, color: "red"    },
                { val: "marked",    label: "Marked",    count: stats.marked,    color: "amber"  },
              ] as const).map(opt => (
                <button key={opt.val} onClick={() => setQFilter(opt.val)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    qFilter === opt.val
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}>
                  <p className={`text-lg font-bold ${qFilter===opt.val?"text-indigo-700":"text-gray-800"}`}>
                    {opt.count}
                  </p>
                  <p className={`text-xs font-semibold mt-0.5 ${qFilter===opt.val?"text-indigo-500":"text-gray-400"}`}>
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
          </Section>

          {/* Blocks */}
          <Section title={`Blocks (${selectedBlocks.length}/${blocks.length} selected)`}>
            <button onClick={toggleAll}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-3 block">
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {blocks.map(block => (
                <label key={block.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={selectedBlocks.includes(block.id)}
                    onChange={() => toggleBlock(block.id)}
                    className="w-4 h-4 accent-indigo-600 rounded"/>
                  <span className="flex-1 text-sm font-medium text-gray-800">{block.title}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {block.question_count}Q
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Question count */}
          <Section title="Number of Questions">
            <div className="flex items-center gap-4">
              <input type="range" min={5} max={maxQ} step={5} value={qCount}
                onChange={e => setQCount(Number(e.target.value))}
                className="flex-1 accent-indigo-600"/>
              <div className="flex items-center gap-2">
                <input type="number" min={1} max={maxQ} value={qCount}
                  onChange={e => setQCount(Math.min(maxQ, Math.max(1, Number(e.target.value))))}
                  className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-indigo-400"/>
                <span className="text-sm text-gray-400">/ {maxQ}</span>
              </div>
            </div>
            {/* Quick picks */}
            <div className="flex gap-2 mt-3">
              {[10, 20, 40, maxQ].filter((v,i,a)=>a.indexOf(v)===i&&v<=maxQ).map(n => (
                <button key={n} onClick={() => setQCount(n)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    qCount===n ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-300"
                  }`}>
                  {n === maxQ ? "Max" : n}
                </button>
              ))}
            </div>
          </Section>

          {/* Mode */}
          <Section title="Test Mode">
            <div className="grid grid-cols-3 gap-2">
              {([
                { val:"tutor",   emoji:"📖", label:"Tutor",    desc:"See answers immediately" },
                { val:"untimed", emoji:"🧘", label:"Practice", desc:"No time pressure"       },
                { val:"timed",   emoji:"⏱",  label:"Timed",    desc:"Exam simulation"        },
              ] as const).map(m => (
                <button key={m.val} onClick={() => setMode(m.val)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    mode===m.val ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}>
                  <span className="text-xl">{m.emoji}</span>
                  <p className={`text-sm font-bold mt-1 ${mode===m.val?"text-indigo-700":"text-gray-800"}`}>{m.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{m.desc}</p>
                </button>
              ))}
            </div>

            {mode === "timed" && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-sm text-amber-700 font-medium">Seconds per question:</span>
                <div className="flex gap-2">
                  {[60, 90, 120].map(s => (
                    <button key={s} onClick={() => setTimePerQ(s)}
                      className={`text-sm font-bold px-3 py-1 rounded-lg transition-all ${
                        timePerQ===s ? "bg-amber-500 text-white" : "bg-white border border-amber-300 text-amber-600"
                      }`}>
                      {s}s
                    </button>
                  ))}
                </div>
                <span className="text-xs text-amber-500 ml-auto">
                  Total: {Math.floor(qCount*timePerQ/60)}m {qCount*timePerQ%60}s
                </span>
              </div>
            )}
          </Section>

          {error && (
            <p className="text-sm text-red-600 font-medium text-center">{error}</p>
          )}

          {/* Start */}
          <button onClick={startTest} disabled={loading || selectedBlocks.length===0}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-indigo-200 transition-all">
            {loading ? "Creating test..." : `🚀 Start Test · ${qCount} Questions`}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}