'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

// ── Supabase browser client (правильно зберігає куки для SSR) ──────
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

export default function LoginClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const nextUrl      = searchParams.get("next") || null

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [checking, setChecking] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  // ── Redirect if already logged in ─────────────────────────────
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setChecking(false); return }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", session.user.id).single()
      redirectByRole(profile?.role)
    }
    checkSession()
  }, [])

  function redirectByRole(role?: string) {
    if (nextUrl) { router.replace(nextUrl); return }
    if (role === "admin") router.replace("/admin")
    else router.replace("/dashboard")
  }

  // ── Login ──────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.")
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) {
        setErrorMsg(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : error.message
        )
        return
      }
      if (!data.session) {
        setErrorMsg("Please confirm your email before logging in.")
        return
      }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", data.user.id).single()
      redirectByRole(profile?.role)
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // ── OAuth ──────────────────────────────────────────────────────
  async function handleOAuth(provider: "google" | "github") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`,
      },
    })
  }

  // ── Loading screen ─────────────────────────────────────────────
  if (checking) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f8fa" }}>
      <div style={{ width:28, height:28, borderRadius:"50%", border:"2.5px solid #e5e7eb", borderTopColor:"#4f46e5", animation:"spin .7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        button:disabled { opacity:.5; cursor:not-allowed; }
        input:focus { outline:2px solid #4f46e5; outline-offset:-1px; border-color:transparent !important; }
        .hov:hover { filter:brightness(.97); }
        .link:hover { text-decoration:underline; }
        @media(min-width:768px) { .left-panel { display:flex !important; } .mobile-logo { display:none !important; } }
      `}</style>

      {/* ── LEFT DECORATIVE PANEL ── */}
      <div className="left-panel" style={{
        flex:1, display:"none", background:"linear-gradient(145deg, #4338ca, #7c3aed)",
        padding:"48px 52px", flexDirection:"column", justifyContent:"space-between",
        position:"relative", overflow:"hidden", minHeight:"100vh",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff" }}>R</div>
          <span style={{ fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" }}>RehabPearls</span>
        </div>

        {/* Headline */}
        <div style={{ zIndex:1 }}>
          <p style={{ fontSize:32, fontWeight:800, color:"#fff", lineHeight:1.3, marginBottom:16, letterSpacing:"-0.02em" }}>
            Prepare smarter.<br />Pass with confidence.
          </p>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.72)", lineHeight:1.65, maxWidth:340 }}>
            Board-style questions, detailed explanations, and progress tracking — built for rehab professionals.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:28, zIndex:1 }}>
          {[["500+","Questions"],["4","Specialties"],["95%","Pass Rate"]].map(([v,l]) => (
            <div key={l}>
              <p style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{v}</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.55)", marginTop:3, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{l}</p>
            </div>
          ))}
        </div>

        {/* BG blobs */}
        <div style={{ position:"absolute", top:-100, right:-100, width:360, height:360, borderRadius:"50%", background:"rgba(255,255,255,.07)", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.05)", zIndex:0 }} />
        <div style={{ position:"absolute", top:"40%", left:"30%", width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,.04)", zIndex:0 }} />
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px", background:"#f9fafb" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .25s ease" }}>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff" }}>R</div>
            <span style={{ fontSize:16, fontWeight:700, color:"#111827" }}>RehabPearls</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize:27, fontWeight:800, color:"#111827", letterSpacing:"-0.025em", marginBottom:6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:28, lineHeight:1.5 }}>
            Sign in to continue your exam preparation
          </p>

          {/* Error banner */}
          {errorMsg && (
            <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:10, padding:"11px 14px", color:"#be123c", fontSize:13, fontWeight:500, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errorMsg}
            </div>
          )}

          {/* Next URL notice */}
          {nextUrl && !errorMsg && (
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"10px 14px", color:"#1d4ed8", fontSize:13, marginBottom:20 }}>
              Sign in to continue to your destination.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:11, padding:"11px 14px", fontSize:14, color:"#111827", background:"#fff", fontFamily:"inherit" }}
              />
            </div>

            {/* Password */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Password</label>
                <Link href="/forgot-password" className="link" style={{ fontSize:12, color:"#4f46e5", textDecoration:"none", fontWeight:500 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position:"relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:11, padding:"11px 44px 11px 14px", fontSize:14, color:"#111827", background:"#fff", fontFamily:"inherit" }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:2, display:"flex" }}>
                  {showPass
                    ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"13px", background:"#4f46e5", border:"none", borderRadius:11, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:2, boxShadow:"0 4px 14px rgba(79,70,229,.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit" }}>
              {loading
                ? <><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,.35)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }} /> Signing in…</>
                : "Sign In →"
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
            <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
            <span style={{ fontSize:12, color:"#9ca3af", fontWeight:500 }}>or continue with</span>
            <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
          </div>

          {/* OAuth buttons */}
          <div style={{ display:"flex", gap:10 }}>
            <button className="hov" onClick={() => handleOAuth("google")}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px 16px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:11, cursor:"pointer", fontSize:14, fontWeight:500, color:"#374151", fontFamily:"inherit" }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="hov" onClick={() => handleOAuth("github")}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px 16px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:11, cursor:"pointer", fontSize:14, fontWeight:500, color:"#374151", fontFamily:"inherit" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          {/* Register */}
          <p style={{ textAlign:"center", fontSize:14, color:"#6b7280", marginTop:26 }}>
            Don't have an account?{" "}
            <Link href="/register" className="link" style={{ color:"#4f46e5", fontWeight:600, textDecoration:"none" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
