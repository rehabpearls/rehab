"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

export default function Header() {
  const [user,      setUser]      = useState<any>(null)
  const [profile,   setProfile]   = useState<any>(null)
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const pathname = usePathname()
  const router   = useRouter()
  const dropRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from("profiles")
          .select("full_name, role, profession").eq("id", session.user.id).single()
        setProfile(data)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from("profiles")
          .select("full_name, role, profession").eq("id", session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })

    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })

    // Close dropdown on outside click
    const onClickOut = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOut)

    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("mousedown", onClickOut)
    }
  }, [])

  const navLinks = [
    { href: "/qbank",   label: "QBank"         },
    { href: "/cases",   label: "Clinical Cases" },
    { href: "/pricing", label: "Pricing"        },
    { href: "/about",   label: "About"          },
  ]

 const isActive = (href: string) => {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
  const initial  = profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "You"

  async function handleLogout() {
    await supabase.auth.signOut()
    setDropOpen(false)
    router.push("/")
  }

  return (
    <>
      <style>{`
        @keyframes hdr-in  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mob-in  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drop-in { from{opacity:0;transform:translateY(6px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      .nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 4px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  opacity: 0;
  transform: scaleX(0.45);
  transform-origin: center;
  transition:
    opacity .18s ease,
    transform .18s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  opacity: 1;
  transform: scaleX(1);
}

.nav-link.active {
  color: #4f46e5 !important;
  background: rgba(79, 70, 229, 0.08);
  box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.10);
}
        .drop-item { display:flex; align-items:center; gap:10; padding:9px 14px; border-radius:9px;
          font-size:14px; font-weight:500; color:#374151; cursor:pointer;
          border:none; background:none; width:100%; text-align:left; text-decoration:none;
          transition:background .12s; }
        .drop-item:hover { background:#f3f4f6; }
        .drop-item.danger { color:#ef4444; }
        .drop-item.danger:hover { background:#fff1f2; }
      `}</style>

      <header style={{
        position:"sticky", top:0, zIndex:50,
        background: scrolled ? "rgba(255,255,255,.93)" : "#fff",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,.07)" : "1px solid #f0f0f0",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,.06)" : "none",
        transition:"all .25s ease",
        animation:"hdr-in .35s ease both",
        fontFamily:"var(--font-sans),system-ui,sans-serif",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",height:78,display:"flex",alignItems:"center",justifyContent:"space-between",gap:24}}>
{/* LOGO */}
<Link
  href="/"
  aria-label="RehabPearls Clinical QBank home"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    flexShrink: 0,
    transition: "transform .18s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-1px)"
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)"
  }}
