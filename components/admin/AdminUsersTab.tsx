"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

// ── Types ──────────────────────────────────────────────────────────
interface UserProfile {
  subscription?: any
  id: string
  email: string
  full_name: string | null
  role: string
  stripe_customer_id: string | null
  created_at: string
  updated_at: string | null
}
interface UserSubscription {
  id: string
  status: string
  plan: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  stripe_subscription_id: string | null
}
interface UserStats {
  total_exams: number
  avg_score: number
  last_exam_at: string | null
  total_correct: number
  total_questions: number
  blocks_attempted: number
}
interface UserPayment {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
}
interface EnrichedUser extends UserProfile {
  subscription?: UserSubscription | null
  stats?: UserStats
  payments?: UserPayment[]
}

// ── Colors ─────────────────────────────────────────────────────────
const C = {
  page:      "#f8fafc",
  surface:   "#ffffff",
  surfaceAlt:"#f8fafc",
  border:    "#e2e8f0",
  borderMd:  "#cbd5e1",
  text:      "#0f172a",
  textMd:    "#334155",
  textSm:    "#64748b",
  textXs:    "#94a3b8",
  blue:      "#2563eb", blueLt:"#eff6ff", blueBd:"#bfdbfe",
  green:     "#059669", greenLt:"#ecfdf5", greenBd:"#6ee7b7",
  amber:     "#d97706", amberLt:"#fffbeb", amberBd:"#fcd34d",
  red:       "#dc2626", redLt:"#fef2f2",   redBd:"#fca5a5",
  teal:      "#0891b2", tealLt:"#ecfeff",  tealBd:"#67e8f9",
  slate:     "#475569", slateLt:"#f1f5f9", slateBd:"#cbd5e1",
}

type SubStatus = "active"|"trialing"|"past_due"|"canceled"|"none"
const SUB_BADGE: Record<SubStatus,{bg:string;text:string;dot:string;label:string}> = {
  active:   {bg:"#ecfdf5",text:"#065f46",dot:"#059669",label:"Active"},
  trialing: {bg:"#eff6ff",text:"#1e40af",dot:"#3b82f6",label:"Trialing"},
  past_due: {bg:"#fffbeb",text:"#92400e",dot:"#f59e0b",label:"Past Due"},
  canceled: {bg:"#fef2f2",text:"#991b1b",dot:"#dc2626",label:"Canceled"},
  none:     {bg:"#f1f5f9",text:"#475569",dot:"#94a3b8",label:"No Sub"},
}
const ROLE_BADGE: Record<string,{bg:string;text:string}> = {
  admin:       {bg:"#fef3c7",text:"#92400e"},
  contributor: {bg:"#eff6ff",text:"#1e40af"},
  user:        {bg:"#f1f5f9",text:"#475569"},
}

// ── Icons ──────────────────────────────────────────────────────────
const Ic = {
  Search:  ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  User:    ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Card:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Chart:   ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Clock:   ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trash:   ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Edit:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X:       ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:   ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevD:   ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevL:   ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:   ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Refresh: ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Filter:  ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Dollar:  ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Award:   ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
}

// ── Helpers ────────────────────────────────────────────────────────
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (m < 2)  return "Just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7)  return `${d}d ago`
  return new Date(dateStr).toLocaleDateString()
}
function fmtDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
}
function fmtMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US",{ style:"currency", currency: currency.toUpperCase() }).format(cents/100)
}
function initials(u: UserProfile) {
  if (u.full_name) return u.full_name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)
  return (u.email?.charAt(0) || "?").toUpperCase()
}
function avatarColor(id: string) {
  const colors = ["#2563eb","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777"]
  let hash = 0; for (const c of id) hash = c.charCodeAt(0) + ((hash<<5)-hash)
  return colors[Math.abs(hash) % colors.length]
}

