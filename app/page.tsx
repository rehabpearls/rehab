import Link from "next/link"

export const metadata = {
  title:
    "RehabPearls | Clinical Rehab QBank, NPTE-Style Cases & Evidence-Based Exam Prep",
  description:
    "RehabPearls is a premium rehabilitation learning platform with clinical reasoning cases, evidence-based rehab education, advanced QBank systems, analytics, and board-style exam preparation for PT, OT, SLP, and rehab learners.",
}

const featuredStats = [
  {
    title: "4,000+",
    subtitle: "Clinical-style rehab questions",
  },
  {
    title: "150+",
    subtitle: "Case-based learning modules",
  },
  {
    title: "92%",
    subtitle: "Users report higher confidence",
  },
]

const learningAreas = [
  "Orthopedic Rehabilitation",
  "Neurological Rehabilitation",
  "Pediatric Therapy",
  "Sports Rehabilitation",
  "Clinical Reasoning",
  "Acute Care",
  "Board Exam Preparation",
  "Evidence-Based Practice",
]

const features = [
  {
    title: "Advanced Rehab QBank",
    description:
      "Practice with detailed board-style rehabilitation questions designed to improve clinical judgment, safety awareness, and intervention planning.",
  },
  {
    title: "Clinical Case Simulations",
    description:
      "Work through realistic rehab scenarios that mirror inpatient, outpatient, neuro, pediatric, and orthopedic settings.",
  },
  {
    title: "Performance Analytics",
    description:
      "Track weak areas, identify trends, monitor readiness scores, and build smarter study strategies through data-driven insights.",
  },
  {
    title: "Evidence-Based Learning",
    description:
      "Connect current rehabilitation research with practical patient care, treatment progression, and documentation strategies.",
  },
]

