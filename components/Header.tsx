"use client"

import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

const navLinks = [
  { href: "/qbank", label: "QBank" },
  { href: "/cases", label: "Clinical Cases" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

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
    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, profession")
        .eq("id", userId)
        .single()

      setProfile(data)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        loadProfile(session.user.id)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    const onScroll = () => setScrolled(window.scrollY > 8)
    const onClickOut = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setDropOpen(false)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("mousedown", onClickOut)

    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("mousedown", onClickOut)
    }
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?"

  const firstName =
    profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User"

  async function handleLogout() {
    await supabase.auth.signOut()
    setDropOpen(false)
    setMenuOpen(false)
    router.push("/")
  }

  return (
    <>
      <style>{`
        .rp-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid #e5e7eb;
          font-family: var(--font-sans), Inter, system-ui, sans-serif;
          transition: box-shadow 0.2s ease, backdrop-filter 0.2s ease;
        }

        .rp-header.scrolled {
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(12px);
        }

        .rp-header-inner {
          max-width: 1280px;
          height: 76px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .rp-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .rp-logo img {
          width: 210px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .rp-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1;
        }

        .rp-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 8px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 650;
          text-decoration: none;
          transition: background 0.16s ease, color 0.16s ease;
        }

        .rp-nav-link:hover {
          color: #2563eb;
          background: #eff6ff;
        }

        .rp-nav-link.active {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 800;
        }

        .rp-nav-link.active::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 6px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #2563eb, #14b8a6);
        }

        .rp-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .rp-auth-link,
        .rp-auth-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }

        .rp-auth-link {
          color: #0f172a;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .rp-auth-primary {
          color: #ffffff;
          background: #2563eb;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
        }

        .rp-user-button {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 13px 5px 5px;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          font-weight: 800;
        }

        .rp-user-button:hover,
        .rp-user-button.open {
          border-color: #bfdbfe;
          background: #f8fbff;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .rp-avatar {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: #2563eb;
          font-size: 13px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .rp-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 260px;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.16);
          z-index: 100;
        }

        .rp-dropdown-head {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 6px;
        }

        .rp-dropdown-name {
          margin: 0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 850;
        }

        .rp-dropdown-sub {
          margin: 2px 0 0;
          color: #64748b;
          font-size: 12px;
          font-weight: 650;
        }

        .rp-dropdown-item {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #334155;
          font-size: 14px;
          font-weight: 750;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .rp-dropdown-item:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .rp-dropdown-item.danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .rp-menu-button {
          display: none;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
        }

        .rp-mobile-backdrop {
          display: none;
          position: fixed;
          inset: 76px 0 0;
          z-index: 70;
          background: rgba(15, 23, 42, 0.28);
        }

        .rp-mobile-panel {
          display: none;
          position: fixed;
          top: 86px;
          left: 14px;
          right: 14px;
          z-index: 80;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 24px 64px rgba(15, 23, 42, 0.2);
        }

        .rp-mobile-panel.open,
        .rp-mobile-backdrop.open {
          display: block;
        }

        .rp-mobile-links {
          display: grid;
          gap: 4px;
          padding: 10px;
        }

        .rp-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 46px;
          padding: 0 12px;
          border-radius: 10px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
        }

        .rp-mobile-link.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .rp-mobile-actions {
          display: grid;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 860px) {
          .rp-header-inner {
            height: 68px;
            padding: 0 14px;
          }

          .rp-logo img {
            width: 170px;
          }

          .rp-nav,
          .rp-auth-link,
          .rp-auth-primary,
          .rp-user-button span {
            display: none;
          }

          .rp-menu-button {
            display: inline-flex;
          }
        }

        @media (max-width: 420px) {
          .rp-logo img {
            width: 148px;
          }
        }
      `}</style>

      <header className={`rp-header${scrolled ? " scrolled" : ""}`}>
        <div className="rp-header-inner">
          <Link href="/" className="rp-logo" aria-label="RehabPearls home">
            <img src="/brand/rehabpearls-logo.png.png" alt="RehabPearls Clinical QBank" />
          </Link>

          <nav className="rp-nav" aria-label="Primary navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rp-nav-link${isActive(href) ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="rp-header-actions">
            {user ? (
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  className={`rp-user-button${dropOpen ? " open" : ""}`}
                  onClick={() => setDropOpen((open) => !open)}
                  aria-expanded={dropOpen}
                >
                  <span className="rp-avatar">{initial}</span>
                  <span>{firstName}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="rp-dropdown">
                    <div className="rp-dropdown-head">
                      <span className="rp-avatar">{initial}</span>
                      <div>
                        <p className="rp-dropdown-name">
                          {profile?.full_name || user?.email?.split("@")[0]}
                        </p>
                        <p className="rp-dropdown-sub">
                          {profile?.profession || profile?.role || "Member"}
                        </p>
                      </div>
                    </div>

                    <Link className="rp-dropdown-item" href="/dashboard">
                      Dashboard
                    </Link>
                    <Link className="rp-dropdown-item" href="/account/subscription">
                      Subscription
                    </Link>
                    <button
                      type="button"
                      className="rp-dropdown-item danger"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="rp-auth-link">
                  Log in
                </Link>
                <Link href="/register" className="rp-auth-primary">
                  Start free trial
                </Link>
              </>
            )}

            <button
              type="button"
              className="rp-menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className={`rp-mobile-backdrop${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={`rp-mobile-panel${menuOpen ? " open" : ""}`}>
        <div className="rp-mobile-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`rp-mobile-link${isActive(href) ? " active" : ""}`}
            >
              {label}
              {isActive(href) && <span>→</span>}
            </Link>
          ))}
        </div>

        <div className="rp-mobile-actions">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rp-auth-primary"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rp-auth-link"
                style={{ width: "100%" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rp-auth-primary"
              >
                Start free trial
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rp-auth-link"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}