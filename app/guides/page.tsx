import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rehab Guides for PT, OT, SLP & Rehab Students | RehabPearls",
  description:
    "Explore expert rehab guides for physical therapy, occupational therapy, speech-language pathology, clinical reasoning, board exam prep, rehab cases, and evidence-based practice.",
  keywords: [
    "rehab guides",
    "physical therapy guides",
    "occupational therapy guides",
    "speech language pathology guides",
    "PT exam prep",
    "OT exam prep",
    "rehab board exam prep",
    "clinical reasoning rehab",
    "rehab education",
    "therapy study guides",
    "RehabPearls guides",
  ],
  alternates: {
    canonical: "https://rehabpearls.com/guides",
  },
  openGraph: {
    title: "Rehab Guides for PT, OT, SLP & Rehab Students | RehabPearls",
    description:
      "Practical rehab guides for students and clinicians preparing for exams, clinical rotations, and evidence-based practice.",
    url: "https://rehabpearls.com/guides",
    siteName: "RehabPearls",
    type: "website",
  },
}

const guides = [
  {
    title: "Physical Therapy Exam Prep Guide",
    description:
      "A structured guide for PT students preparing for board-style questions, clinical reasoning, orthopedic cases, neuro rehab, and patient management.",
    href: "/qbank",
    tag: "Physical Therapy",
    icon: "🦵",
  },
  {
    title: "Occupational Therapy Clinical Reasoning Guide",
    description:
      "Learn how to approach OT cases, functional goals, ADLs, patient safety, intervention planning, and exam-style clinical decisions.",
    href: "/qbank",
    tag: "Occupational Therapy",
    icon: "🧠",
  },
  {
    title: "Speech-Language Pathology Study Guide",
    description:
      "Review core SLP concepts including swallowing, communication, neurogenic disorders, pediatric cases, and clinical documentation.",
    href: "/qbank",
    tag: "Speech Therapy",
    icon: "🗣️",
  },
  {
    title: "Neurological Rehabilitation Guide",
    description:
      "Understand stroke rehab, spinal cord injury, balance, gait, motor control, neuroplasticity, and evidence-based neurological interventions.",
    href: "/cases/neuro",
    tag: "Neuro Rehab",
    icon: "🧬",
  },
  {
    title: "Orthopedic Rehabilitation Guide",
    description:
      "Study common orthopedic injuries, post-op protocols, manual therapy decisions, exercise progression, and return-to-function planning.",
    href: "/cases/orthopedic",
    tag: "Orthopedics",
    icon: "🦴",
  },
  {
    title: "Pediatric Rehab Guide",
    description:
      "Explore pediatric milestones, therapy planning, developmental conditions, family-centered care, and child-focused clinical reasoning.",
    href: "/cases/pediatrics",
    tag: "Pediatrics",
    icon: "👶",
  },
]

const seoTopics = [
  "Board-style rehab questions",
  "Clinical reasoning for therapists",
  "Physical therapy exam preparation",
  "Occupational therapy study resources",
  "Speech-language pathology cases",
  "Neurological rehabilitation practice",
  "Orthopedic rehabilitation cases",
  "Pediatric therapy learning",
  "Evidence-based rehab education",
]