const testimonials = [
  {
    quote:
      "The closest rehab platform I’ve found to true clinical reasoning practice. It feels professional, structured, and extremely practical.",
    author: "Daniel M., DPT",
  },
  {
    quote:
      "The explanations and case breakdowns helped me finally understand why interventions matter clinically — not just memorize facts.",
    author: "Sarah L., SPT",
  },
  {
    quote:
      "RehabPearls made studying feel organized and focused. The analytics alone changed how I prepared for boards.",
    author: "Emily R., OT",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7fb] text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-200 blur-3xl" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-200 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-20 px-6 py-28 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT CONTENT */}
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold tracking-wide text-indigo-700 shadow-sm backdrop-blur">
              Premium Rehabilitation Learning Platform
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-7xl">
              Master Rehab
              <span className="block text-indigo-700">
                Clinical Reasoning
              </span>
              With Modern Exam Prep
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-600">
              RehabPearls combines evidence-based rehabilitation education,
              board-style question banks, clinical case simulations, and advanced
              learning analytics into one professional platform designed for
              serious rehab learners.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/register"
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Start Free Trial
              </Link>

              <Link
                href="/qbank"
                className="rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                Explore QBank
              </Link>
            </div>

            {/* TRUST ROW */}
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {featuredStats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
                >
                  <div className="text-4xl font-black tracking-tight text-indigo-700">
                    {item.title}
                  </div>

                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {item.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="w-full max-w-xl">

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/60">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Featured Learning System
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    Rehab Board Prep
                  </h2>
                </div>

                <div className="rounded-2xl bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                  Live Platform
                </div>
              </div>

              <div className="space-y-5">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Clinical Question Example
                  </div>

                  <p className="text-base leading-8 text-slate-700">
                    A patient presents with post-operative ACL reconstruction and
                    demonstrates quadriceps inhibition during early loading.
                    Which intervention progression is MOST appropriate to improve
                    functional knee stability while protecting graft integrity?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-indigo-50 p-5">
                    <div className="text-3xl font-black text-indigo-700">
                      87%
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Average weekly learner engagement
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-5">
                    <div className="text-3xl font-black text-violet-700">
                      24/7
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Continuous study access across devices
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Learning Categories
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {learningAreas.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Why RehabPearls
            </p>

            <h2 className="text-5xl font-black tracking-tight text-slate-950">
              Designed Like a Modern Clinical Learning Platform
            </h2>

            <p className="mt-6 text-xl leading-9 text-slate-600">
              Built for long study sessions, focused retention, clinical
              reasoning growth, and professional exam preparation — not generic
              AI-generated content pages.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-slate-200 bg-[#fafbff] p-10 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl"
              >
                <div className="mb-6 h-14 w-14 rounded-2xl bg-indigo-100" />

                <h3 className="text-3xl font-black tracking-tight text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-5 text-lg leading-9 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-8 inline-flex items-center text-sm font-bold text-indigo-700">
                  Learn more →
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PROFESSIONAL LEARNING EXPERIENCE */}
      <section className="border-y border-slate-200 bg-[#f8fafc] py-28">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Professional Study Experience
            </p>

            <h2 className="text-5xl font-black tracking-tight text-slate-950">
              Built for Deep Learning & Long Study Sessions
            </h2>

            <div className="mt-8 space-y-7 text-lg leading-9 text-slate-600">

              <p>
                RehabPearls is intentionally structured to feel like a premium
                clinical education environment — clean layouts, minimal
                distractions, evidence-focused content, and strong readability.
              </p>

              <p>
                The platform is optimized for rehabilitation students,
                therapists, clinicians, and board candidates who spend extended
                periods reviewing questions, analyzing explanations, and
                strengthening clinical reasoning.
              </p>

              <p>
                Every section is designed to improve retention, increase trust,
                support SEO visibility, and encourage higher engagement across
                QBank systems, clinical cases, rehab blogs, and educational
                learning modules.
              </p>

            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-200/60">

            <div className="space-y-6">

              <div className="rounded-2xl border border-slate-200 p-6">
                <div className="mb-2 text-sm font-bold uppercase tracking-wide text-indigo-600">
                  Smart Analytics
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Identify weak areas faster
                </h3>

                <p className="mt-3 text-slate-600 leading-8">
                  Monitor categories, performance trends, timing behavior,
                  missed concepts, and clinical decision-making weaknesses.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <div className="mb-2 text-sm font-bold uppercase tracking-wide text-indigo-600">
                  Evidence-Based Learning
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Research connected to practice
                </h3>

                <p className="mt-3 text-slate-600 leading-8">
                  Learn how rehabilitation evidence translates into patient
                  safety, interventions, progression, documentation, and exam
                  reasoning.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <div className="mb-2 text-sm font-bold uppercase tracking-wide text-indigo-600">
                  Clinical Reasoning
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Train beyond memorization
                </h3>

                <p className="mt-3 text-slate-600 leading-8">
                  Strengthen interpretation, prioritization, contraindication
                  awareness, and practical rehabilitation decision-making.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Learner Feedback
            </p>

            <h2 className="text-5xl font-black tracking-tight text-slate-950">
              Trusted by Rehab Learners Worldwide
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="rounded-[28px] border border-slate-200 bg-[#fafbff] p-10"
              >
                <p className="text-lg leading-9 text-slate-700">
                  “{item.quote}”
                </p>

                <div className="mt-8 text-sm font-bold uppercase tracking-wide text-indigo-700">
                  {item.author}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-slate-950 py-28 text-white">

        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.3),transparent_40%)]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
            Start Learning Smarter
          </p>

          <h2 className="text-5xl font-black tracking-tight md:text-6xl">
            Build Real Clinical Confidence
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Join rehab learners using RehabPearls to improve clinical reasoning,
            prepare for board-style exams, strengthen evidence-based thinking,
            and practice with professional rehabilitation education systems.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              href="/register"
              className="rounded-2xl bg-indigo-600 px-10 py-4 text-lg font-bold text-white transition hover:bg-indigo-500"
            >
              Create Free Account
            </Link>

            <Link
              href="/blog"
              className="rounded-2xl border border-slate-700 px-10 py-4 text-lg font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900"
            >
              Explore Rehab Articles
            </Link>

          </div>
        </div>
      </section>

    </main>
  )
}