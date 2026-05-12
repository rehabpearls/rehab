import Link from "next/link"

// SEO метадані для App Router
export const metadata = {
  title: "RehabPearls | QBank, Clinical Cases & Rehab Exam Prep Platform",
  description:
    "RehabPearls offers a comprehensive rehabilitation exam prep with expert benchmarks QBank, real clinical cases, performance analytics & personalized learning.",
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden font-sans bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-white py-32 px-6 text-center">
        {/* SEO‑friendly H1 here отвечает за главный заголовок */}
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 leading-tight">
          RehabPearls — Master Your Rehab Certification
        </h1>

        {/* Hero subheadline: ясно объясняет предложение */}
        <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
          A complete question bank + real clinical cases + performance analytics —
          set up to help therapists, clinicians, and students practice smarter and succeed on exam day.
        </p>

        {/* CTA buttons */}
        <div className="flex justify-center gap-6">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            Get Started Free
          </Link>
          <Link
            href="/qbank"
            className="border border-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition"
          >
            Explore QBank
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">
          What Makes RehabPearls Valuable
        </h2>
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3">
          <div className="bg-indigo-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Expert‑Crafted QBank</h3>
            <p className="text-gray-700">
              Practice thousands of rehab certification questions tailored to exam learning paths.
            </p>
          </div>
          <div className="bg-indigo-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Real Clinical Cases</h3>
            <p className="text-gray-700">
              Sharpen clinical reasoning through realistic cases designed by professionals.
            </p>
          </div>
          <div className="bg-indigo-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Analytics & Insights</h3>
            <p className="text-gray-700">
              Track your progress with personalized analytics to focus on what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-14 bg-indigo-50">
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">
          Trusted by Learners Worldwide
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          “RehabPearls helped me go from uncertain to confident — I passed my exam on the first attempt!” — <strong>Alicia, PT</strong>
        </p>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">
          How It Works
        </h2>
        <div className="max-w-5xl mx-auto space-y-6 px-4 text-gray-700">
          <p>
            Our platform combines practice questions, clinical case scenarios, performance tracking, and tailored study paths — 
            designed to help you identify strengths and improve weaker areas systematically.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Practice with expert‑designed questions</li>
            <li>Analyze your performance and track improvement</li>
            <li>Dive into clinical case challenges</li>
            <li>Build confidence and exam readiness</li>
          </ul>
        </div>
      </section>

      {/* Secondary Call to Action */}
      <section className="text-center py-16 bg-white">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
          Ready to Boost Your Exam Results?
        </h2>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          Create Your Free Account
        </Link>
      </section>

    </main>
  )
}
