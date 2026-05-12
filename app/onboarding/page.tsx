'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

const PROFESSIONS = [
  "Physical Therapist",
  "Occupational Therapist",
  "Speech-Language Pathologist",
  "Athletic Trainer",
  "Physical Therapy Student",
  "OT Student",
  "PT Assistant",
  "OT Assistant",
  "Other",
]

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Netherlands", "Sweden", "Norway", "Denmark", "Finland",
  "New Zealand", "Ireland", "Switzerland", "Austria", "Belgium",
  "Spain", "Italy", "Portugal", "Poland", "Ukraine", "Other",
]

const STEPS = ["Profile", "Specialty", "Confirm"] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [step,        setStep]        = useState(0)
  const [checking,    setChecking]    = useState(true)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState("")
  const [userId,      setUserId]      = useState("")
  const [googleName,  setGoogleName]  = useState("")
  const [googleEmail, setGoogleEmail] = useState("")
  const [googleAvatar,setGoogleAvatar]= useState("")

  const [fullName,    setFullName]    = useState("")
  const [profession,  setProfession]  = useState("")
  const [country,     setCountry]     = useState("")
  const [hideProfile, setHideProfile] = useState(false)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace("/login"); return }

      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", session.user.id).single()

     // Already onboarded
if (profile?.full_name) {
  router.replace("/dashboard")
  return
}

setUserId(session.user.id)

setGoogleName(
  session.user.user_metadata?.["full_name"] || ""
)

setGoogleEmail(session.user.email || "")

setGoogleAvatar(
  session.user.user_metadata?.["avatar_url"] || ""
)

setFullName(
  session.user.user_metadata?.["full_name"] || ""
)

