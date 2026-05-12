import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Support & Contact | RehabPearls",
  description:
    "Contact RehabPearls support for account help, subscriptions, billing questions, exam access, technical issues, and educational platform support.",
  keywords: [
    "RehabPearls support",
    "contact rehabpearls",
    "rehab support",
    "PT support",
    "OT support",
    "SLP support",
    "rehab exam support",
    "therapy education support",
  ],
  alternates: {
    canonical: "https://rehabpearls.com/support",
  },
  openGraph: {
    title: "Support & Contact | RehabPearls",
    description:
      "Need help with RehabPearls? Contact our support team for assistance with accounts, subscriptions, exams, and technical issues.",
    url: "https://rehabpearls.com/support",
    siteName: "RehabPearls",
    type: "website",
  },
}

export default function SupportPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#fff",
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding: "90px 24px 70px",
          background:
            "radial-gradient(circle at top left, rgba(99,102,241,.25), transparent 30%), linear-gradient(135deg,#0b1020,#111827 60%,#1e1b4b)",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "#c7d2fe",
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 22,
            }}
          >
            💬 RehabPearls Support
          </div>

          <h1
            style={{
              fontSize: "clamp(42px,6vw,72px)",
              lineHeight: 1.02,
              letterSpacing: "-0.06em",
              fontWeight: 850,
              maxWidth: 760,
              margin: 0,
            }}
          >
            Need help with RehabPearls?
          </h1>

          <p
            style={{
              marginTop: 24,
              fontSize: 18,
              lineHeight: 1.8,
              color: "#cbd5e1",
              maxWidth: 720,
            }}
          >
            Contact our support team for assistance with subscriptions,
            payments, account access, exam preparation, question banks,
            technical issues, and educational resources.
          </p>
        </div>
      </section>

      {/* SUPPORT CARDS */}
      <section
        style={{
          padding: "40px 24px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 20,
          }}
        >
          {/* EMAIL */}
          <div
            style={{
              background: "rgba(18,25,43,.92)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 20px 40px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: "rgba(99,102,241,.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 22,
              }}
            >
              ✉️
            </div>

            <h2
              style={{
                fontSize: 26,
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Email Support
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              Reach out directly for help with your account, subscription,
              question bank access, exam sessions, or technical issues.
            </p>

            <a
              href="mailto:info@rehabpearls.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 18px",
                borderRadius: 14,
                background: "#6366f1",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(99,102,241,.35)",
              }}
            >
              info@rehabpearls.com
            </a>
          </div>

          {/* RESPONSE */}
          <div
            style={{
              background: "rgba(18,25,43,.92)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 20px 40px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: "rgba(16,185,129,.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 22,
              }}
            >
              ⚡
            </div>

            <h2
              style={{
                fontSize: 26,
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Fast Response
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.75,
              }}
            >
              We aim to respond quickly to support requests regarding billing,
              platform access, educational content, or account-related issues.
            </p>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {[
                "Billing Help",
                "Account Support",
                "Exam Access",
                "Technical Issues",
                "QBank Questions",
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "#cbd5e1",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RESOURCES */}
          <div
            style={{
              background: "rgba(18,25,43,.92)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 20px 40px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: "rgba(56,189,248,.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 22,
              }}
            >
              📚
            </div>

            <h2
              style={{
                fontSize: 26,
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Explore Resources
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.75,
                marginBottom: 22,
              }}
            >
              Browse our rehab study guides, question banks, and clinical cases
              designed for PT, OT, SLP, and rehabilitation students.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Link
                href="/guides"
                style={{
                  color: "#93c5fd",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                → Rehab Guides
              </Link>

              <Link
                href="/qbank"
                style={{
                  color: "#93c5fd",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                → Question Bank
              </Link>

              <Link
                href="/cases"
                style={{
                  color: "#93c5fd",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                → Clinical Cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO TEXT */}
      <section
        style={{
          padding: "0 24px 90px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 28,
            padding: 38,
          }}
        >
          <h2
            style={{
              fontSize: 34,
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              marginBottom: 18,
            }}
          >
            Rehab education support for students and clinicians
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.85,
              fontSize: 16,
              maxWidth: 900,
            }}
          >
            RehabPearls provides educational resources, rehabilitation question
            banks, clinical reasoning practice, exam preparation tools, and
            learning support for physical therapy, occupational therapy,
            speech-language pathology, and rehabilitation professionals. If you
            experience technical issues, billing concerns, login problems, or
            need assistance with your educational experience, our support team
            is available to help.
          </p>
        </div>
      </section>
    </main>
  )
}