"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)

type AuthMode = "google" | "email"

export default function RegisterClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextUrl = searchParams.get("next") || "/onboarding"

  const [checking, setChecking] = useState(true)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("google")

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profession, setProfession] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const passwordStrength = useMemo(() => {
    let score = 0

    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (!password) return { label: "", score: 0, color: "#e5e7eb" }
    if (score <= 1) return { label: "Weak", score, color: "#ef4444" }
    if (score === 2) return { label: "Okay", score, color: "#f59e0b" }
    if (score === 3) return { label: "Good", score, color: "#14b8a6" }

    return { label: "Strong", score, color: "#22c55e" }
  }, [password])

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setChecking(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", session.user.id)
        .single()

      if (!profile?.full_name) {
        router.replace("/onboarding")
        return
      }

      router.replace(profile.role === "admin" ? "/admin" : "/dashboard")
    }

    checkSession()
  }, [router])

  async function handleGoogle() {
    setError("")
    setSuccess("")
    setLoadingGoogle(true)

    const redirectPath = nextUrl || "/onboarding"

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          redirectPath
        )}`,
        queryParams: {
          prompt: "select_account",
        },
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoadingGoogle(false)
    }
  }

 async function handleEmailRegister(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  setError("")
  setSuccess("")

  const cleanName = fullName.trim()
  const cleanEmail = email.trim().toLowerCase()

  if (!cleanName) {
    setError("Please enter your full name.")
    return
  }

  if (!cleanEmail) {
    setError("Please enter your email address.")
    return
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters.")
    return
  }

  setLoadingEmail(true)

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        data: {
          full_name: cleanName,
          profession: profession || null,
          role: "student",
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    /**
     * Important:
     * Do NOT upsert profiles here.
     * Supabase RLS often blocks anonymous/client profile inserts.
     * Save profile data in auth metadata first.
     * Create/update the profile later in onboarding or with a DB trigger.
     */
    if (data.user && data.session) {
      router.replace("/onboarding")
      return
    }

    setSuccess(
      "Account created. Please check your email to confirm your account, then sign in and continue onboarding."
    )
  } catch (err) {
    console.error("EMAIL REGISTER ERROR:", err)
    setError("Something went wrong while creating your account. Please try again.")
  } finally {
    setLoadingEmail(false)
  }
}

  if (checking) {
    return (
      <main className="rp-auth-loading">
        <div className="rp-auth-spinner" />
        <style jsx>{`
          .rp-auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(circle at top, rgba(79, 70, 229, 0.12), transparent 35%),
              #ffffff;
          }
.rp-auth-brand-full {
  width: 220px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.22));
}

.rp-card-brand {
  display: inline-flex;
  align-items: center;
  margin-bottom: 24px;
  text-decoration: none;
}