setChecking(false)
    }
    check()
  }, [])

  async function handleSubmit() {
    if (!fullName.trim()) { setError("Please enter your full name."); return }
    if (!profession)      { setError("Please select your profession."); return }
    if (!country)         { setError("Please select your country."); return }

    setLoading(true); setError("")
    try {
      const { error: err } = await supabase.from("profiles").update({
        full_name:    fullName.trim(),
        role:         "user",
        updated_at:   new Date().toISOString(),
      }).eq("id", userId)

      if (err) { setError(err.message); setLoading(false); return }
      router.replace("/dashboard")
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  function canNext() {
    if (step === 0) return fullName.trim().length >= 2
    if (step === 1) return !!profession && !!country
    return true
  }

  if (checking) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f9fafb" }}>
      <div style={{ width:28, height:28, borderRadius:"50%", border:"2.5px solid #e5e7eb", borderTopColor:"#4f46e5", animation:"spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideR { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        input:focus, select:focus { outline:2px solid #4f46e5; outline-offset:-1px; border-color:transparent !important; }
        button:disabled { opacity:.4; cursor:not-allowed; }
        .opt-btn:hover { border-color:#a5b4fc !important; background:#f5f3ff !important; }
        .opt-btn.sel { border-color:#4f46e5 !important; background:#eef2ff !important; color:#4f46e5 !important; }
      `}</style>

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#fff" }}>R</div>
        <span style={{ fontSize:17, fontWeight:700, color:"#111827" }}>RehabPearls</span>
      </div>

      {/* Card */}
      <div style={{ width:"100%", maxWidth:480, background:"#fff", borderRadius:20, boxShadow:"0 4px 32px rgba(0,0,0,.1)", overflow:"hidden" }}>

        {/* Progress bar */}
        <div style={{ height:4, background:"#f3f4f6" }}>
          <div style={{ height:"100%", width:`${((step+1)/STEPS.length)*100}%`, background:"linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius:99, transition:"width .4s ease" }} />
        </div>

        <div style={{ padding:"32px 32px 28px" }}>

          {/* Step indicator */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{
                  width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                  background: i < step ? "#4f46e5" : i === step ? "#4f46e5" : "#f3f4f6",
                  color: i <= step ? "#fff" : "#9ca3af",
                  transition:"all .2s",
                }}>
                  {i < step
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : i+1
                  }
                </div>
                <span style={{ fontSize:12, fontWeight:600, color: i === step ? "#111827" : "#9ca3af" }}>{s}</span>
                {i < STEPS.length-1 && <div style={{ width:24, height:1, background:"#e5e7eb", margin:"0 4px" }} />}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Profile ─────────────────────────────────── */}
          {step === 0 && (
            <div style={{ animation:"slideR .2s ease" }}>
              {/* Google account preview */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, marginBottom:24 }}>
                {googleAvatar
                  ? <img src={googleAvatar} alt="" style={{ width:40, height:40, borderRadius:"50%", flexShrink:0 }} />
                  : <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:16, flexShrink:0 }}>
                      {googleEmail[0]?.toUpperCase()}
                    </div>
                }
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{googleName || "Google Account"}</p>
                  <p style={{ fontSize:12, color:"#6b7280" }}>{googleEmail}</p>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#059669", fontWeight:600, background:"#ecfdf5", padding:"3px 10px", borderRadius:99 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Verified
                </div>
              </div>

              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", marginBottom:6, letterSpacing:"-0.02em" }}>
                What's your name?
              </h2>
              <p style={{ fontSize:14, color:"#6b7280", marginBottom:22, lineHeight:1.5 }}>
                This is how you'll appear on RehabPearls
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:8 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Full name</label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Dr. Jane Smith"
                  autoFocus
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:11, padding:"12px 14px", fontSize:14, color:"#111827", background:"#fff", fontFamily:"inherit" }}
                />
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:18 }}>
                <input
                  type="checkbox"
                  id="hide"
                  checked={hideProfile}
                  onChange={e => setHideProfile(e.target.checked)}
                  style={{ width:16, height:16, accentColor:"#4f46e5", cursor:"pointer" }}
                />
                <label htmlFor="hide" style={{ fontSize:13, color:"#6b7280", cursor:"pointer" }}>
                  Keep my profile private
                </label>
              </div>
            </div>
          )}

          {/* ── STEP 1: Specialty ───────────────────────────────── */}
          {step === 1 && (
            <div style={{ animation:"slideR .2s ease" }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", marginBottom:6, letterSpacing:"-0.02em" }}>
                Your background
              </h2>
              <p style={{ fontSize:14, color:"#6b7280", marginBottom:22, lineHeight:1.5 }}>
                We'll personalize your question bank based on your specialty
              </p>

              {/* Profession */}
              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:13, fontWeight:600, color:"#374151", marginBottom:10 }}>Profession / Specialty</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {PROFESSIONS.map(p => (
                    <button key={p} onClick={() => setProfession(p)}
                      className={`opt-btn${profession===p?" sel":""}`}
                      style={{ padding:"10px 12px", border:`1.5px solid ${profession===p?"#4f46e5":"#e5e7eb"}`, borderRadius:10, background:profession===p?"#eef2ff":"#fff", color:profession===p?"#4f46e5":"#374151", cursor:"pointer", fontSize:13, fontWeight:500, textAlign:"left", transition:"all .12s", fontFamily:"inherit", display:"flex", alignItems:"center", gap:8 }}>
                      {profession === p && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"#374151", marginBottom:8 }}>Country</p>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:11, padding:"12px 14px", fontSize:14, color:country?"#111827":"#9ca3af", background:"#fff", fontFamily:"inherit", cursor:"pointer" }}>
                  <option value="">Select your country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: Confirm ─────────────────────────────────── */}
          {step === 2 && (
            <div style={{ animation:"slideR .2s ease" }}>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#111827", marginBottom:6, letterSpacing:"-0.02em" }}>
                You're all set!
              </h2>
              <p style={{ fontSize:14, color:"#6b7280", marginBottom:24, lineHeight:1.5 }}>
                Review your profile before we get started
              </p>

              {/* Summary card */}
              <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:14, padding:"20px", marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, paddingBottom:16, borderBottom:"1px solid #e5e7eb" }}>
                  {googleAvatar
                    ? <img src={googleAvatar} alt="" style={{ width:52, height:52, borderRadius:"50%", flexShrink:0 }} />
                    : <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:20, flexShrink:0 }}>
                        {fullName[0]?.toUpperCase()}
                      </div>
                  }
                  <div>
                    <p style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{fullName}</p>
                    <p style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>{googleEmail}</p>
                  </div>
                </div>
                {[
                  { label:"Profession", value:profession },
                  { label:"Country",    value:country    },
                  { label:"Privacy",    value:hideProfile?"Private profile":"Public profile" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:13, color:"#9ca3af", fontWeight:500 }}>{r.label}</span>
                    <span style={{ fontSize:13, color:"#111827", fontWeight:600 }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* What's next */}
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"14px 16px" }}>
                <p style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>What happens next</p>
                {[
                  "Access to 500+ board-style questions",
                  "Personalized question bank by specialty",
                  "Progress tracking & performance analytics",
                ].map(t => (
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize:13, color:"#1d4ed8" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:10, padding:"10px 14px", color:"#be123c", fontSize:13, fontWeight:500, marginTop:16, display:"flex", alignItems:"center", gap:8 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:"flex", gap:10, marginTop:28 }}>
            {step > 0 && (
              <button onClick={() => { setStep(s=>s-1); setError("") }}
                style={{ flex:1, padding:"13px", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:11, color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                ← Back
              </button>
            )}
            {step < STEPS.length-1 ? (
              <button onClick={() => { if(canNext()){ setStep(s=>s+1); setError("") } else setError(step===0?"Please enter your full name.":"Please complete all fields.") }}
                disabled={!canNext()}
                style={{ flex:1, padding:"13px", background:"#4f46e5", border:"none", borderRadius:11, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(79,70,229,.3)" }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex:1, padding:"13px", background:"#4f46e5", border:"none", borderRadius:11, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(79,70,229,.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading
                  ? <><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }}/> Setting up…</>
                  : "🚀 Start Learning"
                }
              </button>
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize:12, color:"#9ca3af", marginTop:20, textAlign:"center" }}>
        Need help?{" "}
        <a href="mailto:info@rehabpearls.com" style={{ color:"#4f46e5", textDecoration:"none", fontWeight:500 }}>
          Contact support
        </a>
      </p>
    </div>
  )
}
