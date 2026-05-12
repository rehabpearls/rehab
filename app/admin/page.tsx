"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import AdminUsersTab from "@/components/AdminUsersTab"
import AIImportTool from "@/components/AIImportTool"
import AdminBlocksTab from "@/components/AdminBlocksTab"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

interface Question {
  id?: string
  question: string
  options: Record<string, string>
  correct_answers: string[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  image_url: string
  category_id: string
  status?: "draft" | "pending_review" | "approved" | "rejected"
}
interface Subscription { id: string; status: string; created_at: string; profiles?: { email?: string } }
interface Category { id: string; name: string; slug?: string }
interface Block { id: string; title: string; category_id: string; order_index: number }

const PAGE_SIZE = 10
const TABS = ["overview", "questions", "blocks", "users", "subscriptions", "import"] as const
type Tab = (typeof TABS)[number]
type QuestionFilter = "all" | "draft" | "pending_review" | "approved" | "rejected"
const OPTS = ["A", "B", "C", "D", "E"] as const

const EMPTY_Q: Question = {
  question: "", options: { A: "", B: "", C: "", D: "", E: "" },
  correct_answers: [], explanation: "", difficulty: "easy",
  image_url: "", category_id: "",
}

const C = {
  bg: "#f7f8fa", surface: "#ffffff", border: "#e8eaed", borderMd: "#d1d5db",
  text: "#111827", textMd: "#374151", textSm: "#6b7280", textXs: "#9ca3af",
  blue: "#2563eb", blueLt: "#eff6ff", blueBd: "#bfdbfe",
  green: "#16a34a", greenLt: "#f0fdf4", greenBd: "#bbf7d0",
  amber: "#b45309", amberLt: "#fffbeb", amberBd: "#fde68a",
  red: "#dc2626", redLt: "#fff1f2", redBd: "#fecdd3",
  purple: "#7c3aed", purpleLt: "#f5f3ff", purpleBd: "#ddd6fe",
  indigo: "#4f46e5", indigoLt: "#eef2ff",
}

type StatusKey = "draft"|"pending_review"|"approved"|"rejected"|"active"|"trialing"|"past_due"|"canceled"
const STATUS: Record<StatusKey, { bg: string; text: string; dot: string; label: string }> = {
  draft:          { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af",  label: "Draft"          },
  pending_review: { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b",  label: "Pending Review" },
  approved:       { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e",  label: "Approved"       },
  rejected:       { bg: "#fff1f2", text: "#dc2626", dot: "#ef4444",  label: "Rejected"       },
  active:         { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e",  label: "Active"         },
  trialing:       { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6",  label: "Trialing"       },
  past_due:       { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b",  label: "Past Due"       },
  canceled:       { bg: "#fff1f2", text: "#dc2626", dot: "#ef4444",  label: "Canceled"       },
}
const DIFF: Record<string, { bg: string; text: string }> = {
  easy:   { bg: "#f0fdf4", text: "#16a34a" },
  medium: { bg: "#fffbeb", text: "#b45309" },
  hard:   { bg: "#fff1f2", text: "#dc2626" },
}

const I = {
  Overview:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Questions: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Blocks:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Users:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Subs:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Import:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Edit:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Check:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:         () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Send:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Layers:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Search:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Refresh:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  LogOut:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevL:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevD:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Image:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
}

function Badge({ s }: { s: string }) {
  const cfg = STATUS[s as StatusKey] ?? STATUS.draft
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, background:cfg.bg, color:cfg.text, fontSize:11, fontWeight:600, letterSpacing:"0.03em", whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
      {cfg.label}
    </span>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin,       setIsAdmin]      = useState(false)
  const [loading,       setLoading]      = useState(true)
  const [tab,           setTab]          = useState<Tab>("overview")
  const [questions,     setQuestions]    = useState<Question[]>([])
  const [categories,    setCategories]   = useState<Category[]>([])
  const [blocks,        setBlocks]       = useState<Block[]>([])
  const [subscriptions, setSubscriptions]= useState<Subscription[]>([])
  const [questionPage,  setQuestionPage] = useState(1)
  const [questionTotal, setQuestionTotal]= useState(0)
  const [userTotal,     setUserTotal]    = useState(0)
  const [qFilter,       setQFilter]      = useState<QuestionFilter>("all")
  const [catFilter,     setCatFilter]    = useState("all")
  const [subSearch,     setSubSearch]    = useState("")
  const [subFilter,     setSubFilter]    = useState("")
  const [form,          setForm]         = useState<Question>(EMPTY_Q)
  const [editingId,     setEditingId]    = useState<string | null>(null)
  const [formOpen,      setFormOpen]     = useState(false)
  const [formError,     setFormError]    = useState("")
  const [formSuccess,   setFormSuccess]  = useState("")
  const [blockTarget,   setBlockTarget]  = useState<Question | null>(null)
  const [blockSel,      setBlockSel]     = useState<string[]>([])

  const checkAdmin = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace("/login"); return }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
    if (!profile || profile.role !== "admin") { router.replace("/dashboard"); return }
    setIsAdmin(true)
    setLoading(false)
  }, [router])

  useEffect(() => { checkAdmin() }, [checkAdmin])

  const fetchAll = useCallback(async () => {
    try {
      let qQuery = supabase.from("questions").select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((questionPage - 1) * PAGE_SIZE, questionPage * PAGE_SIZE - 1)
      if (qFilter !== "all")   qQuery = qQuery.eq("status", qFilter)
      if (catFilter !== "all") qQuery = qQuery.eq("category_id", catFilter)

      const [
        { data: qData, count: qCount },
        { data: uData, count: uCount },
        { data: catData },
        { data: blkData },
        { data: subData },
      ] = await Promise.all([
        qQuery,
        supabase.from("profiles").select("id", { count: "exact" }).limit(1),
        supabase.from("categories").select("*"),
        supabase.from("qbank_blocks").select("*"),
        supabase.from("subscriptions").select("*, profiles(email)"),
      ])
      setQuestions(qData || [])
      setQuestionTotal(qCount || 0)
      setUserTotal(uCount || 0)
      setCategories(catData || [])
      setBlocks(blkData || [])
      setSubscriptions(subData || [])
    } catch (e) { console.error(e) }
  }, [questionPage, qFilter, catFilter])

  useEffect(() => { setQuestionPage(1) }, [qFilter, catFilter])
  useEffect(() => { if (isAdmin) fetchAll() }, [isAdmin, fetchAll])

  function validate(): string {
    if (!form.question.trim())        return "Question text is required."
    if (!form.category_id)            return "Please select a category."
    if (!form.correct_answers.length) return "Mark at least one correct answer."
    return ""
  }

  async function saveQuestion() {
    const err = validate(); if (err) { setFormError(err); return }
    try {
      const payload = editingId ? { ...form } : { ...form, status: "draft" as const }
      const { error } = editingId
        ? await supabase.from("questions").update(payload).eq("id", editingId)
        : await supabase.from("questions").insert([payload])
      if (error) { setFormError(error.message); return }
      setFormSuccess(editingId ? "Question updated." : "Question created.")
      setTimeout(closeForm, 1000)
      await fetchAll()
    } catch (e: any) { setFormError(e.message) }
  }

  function openEdit(q: Question) {
    setForm({ ...q, options: { A:"", B:"", C:"", D:"", E:"", ...q.options } })
    setEditingId(q.id || null); setFormError(""); setFormSuccess(""); setFormOpen(true)
  }
  function openNew() { setForm(EMPTY_Q); setEditingId(null); setFormError(""); setFormSuccess(""); setFormOpen(true) }
  function closeForm() { setFormOpen(false); setForm(EMPTY_Q); setEditingId(null); setFormError(""); setFormSuccess("") }

  async function setQStatus(id: string, status: Question["status"]) {
    await supabase.from("questions").update({ status }).eq("id", id)
    await fetchAll()
  }
  async function deleteQ(id?: string) {
    if (!id || !confirm("Delete this question?")) return
    await supabase.from("questions").delete().eq("id", id)
    await fetchAll()
  }

  const filteredSubs = useMemo(() => subscriptions
    .filter(s => s.profiles?.email?.toLowerCase().includes(subSearch.toLowerCase()))
    .filter(s => !subFilter || s.status === subFilter),
    [subscriptions, subSearch, subFilter])

  async function updateSub(id: string, status: string) {
    await supabase.from("subscriptions").update({ status }).eq("id", id)
    setSubscriptions(p => p.map(s => s.id === id ? { ...s, status } : s))
  }

  async function saveToBlocks() {
    if (!blockTarget) return
    await supabase.from("qbank_block_questions")
      .insert(blockSel.map(bId => ({ block_id: bId, question_id: blockTarget.id })))
    setBlockTarget(null); setBlockSel([])
  }

  const pendingCount = questions.filter(q => q.status === "pending_review").length
  const activeSubs   = subscriptions.filter(s => s.status === "active" || s.status === "trialing").length

  const TAB_NAV = [
    { t: "overview",      label: "Overview",       Icon: I.Overview  },
    { t: "questions",     label: "Questions",      Icon: I.Questions },
    { t: "blocks",        label: "Blocks",         Icon: I.Blocks    },
    { t: "users",         label: "Users",          Icon: I.Users     },
    { t: "subscriptions", label: "Subscriptions",  Icon: I.Subs      },
    { t: "import",        label: "AI Import",      Icon: I.Import    },
  ] as const

  const TAB_LABELS: Record<Tab, string> = {
    overview: "Overview", questions: "Questions", blocks: "Blocks",
    users: "Users", subscriptions: "Subscriptions", import: "AI Import"
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg }}>
      <div style={{ width:36, height:36, borderRadius:"50%", border:`3px solid ${C.border}`, borderTopColor:C.blue, animation:"spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px}
        input:focus,select:focus,textarea:focus{outline:2px solid ${C.blue};outline-offset:-1px}
        button:disabled{opacity:.4;cursor:not-allowed!important}
        .nav-btn{transition:background .12s,color .12s}
        .nav-btn:hover{background:#f3f4f6!important}
        .nav-btn.active{background:${C.indigoLt}!important;color:${C.indigo}!important}
        .row:hover{background:#fafafa}
        .action:hover{opacity:.8}
        .qcard:hover{border-color:${C.borderMd}!important;box-shadow:0 2px 8px rgba(0,0,0,.06)!important}
        .chip:hover{border-color:${C.borderMd}!important}
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>

        {/* SIDEBAR */}
        <aside style={{ width:220, minWidth:220, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", position:"sticky", top:64, height:"calc(100vh - 64px)", overflowY:"auto" }}>
          <div style={{ padding:"16px 14px 12px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#2563eb,#0891b2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:700, color:C.text }}>Admin Console</div>
                <div style={{ fontSize:11, color:C.textXs, fontWeight:500 }}>RehabPearls</div>
              </div>
            </div>
          </div>

          <nav style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:1 }}>
            <p style={{ fontSize:10, fontWeight:700, color:C.textXs, letterSpacing:"0.1em", padding:"10px 10px 6px", textTransform:"uppercase" }}>Navigation</p>
            {TAB_NAV.map(({ t, label, Icon }) => (
              <button key={t} onClick={() => setTab(t as Tab)}
                className={`nav-btn${tab === t ? " active" : ""}`}
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer", background:tab===t?C.indigoLt:"transparent", color:tab===t?C.indigo:C.textMd, fontSize:13, fontWeight:tab===t?600:500, width:"100%", textAlign:"left" }}>
                <Icon />
                <span style={{ flex:1 }}>{label}</span>
                {t === "questions" && pendingCount > 0 && (
                  <span style={{ background:C.amberLt, color:C.amber, fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:99 }}>{pendingCount}</span>
                )}
                {t === "import" && (
                  <span style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:99 }}>AI</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ padding:"10px 8px 16px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:1 }}>
            <button onClick={fetchAll} className="nav-btn"
              style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:C.textMd, fontSize:13, fontWeight:500, width:"100%", textAlign:"left" }}>
              <I.Refresh /><span>Refresh</span>
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/login") }} className="nav-btn"
              style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:C.red, fontSize:13, fontWeight:500, width:"100%", textAlign:"left" }}>
              <I.LogOut /><span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <header style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:64, zIndex:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:C.textXs }}>Admin</span>
              <span style={{ color:C.border, fontSize:16 }}>/</span>
              <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{TAB_LABELS[tab]}</span>
            </div>
            {tab === "questions" && (
              <button onClick={openNew}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background:C.indigo, border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                <I.Plus />&nbsp;New Question
              </button>
            )}
          </header>

          <div style={{ flex:1, padding:"24px 28px", animation:"fadeUp .2s ease" }}>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
                  {[
                    { label:"Total Users",  value:userTotal,         sub:"registered accounts",            accent:"#2563eb", icon:"👥" },
                    { label:"Questions",    value:questionTotal,     sub:`${pendingCount} pending review`,  accent:"#7c3aed", icon:"📚" },
                    { label:"Active Subs",  value:activeSubs,        sub:`of ${subscriptions.length} total`,accent:"#16a34a", icon:"💳" },
                    { label:"Categories",  value:categories.length, sub:"content areas",                   accent:"#b45309", icon:"🗂️" },
                  ].map(k => (
                    <div key={k.label} style={{ background:C.surface, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.border}`, borderLeft:`3px solid ${k.accent}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <p style={{ fontSize:11, fontWeight:600, color:C.textSm, letterSpacing:"0.06em", textTransform:"uppercase" }}>{k.label}</p>
                        <span style={{ fontSize:20 }}>{k.icon}</span>
                      </div>
                      <p style={{ fontSize:32, fontWeight:800, color:C.text, margin:"6px 0 3px", fontVariantNumeric:"tabular-nums", letterSpacing:"-0.02em" }}>{k.value.toLocaleString()}</p>
                      <p style={{ fontSize:12, color:C.textXs }}>{k.sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:C.surface, borderRadius:14, padding:"20px 22px", border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:C.text }}>Question Pipeline</p>
                    <button onClick={() => setTab("questions")} style={{ fontSize:12, color:C.blue, background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>View all →</button>
                  </div>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    {(["draft","pending_review","approved","rejected"] as const).map(s => {
                      const cfg = STATUS[s]; const cnt = questions.filter(q => q.status === s).length
                      const pct = questionTotal ? Math.round(cnt/questionTotal*100) : 0
                      return (
                        <div key={s} onClick={() => { setTab("questions"); setQFilter(s) }}
                          style={{ flex:"1 1 130px", background:cfg.bg, borderRadius:12, padding:"14px 16px", cursor:"pointer" }}>
                          <Badge s={s} />
                          <p style={{ fontSize:28, fontWeight:800, color:C.text, margin:"8px 0 6px" }}>{cnt}</p>
                          <div style={{ height:3, background:"rgba(0,0,0,.08)", borderRadius:99, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:cfg.dot, borderRadius:99 }} />
                          </div>
                          <p style={{ fontSize:11, color:C.textXs, marginTop:4 }}>{pct}% of total</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{ background:C.surface, borderRadius:14, padding:"18px 22px", border:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Quick Actions</p>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <QaBtn onClick={() => { setTab("questions"); openNew() }} bg={C.indigoLt} color={C.indigo}>+ New Question</QaBtn>
                    <QaBtn onClick={() => { setTab("questions"); setQFilter("pending_review") }} bg={C.amberLt} color={C.amber}>Review Pending ({pendingCount})</QaBtn>
                    <QaBtn onClick={() => setTab("blocks")} bg={C.purpleLt} color={C.purple}>📦 Manage Blocks</QaBtn>
                    <QaBtn onClick={() => setTab("users")} bg={C.greenLt} color={C.green}>Manage Users</QaBtn>
                    <QaBtn onClick={() => setTab("import")} bg="linear-gradient(135deg,#eef2ff,#f5f3ff)" color={C.indigo}>🤖 AI Import</QaBtn>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTIONS */}
            {tab === "questions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:C.surface, borderRadius:12, padding:"10px 14px", border:`1px solid ${C.border}`, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:"#f1f5f9", borderRadius:8, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:10.5, fontWeight:700, color:"#64748b", letterSpacing:"0.1em", textTransform:"uppercase" }}>Status</span>
                  </div>
                  {(["all","draft","pending_review","approved","rejected"] as const).map(f => (
                    <FilterChip key={f} active={qFilter===f} onClick={() => setQFilter(f)} color={C.indigo} colorLt={C.indigoLt}>
                      {f === "all" ? "All" : f.replace(/_/g," ")}
                    </FilterChip>
                  ))}
                  <div style={{ width:1, height:20, background:C.border, margin:"0 4px" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:"#f1f5f9", borderRadius:8, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:10.5, fontWeight:700, color:"#64748b", letterSpacing:"0.1em", textTransform:"uppercase" }}>Category</span>
                  </div>
                  <FilterChip active={catFilter==="all"} onClick={() => setCatFilter("all")} color={C.green} colorLt={C.greenLt}>All</FilterChip>
                  {categories.map(c => (
                    <FilterChip key={c.id} active={catFilter===c.id} onClick={() => setCatFilter(c.id)} color={C.green} colorLt={C.greenLt}>{c.name}</FilterChip>
                  ))}
                  <span style={{ marginLeft:"auto", fontSize:12, color:C.textXs, fontWeight:500 }}>{questionTotal} total</span>
                </div>
                {questions.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 24px", background:C.surface, borderRadius:14, border:`2px dashed ${C.border}`, color:C.textXs }}>No questions found.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {questions.map((q, i) => (
                      <QRow key={q.id} q={q} index={(questionPage-1)*PAGE_SIZE+i}
                        catName={categories.find(c => c.id === q.category_id)?.name || "—"}
                        onEdit={() => openEdit(q)} onDelete={() => deleteQ(q.id)}
                        onStatus={s => setQStatus(q.id!, s)}
                        onBlock={() => { setBlockTarget(q); setBlockSel([]) }} />
                    ))}
                  </div>
                )}
                <Pager page={questionPage} total={questionTotal}
                  onPrev={() => setQuestionPage(p => Math.max(1,p-1))}
                  onNext={() => setQuestionPage(p => p+1)} />
              </div>
            )}

            {/* BLOCKS — delegated to AdminBlocksTab */}
            {tab === "blocks" && <AdminBlocksTab categories={categories} />}

            {/* USERS */}
            {tab === "users" && <AdminUsersTab />}

            {/* SUBSCRIPTIONS */}
            {tab === "subscriptions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:10, flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"0 14px" }}>
                    <I.Search />
                    <input style={{ flex:1, border:"none", outline:"none", fontSize:14, padding:"11px 0", color:C.text, background:"transparent" }}
                      placeholder="Search by email…" value={subSearch} onChange={e => setSubSearch(e.target.value)} />
                  </label>
                  <select value={subFilter} onChange={e => setSubFilter(e.target.value)}
                    style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.textMd, padding:"0 14px", fontSize:13, cursor:"pointer", minWidth:150 }}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="trialing">Trialing</option>
                    <option value="past_due">Past Due</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
                <DataTable headers={["Email","Status","Created","Actions"]}>
                  {filteredSubs.map(s => (
                    <tr key={s.id} className="row" style={{ borderBottom:`1px solid ${C.bg}` }}>
                      <td style={td}><span style={{ color:C.blue, fontFamily:"monospace", fontSize:12 }}>{s.profiles?.email||"—"}</span></td>
                      <td style={td}><Badge s={s.status} /></td>
                      <td style={{ ...td, color:C.textXs, fontSize:13 }}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                      <td style={td}>
                        <div style={{ display:"flex", gap:6 }}>
                          <ABtn onClick={() => updateSub(s.id,"active")} color={C.green} bg={C.greenLt} border={C.green}>Activate</ABtn>
                          <ABtn onClick={() => updateSub(s.id,"canceled")} color={C.red} bg={C.redLt} border={C.red}>Cancel</ABtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </div>
            )}

            {/* AI IMPORT */}
            {tab === "import" && <AIImportTool categories={categories} />}
          </div>
        </main>
      </div>

      {/* QUESTION FORM MODAL */}
      {formOpen && (
        <Overlay onClose={closeForm}>
          <div style={{ background:C.surface, borderRadius:20, width:"100%", maxWidth:600, maxHeight:"92vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.15)", animation:"fadeUp .2s ease" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:C.text, margin:0 }}>{editingId ? "Edit Question" : "New Question"}</h2>
                <p style={{ fontSize:12, color:C.textXs, marginTop:3 }}>{editingId ? "Update the question details" : "Create a draft question"}</p>
              </div>
              <CloseBtn onClick={closeForm} />
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"22px 24px", display:"flex", flexDirection:"column", gap:18 }}>
              <FormRow label="Question Text *">
                <textarea style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 13px", fontSize:14, color:C.text, resize:"vertical", minHeight:82, fontFamily:"inherit", background:C.bg, lineHeight:1.5 }}
                  placeholder="Enter the question here…" value={form.question} maxLength={512}
                  onChange={e => setForm(p => ({ ...p, question: e.target.value }))} />
                <span style={{ fontSize:11, color:C.textXs, textAlign:"right", display:"block", marginTop:3 }}>{form.question.length}/512</span>
              </FormRow>
              <FormRow label="Answer Options * (check correct)">
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {OPTS.map(opt => {
                    const isCorrect = form.correct_answers.includes(opt)
                    return (
                      <div key={opt} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", background:isCorrect?C.greenLt:C.bg, border:`1px solid ${isCorrect?C.greenBd:C.border}`, borderRadius:10, transition:"all .15s" }}>
                        <span style={{ width:26, height:26, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isCorrect?C.green:C.borderMd, color:isCorrect?"#fff":C.textSm, fontSize:12, fontWeight:700 }}>{opt}</span>
                        <input style={{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:14, color:C.text }}
                          placeholder={`Option ${opt}…`} value={form.options[opt] || ""}
                          onChange={e => setForm(p => ({ ...p, options: { ...p.options, [opt]: e.target.value } }))} />
                        <button onClick={() => setForm(p => ({ ...p, correct_answers: isCorrect ? p.correct_answers.filter(x=>x!==opt) : [...p.correct_answers, opt] }))}
                          style={{ width:28, height:28, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:isCorrect?C.green:C.surface, border:`1px solid ${isCorrect?C.green:C.borderMd}`, color:isCorrect?"#fff":C.textXs, transition:"all .15s" }}>
                          <I.Check />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </FormRow>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <FormRow label="Difficulty *">
                  <select style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 13px", fontSize:14, color:C.text, background:C.bg, cursor:"pointer" }}
                    value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value as any }))}>
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </FormRow>
                <FormRow label="Category *">
                  <select style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 13px", fontSize:14, color:C.text, background:C.bg, cursor:"pointer" }}
                    value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
                    <option value="">Select a category…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormRow>
              </div>
              <FormRow label="Explanation">
                <textarea style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 13px", fontSize:14, color:C.text, resize:"vertical", minHeight:72, fontFamily:"inherit", background:C.bg, lineHeight:1.5 }}
                  placeholder="Explain why the answer is correct…" value={form.explanation}
                  onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} />
              </FormRow>
              <FormRow label="Image URL (optional)">
                <div style={{ display:"flex", alignItems:"center", gap:8, border:`1px solid ${C.border}`, borderRadius:10, padding:"0 13px", background:C.bg }}>
                  <I.Image />
                  <input style={{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:14, padding:"10px 0", color:C.text }}
                    placeholder="https://…" value={form.image_url}
                    onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} />
                </div>
              </FormRow>
              {formError   && <div style={{ background:C.redLt,   border:`1px solid ${C.redBd}`,   borderRadius:10, padding:"10px 14px", color:C.red,   fontSize:13 }}>⚠ {formError}</div>}
              {formSuccess && <div style={{ background:C.greenLt, border:`1px solid ${C.greenBd}`, borderRadius:10, padding:"10px 14px", color:C.green, fontSize:13 }}>✓ {formSuccess}</div>}
            </div>
            <div style={{ padding:"14px 24px", borderTop:`1px solid ${C.border}`, background:C.bg, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={closeForm} style={{ padding:"9px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, color:C.textMd, cursor:"pointer", fontSize:14 }}>Cancel</button>
              <button onClick={saveQuestion} style={{ padding:"9px 20px", background:C.indigo, border:"none", borderRadius:9, color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600 }}>
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* BLOCK MODAL */}
      {blockTarget && (
        <Overlay onClose={() => setBlockTarget(null)}>
          <div style={{ background:C.surface, borderRadius:20, width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,.15)", animation:"fadeUp .2s ease" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:"20px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:C.text, margin:0 }}>Add to Block</h2>
              <CloseBtn onClick={() => setBlockTarget(null)} />
            </div>
            <div style={{ padding:"18px 22px" }}>
              <p style={{ fontSize:13, color:C.textSm, marginBottom:16, background:C.indigoLt, padding:"8px 12px", borderRadius:8, borderLeft:`3px solid ${C.indigo}`, lineHeight:1.5 }}>
                {blockTarget.question.slice(0,90)}{blockTarget.question.length>90?"…":""}
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {blocks.filter(b => b.category_id === blockTarget.category_id).map(blk => {
                  const on = blockSel.includes(blk.id)
                  return (
                    <label key={blk.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px", border:`1px solid ${on?C.greenBd:C.border}`, background:on?C.greenLt:C.bg, borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                      <input type="checkbox" style={{ accentColor:C.green, width:16, height:16 }} checked={on}
                        onChange={() => setBlockSel(p => p.includes(blk.id) ? p.filter(x=>x!==blk.id) : [...p, blk.id])} />
                      <span style={{ fontSize:14, color:C.textMd, fontWeight:500 }}>{blk.title}</span>
                    </label>
                  )
                })}
                {blocks.filter(b => b.category_id === blockTarget.category_id).length === 0 && (
                  <p style={{ color:C.textXs, fontSize:14, textAlign:"center", padding:"18px 0" }}>No blocks in this category.</p>
                )}
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
                <button onClick={() => setBlockTarget(null)} style={{ padding:"9px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, color:C.textMd, cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button onClick={saveToBlocks} disabled={!blockSel.length}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", background:C.indigo, border:"none", borderRadius:9, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                  <I.Layers /> Add to {blockSel.length} block{blockSel.length!==1?"s":""}
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </>
  )
}

function QRow({ q, index, catName, onEdit, onDelete, onStatus, onBlock }: {
  q: Question; index: number; catName: string
  onEdit:()=>void; onDelete:()=>void; onStatus:(s:Question["status"])=>void; onBlock:()=>void
}) {
  const [open, setOpen] = useState(false)
 const diffCfg = DIFF[q.difficulty] || DIFF["easy"]!
  return (
    <div className="qcard" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", transition:"all .15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:13, padding:"12px 15px", cursor:"pointer" }} onClick={() => setOpen(p=>!p)}>
        <span style={{ color:C.textXs, fontSize:12, minWidth:28, fontVariantNumeric:"tabular-nums" }}>#{index+1}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize:14, fontWeight:500, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.question}</p>
          <div style={{ display:"flex", gap:7, marginTop:5, alignItems:"center", flexWrap:"wrap" }}>
            <Badge s={q.status || "draft"} />
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99, background:diffCfg.bg, color:diffCfg.text }}>{q.difficulty}</span>
            <span style={{ fontSize:12, color:C.textXs }}>{catName}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:5, flexShrink:0 }} onClick={e => e.stopPropagation()}>
          <RowBtn onClick={onEdit} bg={C.indigoLt} border={C.blueBd} color={C.indigo} title="Edit"><I.Edit /></RowBtn>
          {q.status === "draft" && <RowBtn onClick={() => onStatus("pending_review")} bg={C.amberLt} border={C.amberBd} color={C.amber} title="Send for review"><I.Send /></RowBtn>}
          {q.status === "pending_review" && <>
            <RowBtn onClick={() => onStatus("approved")} bg={C.greenLt} border={C.greenBd} color={C.green} title="Approve"><I.Check /></RowBtn>
            <RowBtn onClick={() => onStatus("rejected")} bg={C.redLt} border={C.redBd} color={C.red} title="Reject"><I.X /></RowBtn>
          </>}
          {q.status === "approved" && <>
            <RowBtn onClick={onBlock} bg={C.purpleLt} border={C.purpleBd} color={C.purple} title="Add to Block"><I.Layers /></RowBtn>
            <RowBtn onClick={() => onStatus("rejected")} bg={C.redLt} border={C.redBd} color={C.red} title="Reject"><I.X /></RowBtn>
          </>}
          {q.status === "rejected" && <RowBtn onClick={() => onStatus("draft")} bg={C.bg} border={C.border} color={C.textSm} title="Restore">↩</RowBtn>}
          <RowBtn onClick={onDelete} bg={C.redLt} border={C.redBd} color={C.red} title="Delete"><I.Trash /></RowBtn>
        </div>
        <div style={{ color:C.textXs, transform:open?"rotate(180deg)":"rotate(0deg)", transition:"transform .2s" }}><I.ChevD /></div>
      </div>
      {open && (
        <div style={{ padding:"0 15px 15px 56px", borderTop:`1px solid ${C.bg}`, animation:"fadeUp .15s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, margin:"12px 0" }}>
            {(["A","B","C","D","E"] as const).map(k => {
              const v = q.options?.[k] || ""; const correct = q.correct_answers.includes(k)
              return (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 11px", background:correct?C.greenLt:C.bg, border:`1px solid ${correct?C.greenBd:C.border}`, borderRadius:9 }}>
                  <span style={{ width:22, height:22, borderRadius:6, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:correct?C.green:C.borderMd, color:correct?"#fff":C.textSm, fontSize:11, fontWeight:700 }}>{k}</span>
                  <span style={{ fontSize:13, color:correct?C.green:C.textMd, flex:1 }}>{v || <span style={{color:C.textXs,fontStyle:"italic"}}>empty</span>}</span>
                  {correct && <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>✓</span>}
                </div>
              )
            })}
          </div>
          {q.explanation && (
            <div style={{ background:C.amberLt, border:`1px solid ${C.amberBd}`, borderRadius:10, padding:"10px 13px", marginTop:8 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.amber, textTransform:"uppercase", marginBottom:4 }}>Explanation</p>
              <p style={{ fontSize:13, color:C.textMd, lineHeight:1.55 }}>{q.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RowBtn({ onClick, bg, border, color, title, children }: { onClick:()=>void; bg:string; border:string; color:string; title:string; children:React.ReactNode }) {
  return <button className="action" onClick={onClick} title={title} style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", background:bg, border:`1px solid ${border}`, borderRadius:7, cursor:"pointer", color, flexShrink:0 }}>{children}</button>
}
function ABtn({ onClick, color, bg, border, children }: { onClick:()=>void; color:string; bg:string; border:string; children:React.ReactNode }) {
  return <button onClick={onClick} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"5px 12px", background:bg, border:`1px solid ${border}20`, borderRadius:7, color, cursor:"pointer", fontSize:12, fontWeight:500 }}>{children}</button>
}
function QaBtn({ onClick, bg, color, children }: { onClick:()=>void; bg:string; color:string; children:React.ReactNode }) {
  return <button onClick={onClick} style={{ padding:"9px 18px", background:bg, border:"none", borderRadius:9, color, fontSize:13, fontWeight:600, cursor:"pointer" }}>{children}</button>
}
function FilterChip({ active, onClick, color, colorLt, children }: { active:boolean; onClick:()=>void; color:string; colorLt:string; children:React.ReactNode }) {
  return <button className="chip" onClick={onClick} style={{ padding:"4px 12px", borderRadius:99, cursor:"pointer", fontSize:12, fontWeight:500, border:`1px solid ${active?color:C.border}`, background:active?colorLt:"transparent", color:active?color:C.textSm, transition:"all .15s", textTransform:"capitalize" }}>{children}</button>
}
function DataTable({ headers, children }: { headers:string[]; children:React.ReactNode }) {
  return (
    <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr style={{ background:C.bg }}>{headers.map(h => <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.textXs, letterSpacing:"0.07em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
function Pager({ page, total, onPrev, onNext }: { page:number; total:number; onPrev:()=>void; onNext:()=>void }) {
  const max = Math.max(1, Math.ceil(total/PAGE_SIZE))
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0" }}>
      <span style={{ fontSize:13, color:C.textXs, fontVariantNumeric:"tabular-nums" }}>{total.toLocaleString()} total · Page {page} of {max}</span>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onPrev} disabled={page===1} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.textMd, cursor:"pointer", fontSize:13 }}><I.ChevL /> Prev</button>
        <button onClick={onNext} disabled={page>=max} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.textMd, cursor:"pointer", fontSize:13 }}>Next <I.ChevR /></button>
      </div>
    </div>
  )
}
function Overlay({ onClose, children }: { onClose:()=>void; children:React.ReactNode }) {
  return <div style={{ position:"fixed", inset:0, background:"rgba(17,24,39,.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20, animation:"fadeIn .15s ease" }} onClick={onClose}>{children}</div>
}
function CloseBtn({ onClick }: { onClick:()=>void }) {
  return <button onClick={onClick} style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, cursor:"pointer", color:C.textSm }}><I.X /></button>
}
function FormRow({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{ display:"flex", flexDirection:"column", gap:7 }}><label style={{ fontSize:12, fontWeight:600, color:C.textSm, letterSpacing:"0.04em" }}>{label}</label>{children}</div>
}
const td: React.CSSProperties = { padding:"13px 16px", fontSize:14, color:"#111827", verticalAlign:"middle" }
