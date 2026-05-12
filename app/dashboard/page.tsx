'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

interface UserProfile {
  id: string; email: string; full_name?: string
  role?: string; profession?: string; country?: string; created_at?: string
}
interface ExamResult {
  id: string; score: number; correct_answers: number
  total_questions: number; mode: string; finished_at: string; started_at: string
}
interface BlockProgress {
  block_id: string; attempts: number; correct: number
  qbank_blocks?: { title: string }
}

function timeAgo(d: string) {
  if (!d) return "—"
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff/60000), h = Math.floor(m/60), days = Math.floor(h/24)
  if (m < 2) return "Just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})
}
function fmtDur(s: string, e: string) {
  const m = Math.round((new Date(e).getTime()-new Date(s).getTime())/60000)
  return m < 60 ? `${m}m` : `${Math.floor(m/60)}h ${m%60}m`
}

export default function Dashboard() {
  const [user,    setUser]    = useState<UserProfile|null>(null)
  const [sub,     setSub]     = useState<any>(null)
  const [exams,   setExams]   = useState<ExamResult[]>([])
  const [blocks,  setBlocks]  = useState<BlockProgress[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push("/login"); return }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
      if (!profile) { router.push("/login"); return }
      if (profile.role?.toLowerCase() === "admin") { router.push("/admin"); return }
      await supabase.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", session.user.id)
      setUser(profile)
      const [{ data: subs }, { data: examData }, { data: blockData }] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", profile.id).order("created_at",{ascending:false}).limit(1),
        supabase.from("exams").select("*").eq("user_id", profile.id).not("finished_at","is",null).order("finished_at",{ascending:false}).limit(20),
        supabase.from("user_block_progress").select("*, qbank_blocks(title)").eq("user_id", profile.id),
      ])
      if (subs?.length) setSub(subs[0])
      setExams(examData || [])
      setBlocks(blockData || [])
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:32,height:32,borderRadius:"50%",border:"3px solid #e5e7eb",borderTopColor:"#4f46e5",animation:"spin .7s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!user) return null

  const isActive    = sub?.status === "active" || sub?.status === "trialing"
  const initial     = user.full_name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase() ?? "?"
  const totalExams  = exams.length
  const avgScore    = totalExams ? Math.round(exams.reduce((a,e)=>a+Number(e.score),0)/totalExams) : 0
  const totalRight  = exams.reduce((a,e)=>a+(e.correct_answers||0),0)
  const totalQs     = exams.reduce((a,e)=>a+(e.total_questions||0),0)
  const accuracy    = totalQs ? Math.round(totalRight/totalQs*100) : 0
  const trendData   = exams.slice(0,8).reverse()
  const subEnd      = sub?.current_period_end || sub?.end_date
  const daysLeft    = subEnd ? Math.max(0,Math.ceil((new Date(subEnd).getTime()-Date.now())/86400000)) : null

  const firstName = user.full_name?.split(" ")[0] || "there"

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"var(--font-sans),system-ui,sans-serif"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
        .hov{transition:all .18s}.hov:hover{border-color:#c7d2fe!important;box-shadow:0 4px 20px rgba(0,0,0,.08)!important;transform:translateY(-1px)}
        .row-h:hover{background:#f9fafb;border-radius:10px}
        .ql:hover{border-color:#a5b4fc!important;background:#eef2ff!important}
        .ql{transition:all .15s}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* ── PAGE WRAPPER ───────────────────────────────────────── */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px",animation:"fadeUp .3s ease"}}>

        {/* ── GREETING BANNER ─────────────────────────────────── */}
        <div style={{
          background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#a855f7 100%)",
          borderRadius:20,padding:"28px 32px",marginBottom:28,
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,
          boxShadow:"0 4px 24px rgba(79,70,229,.25)",position:"relative",overflow:"hidden",
        }}>
          {/* BG blobs */}
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
          <div style={{position:"absolute",bottom:-60,right:120,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>

          <div style={{zIndex:1}}>
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",fontWeight:500,marginBottom:4}}>
              {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
            </p>
            <h1 style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-0.025em",lineHeight:1.2}}>
              {totalExams > 0 ? `Welcome back, ${firstName} 👋` : `Hi, ${firstName}! Let's get started 🚀`}
            </h1>
            <p style={{fontSize:14,color:"rgba(255,255,255,.75)",marginTop:6}}>
              {totalExams > 0
                ? `${totalExams} exams · ${accuracy}% accuracy · Keep it up!`
                : "Complete your first exam to start tracking your progress"
              }
            </p>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:12,zIndex:1}}>
            {/* Sub status */}
            <div style={{
              padding:"10px 18px",borderRadius:12,
              background: isActive ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.1)",
              border:"1px solid rgba(255,255,255,.2)",backdropFilter:"blur(8px)",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:isActive?"#4ade80":"#fbbf24",flexShrink:0}}/>
                <p style={{fontSize:13,fontWeight:700,color:"#fff"}}>
                  {isActive ? `${sub?.plan?.toUpperCase()||"PRO"} Active` : "Free Plan"}
                </p>
              </div>
              {daysLeft !== null && isActive && (
                <p style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:2}}>{daysLeft} days remaining</p>
              )}
              {!isActive && (
                <Link href="/pricing" style={{fontSize:11,color:"#fbbf24",fontWeight:700,marginTop:2,display:"block"}}>Upgrade →</Link>
              )}
            </div>

            <Link href="/qbank" style={{
              padding:"11px 22px",background:"#fff",borderRadius:11,
              fontSize:14,fontWeight:700,color:"#4f46e5",
              boxShadow:"0 2px 12px rgba(0,0,0,.15)",transition:"all .15s",display:"inline-block",
            }}>
              Start Exam →
            </Link>
          </div>
        </div>

        {/* ── STAT CARDS ──────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
          {[
            {label:"Exams Taken",  val:String(totalExams),     sub:totalExams>0?`Last ${timeAgo(exams[0]?.finished_at||"")}`:"No exams yet",   accent:"#4f46e5",bg:"#eef2ff"},
            {label:"Avg Score",    val:totalExams?`${avgScore}%`:"—",   sub:avgScore>=70?"On track 🎯":avgScore>0?"Keep practicing":"—",  accent:"#059669",bg:"#ecfdf5"},
            {label:"Accuracy",     val:totalQs?`${accuracy}%`:"—",      sub:`${totalRight} of ${totalQs} correct`,                          accent:"#7c3aed",bg:"#f5f3ff"},
            {label:"Blocks Done",  val:String(blocks.length),   sub:`${blocks.reduce((a,b)=>a+b.attempts,0)} attempts total`,              accent:"#0891b2",bg:"#ecfeff"},
          ].map(s=>(
            <div key={s.label} className="card hov" style={{padding:"20px 22px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>{s.label}</p>
              <p style={{fontSize:32,fontWeight:800,color:"#111827",fontVariantNumeric:"tabular-nums",letterSpacing:"-0.025em"}}>{s.val}</p>
              <p style={{fontSize:12,color:"#9ca3af",marginTop:6}}>{s.sub}</p>
              <div style={{height:3,background:"#f3f4f6",borderRadius:99,marginTop:14,overflow:"hidden"}}>
                <div style={{
                  height:"100%",borderRadius:99,background:s.accent,
                  width:s.label==="Avg Score"&&totalExams?`${avgScore}%`:s.label==="Accuracy"&&totalQs?`${accuracy}%`:"0%",
                  transition:"width .7s ease"
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ───────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>

          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:20}}>

            {/* Score trend */}
            {trendData.length > 1 && (
              <div className="card" style={{padding:"22px 24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div>
                    <h2 style={{fontSize:15,fontWeight:700,color:"#111827"}}>Score Trend</h2>
                    <p style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Last {trendData.length} exams</p>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:99,background:avgScore>=70?"#ecfdf5":"#fffbeb",color:avgScore>=70?"#059669":"#d97706"}}>
                    {avgScore}% avg
                  </span>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",gap:6,height:72}}>
                  {trendData.map((e,i)=>{
                    const sc=Math.round(Number(e.score))
                    const h=Math.max(6,(sc/100)*72)
                    const bg=sc>=70?"#4f46e5":sc>=50?"#f59e0b":"#ef4444"
                    return(
                      <div key={i} title={`${sc}%`} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <span style={{fontSize:9,fontWeight:700,color:bg}}>{sc}%</span>
                        <div style={{width:"100%",height:h,background:bg,borderRadius:"3px 3px 0 0",opacity:.85}}/>
                      </div>
                    )
                  })}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6,borderTop:"1px solid #f3f4f6",paddingTop:6}}>
                  <span style={{fontSize:10,color:"#d1d5db"}}>← Oldest</span>
                  <span style={{fontSize:10,color:"#d1d5db"}}>Most recent →</span>
                </div>
              </div>
            )}

            {/* Recent Exams */}
            <div className="card" style={{padding:"22px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h2 style={{fontSize:15,fontWeight:700,color:"#111827"}}>Recent Exams</h2>
                <Link href="/qbank" style={{fontSize:13,fontWeight:600,color:"#4f46e5",padding:"6px 14px",background:"#eef2ff",borderRadius:8}}>+ New Exam</Link>
              </div>

              {exams.length === 0 ? (
                <div style={{textAlign:"center",padding:"44px 0"}}>
                  <div style={{width:64,height:64,borderRadius:18,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>📋</div>
                  <p style={{fontSize:16,fontWeight:700,color:"#374151",marginBottom:6}}>No exams yet</p>
                  <p style={{fontSize:13,color:"#9ca3af",marginBottom:20}}>Complete your first exam to see your results here</p>
                  <Link href="/qbank" style={{display:"inline-block",padding:"12px 28px",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",borderRadius:11,fontSize:14,fontWeight:700,boxShadow:"0 4px 14px rgba(79,70,229,.35)"}}>
                    Start Practicing →
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 72px 72px 64px 72px",gap:"0 8px",padding:"0 8px 10px",borderBottom:"1px solid #f3f4f6",marginBottom:4}}>
                    {["Exam","Score","Q's","Time","When"].map(h=>(
                      <span key={h} style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</span>
                    ))}
                  </div>
                  {exams.slice(0,7).map((e,i)=>{
                    const sc=Math.round(Number(e.score))
                    const sc_col=sc>=70?"#059669":sc>=50?"#d97706":"#dc2626"
                    const sc_bg =sc>=70?"#ecfdf5":sc>=50?"#fffbeb":"#fef2f2"
                    return(
                      <div key={e.id} className="row-h" style={{display:"grid",gridTemplateColumns:"1fr 72px 72px 64px 72px",gap:"0 8px",padding:"10px 8px",alignItems:"center",borderBottom:i<6?"1px solid #f9fafb":"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#4f46e5",flexShrink:0}}>
                            {i+1}
                          </div>
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:"#111827",textTransform:"capitalize"}}>{e.mode||"Standard"}</p>
                            <p style={{fontSize:11,color:"#9ca3af"}}>{new Date(e.finished_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</p>
                          </div>
                        </div>
                        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"4px 8px",background:sc_bg,borderRadius:7,fontSize:13,fontWeight:700,color:sc_col}}>{sc}%</div>
                        <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{e.correct_answers}/{e.total_questions}</span>
                        <span style={{fontSize:12,color:"#9ca3af"}}>{e.started_at?fmtDur(e.started_at,e.finished_at):"—"}</span>
                        <span style={{fontSize:12,color:"#9ca3af"}}>{timeAgo(e.finished_at)}</span>
                      </div>
                    )
                  })}
                </>
              )}
            </div>

            {/* Block Progress */}
            {blocks.length > 0 && (
              <div className="card" style={{padding:"22px 24px"}}>
                <h2 style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:18}}>Block Progress</h2>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {blocks.slice(0,6).map(b=>{
                    const acc=b.attempts>0?Math.round(b.correct/b.attempts*100):0
                    const col=acc>=70?"#059669":acc>=50?"#d97706":"#ef4444"
                    return(
                      <div key={b.block_id}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontSize:13,fontWeight:500,color:"#374151"}}>{b.qbank_blocks?.title||"Block"}</span>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:11,color:"#9ca3af"}}>{b.attempts} attempts</span>
                            <span style={{fontSize:12,fontWeight:700,color:col}}>{acc}%</span>
                          </div>
                        </div>
                        <div style={{height:5,background:"#f3f4f6",borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${acc}%`,background:col,borderRadius:99,transition:"width .5s ease"}}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:80}}>

            {/* User card */}
            <div className="card" style={{padding:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingBottom:16,borderBottom:"1px solid #f3f4f6"}}>
                <div style={{width:46,height:46,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:800,flexShrink:0}}>
                  {initial}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:14,fontWeight:700,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.full_name||"No name"}</p>
                  <p style={{fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{user.email}</p>
                </div>
              </div>
              {[
                {label:"Profession", value:user.profession||"—"},
                {label:"Country",    value:user.country||"—"},
                {label:"Plan",       value:isActive?(sub?.plan?.toUpperCase()||"PRO"):"Free"},
                {label:"Joined",     value:user.created_at?new Date(user.created_at).toLocaleDateString("en-GB",{month:"short",year:"numeric"}):"—"},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f9fafb"}}>
                  <span style={{fontSize:12,color:"#9ca3af",fontWeight:500}}>{r.label}</span>
                  <span style={{fontSize:12,color:"#374151",fontWeight:600}}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Start */}
            <div className="card" style={{padding:"18px"}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:12}}>Quick Start</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {href:"/qbank",   emoji:"📚",title:"QBank",          sub:"Board questions",  bg:"#eef2ff",bd:"#c7d2fe"},
                  {href:"/cases",   emoji:"🩺",title:"Clinical Cases", sub:"Scenario cases",   bg:"#f5f3ff",bd:"#ddd6fe"},
                  {href:"/pricing", emoji:"⚡",title:"Upgrade",        sub:"Unlock everything", bg:"#fffbeb",bd:"#fde68a"},
                ].map(item=>(
                  <Link key={item.href} href={item.href} className="ql"
                    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:item.bg,border:`1px solid ${item.bd}`,borderRadius:11}}>
                    <span style={{fontSize:20}}>{item.emoji}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#111827"}}>{item.title}</p>
                      <p style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{item.sub}</p>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Motivation */}
            {totalExams > 0 ? (
              <div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",borderRadius:16,padding:"18px 20px",color:"#fff"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:24}}>{avgScore>=70?"🏆":"💪"}</span>
                  <div>
                    <p style={{fontSize:16,fontWeight:800,letterSpacing:"-0.02em"}}>{totalExams} exams done</p>
                    <p style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:1}}>Keep going!</p>
                  </div>
                </div>
                <p style={{fontSize:12.5,color:"rgba(255,255,255,.8)",lineHeight:1.55}}>
                  Overall accuracy: <strong style={{color:"#fff"}}>{accuracy}%</strong>
                  {avgScore>=70?" — Excellent! 🎉":" — Practice makes perfect 📈"}
                </p>
              </div>
            ) : (
              <div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",borderRadius:16,padding:"20px",color:"#fff",textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:10}}>🎯</div>
                <p style={{fontSize:15,fontWeight:800,marginBottom:6}}>Ready to start?</p>
                <p style={{fontSize:12,color:"rgba(255,255,255,.75)",marginBottom:14,lineHeight:1.5}}>
                  500+ board-style questions are waiting for you
                </p>
                <Link href="/qbank" style={{display:"block",padding:"10px",background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700}}>
                  Start Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