const PAGE_SIZE = 15

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function AdminUsersTab() {
  const [users, setUsers]           = useState<EnrichedUser[]>([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [roleFilter, setRoleFilter] = useState<"all"|"user"|"admin"|"contributor">("all")
  const [subFilter, setSubFilter]   = useState<"all"|"active"|"trialing"|"past_due"|"canceled"|"none">("all")
  const [sortBy, setSortBy]         = useState<"created_at"|"updated_at"|"email">("created_at")
  const [sortDir, setSortDir]       = useState<"desc"|"asc">("desc")
  const [selected, setSelected]     = useState<UserProfile | null>(null)
  const [userDetail, setUserDetail] = useState<EnrichedUser | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [toast, setToast]           = useState<{msg:string;type:"ok"|"err"}|null>(null)

  // ── Stats summary ─────────────────────────────────────────────
  const [summary, setSummary] = useState({ total:0, active_subs:0, new_7d:0, admins:0 })

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({msg,type})
    setTimeout(()=>setToast(null), 3000)
  }

  // ── Load summary ──────────────────────────────────────────────
  const loadSummary = useCallback(async () => {
    const [
      {count: totalCount},
      {count: activeSubs},
      {count: new7d},
      {count: admins},
    ] = await Promise.all([
      supabase.from("profiles").select("*",{count:"exact",head:true}),
      supabase.from("subscriptions").select("*",{count:"exact",head:true}).in("status",["active","trialing"]),
      supabase.from("profiles").select("*",{count:"exact",head:true}).gte("created_at", new Date(Date.now()-7*24*60*60*1000).toISOString()),
      supabase.from("profiles").select("*",{count:"exact",head:true}).eq("role","admin"),
    ])
    setSummary({ total:totalCount||0, active_subs:activeSubs||0, new_7d:new7d||0, admins:admins||0 })
  },[])

  // ── Load users ────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      let q = supabase.from("profiles")
        .select("*", { count:"exact" })
        .order(sortBy, { ascending: sortDir==="asc" })
        .range((page-1)*PAGE_SIZE, page*PAGE_SIZE-1)

      if (roleFilter !== "all") q = q.eq("role", roleFilter)
      if (search) q = q.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)

      const { data: profileData, count } = await q
      if (!profileData) { setLoading(false); return }

      // Fetch subscriptions for these users
      const ids = profileData.map(p => p.id)
      const { data: subs } = await supabase.from("subscriptions")
        .select("user_id, id, status, plan, current_period_end, cancel_at_period_end, stripe_subscription_id")
        .in("user_id", ids)
        .order("created_at", { ascending:false })

      // Fetch exam stats
      const { data: examStats } = await supabase.from("exams")
        .select("user_id, score, correct_answers, total_questions, finished_at")
        .in("user_id", ids)
        .not("finished_at","is",null)

      // Fetch block progress counts
      const { data: blockProgress } = await supabase.from("user_block_progress")
        .select("user_id")
        .in("user_id", ids)

      // Enrich
      const enriched: EnrichedUser[] = profileData.map(p => {
        const userSubs = subs?.filter(s => s.user_id === p.id) || []
        const activeSub = userSubs.find(s => s.status === "active" || s.status === "trialing")
        const sub = activeSub || userSubs[0] || null

        const userExams = examStats?.filter(e => e.user_id === p.id) || []
        const scores = userExams.map(e => Number(e.score)).filter(s => !isNaN(s))
        const lastExam = userExams.sort((a,b) => new Date(b.finished_at||0).getTime() - new Date(a.finished_at||0).getTime())[0]
        const totalCorrect = userExams.reduce((acc,e) => acc + (e.correct_answers||0), 0)
        const totalQs = userExams.reduce((acc,e) => acc + (e.total_questions||0), 0)
        const blocksAttempted = blockProgress?.filter(b => b.user_id === p.id).length || 0

        return {
          ...p,
          subscription: sub ? {
            id: sub.id,
            status: sub.status,
            plan: sub.plan,
            current_period_end: sub.current_period_end,
            cancel_at_period_end: sub.cancel_at_period_end,
            stripe_subscription_id: sub.stripe_subscription_id,
          } : null,
          stats: {
            total_exams: userExams.length,
            avg_score: scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0,
            last_exam_at: lastExam?.finished_at || null,
            total_correct: totalCorrect,
            total_questions: totalQs,
            blocks_attempted: blocksAttempted,
          }
        }
      })

      // Apply subscription filter client-side
      const filtered = subFilter === "all" ? enriched :
        subFilter === "none" ? enriched.filter(u => !u.subscription) :
        enriched.filter(u => u.subscription?.status === subFilter)

      setUsers(filtered)
      setTotal(count || 0)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, search, roleFilter, subFilter, sortBy, sortDir])

  useEffect(() => { loadSummary() }, [loadSummary])
  useEffect(() => { setPage(1) }, [search, roleFilter, subFilter, sortBy, sortDir])
  useEffect(() => { loadUsers() }, [loadUsers])

  // ── Load user detail ──────────────────────────────────────────
  const openDetail = async (u: EnrichedUser) => {
    setSelected(u); setDetailLoading(true); setUserDetail(null)
    const [
      { data: allSubs },
      { data: exams },
      { data: payments },
      { data: blockProg },
    ] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("user_id", u.id).order("created_at",{ascending:false}),
      supabase.from("exams").select("*").eq("user_id", u.id).order("created_at",{ascending:false}).limit(10),
      supabase.from("payments").select("*").eq("user_id", u.id).order("created_at",{ascending:false}).limit(5),
      supabase.from("user_block_progress").select("*, qbank_blocks(title)").eq("user_id", u.id),
    ])

    const activeSub = allSubs?.find(s => s.status==="active"||s.status==="trialing") || allSubs?.[0] || null
    const examList = exams || []
    const scores = examList.map(e=>Number(e.score)).filter(s=>!isNaN(s))

    setUserDetail({
      ...u,
      subscription: activeSub ? {
        id:activeSub.id, status:activeSub.status, plan:activeSub.plan,
        current_period_end:activeSub.current_period_end,
        cancel_at_period_end:activeSub.cancel_at_period_end,
        stripe_subscription_id:activeSub.stripe_subscription_id,
      } : null,
      stats: {
        total_exams: examList.length,
        avg_score: scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0,
        last_exam_at: examList[0]?.finished_at||null,
        total_correct: examList.reduce((a,e)=>a+(e.correct_answers||0),0),
        total_questions: examList.reduce((a,e)=>a+(e.total_questions||0),0),
        blocks_attempted: blockProg?.length||0,
      },
      payments: (payments||[]).map(p=>({id:p.id,amount:p.amount,currency:p.currency,status:p.status,created_at:p.created_at})),
    })
    // Store full exams + subs + blockProg for detail view
    ;(window as any).__adminUserDetail = { allSubs, exams, blockProg }
    setDetailLoading(false)
  }

  // ── Actions ───────────────────────────────────────────────────
  async function updateRole(id: string, role: string) {
  const { error } = await supabase.from("profiles").update({ 
    role,
    updated_at: new Date().toISOString()
  }).eq("id", id)
  
  if (error) { showToast(error.message, "err"); return }
  
  // Оновлюємо всі стани одночасно
  setUsers(p => p.map(u => u.id === id ? { ...u, role } : u))
  setSelected(p => p?.id === id ? { ...p, role } : p)
  setUserDetail(p => p?.id === id ? { ...p, role } : p)
  showToast("Role updated ✓")
  loadSummary() // оновлюємо лічильник admins
}
  async function deleteUser(id: string) {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return
    const { error } = await supabase.from("profiles").delete().eq("id", id)
    if (error) { showToast(error.message,"err"); return }
    setUsers(p => p.filter(u => u.id!==id))
    setTotal(p => Math.max(0,p-1))
    setSelected(null); setUserDetail(null)
    showToast("User deleted")
    loadSummary()
  }
  async function extendSubscription(userId: string, days: number) {
    // Find existing sub
    const { data: sub } = await supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at",{ascending:false}).limit(1).single()
    if (sub) {
      const newEnd = new Date(sub.current_period_end || Date.now())
      newEnd.setDate(newEnd.getDate() + days)
      const { error } = await supabase.from("subscriptions").update({
        status: "active",
        current_period_end: newEnd.toISOString(),
        cancel_at_period_end: false,
      }).eq("id", sub.id)
      if (error) { showToast(error.message,"err"); return }
    } else {
      const start = new Date()
      const end = new Date(); end.setDate(end.getDate() + days)
      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId, status:"active", plan:"manual",
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: false,
        created_at: start.toISOString(),
      })
      if (error) { showToast(error.message,"err"); return }
    }
    showToast(`Subscription extended by ${days} days ✓`)
    openDetail(userDetail!)
    loadUsers()
  }
  async function cancelSubscription(subId: string) {
    if (!confirm("Cancel this subscription?")) return
    const { error } = await supabase.from("subscriptions").update({ status:"canceled", cancel_at_period_end:true }).eq("id", subId)
    if (error) { showToast(error.message,"err"); return }
    showToast("Subscription canceled")
    openDetail(userDetail!)
    loadUsers()
  }

  const maxPage = Math.max(1, Math.ceil(total/PAGE_SIZE))
  const subStatus = (u: EnrichedUser): SubStatus => (u.subscription?.status as SubStatus) || "none"

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slide-in { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fade-up  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toast-in { from { opacity:0; transform:translateY(8px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .u-row:hover { background: #f8fafc; }
        .act-btn:hover { opacity:.72; }
        .sort-btn:hover { color: #0f172a !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, padding:"12px 18px", borderRadius:10, background:toast.type==="ok"?C.green:C.red, color:"#fff", fontSize:13, fontWeight:600, boxShadow:"0 4px 20px rgba(0,0,0,.18)", animation:"toast-in .2s ease", display:"flex", alignItems:"center", gap:8 }}>
          {toast.type==="ok" ? <Ic.Check/> : <Ic.X/>} {toast.msg}
        </div>
      )}

      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* ── LEFT: main panel ─────────────────────────────────── */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Summary row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[
              { label:"Total Users",   value:summary.total,       color:C.blue,  icon:<Ic.User/> },
              { label:"Active Subs",   value:summary.active_subs, color:C.green, icon:<Ic.Card/> },
              { label:"New (7 days)",  value:summary.new_7d,      color:C.teal,  icon:<Ic.Clock/> },
              { label:"Admins",        value:summary.admins,      color:C.amber, icon:<Ic.Award/> },
            ].map(s=>(
              <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", borderTop:`3px solid ${s.color}`, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:10.5, fontWeight:700, color:C.textSm, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.label}</span>
                  <span style={{ color:s.color }}>{s.icon}</span>
                </div>
                <div style={{ fontSize:28, fontWeight:800, color:C.text, fontVariantNumeric:"tabular-nums", letterSpacing:"-0.02em" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            {/* Search */}
            <label style={{ display:"flex", alignItems:"center", gap:8, flex:"1 1 220px", background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:8, padding:"0 12px" }}>
              <span style={{ color:C.textXs }}><Ic.Search/></span>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                style={{ flex:1, border:"none", outline:"none", fontSize:13.5, padding:"9px 0", color:C.text, background:"transparent" }}
                placeholder="Search name or email…"/>
              {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",color:C.textXs,padding:2 }}><Ic.X/></button>}
            </label>

            {/* Role filter */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:C.textXs, letterSpacing:"0.08em", textTransform:"uppercase" }}>Role</span>
              {(["all","user","admin","contributor"] as const).map(r=>(
                <button key={r} onClick={()=>setRoleFilter(r)}
                  style={{ padding:"4px 11px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:500, border:`1px solid ${roleFilter===r?C.blue:C.border}`, background:roleFilter===r?C.blueLt:"transparent", color:roleFilter===r?C.blue:C.textSm, transition:"all .12s", textTransform:"capitalize" }}>
                  {r==="all"?"All":r}
                </button>
              ))}
            </div>

            <div style={{ width:1, height:20, background:C.border }}/>

            {/* Sub filter */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:C.textXs, letterSpacing:"0.08em", textTransform:"uppercase" }}>Sub</span>
              {(["all","active","trialing","past_due","canceled","none"] as const).map(s=>(
                <button key={s} onClick={()=>setSubFilter(s)}
                  style={{ padding:"4px 11px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:500, border:`1px solid ${subFilter===s?C.blue:C.border}`, background:subFilter===s?C.blueLt:"transparent", color:subFilter===s?C.blue:C.textSm, transition:"all .12s", textTransform:"capitalize" }}>
                  {s==="all"?"All":s==="none"?"No Sub":s.replace("_"," ")}
                </button>
              ))}
            </div>

            <button onClick={()=>loadUsers()} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"7px 13px", background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:8, color:C.textSm, cursor:"pointer", fontSize:13 }}>
              <Ic.Refresh/> Refresh
            </button>
          </div>

          {/* Table */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:C.surfaceAlt, borderBottom:`1px solid ${C.border}` }}>
                  {[
                    { label:"User",      key:"email"      },
                    { label:"Role",      key:null         },
                    { label:"Sub",       key:null         },
                    { label:"Exams",     key:null         },
                    { label:"Avg Score", key:null         },
                    { label:"Registered",key:"created_at" },
                    { label:"Activity",  key:"updated_at" },
                    { label:"",          key:null         },
                  ].map((h,i)=>(
                    <th key={i} style={{ padding:"9px 14px", textAlign:"left", fontSize:10.5, fontWeight:700, color:C.textXs, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                      {h.key ? (
                        <button className="sort-btn" onClick={()=>{ if(sortBy===h.key){setSortDir(d=>d==="asc"?"desc":"asc")}else{setSortBy(h.key as any);setSortDir("desc")} }}
                          style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:sortBy===h.key?C.blue:C.textXs,fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:0 }}>
                          {h.label}
                          <span style={{ fontSize:9 }}>{sortBy===h.key ? (sortDir==="asc"?"↑":"↓") : "↕"}</span>
                        </button>
                      ) : h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding:"48px", textAlign:"center", color:C.textXs }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",border:`3px solid ${C.border}`,borderTopColor:C.blue,animation:"spin .7s linear infinite",margin:"0 auto" }}/>
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding:"48px", textAlign:"center", color:C.textXs, fontSize:14 }}>No users found</td></tr>
                ) : users.map(u => {
                  const ss = subStatus(u)
                  const sbc = SUB_BADGE[ss]
                  const rc = ROLE_BADGE[u.role] ?? { bg:"#f3f4f6", text:"#374151" }
                  const isSelected = selected?.id === u.id
                  const accuracy = u.stats?.total_questions ? Math.round((u.stats.total_correct/u.stats.total_questions)*100) : null

                  return (
                    <tr key={u.id} className="u-row"
                      style={{ borderBottom:`1px solid ${C.surfaceAlt}`, background:isSelected?"#f0f9ff":"", cursor:"pointer", transition:"background .1s" }}
                      onClick={()=>openDetail(u)}>

                      {/* User */}
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34,height:34,borderRadius:"50%",background:avatarColor(u.id),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,flexShrink:0 }}>
                            {initials(u)}
                          </div>
                          <div>
                            <div style={{ fontSize:13.5,fontWeight:600,color:C.text,lineHeight:1.2 }}>{u.full_name||<span style={{color:C.textXs,fontStyle:"italic"}}>No name</span>}</div>
                            <div style={{ fontSize:11.5,color:C.textSm,marginTop:1 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ padding:"2px 8px",borderRadius:5,background:rc.bg,color:rc.text,fontSize:11,fontWeight:600,textTransform:"capitalize" }}>
                          {u.role}
                        </span>
                      </td>

                      {/* Sub */}
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
                          <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:5,background:sbc.bg,color:sbc.text,fontSize:11,fontWeight:600 }}>
                            <span style={{ width:5,height:5,borderRadius:"50%",background:sbc.dot,flexShrink:0 }}/>
                            {sbc.label}
                          </span>
                          {u.subscription?.current_period_end && (
                            <span style={{ fontSize:10.5,color:C.textXs }}>until {fmtDate(u.subscription.current_period_end)}</span>
                          )}
                        </div>
                      </td>

                      {/* Exams */}
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:5,color:C.textMd }}>
                          <Ic.Chart/>
                          <span style={{ fontSize:13,fontWeight:600 }}>{u.stats?.total_exams||0}</span>
                        </div>
                      </td>

                      {/* Avg Score */}
                      <td style={{ padding:"11px 14px" }}>
                        {accuracy !== null ? (
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <div style={{ flex:1,height:4,background:C.border,borderRadius:99,overflow:"hidden",minWidth:48 }}>
                              <div style={{ height:"100%",width:`${accuracy}%`,background:accuracy>=70?C.green:accuracy>=50?C.amber:C.red,borderRadius:99 }}/>
                            </div>
                            <span style={{ fontSize:12,fontWeight:600,color:accuracy>=70?C.green:accuracy>=50?C.amber:C.red,minWidth:32 }}>{accuracy}%</span>
                          </div>
                        ) : <span style={{ color:C.textXs,fontSize:12 }}>—</span>}
                      </td>

                      {/* Registered */}
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textSm, whiteSpace:"nowrap" }}>
                        {fmtDate(u.created_at)}
                      </td>

                      {/* Last Activity */}
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ fontSize:12, color:u.stats?.last_exam_at?C.textSm:C.textXs }}>
                          {u.stats?.last_exam_at ? timeAgo(u.stats.last_exam_at) : "No activity"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"11px 14px" }} onClick={e=>e.stopPropagation()}>
                        <div style={{ display:"flex",gap:5 }}>
                          <button className="act-btn" title="View details" onClick={()=>openDetail(u)}
                            style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:C.blueLt,border:`1px solid ${C.blueBd}`,borderRadius:6,cursor:"pointer",color:C.blue }}>
                            <Ic.User/>
                          </button>
                          <button className="act-btn" title="Delete user" onClick={()=>deleteUser(u.id)}
                            style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:C.redLt,border:`1px solid ${C.redBd}`,borderRadius:6,cursor:"pointer",color:C.red }}>
                            <Ic.Trash/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0" }}>
            <span style={{ fontSize:12.5,color:C.textXs }}>{total.toLocaleString()} users · Page {page} of {maxPage}</span>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.textMd,cursor:"pointer",fontSize:13 }}>
                <Ic.ChevL/> Prev
              </button>
              <button onClick={()=>setPage(p=>Math.min(maxPage,p+1))} disabled={page>=maxPage}
                style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.textMd,cursor:"pointer",fontSize:13 }}>
                Next <Ic.ChevR/>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: User detail panel ──────────────────────────── */}
        {selected && (
          <div style={{ width:340,flexShrink:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.08)",animation:"slide-in .2s ease",position:"sticky",top:120,maxHeight:"calc(100vh - 160px)",overflowY:"auto" }}>

            {/* Header */}
            <div style={{ padding:"16px 18px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,fontWeight:700,color:C.text }}>User Profile</span>
              <button onClick={()=>{ setSelected(null);setUserDetail(null) }}
                style={{ width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",color:C.textSm }}>
                <Ic.X/>
              </button>
            </div>

            {detailLoading ? (
              <div style={{ padding:"40px",textAlign:"center" }}>
                <div style={{ width:24,height:24,borderRadius:"50%",border:`3px solid ${C.border}`,borderTopColor:C.blue,animation:"spin .7s linear infinite",margin:"0 auto" }}/>
              </div>
            ) : (
              <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:16, animation:"fade-up .2s ease" }}>
                
                {/* Avatar + name */}
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:48,height:48,borderRadius:"50%",background:avatarColor(selected.id),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:700,flexShrink:0 }}>
                    {initials(selected)}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:15,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {selected.full_name || "No name"}
                    </div>
                    <div style={{ fontSize:12,color:C.textSm,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {selected.email}
                    </div>
                  </div>
                </div>

                {/* Role editor */}
                <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px" }}>
                  <p style={{ fontSize:10.5,fontWeight:700,color:C.textXs,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Role</p>
                  <div style={{ display:"flex",gap:6 }}>
                    {["user","contributor","admin"].map(r=>(
                      <button key={r} onClick={()=>updateRole(selected.id,r)}
                        style={{ flex:1,padding:"6px",borderRadius:7,border:`1px solid ${(userDetail||selected).role===r?C.blue:C.border}`,background:(userDetail||selected).role===r?C.blueLt:"transparent",color:(userDetail||selected).role===r?C.blue:C.textSm,cursor:"pointer",fontSize:12,fontWeight:600,textTransform:"capitalize",transition:"all .12s" }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                {userDetail?.stats && (
                  <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px" }}>
                    <p style={{ fontSize:10.5,fontWeight:700,color:C.textXs,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>Exam Statistics</p>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                      {[
                        { label:"Total Exams",   value:userDetail.stats.total_exams },
                        { label:"Avg Score",     value:userDetail.stats.avg_score ? `${userDetail.stats.avg_score}%` : "—" },
                        { label:"Correct Ans.",  value:userDetail.stats.total_correct },
                        { label:"Blocks Done",   value:userDetail.stats.blocks_attempted },
                      ].map(s=>(
                        <div key={s.label} style={{ textAlign:"center",padding:"8px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:20,fontWeight:800,color:C.text,fontVariantNumeric:"tabular-nums" }}>{s.value}</div>
                          <div style={{ fontSize:10.5,color:C.textXs,marginTop:2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {userDetail.stats.total_questions > 0 && (
                      <div style={{ marginTop:10 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                          <span style={{ fontSize:11,color:C.textSm }}>Overall accuracy</span>
                          <span style={{ fontSize:11,fontWeight:700,color:C.text }}>{Math.round(userDetail.stats.total_correct/userDetail.stats.total_questions*100)}%</span>
                        </div>
                        <div style={{ height:6,background:C.border,borderRadius:99,overflow:"hidden" }}>
                          <div style={{ height:"100%",width:`${Math.round(userDetail.stats.total_correct/userDetail.stats.total_questions*100)}%`,background:C.blue,borderRadius:99,transition:"width .5s ease" }}/>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop:8,fontSize:11.5,color:C.textXs,display:"flex",alignItems:"center",gap:4 }}>
                      <Ic.Clock/> Last activity: <strong style={{ color:C.textSm }}>{timeAgo(userDetail.stats.last_exam_at)}</strong>
                    </div>
                  </div>
                )}

                {/* Subscription */}
                <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px" }}>
                  <p style={{ fontSize:10.5,fontWeight:700,color:C.textXs,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>Subscription</p>
                  {(userDetail||selected).subscription ? (
                    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                      {[
                        { label:"Status",  value:<span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:5,background:SUB_BADGE[subStatus(userDetail||selected)].bg,color:SUB_BADGE[subStatus(userDetail||selected)].text,fontSize:11,fontWeight:600 }}>{SUB_BADGE[subStatus(userDetail||selected)].label}</span> },
                        { label:"Plan",    value:(userDetail||selected).subscription?.plan||"—" },
                        { label:"Ends",    value:fmtDate((userDetail||selected).subscription?.current_period_end||null) },
                        { label:"Cancel",  value:(userDetail||selected).subscription?.cancel_at_period_end ? "Yes" : "No" },
                      ].map(r=>(
                        <div key={r.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12 }}>
                          <span style={{ color:C.textXs,fontWeight:500 }}>{r.label}</span>
                          <span style={{ color:C.text,fontWeight:500 }}>{r.value}</span>
                        </div>
                      ))}
                      {/* Extend buttons */}
                      <div style={{ marginTop:6 }}>
                        <p style={{ fontSize:10.5,color:C.textXs,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6 }}>Extend by</p>
                        <div style={{ display:"flex",gap:6 }}>
                          {[7,30,90,365].map(d=>(
                            <button key={d} onClick={()=>extendSubscription(selected.id,d)}
                              style={{ flex:1,padding:"5px 0",background:C.greenLt,border:`1px solid ${C.greenBd}`,borderRadius:6,color:C.green,cursor:"pointer",fontSize:11,fontWeight:700 }}>
                              {d === 365 ? "1yr" : `${d}d`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={()=>cancelSubscription((userDetail||selected).subscription!.id)}
                        style={{ marginTop:4,padding:"7px",background:C.redLt,border:`1px solid ${C.redBd}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:12,fontWeight:600,width:"100%" }}>
                        Cancel Subscription
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize:12,color:C.textXs,marginBottom:10 }}>No subscription. Grant access manually:</p>
                      <div style={{ display:"flex",gap:6 }}>
                        {[7,30,90,365].map(d=>(
                          <button key={d} onClick={()=>extendSubscription(selected.id,d)}
                            style={{ flex:1,padding:"7px 0",background:C.blueLt,border:`1px solid ${C.blueBd}`,borderRadius:7,color:C.blue,cursor:"pointer",fontSize:12,fontWeight:700 }}>
                            {d === 365 ? "1yr" : `${d}d`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payments */}
                {userDetail?.payments && userDetail.payments.length > 0 && (
                  <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px" }}>
                    <p style={{ fontSize:10.5,fontWeight:700,color:C.textXs,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10 }}>Recent Payments</p>
                    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                      {userDetail.payments.map(p=>(
                        <div key={p.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8 }}>
                          <div>
                            <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{fmtMoney(p.amount,p.currency)}</div>
                            <div style={{ fontSize:11,color:C.textXs,marginTop:1 }}>{fmtDate(p.created_at)}</div>
                          </div>
                          <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:p.status==="succeeded"?C.greenLt:C.amberLt,color:p.status==="succeeded"?C.green:C.amber }}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px" }}>
                  <p style={{ fontSize:10.5,fontWeight:700,color:C.textXs,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Account Info</p>
                  {[
                    { label:"User ID",    value:selected.id.slice(0,16)+"…" },
                    { label:"Registered", value:fmtDate(selected.created_at) },
                    { label:"Stripe ID",  value:selected.stripe_customer_id ? selected.stripe_customer_id.slice(0,18)+"…" : "—" },
                  ].map(r=>(
                    <div key={r.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:11.5,color:C.textXs,fontWeight:500 }}>{r.label}</span>
                      <span style={{ fontSize:11.5,color:C.textMd,fontFamily:"monospace" }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Delete */}
                <button onClick={()=>deleteUser(selected.id)}
                  style={{ padding:"10px",background:C.redLt,border:`1px solid ${C.redBd}`,borderRadius:9,color:C.red,cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                  <Ic.Trash/> Delete User Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

