'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

export default function RegisterClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const nextUrl      = searchParams.get("next") || null
  const [checking, setChecking] = useState(true)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setChecking(false); return }
      const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", session.user.id).single()
      if (!profile?.full_name) { router.replace("/onboarding"); return }
      router.replace(profile.role === "admin" ? "/admin" : "/dashboard")
    }
    check()
  }, [])

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        queryParams: { prompt: "select_account" },
      },
    })
  }

  if (checking) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f9fafb" }}>
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
        .hov:hover { filter:brightness(.97); }
        .link:hover { text-decoration:underline; }
        @media(min-width:768px) { .left-panel { display:flex !important; } .mobile-logo { display:none !important; } }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel" style={{
        flex:1, display:"none",
        background:"linear-gradient(145deg, #4338ca, #7c3aed)",
        padding:"48px 52px", flexDirection:"column", justifyContent:"space-between",
        position:"relative", overflow:"hidden", minHeight:"100vh",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff" }}>R</div>
          <span style={{ fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" }}>RehabPearls</span>
        </div>

        {/* Steps preview */}
        <div style={{ zIndex:1 }}>
          <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.5)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>How it works</p>
          {[
            { n:"01", title:"Create account", desc:"Sign up with Google in one click — no password needed." },
            { n:"02", title:"Set up profile",  desc:"Tell us your specialty so we can personalize your experience." },
            { n:"03", title:"Start learning",  desc:"Access 500+ board-style questions with detailed explanations." },
          ].map(s => (
            <div key={s.n} style={{ display:"flex", gap:16, marginBottom:28 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"rgba(255,255,255,.7)", flexShrink:0 }}>{s.n}</div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{s.title}</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:28, zIndex:1 }}>
          {[["500+","Questions"],["4","Specialties"],["95%","Pass Rate"]].map(([v,l]) => (
            <div key={l}>
              <p style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{v}</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.55)", marginTop:3, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{l}</p>
            </div>
          ))}
        </div>

        <div style={{ position:"absolute", top:-100, right:-100, width:360, height:360, borderRadius:"50%", background:"rgba(255,255,255,.07)", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.05)", zIndex:0 }} />
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px", background:"#f9fafb" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .25s ease" }}>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff" }}>R</div>
            <span style={{ fontSize:16, fontWeight:700, color:"#111827" }}>RehabPearls</span>
          </div>

          <h1 style={{ fontSize:27, fontWeight:800, color:"#111827", letterSpacing:"-0.025em", marginBottom:6 }}>
            Create your account
          </h1>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:32, lineHeight:1.5 }}>
            Join thousands of rehab professionals preparing for their boards
          </p>

          {/* Google button */}
          <button
            className="hov"
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              padding:"14px 20px", background:"#fff",
              border:"1.5px solid #e5e7eb", borderRadius:12,
              cursor:"pointer", fontSize:15, fontWeight:600, color:"#111827",
              fontFamily:"inherit", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
              transition:"all .15s", marginBottom:16,
            }}>
            {loading
              ? <div style={{ width:18, height:18, borderRadius:"50%", border:"2.5px solid #e5e7eb", borderTopColor:"#4f46e5", animation:"spin .7s linear infinite" }} />
              : <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Trust badges */}
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:32, flexWrap:"wrap" }}>
            {["No credit card required", "Free 7-day trial", "Cancel anytime"].map(t => (
              <span key={t} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#6b7280", fontWeight:500 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", lineHeight:1.6, marginBottom:24 }}>
            By creating an account you agree to our{" "}
            <Link href="/terms" style={{ color:"#4f46e5", fontWeight:500, textDecoration:"none" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" style={{ color:"#4f46e5", fontWeight:500, textDecoration:"none" }}>Privacy Policy</Link>
          </p>

          <p style={{ textAlign:"center", fontSize:14, color:"#6b7280" }}>
            Already have an account?{" "}
            <Link href="/login" className="link" style={{ color:"#4f46e5", fontWeight:600, textDecoration:"none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
