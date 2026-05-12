"use client"

import { useState, useCallback, useEffect } from "react"

interface Category { id: string; name: string }
interface BlockResult { blockName: string; count: number }
interface ChunkResult { chunkIndex: number; saved: number; blocks: BlockResult[]; error?: string }

const CHARS_PER_CHUNK = 8000
const DELAY_MS = 13000
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function splitText(text: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size) {
    const c = text.slice(i, i + size).trim()
    if (c.length > 20) chunks.push(c)
  }
  return chunks
}

type LogType = "info" | "ok" | "err" | "wait"
const logColor = (t: LogType) =>
  t === "ok" ? "#4ade80" : t === "err" ? "#f87171" : t === "wait" ? "#fbbf24" : "#94a3b8"

const Spin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ animation: "spin .8s linear infinite", flexShrink: 0 }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
)

export default function AIImportTool({ categories }: { categories: Category[] }) {
  const [step, setStep]           = useState<"upload" | "processing" | "done">("upload")
  const [file, setFile]           = useState<File | null>(null)
  const [dragging, setDragging]   = useState(false)
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "")
  const [pdfJsReady, setPdfJsReady] = useState(false)
  const [log, setLog]             = useState<{ text: string; type: LogType }[]>([])
  const [progress, setProgress]   = useState({ done: 0, total: 0 })
  const [results, setResults]     = useState<ChunkResult[]>([])
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)

  // Load pdf.js from CDN
  useEffect(() => {
    if ((window as any).pdfjsLib) { setPdfJsReady(true); return }
    const s = document.createElement("script")
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    s.onload = () => {
      ;(window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
      setPdfJsReady(true)
    }
    document.head.appendChild(s)
  }, [])

  const addLog = (text: string, type: LogType = "info") =>
    setLog(p => [...p, { text, type }])

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 5000)
  }

  async function extractText(file: File): Promise<string> {
    const lib = (window as any).pdfjsLib
    const buf = await file.arrayBuffer()
    const pdf = await lib.getDocument({ data: buf }).promise
    let out = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      out += content.items.map((x: any) => x.str).join(" ") + "\n"
    }
    return out
  }

  async function run() {
    if (!file || !categoryId || !pdfJsReady) return
    setStep("processing")
    setLog([])
    setResults([])

    try {
      // Step 1: extract text locally
      addLog("📂 Extracting text from PDF...")
      const text = await extractText(file)
      addLog(`✓ ${text.length.toLocaleString()} characters extracted`, "ok")
      addLog(`Preview: "${text.slice(0, 120).replace(/\n/g, " ").trim()}..."`, "wait")

      // Step 2: split
      const chunks = splitText(text, CHARS_PER_CHUNK)
      addLog(`🔀 ${chunks.length} parts · ~${Math.ceil(chunks.length * (DELAY_MS + 8000) / 60000)} min`)
      setProgress({ done: 0, total: chunks.length })

      // Step 3: process each chunk — server parses AND saves
      let totalSaved = 0
      const allResults: ChunkResult[] = []

      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
          addLog(`⏳ Waiting ${DELAY_MS / 1000}s (rate limit)...`, "wait")
          await sleep(DELAY_MS)
        }

        addLog(`⚡ Part ${i + 1}/${chunks.length}...`)

        try {
          const res = await fetch("/api/ai/import-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: chunks[i],
              chunkIndex: i,
              totalChunks: chunks.length,
              categoryId,
            }),
          })

          const data = await res.json()

          if (!res.ok) {
            addLog(`  ⚠️ Failed: ${data.error}`, "err")
            allResults.push({ chunkIndex: i, saved: 0, blocks: [], error: data.error })
            continue
          }

          totalSaved += data.saved
          allResults.push(data)
          setProgress({ done: i + 1, total: chunks.length })
          addLog(`  ✓ Saved ${data.saved} questions`, "ok")
          data.blocks?.forEach((b: BlockResult) =>
            addLog(`    📦 "${b.blockName}" — ${b.count}q`, "ok")
          )
        } catch (e: any) {
          addLog(`  ⚠️ Network error: ${e.message}`, "err")
          allResults.push({ chunkIndex: i, saved: 0, blocks: [], error: e.message })
        }
      }

      setResults(allResults)
      addLog(`\n🎉 Done! ${totalSaved} questions imported to database.`, "ok")
      setStep("done")
      showToast(`${totalSaved} questions imported!`)

    } catch (e: any) {
      addLog(`❌ ${e.message}`, "err")
      showToast(e.message, false)
      setStep("upload")
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === "application/pdf") setFile(f)
  }, [])

  const totalSaved = results.reduce((a, r) => a + r.saved, 0)
  const failedChunks = results.filter(r => r.error)

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        .ai-dz:hover { border-color: #6366f1 !important; background: #eef2ff !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          padding: "11px 18px", borderRadius: 10,
          background: toast.ok ? "#059669" : "#dc2626",
          color: "#fff", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 24px rgba(0,0,0,.2)",
          animation: "fadeUp .2s ease",
        }}>
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div style={{
        background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: 16, overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          padding: "16px 22px",
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>AI Import</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                pdf.js → <span style={{ color: "#4285f4", fontWeight: 600 }}>Gemini</span> → Supabase
              </div>
            </div>
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {(["upload", "processing", "done"] as const).map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: step === s ? "#4f46e5" : (["upload","processing","done"].indexOf(step) > i) ? "#ecfdf5" : "#f3f4f6",
                  color: step === s ? "#fff" : (["upload","processing","done"].indexOf(step) > i) ? "#059669" : "#9ca3af",
                  border: `1px solid ${step === s ? "#4f46e5" : (["upload","processing","done"].indexOf(step) > i) ? "#6ee7b7" : "#e5e7eb"}`,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: step === s ? "rgba(255,255,255,.25)" : (["upload","processing","done"].indexOf(step) > i) ? "#059669" : "#d1d5db",
                    fontSize: 8, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>
                    {["upload","processing","done"].indexOf(step) > i ? "✓" : i + 1}
                  </span>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
                {i < 2 && <div style={{ width: 10, height: 1, background: "#e5e7eb" }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px" }}>

          {/* ── UPLOAD ── */}
          {step === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .2s ease" }}>

              {/* Category select */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Target Category
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  style={{
                    padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8,
                    fontSize: 13, color: "#111827", background: "#f9fafb",
                    minWidth: 240, cursor: "pointer",
                  }}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Drop zone */}
              <div
                className="ai-dz"
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById("ai-file-input")?.click()}
                style={{
                  border: `2px dashed ${dragging ? "#6366f1" : file ? "#6ee7b7" : "#d1d5db"}`,
                  borderRadius: 12, padding: "36px 20px", textAlign: "center",
                  cursor: "pointer",
                  background: dragging ? "#eef2ff" : file ? "#f0fdf4" : "#fafafa",
                  transition: "all .18s",
                }}
              >
                <input id="ai-file-input" type="file" accept=".pdf" style={{ display: "none" }}
                  onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]) }} />
                <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : "📄"}</div>
                {file ? (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>{file.name}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Drop PDF or click to browse</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                      Text extracted locally — zero token cost
                    </p>
                  </>
                )}
              </div>

              {/* Info banner */}
              <div style={{
                background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: 10, padding: "12px 16px",
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <p style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.7, margin: 0 }}>
                  <strong>How it works:</strong> Your PDF text is extracted in the browser (free) →
                  sent in chunks to Gemini API → parsed questions are saved directly to Supabase on the server.
                  No intermediate steps, no browser DB calls.
                </p>
              </div>

              <button
                onClick={run}
                disabled={!file || !categoryId || !pdfJsReady}
                style={{
                  padding: "12px 24px",
                  background: !file || !categoryId ? "#e5e7eb" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  border: "none", borderRadius: 10,
                  color: !file || !categoryId ? "#9ca3af" : "#fff",
                  fontSize: 14, fontWeight: 700,
                  cursor: !file || !categoryId ? "not-allowed" : "pointer",
                  alignSelf: "flex-start",
                  boxShadow: !file || !categoryId ? "none" : "0 4px 16px rgba(79,70,229,.35)",
                  transition: "all .15s",
                }}
              >
                {pdfJsReady ? "✨ Start Import" : "Loading..."}
              </button>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {step === "processing" && (
            <div style={{ animation: "fadeUp .2s ease" }}>

              {/* Progress bar */}
              {progress.total > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                      Processing chunks
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5" }}>
                      {progress.done} / {progress.total}
                    </span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                      background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
                      borderRadius: 99, transition: "width .4s ease",
                    }} />
                  </div>
                </div>
              )}

              {/* Terminal */}
              <div style={{
                background: "#0f172a", borderRadius: 12,
                padding: "16px", fontFamily: "monospace",
                minHeight: 220, maxHeight: 380, overflowY: "auto",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1e293b",
                }}>
                  {["#ef4444", "#f59e0b", "#22c55e"].map(c =>
                    <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                  )}
                  <span style={{ fontSize: 10, color: "#475569", marginLeft: 4 }}>AI Import Terminal</span>
                  <span style={{ fontSize: 10, color: "#4285f4", marginLeft: "auto", fontWeight: 600 }}>
                    ● Gemini Flash
                  </span>
                </div>
                {log.map((l, i) => (
                  <p key={i} style={{ fontSize: 11.5, color: logColor(l.type), margin: "2px 0", lineHeight: 1.55 }}>
                    <span style={{ color: "#334155", marginRight: 6 }}>›</span>{l.text}
                  </p>
                ))}
               {(() => {
  const lastLog = log.at(-1)
  return lastLog && !lastLog.text.includes("🎉") && !lastLog.text.includes("❌")
})() && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, color: "#475569" }}>
                    <Spin /><span style={{ fontSize: 11 }}>Working...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <div style={{ animation: "fadeUp .2s ease", textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Import Complete!</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 22 }}>
                Questions have been saved directly to Supabase
              </p>

              {/* Stats */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{
                  padding: "14px 24px", background: "#ecfdf5",
                  border: "1px solid #6ee7b7", borderRadius: 12,
                }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#059669", margin: 0 }}>{totalSaved}</p>
                  <p style={{ fontSize: 11, color: "#065f46", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Imported</p>
                </div>
                {failedChunks.length > 0 && (
                  <div style={{
                    padding: "14px 24px", background: "#fef2f2",
                    border: "1px solid #fca5a5", borderRadius: 12,
                  }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#dc2626", margin: 0 }}>{failedChunks.length}</p>
                    <p style={{ fontSize: 11, color: "#991b1b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Failed chunks</p>
                  </div>
                )}
              </div>

              {/* Block breakdown */}
              <div style={{ textAlign: "left", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
                {results.flatMap(r => r.blocks).reduce((acc: { blockName: string; count: number }[], b) => {
                  const ex = acc.find(x => x.blockName === b.blockName)
                  if (ex) ex.count += b.count
                  else acc.push({ ...b })
                  return acc
                }, []).map(b => (
                  <div key={b.blockName} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "7px 12px", borderRadius: 8, marginBottom: 4,
                    background: "#f9fafb", border: "1px solid #f3f4f6",
                  }}>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>📦 {b.blockName}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5" }}>{b.count}q</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => { setStep("upload"); setFile(null); setLog([]); setResults([]); setProgress({ done: 0, total: 0 }) }}
                  style={{
                    padding: "11px 22px",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    border: "none", borderRadius: 9, color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Import Another File
                </button>
                <a
                  href="/admin/questions"
                  style={{
                    padding: "11px 22px",
                    background: "#f3f4f6", border: "1px solid #e5e7eb",
                    borderRadius: 9, color: "#374151",
                    fontSize: 13, fontWeight: 700,
                    textDecoration: "none", display: "inline-flex", alignItems: "center",
                  }}
                >
                  View Questions →
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