.rp-card-brand img {
  width: 210px;
  height: auto;
  object-fit: contain;
}
          .rp-auth-spinner {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 3px solid #e5e7eb;
            border-top-color: #4f46e5;
            animation: rp-spin 0.7s linear infinite;
          }

          @keyframes rp-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    )
  }

  return (
    <main className="rp-auth-page">
      <style jsx>{`
        .rp-auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(520px, 0.72fr);
          background: #ffffff;
          color: #111827;
          font-family:
            var(--font-sans),
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-x: hidden;
        }

        .rp-auth-left {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 44px 54px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(circle at 85% 8%, rgba(255, 255, 255, 0.18), transparent 30%),
            radial-gradient(circle at 8% 88%, rgba(20, 184, 166, 0.18), transparent 28%),
            linear-gradient(145deg, #1e1b4b 0%, #4338ca 46%, #7c3aed 100%);
        }

        .rp-auth-left::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 85%);
          pointer-events: none;
        }

        .rp-auth-orb-one,
        .rp-auth-orb-two {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }

        .rp-auth-orb-one {
          width: 360px;
          height: 360px;
          top: -105px;
          right: -110px;
        }

        .rp-auth-orb-two {
          width: 280px;
          height: 280px;
          bottom: -90px;
          left: -86px;
        }

        .rp-auth-brand {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          text-decoration: none;
          width: max-content;
        }

        .rp-auth-brand-icon {
          width: 68px;
          height: 68px;
          object-fit: contain;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.22));
        }

        .rp-auth-brand-title {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .rp-auth-brand-title strong {
          font-size: 30px;
          letter-spacing: -0.055em;
          color: #ffffff;
          font-weight: 950;
        }

        .rp-auth-brand-title span {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.36em;
          color: #7dd3fc;
          text-transform: uppercase;
          font-weight: 900;
        }

        .rp-auth-story {
          position: relative;
          z-index: 2;
          max-width: 620px;
        }

        .rp-auth-kicker {
          margin-bottom: 14px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 900;
        }

        .rp-auth-story h1 {
          margin: 0;
          max-width: 650px;
          color: #ffffff;
          font-size: clamp(42px, 4.8vw, 74px);
          line-height: 0.95;
          letter-spacing: -0.075em;
          font-weight: 950;
        }

        .rp-auth-story p {
          margin: 22px 0 0;
          max-width: 560px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 17px;
          line-height: 1.75;
        }

        .rp-auth-steps {
          position: relative;
          z-index: 2;
          margin-top: 44px;
          display: grid;
          gap: 16px;
          max-width: 560px;
        }

        .rp-auth-step {
          display: flex;
          gap: 15px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
        }

        .rp-auth-step-number {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          font-size: 12px;
          font-weight: 950;
        }

        .rp-auth-step strong {
          display: block;
          color: #ffffff;
          font-size: 15px;
          font-weight: 850;
          margin-bottom: 4px;
        }

        .rp-auth-step span {
          color: rgba(255, 255, 255, 0.66);
          font-size: 13px;
          line-height: 1.5;
        }

        .rp-auth-stats {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          max-width: 520px;
        }

        .rp-auth-stat {
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
        }

        .rp-auth-stat strong {
          display: block;
          color: #ffffff;
          font-size: 30px;
          line-height: 1;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .rp-auth-stat span {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 11px;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          font-weight: 850;
        }

        .rp-auth-right {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 34px;
          background:
            radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 100%);
        }

        .rp-auth-card {
          width: 100%;
          max-width: 480px;
          padding: 34px;
          border: 1px solid rgba(226, 232, 240, 0.96);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 26px 80px rgba(30, 27, 75, 0.12);
          backdrop-filter: blur(20px);
          animation: rp-fade-up 0.32s ease both;
        }

        .rp-mobile-brand {
          display: none;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          text-decoration: none;
        }

        .rp-mobile-brand img {
          width: 46px;
          height: 46px;
          object-fit: contain;
        }

        .rp-mobile-brand strong {
          display: block;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.055em;
          color: #1e1b4b;
        }

        .rp-mobile-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.rp-mobile-brand-text strong {
  display: block;
  font-size: 25px;
  font-weight: 950;
  letter-spacing: -0.055em;
  color: #1e1b4b;
}

.rp-mobile-brand-text em {
  display: block;
  margin-top: 7px;
  font-style: normal;
  font-size: 9px;
  font-weight: 950;
  letter-spacing: 0.36em;
  color: #14b8a6;
  text-transform: uppercase;
}

        .rp-auth-card h2 {
          margin: 0;
          color: #111827;
          font-size: 34px;
          line-height: 1.02;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .rp-auth-card-subtitle {
          margin: 12px 0 26px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.65;
        }

        .rp-auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 6px;
          margin-bottom: 20px;
          border-radius: 16px;
          background: #f1f5f9;
        }

        .rp-auth-tab {
          min-height: 42px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #64748b;
          font-weight: 850;
          cursor: pointer;
          transition:
            background 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .rp-auth-tab.active {
          background: #ffffff;
          color: #1e1b4b;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
        }

        .rp-google-button,
        .rp-email-submit {
          width: 100%;
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 15px;
          font-size: 15px;
          font-weight: 850;
          cursor: pointer;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .rp-google-button {
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #111827;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        .rp-google-button:hover {
          transform: translateY(-1px);
          border-color: #c7d2fe;
          box-shadow: 0 14px 28px rgba(79, 70, 229, 0.12);
        }

        .rp-email-submit {
          border: 0;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          box-shadow: 0 14px 34px rgba(79, 70, 229, 0.3);
        }

        .rp-email-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 42px rgba(79, 70, 229, 0.38);
        }

        .rp-email-submit:disabled,
        .rp-google-button:disabled {
          cursor: not-allowed;
          opacity: 0.74;
          transform: none;
        }

        .rp-auth-form {
          display: grid;
          gap: 14px;
        }

        .rp-field {
          display: grid;
          gap: 7px;
        }

        .rp-field label {
          color: #334155;
          font-size: 13px;
          font-weight: 850;
        }

        .rp-field input,
        .rp-field select {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          color: #111827;
          font-size: 15px;
          outline: none;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .rp-field input:focus,
        .rp-field select:focus {
          border-color: rgba(79, 70, 229, 0.72);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
        }

        .rp-password-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: -2px;
        }

        .rp-password-track {
          flex: 1;
          height: 6px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
        }

        .rp-password-fill {
          height: 100%;
          border-radius: 999px;
          transition:
            width 0.18s ease,
            background 0.18s ease;
        }

        .rp-password-label {
          min-width: 48px;
          text-align: right;
          font-size: 12px;
          font-weight: 850;
          color: #64748b;
        }

        .rp-auth-message {
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 700;
        }

        .rp-auth-message.error {
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .rp-auth-message.success {
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .rp-trust-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 9px 12px;
          margin: 18px 0 22px;
        }

        .rp-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #64748b;
          font-size: 12px;
          font-weight: 750;
        }

        .rp-divider {
          height: 1px;
          margin: 22px 0;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        }

        .rp-legal {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.7;
          text-align: center;
        }

        .rp-legal a,
        .rp-bottom-link a {
          color: #4f46e5;
          font-weight: 850;
          text-decoration: none;
        }

        .rp-legal a:hover,
        .rp-bottom-link a:hover {
          text-decoration: underline;
        }

        .rp-bottom-link {
          margin: 22px 0 0;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        .rp-spinner {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2.5px solid rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
          animation: rp-spin 0.7s linear infinite;
        }

        .rp-spinner.dark {
          border-color: #e5e7eb;
          border-top-color: #4f46e5;
        }

        @keyframes rp-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rp-fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 980px) {
          .rp-auth-page {
            grid-template-columns: 1fr;
          }

          .rp-auth-left {
            display: none;
          }

          .rp-auth-right {
            min-height: 100vh;
            padding: 28px 18px;
            align-items: flex-start;
          }

          .rp-auth-card {
            max-width: 520px;
            margin: 18px auto 0;
            padding: 28px 22px;
            border-radius: 26px;
          }

          .rp-mobile-brand {
            display: inline-flex;
          }

          .rp-auth-card h2 {
            font-size: 31px;
          }
        }

        @media (max-width: 520px) {
          .rp-auth-right {
            padding: 16px 14px 24px;
            background:
              radial-gradient(circle at top, rgba(79, 70, 229, 0.12), transparent 34%),
              #ffffff;
          }

          .rp-auth-card {
            margin-top: 10px;
            padding: 22px 18px;
            border-radius: 24px;
            box-shadow: none;
          }

          .rp-mobile-brand img {
            width: 42px;
            height: 42px;
          }

          .rp-mobile-brand strong {
            font-size: 24px;
          }

          .rp-auth-card h2 {
            font-size: 29px;
          }

          .rp-auth-card-subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <section className="rp-auth-left" aria-label="RehabPearls benefits">
        <div className="rp-auth-orb-one" />
        <div className="rp-auth-orb-two" />

       <Link href="/" className="rp-auth-brand">
  <img
    src="/brand/rehabpearls-logo.png"
    alt="RehabPearls Clinical QBank"
    className="rp-auth-brand-full"
  />
</Link>

        <div className="rp-auth-story">
          <p className="rp-auth-kicker">Clinical board preparation</p>

          <h1>Start smarter rehab exam preparation.</h1>

          <p>
            Practice board-style rehabilitation questions, build stronger
            clinical reasoning, and prepare with a focused learning experience
            designed for PT, OT, SLP, PM&amp;R, and neuro rehab learners.
          </p>

          <div className="rp-auth-steps">
            {[
              {
                n: "01",
                title: "Create your account",
                desc: "Use Google or email/password to start your RehabPearls learning profile.",
              },
              {
                n: "02",
                title: "Personalize your pathway",
                desc: "Choose your specialty, exam focus, and clinical interests.",
              },
              {
                n: "03",
                title: "Practice with purpose",
                desc: "Work through QBank questions, clinical cases, explanations, and progress tracking.",
              },
            ].map((step) => (
              <div className="rp-auth-step" key={step.n}>
                <div className="rp-auth-step-number">{step.n}</div>
                <div>
                  <strong>{step.title}</strong>
                  <span>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-auth-stats">
          {[
            ["500+", "Questions"],
            ["4", "Specialties"],
            ["95%", "Study focus"],
          ].map(([value, label]) => (
            <div className="rp-auth-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rp-auth-right" aria-label="Create your RehabPearls account">
        <div className="rp-auth-card">
          <Link href="/" className="rp-card-brand">
  <img
    src="/brand/rehabpearls-logo.png"
    alt="RehabPearls Clinical QBank"
  />
</Link>

          <h2>Create your account</h2>

          <p className="rp-auth-card-subtitle">
            Join a clinical learning platform built for rehab professionals,
            board-style questions, neuro rehab topics, and case-based practice.
          </p>

          <div className="rp-auth-tabs" role="tablist" aria-label="Registration method">
            <button
              type="button"
              className={`rp-auth-tab ${authMode === "google" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("google")
                setError("")
                setSuccess("")
              }}
            >
              Google
            </button>

            <button
              type="button"
              className={`rp-auth-tab ${authMode === "email" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("email")
                setError("")
                setSuccess("")
              }}
            >
              Email
            </button>
          </div>

          {error && <div className="rp-auth-message error">{error}</div>}
          {success && <div className="rp-auth-message success">{success}</div>}

          {authMode === "google" ? (
            <button
              type="button"
              className="rp-google-button"
              onClick={handleGoogle}
              disabled={loadingGoogle}
              style={{ marginTop: error || success ? 14 : 0 }}
            >
              {loadingGoogle ? (
                <span className="rp-spinner dark" />
              ) : (
                <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}

              {loadingGoogle ? "Redirecting…" : "Continue with Google"}
            </button>
          ) : (
            <form
              className="rp-auth-form"
              onSubmit={handleEmailRegister}
              style={{ marginTop: error || success ? 14 : 0 }}
            >
              <div className="rp-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Alex Morgan"
                  autoComplete="name"
                />
              </div>

              <div className="rp-field">
                <label htmlFor="profession">Profession</label>
                <select
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="">Choose one</option>
                  <option value="Physical Therapist">Physical Therapist</option>
                  <option value="Occupational Therapist">Occupational Therapist</option>
                  <option value="Speech-Language Pathologist">
                    Speech-Language Pathologist
                  </option>
                  <option value="PM&R / Physician">PM&amp;R / Physician</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="rp-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="rp-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                {password && (
                  <div className="rp-password-row">
                    <div className="rp-password-track">
                      <div
                        className="rp-password-fill"
                        style={{
                          width: `${Math.max(passwordStrength.score, 1) * 25}%`,
                          background: passwordStrength.color,
                        }}
                      />
                    </div>

                    <span className="rp-password-label">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="rp-email-submit"
                disabled={loadingEmail}
              >
                {loadingEmail ? <span className="rp-spinner" /> : null}
                {loadingEmail ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}

          <div className="rp-trust-row">
            {["No credit card required", "Free trial ready", "Cancel anytime"].map(
              (item) => (
                <span className="rp-trust-item" key={item}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </span>
              )
            )}
          </div>

          <div className="rp-divider" />

          <p className="rp-legal">
            By creating an account you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <p className="rp-bottom-link">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}