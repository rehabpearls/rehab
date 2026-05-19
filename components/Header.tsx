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
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)
 
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
 
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
 
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
    { href: "/qbank", label: "QBank" },
    { href: "/cases", label: "Clinical Cases" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]
 
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }
 
  const initial = profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User"
 
  async function handleLogout() {
    await supabase.auth.signOut()
    setDropOpen(false)
    router.push("/")
  }
 
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap");
 
        header {
          font-family: "Inter", system-ui, sans-serif;
        }
 
        h3, .header-logo span:first-child {
          font-family: "Poppins", sans-serif;
        }
 
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-12px) } 
          to { opacity: 1; transform: translateY(0) }
        }
 
        @keyframes fadeIn { 
          from { opacity: 0 } 
          to { opacity: 1 }
        }
 
        @keyframes scaleIn { 
          from { opacity: 0; transform: scale(0.95) }
          to { opacity: 1; transform: scale(1) }
        }
 
        .nav-link {
          position: relative;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
 
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 14px;
          right: 14px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #14b8a6);
          border-radius: 999px;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: center;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
 
        .nav-link:hover {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.06);
        }
 
        .nav-link:hover::after,
        .nav-link.active::after {
          opacity: 1;
          transform: scaleX(1);
        }
 
        .nav-link.active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.08);
          font-weight: 600;
        }
 
        .avatar-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 32px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }
 
        .avatar-button:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }
 
        .avatar-button.open {
          background: #f0f9ff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
 
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
 
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
          z-index: 100;
          animation: scaleIn 0.15s ease;
        }
 
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border: none;
          background: none;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          text-align: left;
          text-decoration: none;
          transition: all 0.15s ease;
          border-radius: 8px;
          margin: 0 8px;
        }
 
        .dropdown-item:hover {
          background: #f0f9ff;
          color: #3b82f6;
        }
 
        .dropdown-item.danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }
 
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
 
        .cta-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
 
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
 
        .cta-secondary {
          background: transparent;
          color: #374151;
          border: 1.5px solid #e5e7eb;
        }
 
        .cta-secondary:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.04);
        }
 
        .mobile-menu-button {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          color: #111827;
          transition: all 0.2s ease;
        }
 
        .mobile-menu-button:hover {
          background: #f0f9ff;
          border-color: #3b82f6;
        }
 
        .mobile-backdrop {
          display: none;
          position: fixed;
          inset: 68px 0 0 0;
          z-index: 80;
          background: rgba(15, 23, 42, 0.32);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }
 
        .mobile-menu {
          display: none;
          position: fixed;
          top: 76px;
          left: 12px;
          right: 12px;
          z-index: 90;
          animation: slideDown 0.25s ease;
        }
 
        .mobile-menu-inner {
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          box-shadow: 0 20px 64px rgba(15, 23, 42, 0.2);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }
 
        @media (max-width: 768px) {
          nav {
            display: none !important;
          }
 
          .mobile-menu-button {
            display: flex !important;
          }
 
          .mobile-menu.open {
            display: block !important;
          }
 
          .mobile-backdrop.open {
            display: block !important;
          }
 
          header > div {
            padding: 0 14px !important;
            height: 68px !important;
          }
 
          .header-logo img {
            width: 36px !important;
            height: 36px !important;
          }
 
          .header-logo span:first-child {
            font-size: 20px !important;
          }
 
          .header-logo span:last-child {
            font-size: 8px !important;
          }
 
          .cta-secondary {
            display: none !important;
          }
        }
      `}</style>
 
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(255, 255, 255, 0.95)" : "white",
          borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid #f0f0f0",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0, 0, 0, 0.06)" : "none",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 78,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="header-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              flexShrink: 0,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                fontWeight: 900,
                filter: "drop-shadow(0 4px 12px rgba(59, 130, 246, 0.25))",
              }}
            >
              RP
            </div>
 
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  whiteSpace: "nowrap",
                }}
              >
                RehabPearls
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#14b8a6",
                  marginTop: 2,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Clinical QBank
              </span>
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link${isActive(href) ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>
 
          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {user ? (
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={`avatar-button ${dropOpen ? "open" : ""}`}
                >
                  <div className="avatar-circle">{initial}</div>
                  <span>{firstName}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
 
                {dropOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #f0f0f0", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div className="avatar-circle" style={{ width: 36, height: 36 }}>{initial}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>
                            {profile?.full_name || user?.email?.split("@")[0]}
                          </p>
                          <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>
                            {profile?.profession || "User"}
                          </p>
                        </div>
                      </div>
                    </div>
 
                    <Link href="/dashboard" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Dashboard
                    </Link>
 
                    <Link href="/settings" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6m-1.78-7.22l-4.24 4.24m-2.98 2.98l-4.24 4.24" />
                      </svg>
                      Settings
                    </Link>
 
                    <div style={{ borderTop: "1px solid #f0f0f0", margin: "6px 8px 0" }}>
                      <button onClick={handleLogout} className="dropdown-item danger" style={{ marginTop: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 0h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-9l9-9m0 0l0 9m0-9l-9 0" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="cta-button cta-secondary">
                  Log In
                </Link>
                <Link href="/register" className="cta-button cta-primary">
                  Start Free Trial
                </Link>
              </>
            )}
 
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
 
      {/* Mobile Menu */}
      {menuOpen && <div className="mobile-backdrop open" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          {/* Mobile Menu Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Menu</h3>
              <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
                Explore RehabPearls
              </p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                width: 32,
                height: 32,
                border: 0,
                borderRadius: 8,
                background: "#f0f9ff",
                color: "#3b82f6",
                fontSize: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ✕
            </button>
          </div>
 
          {/* Mobile Menu Links */}
          <div style={{ padding: "8px" }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 10,
                  color: isActive(href) ? "#3b82f6" : "#1f2937",
                  fontWeight: isActive(href) ? 700 : 600,
                  fontSize: 14,
                  textDecoration: "none",
                  background: isActive(href) ? "rgba(59, 130, 246, 0.08)" : "transparent",
                  transition: "all 0.2s ease",
                  border: isActive(href) ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid transparent",
                }}
              >
                {label}
                {isActive(href) && <span style={{ color: "#3b82f6", fontSize: 16 }}>→</span>}
              </Link>
            ))}
          </div>
 
          {/* Mobile Menu Actions */}
          {user ? (
            <div style={{ display: "grid", gap: 8, padding: "12px 16px", borderTop: "1px solid #f0f0f0" }}>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="cta-button cta-primary"
                style={{ width: "100%", textAlign: "center" }}
              >
                Open Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="cta-button cta-secondary"
                style={{ width: "100%", textAlign: "center", color: "#dc2626", borderColor: "#fecaca" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8, padding: "12px 16px", borderTop: "1px solid #f0f0f0" }}>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="cta-button cta-primary"
                style={{ width: "100%", textAlign: "center" }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="cta-button cta-secondary"
                style={{ width: "100%", textAlign: "center" }}
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
 

