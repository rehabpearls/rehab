"use client"

import { useState, useCallback, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

interface Category { id: string; name: string; slug?: string }
interface Block { id: string; title: string; category_id: string; q_count?: number }

export default function AdminBlocksTab({ categories }: { categories: Category[] }) {
  const [blocks, setBlocks]               = useState<Block[]>([])
  const [loading, setLoading]             = useState(true)
  const [catFilter, setCatFilter]         = useState("all")
  const [mergeMode, setMergeMode]         = useState(false)
  const [mergeSelected, setMergeSelected] = useState<Set<string>>(new Set())
  const [mergeTarget, setMergeTarget]     = useState("")
  const [toast, setToast]                 = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const loadBlocks = useCallback(async () => {
    setLoading(true)
    let q = supabase.from("qbank_blocks").select("id, title, category_id").order("title")
    if (catFilter !== "all") q = q.eq("category_id", catFilter)
    const { data: blockData } = await q
    if (!blockData?.length) { setBlocks([]); setLoading(false); return }

    const { data: counts } = await supabase
      .from("qbank_block_questions").select("block_id")
      .in("block_id", blockData.map(b => b.id))

    const countMap: Record<string, number> = {}
    for (const row of counts ?? []) {
      countMap[row.block_id] = (countMap[row.block_id] ?? 0) + 1
    }
    setBlocks(blockData.map(b => ({ ...b, q_count: countMap[b.id] ?? 0 })))
    setLoading(false)
  }, [catFilter])

  useEffect(() => { loadBlocks() }, [loadBlocks])

  async function mergeBlocks() {
    if (!mergeTarget || mergeSelected.size < 2) {
      showToast("Select ≥2 blocks and a target", false); return
    }
    const sourceIds = Array.from(mergeSelected).filter(id => id !== mergeTarget)
    let moved = 0
    for (const srcId of sourceIds) {
      const { data: existing } = await supabase
        .from("qbank_block_questions").select("question_id").eq("block_id", mergeTarget)
      const existingIds = new Set((existing ?? []).map((r: any) => r.question_id))
      const { data: srcQs } = await supabase
        .from("qbank_block_questions").select("question_id").eq("block_id", srcId)
      const newLinks = (srcQs ?? [])
        .filter((r: any) => !existingIds.has(r.question_id))
        .map((r: any) => ({ block_id: mergeTarget, question_id: r.question_id }))
      if (newLinks.length > 0) {
        await supabase.from("qbank_block_questions").insert(newLinks)
        moved += newLinks.length
      }
      await supabase.from("qbank_block_questions").delete().eq("block_id", srcId)
      await supabase.from("qbank_blocks").delete().eq("id", srcId)
    }
    showToast(`✅ Merged ${sourceIds.length} blocks · ${moved} questions moved`)
    setMergeMode(false); setMergeSelected(new Set()); setMergeTarget("")
    loadBlocks()
  }

  async function deleteBlock(id: string) {
    if (!confirm("Delete block? Questions will be unlinked.")) return
    await supabase.from("qbank_block_questions").delete().eq("block_id", id)
    await supabase.from("qbank_blocks").delete().eq("id", id)
    showToast("Block deleted")
    loadBlocks()
  }

  async function renameBlock(id: string, title: string) {
    await supabase.from("qbank_blocks").update({ title }).eq("id", id)
    showToast("Renamed ✓")
    loadBlocks()
  }

  const catName = (id: string) => categories.find(c => c.id === id)?.name ?? "—"

  return (
    <>
      <style>{`
        @keyframes fadeUp2{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .blk-card{transition:border-color .15s,box-shadow .15s,background .15s}
        .blk-card:hover{border-color:#c7d2fe!important}
      `}</style>

      {toast && (
        <div style={{
          position:"fixed",bottom:24,right:24,zIndex:9999,
          padding:"10px 18px",borderRadius:10,
          background:toast.ok?"#059669":"#dc2626",
          color:"#fff",fontSize:13,fontWeight:600,
          boxShadow:"0 4px 20px rgba(0,0,0,.15)",
          animation:"fadeUp2 .2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        background:"#fff",borderRadius:12,border:"1px solid #e8eaed",
        padding:"12px 16px",marginBottom:16,
        display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",
      }}>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          style={{
            padding:"8px 12px",border:"1.5px solid #e5e7eb",borderRadius:8,
            fontSize:13,color:"#374151",background:"#f9fafb",cursor:"pointer",
            minWidth:180,
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <span style={{fontSize:12,color:"#9ca3af",fontWeight:500}}>
          {loading ? "Loading…" : `${blocks.length} blocks`}
        </span>

        {!mergeMode ? (
          <button
            onClick={() => setMergeMode(true)}
            style={{
              marginLeft:"auto",padding:"8px 18px",
              background:"linear-gradient(135deg,#f59e0b,#d97706)",
              border:"none",borderRadius:8,color:"#fff",
              fontSize:13,fontWeight:700,cursor:"pointer",
            }}
          >
            🔀 Merge Blocks
          </button>
        ) : (
          <MergeBar
            selectedCount={mergeSelected.size}
            mergeTarget={mergeTarget}
            setMergeTarget={setMergeTarget}
            selectedBlocks={Array.from(mergeSelected).map(id => blocks.find(b => b.id === id)).filter(Boolean) as Block[]}
            onMerge={mergeBlocks}
            onCancel={() => { setMergeMode(false); setMergeSelected(new Set()); setMergeTarget("") }}
          />
        )}
      </div>

      {mergeMode && (
        <div style={{
          background:"#eff6ff",border:"1px solid #bfdbfe",
          borderRadius:10,padding:"10px 16px",marginBottom:14,
          fontSize:12,color:"#1e40af",
        }}>
          💡 <strong>How to merge:</strong> Check the blocks you want to combine →
          open the dropdown → select which block keeps the name (TARGET) →
          click <strong>Merge ✓</strong>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{textAlign:"center",padding:48,color:"#9ca3af",fontSize:13}}>
          Loading blocks…
        </div>
      ) : blocks.length === 0 ? (
        <div style={{
          textAlign:"center",padding:48,color:"#9ca3af",fontSize:13,
          background:"#fff",borderRadius:12,border:"2px dashed #e5e7eb",
        }}>
          No blocks found
        </div>
      ) : (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
          gap:10,
        }}>
          {blocks.map(b => {
            const isChecked = mergeSelected.has(b.id)
            const isTarget  = mergeTarget === b.id
            return (
              <BlockCard
                key={b.id}
                block={b}
                catName={catName(b.category_id)}
                mergeMode={mergeMode}
                isChecked={isChecked}
                isTarget={isTarget}
                onCheck={() => {
                  const n = new Set(mergeSelected)
                  isChecked ? n.delete(b.id) : n.add(b.id)
                  setMergeSelected(n)
                }}
                onDelete={() => deleteBlock(b.id)}
                onRename={t => renameBlock(b.id, t)}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

// ── MergeBar ───────────────────────────────────────────────────────
function MergeBar({ selectedCount, mergeTarget, setMergeTarget, selectedBlocks, onMerge, onCancel }: {
  selectedCount: number; mergeTarget: string
  setMergeTarget: (id: string) => void; selectedBlocks: Block[]
  onMerge: () => void; onCancel: () => void
}) {
  const [open, setOpen] = useState(false)
  const target = selectedBlocks.find(b => b.id === mergeTarget)

  return (
    <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{
        background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:7,
        padding:"5px 12px",fontSize:13,fontWeight:600,color:"#4f46e5",
      }}>
        {selectedCount} selected
      </span>
      <span style={{fontSize:12,color:"#6b7280"}}>→ keep:</span>

      {/* Dropdown */}
      <div style={{position:"relative"}}>
        <button
          onClick={() => setOpen(p => !p)}
          style={{
            padding:"8px 14px",minWidth:210,
            background: target ? "#eef2ff" : "#f9fafb",
            border:`2px solid ${target ? "#4f46e5" : "#e5e7eb"}`,
            borderRadius:8,cursor:"pointer",
            fontSize:13,fontWeight:600,
            color: target ? "#4f46e5" : "#9ca3af",
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,
          }}
        >
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {target ? `✓ ${target.title}` : "— Select target —"}
          </span>
          <span style={{fontSize:9,flexShrink:0}}>▼</span>
        </button>

        {open && (
          <div style={{
            position:"absolute",top:"calc(100% + 4px)",left:0,
            background:"#fff",border:"1px solid #e5e7eb",
            borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,.12)",
            zIndex:200,minWidth:240,overflow:"hidden",
          }}>
            {selectedBlocks.length === 0
              ? <div style={{padding:"12px 16px",fontSize:12,color:"#9ca3af"}}>Select blocks first</div>
              : selectedBlocks.map(b => (
                  <div
                    key={b.id}
                    onClick={() => { setMergeTarget(b.id); setOpen(false) }}
                    style={{
                      padding:"11px 16px",cursor:"pointer",
                      background: mergeTarget === b.id ? "#eef2ff" : "#fff",
                      color: mergeTarget === b.id ? "#4f46e5" : "#111827",
                      fontSize:13,fontWeight: mergeTarget === b.id ? 700 : 400,
                      display:"flex",alignItems:"center",gap:8,
                      borderBottom:"1px solid #f3f4f6",
                    }}
                    onMouseEnter={e => { if (mergeTarget !== b.id) (e.currentTarget as HTMLElement).style.background = "#f9fafb" }}
                    onMouseLeave={e => { if (mergeTarget !== b.id) (e.currentTarget as HTMLElement).style.background = "#fff" }}
                  >
                    {mergeTarget === b.id && <span>✓</span>}
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.title}</span>
                    <span style={{fontSize:11,color:"#9ca3af",flexShrink:0}}>{b.q_count ?? 0}q</span>
                  </div>
                ))
            }
          </div>
        )}
      </div>

      <button
        onClick={onMerge}
        disabled={!mergeTarget || selectedCount < 2}
        style={{
          padding:"8px 18px",
          background:!mergeTarget||selectedCount<2?"#e5e7eb":"linear-gradient(135deg,#4f46e5,#7c3aed)",
          border:"none",borderRadius:8,
          color:!mergeTarget||selectedCount<2?"#9ca3af":"#fff",
          fontSize:13,fontWeight:700,cursor:!mergeTarget||selectedCount<2?"not-allowed":"pointer",
        }}
      >
        Merge ✓
      </button>
      <button
        onClick={onCancel}
        style={{padding:"8px 12px",background:"#f3f4f6",border:"none",borderRadius:8,color:"#6b7280",fontSize:13,cursor:"pointer"}}
      >
        Cancel
      </button>
    </div>
  )
}

// ── BlockCard ──────────────────────────────────────────────────────
function BlockCard({ block, catName, mergeMode, isChecked, isTarget, onCheck, onDelete, onRename }: {
  block: Block; catName: string; mergeMode: boolean
  isChecked: boolean; isTarget: boolean
  onCheck: () => void; onDelete: () => void; onRename: (t: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle]     = useState(block.title)

  return (
    <div
      className="blk-card"
      onClick={mergeMode ? onCheck : undefined}
      style={{
        background: isTarget ? "#eef2ff" : isChecked ? "#f5f3ff" : "#fff",
        border:`2px solid ${isTarget ? "#4f46e5" : isChecked ? "#818cf8" : "#e5e7eb"}`,
        borderRadius:12,padding:"14px 16px",
        cursor: mergeMode ? "pointer" : "default",
        position:"relative",
        boxShadow: isChecked||isTarget ? "0 2px 12px rgba(79,70,229,.12)" : "none",
      }}
    >
      {isTarget && (
        <div style={{
          position:"absolute",top:-10,left:12,
          background:"#4f46e5",color:"#fff",
          fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:99,
        }}>✓ TARGET</div>
      )}

      {mergeMode && (
        <div
          onClick={e => { e.stopPropagation(); onCheck() }}
          style={{
            position:"absolute",top:12,right:12,
            width:20,height:20,borderRadius:5,
            border:`2px solid ${isChecked ? "#4f46e5" : "#d1d5db"}`,
            background: isChecked ? "#4f46e5" : "#fff",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,color:"#fff",fontWeight:700,flexShrink:0,cursor:"pointer",
          }}
        >
          {isChecked ? "✓" : ""}
        </div>
      )}

      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
        <div style={{
          width:34,height:34,borderRadius:9,flexShrink:0,
          background: isTarget
            ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
            : isChecked
            ? "linear-gradient(135deg,#818cf8,#a78bfa)"
            : "linear-gradient(135deg,#64748b,#94a3b8)",
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"#fff",fontSize:16,
        }}>📦</div>

        <div style={{flex:1,minWidth:0,paddingRight: mergeMode ? 28 : 0}}>
          {editing ? (
            <div style={{display:"flex",gap:6}} onClick={e => e.stopPropagation()}>
              <input
                autoFocus value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter") { onRename(title); setEditing(false) } }}
                style={{flex:1,padding:"4px 8px",border:"2px solid #4f46e5",borderRadius:6,fontSize:12,outline:"none"}}
              />
              <button
                onClick={e => { e.stopPropagation(); onRename(title); setEditing(false) }}
                style={{padding:"4px 10px",background:"#4f46e5",border:"none",borderRadius:6,color:"#fff",fontSize:12,cursor:"pointer"}}
              >✓</button>
            </div>
          ) : (
            <p style={{fontSize:13,fontWeight:600,color:"#111827",margin:0,lineHeight:1.4}}>{block.title}</p>
          )}
          <p style={{fontSize:11,color:"#9ca3af",margin:"2px 0 0"}}>{catName}</p>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{
          fontSize:12,fontWeight:700,
          color: (block.q_count ?? 0) === 0 ? "#dc2626" : "#4f46e5",
        }}>
          {block.q_count ?? 0} questions
        </span>
        {!mergeMode && (
          <div style={{display:"flex",gap:6}}>
            <button
              onClick={e => { e.stopPropagation(); setEditing(true) }}
              style={{padding:"4px 10px",background:"#f3f4f6",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",color:"#374151"}}
            >Rename</button>
            <button
              onClick={e => { e.stopPropagation(); onDelete() }}
              style={{padding:"4px 10px",background:"#fef2f2",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",color:"#dc2626"}}
            >Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}
