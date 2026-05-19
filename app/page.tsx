import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  metadataBase: new URL("https://rehabpearls.com"),
  title: "RehabPearls | NPTE QBank, PT Board Exam Prep & Clinical Reasoning",
  description:
    "RehabPearls is an adaptive clinical reasoning QBank for NPTE, PT board exam prep, OT, SLP, neuro rehab, orthopedic rehab, pediatrics, acute care, and evidence-based rehabilitation practice.",
  keywords: [
    "NPTE QBank",
    "NPTE prep",
    "NPTE practice questions",
    "physical therapy board exam prep",
    "PT board exam questions",
    "clinical reasoning QBank",
    "rehabilitation QBank",
    "adaptive QBank",
    "occupational therapy exam prep",
    "SLP exam prep",
    "neuro rehab questions",
    "orthopedic rehab questions",
    "clinical case simulations",
    "UWorld alternative for rehab",
    "rehab board exam prep",
  ],
  alternates: {
    canonical: "https://rehabpearls.com",
  },
  openGraph: {
    title: "RehabPearls | Clinical Reasoning QBank for Rehab Professionals",
    description:
      "Adaptive board-style rehab questions, clinical cases, evidence-based explanations, and analytics for PT, OT, SLP, and NPTE preparation.",
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
  ["Adaptive QBank Engine", "Practice with board-style questions that focus review on weak areas, missed concepts, and clinical decision-making patterns."],
  ["Clinical Case Simulations", "Train with realistic patient scenarios across neuro, orthopedic, pediatric, acute care, cardiopulmonary, and complex rehab settings."],
  ["Evidence-Based Explanations", "Every answer teaches the reasoning behind the choice, so learners build clinical judgment instead of memorizing isolated facts."],
  ["Performance Analytics", "Track readiness by topic, difficulty, exam domain, and confidence so users know exactly what to review next."],
  ["Built For Rehab Learners", "Designed for PT students, OT learners, SLP clinicians, PM&R teams, and rehabilitation professionals preparing for exams."],
  ["Exam-Style Practice", "Use focused review, timed practice, rationales, and clinical pearls to prepare for pressure before test day."],
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
  ["Clinical cases", "Limited or generic", "Rehab-specific patient scenarios"],
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
    </>
  )
}

export default function Home() {
  return (
    <main className="rp-home-page">
      <JsonLd />

      <section className="rp-home-hero">
        <div className="rp-home-wrap">
          <div className="rp-home-hero-grid">
            <div>
              <div className="rp-home-badge">Clinical reasoning QBank for rehab exam prep</div>

              <h1 className="rp-home-hero-title">
                Master NPTE and board-style rehab questions with{" "}
                <span>clinical reasoning</span>
              </h1>

              <p className="rp-home-lead">
                RehabPearls helps PT, OT, and SLP learners prepare with adaptive questions,
                real patient cases, evidence-based rationales, and focused analytics built
                for rehabilitation exams.
              </p>

              <div className="rp-home-actions">
                <Link href="/register" className="rp-home-btn rp-home-btn-primary">
                  Start free trial
                </Link>
                <Link href="/qbank" className="rp-home-btn rp-home-btn-secondary">
                  Explore QBank
                </Link>
              </div>

              <p className="rp-home-note">
                No credit card required. Built for NPTE, PT, OT, SLP, and clinical practice.
              </p>
            </div>

            <div className="rp-home-panel" aria-label="Sample RehabPearls question">
              <div className="rp-home-panel-head">
                <span>Sample clinical question</span>
                <span>Neuro rehab</span>
              </div>

              <div className="rp-home-question">
                <p>
                  A patient post left CVA has right-sided weakness, impaired selective motor
                  control, and difficulty with sit-to-stand. Which intervention best supports
                  functional motor recovery?
                </p>

                <div className="rp-home-options">
                  <div className="rp-home-option">Passive range of motion only</div>
                  <div className="rp-home-option is-correct">Task-specific repetitive practice</div>
                  <div className="rp-home-option">Long-term immobilization</div>
                  <div className="rp-home-option">Avoidance of weight bearing</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rp-home-stats">
            <div><strong>4,000+</strong><span>Board-style questions</span></div>
            <div><strong>150+</strong><span>Clinical case scenarios</span></div>
            <div><strong>92%</strong><span>Reported first-time pass rate</span></div>
            <div><strong>24/7</strong><span>Self-paced study access</span></div>
          </div>
        </div>
      </section>

      <section className="rp-home-section">
        <div className="rp-home-wrap">
          <p className="rp-home-kicker">Why learners choose RehabPearls</p>
          <h2 className="rp-home-title">A stronger way to study than memorizing random questions</h2>
          <p className="rp-home-copy">
            RehabPearls is built around the way clinicians actually think: identify the
            problem, choose the safest intervention, justify the answer, and understand why
            the alternatives are less appropriate.
          </p>

          <div className="rp-home-card-grid">
            {features.map(([title, text]) => (
              <article className="rp-home-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rp-home-section rp-home-soft">
        <div className="rp-home-wrap rp-home-split">
          <div>
            <p className="rp-home-kicker">Coverage</p>
            <h2 className="rp-home-title">Rehab topics organized for exam readiness</h2>
            <p className="rp-home-copy">
              Study across high-yield rehabilitation domains with focused practice for
              board exams, clinical rotations, and real-world decision making.
            </p>

            <div className="rp-home-pills">
              {specialties.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <table className="rp-home-table">
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

      <section className="rp-home-section">
        <div className="rp-home-wrap">
          <p className="rp-home-kicker">Google and AI-ready answers</p>
          <h2 className="rp-home-title">Clear answers for learners searching before they buy</h2>
          <p className="rp-home-copy">
            RehabPearls explains what the platform does, who it is for, what exams it
            supports, and how it improves clinical reasoning.
          </p>

          <div className="rp-home-faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="rp-home-section rp-home-cta">
        <div className="rp-home-wrap">
          <h2 className="rp-home-title">Ready to practice with purpose?</h2>
          <p className="rp-home-copy">
            Start with board-style questions, clinical explanations, and rehab-focused
            review that helps learners build confidence before exam day.
          </p>

          <div className="rp-home-actions center">
            <Link href="/register" className="rp-home-btn rp-home-btn-primary">
              Start free trial
            </Link>
            <Link href="/pricing" className="rp-home-btn rp-home-btn-light">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}