export default function GuidesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rehab Guides",
    url: "https://rehabpearls.com/guides",
    description:
      "Professional rehabilitation study guides for PT, OT, SLP students and clinicians.",
    publisher: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
    mainEntity: guides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `https://rehabpearls.com${guide.href}`,
    })),
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        style={{
          background:
            "radial-gradient(circle at top left, rgba(79,70,229,.18), transparent 34%), linear-gradient(135deg,#0f172a,#111827 58%,#1e1b4b)",
          padding: "86px 24px 72px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 13px",
              borderRadius: 999,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.14)",
              marginBottom: 22,
              fontSize: 13,
              fontWeight: 700,
              color: "#c7d2fe",
            }}
          >
            <span>📚</span>
            Rehab Study Guides
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 68px)",
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              fontWeight: 850,
              maxWidth: 900,
              margin: 0,
            }}
          >
            Professional rehab guides for smarter clinical learning.
          </h1>

          <p
            style={{
              marginTop: 24,
              maxWidth: 720,
              fontSize: 18,
              lineHeight: 1.75,
              color: "#cbd5e1",
            }}
          >
            Explore focused guides for physical therapy, occupational therapy,
            speech-language pathology, neurological rehab, orthopedic rehab,
            pediatric therapy, and board-style exam preparation.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
            <Link
              href="/qbank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 20px",
                borderRadius: 12,
                background: "#6366f1",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(99,102,241,.35)",
              }}
            >
              Start QBank Practice →
            </Link>

            <Link
              href="/cases"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,.14)",
              }}
            >
              Explore Rehab Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Intro SEO */}
      <section style={{ padding: "54px 24px 18px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, .8fr)",
              gap: 28,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 22,
                padding: 30,
                boxShadow: "0 10px 30px rgba(15,23,42,.06)",
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  lineHeight: 1.18,
                  letterSpacing: "-0.035em",
                  marginBottom: 14,
                }}
              >
                Built for rehab students, clinicians, and exam preparation.
              </h2>
              <p style={{ color: "#475569", lineHeight: 1.75, fontSize: 16 }}>
                RehabPearls guides are designed to help learners connect textbook
                knowledge with real clinical reasoning. Whether you are preparing
                for a physical therapy exam, occupational therapy boards,
                speech-language pathology coursework, or clinical rotations, these
                resources help organize high-yield rehabilitation concepts into
                clear, practical learning paths.
              </p>
            </div>

            <div
              style={{
                background: "#0f172a",
                color: "#fff",
                borderRadius: 22,
                padding: 30,
                boxShadow: "0 16px 36px rgba(15,23,42,.18)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  color: "#93c5fd",
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                Learning Focus
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Clinical reasoning", "Board-style questions", "Evidence-based rehab", "Case-based learning"].map(
                  (item) => (
                    <div key={item} style={{ display: "flex", gap: 10 }}>
                      <span style={{ color: "#22c55e" }}>✓</span>
                      <span style={{ color: "#e2e8f0", fontSize: 15 }}>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide cards */}
      <section style={{ padding: "28px 24px 70px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ marginBottom: 22 }}>
            <p
              style={{
                color: "#6366f1",
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".12em",
                marginBottom: 8,
              }}
            >
              Featured Guides
            </p>
            <h2
              style={{
                fontSize: 34,
                lineHeight: 1.15,
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              Choose a rehab learning path
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 18,
            }}
          >
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  style={{
                    height: "100%",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: "0 8px 26px rgba(15,23,42,.055)",
                    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      marginBottom: 18,
                    }}
                  >
                    {guide.icon}
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "#f1f5f9",
                      color: "#475569",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    {guide.tag}
                  </span>

                  <h3
                    style={{
                      fontSize: 19,
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                    }}
                  >
                    {guide.title}
                  </h3>

                  <p style={{ color: "#64748b", lineHeight: 1.65, fontSize: 14 }}>
                    {guide.description}
                  </p>

                  <div
                    style={{
                      marginTop: 18,
                      color: "#4f46e5",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    Open guide →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO topics */}
      <section style={{ padding: "0 24px 78px" }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            padding: 32,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              lineHeight: 1.2,
              letterSpacing: "-0.035em",
              marginBottom: 14,
            }}
          >
            High-yield rehab topics covered
          </h2>

          <p style={{ color: "#64748b", lineHeight: 1.7, maxWidth: 760 }}>
            Use these guides to strengthen your understanding of rehabilitation
            assessment, intervention planning, documentation, patient safety,
            clinical decision-making, and board-style question strategy.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            {seoTopics.map((topic) => (
              <span
                key={topic}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#334155",
                  fontSize: 13,
                  fontWeight: 650,
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "58px 24px",
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 940,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.045em",
              marginBottom: 16,
            }}
          >
            Turn rehab knowledge into clinical confidence.
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 680,
              margin: "0 auto 28px",
            }}
          >
            Practice with board-style questions, review explanations, track your
            progress, and build the reasoning skills needed for real clinical care.
          </p>

          <Link
            href="/qbank"
            style={{
              display: "inline-flex",
              padding: "14px 22px",
              borderRadius: 13,
              background: "#6366f1",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            Start Practicing Now →
          </Link>
        </div>
      </section>
    </main>
  )
}