
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  metadataBase: new URL("https://rehabpearls.com"),
  title: "RehabPearls | NPTE QBank, PT Board Exam Prep & Clinical Reasoning Platform",
  description:
    "RehabPearls is a clinical reasoning QBank for NPTE, PT board exam prep, OT, SLP, neuro rehab, orthopedic rehab, pediatrics, acute care, and evidence-based rehabilitation exam practice.",
  keywords: [
    "NPTE QBank",
    "NPTE prep",
    "NPTE practice questions",
    "physical therapy board exam prep",
    "PT board exam questions",
    "clinical reasoning QBank",
    "rehabilitation QBank",
    "physical therapy exam prep",
    "occupational therapy exam prep",
    "SLP exam prep",
    "neuro rehab questions",
    "orthopedic rehab questions",
    "pediatric therapy exam prep",
    "acute care rehab questions",
    "evidence based rehabilitation",
    "clinical case simulations",
    "adaptive QBank",
    "UWorld alternative for rehab",
    "rehab board exam prep",
    "PT student study platform",
  ],
  alternates: {
    canonical: "https://rehabpearls.com",
  },
  openGraph: {
    title: "RehabPearls | Clinical Reasoning QBank for Rehab Professionals",
    description:
      "Adaptive board-style rehab questions, clinical cases, evidence-based explanations, and performance analytics for PT, OT, SLP, and NPTE preparation.",
    url: "https://rehabpearls.com",
    siteName: "RehabPearls",
    type: "website",
    images: [
      {
        url: "/brand/og-cover.png",
        width: 1200,
        height: 630,
        alt: "RehabPearls clinical reasoning QBank platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RehabPearls | NPTE QBank & Clinical Reasoning Prep",
    description:
      "Board-style rehabilitation questions, clinical cases, and adaptive exam prep for PT, OT, and SLP learners.",
    images: ["/brand/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

const features = [
  {
    title: "Adaptive QBank Engine",
    text: "Practice with board-style questions that focus attention on weak areas, missed concepts, and clinical decision-making patterns.",
  },
  {
    title: "Clinical Case Simulations",
    text: "Train with patient scenarios across neuro, orthopedic, pediatric, acute care, cardiopulmonary, and complex rehabilitation settings.",
  },
  {
    title: "Evidence-Based Explanations",
    text: "Each answer teaches the reasoning behind the choice, so learners build durable clinical judgment instead of memorizing trivia.",
  },
  {
    title: "Performance Analytics",
    text: "Track readiness by topic, system, difficulty, and exam domain so users know exactly what to review next.",
  },
  {
    title: "Built For Rehab Learners",
    text: "Designed for PT students, OT learners, SLP clinicians, PM&R teams, and rehabilitation professionals preparing for exams.",
  },
  {
    title: "Exam-Style Practice",
    text: "Use timed practice, focused review, rationales, and clinical pearls to prepare for pressure before test day.",
  },
]

const specialties = [
  "Neurological rehabilitation",
  "Orthopedic rehabilitation",
  "Pediatric therapy",
  "Acute care therapy",
  "Cardiopulmonary rehab",
  "Geriatric rehabilitation",
  "Sports rehabilitation",
  "Clinical reasoning",
]

const comparisons = [
  ["Adaptive learning", "Basic question lists", "Weakness-focused practice"],
  ["Clinical cases", "Limited or generic", "Rehab-specific scenarios"],
  ["Explanations", "Answer-only review", "Reasoning-first rationales"],
  ["Analytics", "Simple scores", "Topic and readiness insights"],
  ["Exam prep focus", "Broad medical review", "PT, OT, SLP, NPTE focus"],
]

const faqs = [
  {
    q: "What is RehabPearls?",
    a: "RehabPearls is a rehabilitation-focused QBank and clinical reasoning platform for learners preparing for NPTE, PT board exams, OT exams, SLP exams, and clinical practice.",
  },
  {
    q: "Is RehabPearls useful for NPTE preparation?",
    a: "Yes. RehabPearls is built around board-style questions, clinical cases, evidence-based explanations, and topic review for physical therapy exam preparation.",
  },
  {
    q: "How is RehabPearls different from a normal QBank?",
    a: "RehabPearls emphasizes clinical reasoning, patient scenarios, rehabilitation-specific decision making, and adaptive review rather than simple memorization.",
  },
  {
    q: "Does RehabPearls cover neuro and orthopedic rehab?",
    a: "Yes. The platform is organized around major rehab areas including neuro, ortho, pediatrics, acute care, cardiopulmonary, sports, and geriatrics.",
  },
]

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "RehabPearls",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: "https://rehabpearls.com",
      description:
        "Adaptive rehabilitation QBank and clinical reasoning platform for NPTE, PT, OT, and SLP exam preparation.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free trial available",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ]

  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}

export default function Home() {
  return (
    <main className="rp-home">
      <style>{`
        .rp-home {
          background: #ffffff;
          color: #101827;
          font-family: var(--font-sans), Inter, system-ui, sans-serif;
        }

        .rp-section {
          padding: 88px 24px;
        }

        .rp-wrap {
          max-width: 1180px;
          margin: 0 auto;
        }

        .rp-hero {
  position: relative;
  overflow: hidden;
  padding: 96px 24px 78px;
  color: #ffffff;
  background:
    radial-gradient(circle at 78% 18%, rgba(20, 184, 166, 0.22), transparent 30%),
    linear-gradient(135deg, #f8fbff 0%, #eef7ff 46%, #e9fbf7 100%);
}

.rp-hero h1 {
  margin: 0;
  max-width: 780px;
  color: #0f172a;
  font-size: clamp(46px, 6.2vw, 76px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 950;
}

.rp-accent {
  color: #0f766e;
}

.rp-lead {
  max-width: 680px;
  margin: 24px 0 0;
  color: #334155;
  font-size: 20px;
  line-height: 1.7;
  font-weight: 500;
}

.rp-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  margin-bottom: 22px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 13px;
  font-weight: 850;
}

.rp-btn-primary {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.24);
}

.rp-btn-outline {
  border: 1px solid #cbd5e1;
  color: #0f172a;
  background: #ffffff;
}

.rp-hero-note {
  margin-top: 18px;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
}

.rp-panel {
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.rp-panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: #173b66;
  color: #ffffff;
  font-size: 13px;
  font-weight: 850;
}

.rp-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 54px;
}

.rp-stat {
  padding: 20px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
}

.rp-stat strong {
  display: block;
  font-size: 31px;
  line-height: 1;
  color: #0f172a;
}

.rp-stat span {
  display: block;
  margin-top: 8px;
  color: #475569;
  font-size: 13px;
  font-weight: 750;
}

        .rp-kicker {
          margin: 0 0 12px;
          color: #0f766e;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .rp-title {
          margin: 0;
          max-width: 760px;
          font-size: clamp(34px, 4.2vw, 54px);
          line-height: 1.05;
          letter-spacing: -0.035em;
          font-weight: 950;
        }

        .rp-copy {
          max-width: 680px;
          margin: 18px 0 0;
          color: #475569;
          font-size: 18px;
          line-height: 1.75;
        }

        .rp-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 42px;
        }

        .rp-card {
          padding: 26px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
        }

        .rp-card h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.02em;
        }

        .rp-card p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.65;
        }

        .rp-band {
          background: #f8fafc;
        }

        .rp-specialties {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 30px;
        }

        .rp-pill {
          padding: 10px 13px;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          background: #eff6ff;
          color: #1e3a8a;
          font-size: 14px;
          font-weight: 800;
        }

        .rp-split {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(420px, 1fr);
          gap: 46px;
          align-items: start;
        }

        .rp-table {
          width: 100%;
          border-collapse: collapse;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
        }

        .rp-table th,
        .rp-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          vertical-align: top;
        }

        .rp-table th {
          background: #0f172a;
          color: #ffffff;
          font-size: 13px;
        }

        .rp-table td {
          color: #334155;
          font-size: 14px;
          line-height: 1.5;
        }

        .rp-faq {
          display: grid;
          gap: 12px;
          margin-top: 34px;
        }

        .rp-faq details {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          padding: 18px 20px;
        }

        .rp-faq summary {
          cursor: pointer;
          font-weight: 900;
          color: #0f172a;
        }

        .rp-faq p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        .rp-cta {
          color: #ffffff;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 52%, #0f766e 100%);
          text-align: center;
        }

        .rp-cta .rp-title,
        .rp-cta .rp-copy {
          margin-left: auto;
          margin-right: auto;
        }

        .rp-cta .rp-copy {
          color: #dbeafe;
        }

        @media (max-width: 900px) {
          .rp-hero-grid,
          .rp-split {
            grid-template-columns: 1fr;
          }

          .rp-stats,
          .rp-grid-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .rp-hero,
          .rp-section {
            padding-left: 18px;
            padding-right: 18px;
          }

          .rp-actions {
            flex-direction: column;
          }

          .rp-stats,
          .rp-grid-3 {
            grid-template-columns: 1fr;
          }

          .rp-table {
            font-size: 13px;
          }

          .rp-table th,
          .rp-table td {
            padding: 12px;
          }
        }
      `}</style>

      <JsonLd />

      <section className="rp-hero">
        <div className="rp-wrap">
          <div className="rp-hero-grid">
            <div>
              <div className="rp-badge">Clinical reasoning QBank for rehab exam prep</div>
              <h1>
                Master NPTE and board-style rehab questions with{" "}
                <span className="rp-accent">clinical reasoning</span>
              </h1>
              <p className="rp-lead">
                RehabPearls helps PT, OT, and SLP learners prepare with adaptive questions,
                real patient cases, evidence-based rationales, and focused analytics built
                for rehabilitation exams.
              </p>
              <div className="rp-actions">
                <Link href="/register" className="rp-btn rp-btn-primary">
                  Start free trial
                </Link>
                <Link href="/qbank" className="rp-btn rp-btn-outline">
                  Explore QBank
                </Link>
              </div>
              <p className="rp-hero-note">
                No credit card required. Built for NPTE, PT, OT, SLP, and clinical practice.
              </p>
            </div>

            <div className="rp-panel" aria-label="Sample RehabPearls question">
              <div className="rp-panel-head">
                <span>Sample clinical question</span>
                <span>Neuro rehab</span>
              </div>
              <div className="rp-question">
                <p>
                  A patient post left CVA has right-sided weakness, impaired selective motor
                  control, and difficulty with sit-to-stand. Which intervention best supports
                  functional motor recovery?
                </p>
                <div className="rp-options">
                  <div className="rp-option">Passive range of motion only</div>
                  <div className="rp-option correct">Task-specific repetitive practice</div>
                  <div className="rp-option">Long-term immobilization</div>
                  <div className="rp-option">Avoidance of weight bearing</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rp-stats">
            <div className="rp-stat">
              <strong>4,000+</strong>
              <span>Board-style questions</span>
            </div>
            <div className="rp-stat">
              <strong>150+</strong>
              <span>Clinical case scenarios</span>
            </div>
            <div className="rp-stat">
              <strong>92%</strong>
              <span>Reported first-time pass rate</span>
            </div>
            <div className="rp-stat">
              <strong>24/7</strong>
              <span>Self-paced study access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rp-section">
        <div className="rp-wrap">
          <p className="rp-kicker">Why learners choose RehabPearls</p>
          <h2 className="rp-title">A stronger way to study than memorizing random questions</h2>
          <p className="rp-copy">
            RehabPearls is built around the way clinicians actually think: identify the
            problem, choose the safest intervention, justify the answer, and understand why
            the alternatives are less appropriate.
          </p>

          <div className="rp-grid-3">
            {features.map((feature) => (
              <article className="rp-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rp-section rp-band">
        <div className="rp-wrap rp-split">
          <div>
            <p className="rp-kicker">Coverage</p>
            <h2 className="rp-title">Rehab topics organized for exam readiness</h2>
            <p className="rp-copy">
              Study across high-yield rehabilitation domains with focused practice for
              board exams, clinical rotations, and real-world decision making.
            </p>
            <div className="rp-specialties">
              {specialties.map((item) => (
                <span className="rp-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <table className="rp-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Typical QBank</th>
                <th>RehabPearls</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(([feature, typical, rehab]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td>{typical}</td>
                  <td>{rehab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rp-section">
        <div className="rp-wrap">
          <p className="rp-kicker">AI search and Google-ready answers</p>
          <h2 className="rp-title">Clear answers for learners searching before they buy</h2>
          <p className="rp-copy">
            RehabPearls explains what the platform does, who it is for, what exams it
            supports, and how it improves clinical reasoning. That structure helps users,
            Google, and AI answer engines understand the product quickly.
          </p>

          <div className="rp-faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="rp-section rp-cta">
        <div className="rp-wrap">
          <h2 className="rp-title">Ready to practice with purpose?</h2>
          <p className="rp-copy">
            Start with board-style questions, clinical explanations, and rehab-focused
            review that helps learners build confidence before exam day.
          </p>
          <div className="rp-actions" style={{ justifyContent: "center" }}>
            <Link href="/register" className="rp-btn rp-btn-primary">
              Start free trial
            </Link>
            <Link href="/pricing" className="rp-btn rp-btn-outline">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}