>
  <img
    src="/favicon-512.png"
    alt="RehabPearls pearl shell logo"
    style={{
      width: 54,
      height: 54,
      objectFit: "contain",
      display: "block",
      filter: "drop-shadow(0 8px 16px rgba(79,70,229,.18))",
    }}
  />

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      lineHeight: 1,
    }}
  >
    <span
      style={{
        fontSize: 30,
        fontWeight: 900,
        letterSpacing: "-0.055em",
        background:
          "linear-gradient(90deg,#1E1B4B 0%, #312E81 42%, #5B43F6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        whiteSpace: "nowrap",
      }}
    >
      RehabPearls
    </span>

    <span
      style={{
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.36em",
        color: "#14B8A6",
        marginTop: 6,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      Clinical QBank
    </span>
  </div>
</Link>

          {/* NAV */}
          <nav style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
            {navLinks.map(({href,label})=>(
              <Link key={href} href={href}
                className={`nav-link${isActive(href)?" active":""}`}
                style={{
  position: "relative",
  padding: "9px 16px",
  fontSize: 14,
  fontWeight: isActive(href) ? 800 : 650,
  color: isActive(href) ? "#4f46e5" : "#374151",
  textDecoration: "none",
  borderRadius: 999,
  transition:
    "color .18s ease, background .18s ease, box-shadow .18s ease, transform .18s ease",
}}>
                {label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            {user ? (
              /* ── AVATAR DROPDOWN ── */
              <div ref={dropRef} style={{position:"relative"}}>
                <button
                  onClick={()=>setDropOpen(o=>!o)}
                  style={{
                    display:"flex",alignItems:"center",gap:8,
                    padding:"5px 12px 5px 6px",
                    background: dropOpen ? "#f3f4f6" : "#fff",
                    border:"1.5px solid #e5e7eb",
                    borderRadius:40,cursor:"pointer",
                    transition:"all .15s",
                    boxShadow: dropOpen ? "0 0 0 3px rgba(79,70,229,.12)" : "none",
                  }}
                >
                  {/* Avatar */}
                  <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800,flexShrink:0}}>
                    {initial}
                  </div>
                  <span style={{fontSize:13.5,fontWeight:600,color:"#111827"}}>{firstName}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{transform:dropOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div style={{
                    position:"absolute",top:"calc(100% + 8px)",right:0,
                    width:230,background:"#fff",
                    border:"1px solid #e5e7eb",borderRadius:14,
                    boxShadow:"0 8px 32px rgba(0,0,0,.12)",
                    padding:"8px",zIndex:100,
                    animation:"drop-in .15s ease",
                  }}>
                    {/* User info */}
                    <div style={{padding:"10px 14px 12px",borderBottom:"1px solid #f3f4f6",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:800,flexShrink:0}}>
                          {initial}
                        </div>
                        <div style={{minWidth:0}}>
                          <p style={{fontSize:13.5,fontWeight:700,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile?.full_name||"User"}</p>
                          <p style={{fontSize:11.5,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{user.email}</p>
                        </div>
                      </div>
                      {profile?.profession && (
                        <p style={{fontSize:11.5,color:"#6b7280",marginTop:8,padding:"4px 8px",background:"#f9fafb",borderRadius:6}}>{profile.profession}</p>
                      )}
                    </div>

                    {/* Links */}
                    <Link href="/dashboard" className="drop-item" onClick={()=>setDropOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                      Dashboard
                    </Link>
                    <Link href="/qbank" className="drop-item" onClick={()=>setDropOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      QBank
                    </Link>
                    {profile?.role === "admin" && (
                      <Link href="/admin" className="drop-item" onClick={()=>setDropOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/pricing" className="drop-item" onClick={()=>setDropOpen(false)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Upgrade Plan
                    </Link>

                    <div style={{height:1,background:"#f3f4f6",margin:"6px 0"}}/>

                    <button className="drop-item danger" onClick={handleLogout}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" style={{fontSize:14,fontWeight:500,color:"#374151",textDecoration:"none",padding:"7px 14px",borderRadius:8,transition:"background .15s"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="#f3f4f6")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  Log in
                </Link>
                <Link href="/register" style={{fontSize:14,fontWeight:600,color:"#fff",textDecoration:"none",padding:"8px 18px",borderRadius:9,background:"linear-gradient(135deg,#4f46e5,#7c3aed)",boxShadow:"0 2px 10px rgba(79,70,229,.3)",transition:"all .15s",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 4px 18px rgba(79,70,229,.45)";(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-1px)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.boxShadow="0 2px 10px rgba(79,70,229,.3)";(e.currentTarget as HTMLAnchorElement).style.transform="translateY(0)"}}>
                  Start Free Trial
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button onClick={()=>setMenuOpen(o=>!o)}
              style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:6,color:"#374151"}}
              className="mob-menu-btn" aria-label="Menu">
              {menuOpen
                ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

       {/* MOBILE MENU */}
{menuOpen && (
  <>
    <div
      onClick={() => setMenuOpen(false)}
      className="rp-mobile-backdrop"
    />

    <div className="rp-mobile-menu">
      <div className="rp-mobile-menu-inner">
        <div className="rp-mobile-menu-head">
          <div>
            <strong>Menu</strong>
            <span>RehabPearls navigation</span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="rp-mobile-close"
          >
            ×
          </button>
        </div>

        <div className="rp-mobile-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`rp-mobile-link ${isActive(href) ? "active" : ""}`}
            >
              <span>{label}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="rp-mobile-actions">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rp-mobile-primary"
              >
                Open Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rp-mobile-secondary danger"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rp-mobile-primary"
              >
                Start Free Trial
              </Link>

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rp-mobile-secondary"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </>
)}
      </header>

      <style>{`
  @media (max-width: 768px) {
    header {
      width: 100%;
      overflow: visible;
    }

    header > div {
      max-width: 100% !important;
      height: 68px !important;
      padding: 0 14px !important;
      gap: 10px !important;
    }

    nav {
      display: none !important;
    }

    .mob-menu-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      width: 42px !important;
      height: 42px !important;
      border-radius: 12px !important;
      background: #f8fafc !important;
      border: 1px solid #e5e7eb !important;
      color: #111827 !important;
    }

    header a[aria-label="RehabPearls Clinical QBank home"] {
      min-width: 0 !important;
      flex: 1 !important;
      gap: 8px !important;
      overflow: hidden !important;
    }

    header a[aria-label="RehabPearls Clinical QBank home"] img {
      width: 38px !important;
      height: 38px !important;
      flex-shrink: 0 !important;
    }

    header a[aria-label="RehabPearls Clinical QBank home"] span:first-child {
      font-size: 22px !important;
      letter-spacing: -0.055em !important;
    }

    header a[aria-label="RehabPearls Clinical QBank home"] span:last-child {
      font-size: 8.5px !important;
      letter-spacing: 0.28em !important;
      margin-top: 4px !important;
    }

    header a[href="/login"] {
      display: none !important;
    }

    header a[href="/register"] {
      padding: 9px 13px !important;
      font-size: 12px !important;
      border-radius: 12px !important;
      white-space: nowrap !important;
      max-width: 138px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
  }

  @media (max-width: 420px) {
    header a[href="/register"] {
      display: none !important;
    }
  }

  .rp-mobile-backdrop {
    position: fixed;
    inset: 68px 0 0 0;
    z-index: 80;
    background: rgba(15, 23, 42, 0.28);
    backdrop-filter: blur(8px);
    animation: mob-in .18s ease both;
  }

  .rp-mobile-menu {
    position: fixed;
    top: 76px;
    left: 12px;
    right: 12px;
    z-index: 90;
    animation: mob-in .2s ease both;
  }

  .rp-mobile-menu-inner {
    overflow: hidden;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(226, 232, 240, 0.95);
    box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
    backdrop-filter: blur(18px);
  }

  .rp-mobile-menu-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 18px 14px;
    border-bottom: 1px solid #eef2ff;
  }

  .rp-mobile-menu-head strong {
    display: block;
    color: #111827;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  .rp-mobile-menu-head span {
    display: block;
    margin-top: 3px;
    color: #64748b;
    font-size: 12px;
    font-weight: 650;
  }

  .rp-mobile-close {
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 14px;
    background: #f1f5f9;
    color: #111827;
    font-size: 30px;
    line-height: 1;
    cursor: pointer;
  }

  .rp-mobile-links {
    display: grid;
    padding: 8px;
  }

  .rp-mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 14px;
    border-radius: 16px;
    color: #1f2937;
    text-decoration: none;
    font-size: 16px;
    font-weight: 800;
    border: 1px solid transparent;
  }

  .rp-mobile-link.active {
    color: #4f46e5;
    background: #eef2ff;
    border-color: #c7d2fe;
  }

  .rp-mobile-link:hover {
    background: #f8fafc;
  }

  .rp-mobile-actions {
    display: grid;
    gap: 10px;
    padding: 14px 16px 18px;
    border-top: 1px solid #eef2ff;
  }

  .rp-mobile-primary,
  .rp-mobile-secondary {
    display: flex;
    min-height: 52px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 900;
  }

  .rp-mobile-primary {
    color: #ffffff !important;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    box-shadow: 0 16px 34px rgba(79, 70, 229, 0.32);
  }

  .rp-mobile-secondary {
    color: #374151;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
  }

  .rp-mobile-secondary.danger {
    color: #ef4444;
    background: #fff1f2;
    border: 1px solid #fecaca;
  }
`}</style>
    </>
  )
}
