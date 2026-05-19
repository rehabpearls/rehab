import Link from "next/link"

export const metadata = {
  metadataBase: new URL("https://rehabpearls.com"),

  title:
    "RehabPearls | #1 NPTE Prep Platform for PT, OT & SLP Clinical Reasoning, Rehab QBank & Board Exam Mastery 2026",

  description:
    "RehabPearls is the most advanced rehabilitation learning platform for PT, OT, and SLP board exam preparation. Master NPTE with adaptive QBank, clinical reasoning cases, evidence-based rehab education, performance analytics, and real-world patient simulation training.",

  keywords: [
    "NPTE prep platform",
    "PT board exam QBank",
    "OT exam preparation",
    "SLP certification prep",
    "clinical reasoning rehab",
    "physical therapy practice questions",
    "rehab QBank system",
    "neuro rehab cases",
    "orthopedic rehab training",
    "sports rehab education",
    "acute care PT training",
    "pediatric therapy learning",
    "evidence based practice rehab",
    "best NPTE study platform",
    "rehabilitation exam prep 2026",
    "adaptive learning rehab system",
    "clinical decision making training"
  ],

  openGraph: {
    title: "RehabPearls | Ultimate NPTE Clinical Reasoning Platform",
    description:
      "Adaptive rehab QBank + clinical reasoning + board exam mastery for PT, OT & SLP.",
    url: "https://rehabpearls.com",
    siteName: "RehabPearls",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
}

/* ======================= DATA LAYER ======================= */

const stats = [
  { title: "4,000+", subtitle: "NPTE-style clinical questions" },
  { title: "150+", subtitle: "Real patient case simulations" },
  { title: "92%", subtitle: "Improved exam performance confidence" },
  { title: "24/7", subtitle: "Adaptive learning system access" },
]

const pillars = [
  {
    title: "Clinical Reasoning Mastery",
    description:
      "Train decision-making skills used in real PT, OT, and SLP clinical environments across neuro, ortho, acute care, and pediatrics.",
  },
  {
    title: "Adaptive QBank Engine",
    description:
      "AI-driven question system that adapts to your weaknesses and improves retention efficiency for NPTE success.",
  },
  {
    title: "Evidence-Based Practice Integration",
    description:
      "Every question is backed by real clinical research and modern rehabilitation guidelines.",
  },
  {
    title: "Board Exam Simulation Mode",
    description:
      "Full-length NPTE simulation exams designed to mirror real testing conditions.",
  },
]

const features = [
  {
    title: "Neuro Rehabilitation Module",
    description:
      "Stroke, SCI, TBI, Parkinson’s disease clinical reasoning pathways and interventions.",
  },
  {
    title: "Orthopedic Rehabilitation Module",
    description:
      "Post-surgical rehab, musculoskeletal injuries, pain management strategies.",
  },
  {
    title: "Pediatric Therapy Module",
    description:
      "Developmental disorders, pediatric motor control, early intervention strategies.",
  },
  {
    title: "Acute Care Module",
    description:
      "ICU mobility, safety screening, medical stability decision-making.",
  },
]

const comparisons = [
  {
    title: "Traditional Study Methods",
    points: [
      "Memorization-focused learning",
      "No clinical reasoning structure",
      "No adaptive feedback",
      "No real patient simulation",
    ],
  },
  {
    title: "RehabPearls System",
    points: [
      "Clinical reasoning-first approach",
      "Adaptive QBank personalization",
      "Real-world patient scenarios",
      "Data-driven performance analytics",
    ],
  },
]

const faqs = [
  {
    q: "What is RehabPearls used for?",
    a: "It is an NPTE exam preparation platform for PT, OT, and SLP students focusing on clinical reasoning.",
  },
  {
    q: "Is this better than standard QBank systems?",
    a: "Yes, because it adapts to your weaknesses and focuses on clinical decision-making.",
  },
  {
    q: "Does it include real clinical cases?",
    a: "Yes, it simulates real-world rehabilitation patient scenarios.",
  },
  {
    q: "Can beginners use it?",
    a: "Yes, it supports both beginners and advanced learners.",
  },
]

const glossary = [
  "NPTE (National Physical Therapy Exam)",
  "Clinical Reasoning",
  "Evidence-Based Practice",
  "Adaptive Learning System",
  "Rehabilitation QBank",
  "Orthopedic Rehabilitation",
  "Neurological Rehabilitation",
  "Pediatric Therapy",
  "Acute Care Therapy",
]

/* ======================= PAGE ======================= */

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= SCHEMA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "RehabPearls",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description:
              "Advanced NPTE rehab learning platform with clinical reasoning and adaptive QBank.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      {/* ================= HERO (SEO + CONVERSION) ================= */}
      <header className="mx-auto max-w-6xl px-6 py-32 text-center">

        <p className="text-sm font-bold tracking-[0.35em] text-indigo-600 uppercase">
          #1 NPTE CLINICAL REASONING PLATFORM
        </p>

        <h1 className="mt-8 text-6xl md:text-7xl font-black leading-tight">
          Master NPTE Exam <br />
          <span className="text-indigo-700">With Clinical Reasoning</span>
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-xl text-slate-600 leading-9">
          RehabPearls is the most advanced rehabilitation learning system for PT, OT,
          and SLP students preparing for board exams using adaptive QBank, clinical
          simulations, and evidence-based decision training.
        </p>

        <div className="mt-12 flex justify-center gap-6">
          <Link className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold" href="/register">
            Start Free Trial
          </Link>

          <Link className="border px-8 py-4 rounded-xl font-semibold" href="/qbank">
            Explore QBank
          </Link>
        </div>

        {/* STATS */}
        <div className="mt-20 grid md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.title}>
              <p className="text-4xl font-black text-indigo-700">{s.title}</p>
              <p className="text-slate-600">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ================= CORE SEO AUTHORITY BLOCK ================= */}
      <section className="bg-slate-50 py-28">
        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-5xl font-black">
            Built for Clinical Excellence & NPTE Mastery
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            RehabPearls combines neuroscience of learning, clinical reasoning models,
            and rehabilitation evidence-based practice into one structured system.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {pillars.map((p) => (
              <div key={p.title} className="border rounded-2xl p-10 bg-white">
                <h3 className="text-2xl font-black">{p.title}</h3>
                <p className="mt-4 text-slate-600 leading-8">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SPECIALIZATION SEO ================= */}
      <section className="py-28 mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">
          Specialized Rehabilitation Learning Tracks
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border p-8 rounded-2xl">
              <h3 className="text-xl font-black">{f.title}</h3>
              <p className="mt-3 text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMPARISON ================= */}
      <section className="bg-slate-50 py-28">
        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-5xl font-black">
            Traditional Study vs RehabPearls
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {comparisons.map((c) => (
              <div key={c.title} className="bg-white border rounded-2xl p-8">
                <h3 className="text-xl font-black">{c.title}</h3>
                <ul className="mt-4 space-y-2 text-slate-600">
                  {c.points.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GLOSSARY SEO ================= */}
      <section className="py-28 mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">
          Rehabilitation Learning Glossary (SEO Authority Boost)
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {glossary.map((g) => (
            <div key={g} className="border rounded-xl p-4">
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ (SEO POWER) ================= */}
      <section className="py-28 mx-auto max-w-4xl px-6">

        <h2 className="text-5xl font-black">Frequently Asked Questions</h2>

        <div className="mt-10 space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-b pb-5">
              <h3 className="font-bold text-xl">{f.q}</h3>
              <p className="text-slate-600 mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-indigo-700 py-32 text-center text-white">

        <h2 className="text-6xl font-black">
          Become NPTE Ready Faster
        </h2>

        <p className="mt-8 text-indigo-100 max-w-2xl mx-auto text-lg">
          Join thousands of PT, OT, and SLP students mastering clinical reasoning
          with RehabPearls adaptive learning system.
        </p>

        <div className="mt-12">
          <Link className="bg-white text-indigo-700 px-10 py-4 rounded-xl font-bold" href="/register">
            Start Free Trial
          </Link>
        </div>
      </section>

    </main>
  )
}