import Link from "next/link"
import {
  FaBone,
  FaBrain,
  FaChild,
  FaRunning,
  FaUserMd,
  FaChartLine,
  FaClipboardCheck,
} from "react-icons/fa"

export const metadata = {
  title: "Clinical Cases | RehabPearls",
  description:
    "Practice realistic rehabilitation clinical cases designed to improve clinical reasoning, patient assessment, and decision-making skills.",
  keywords: [
    "clinical cases",
    "rehabilitation cases",
    "physical therapy case studies",
    "clinical reasoning",
    "rehab education",
  ],
  alternates: {
    canonical: "https://rehabpearls.com/cases",
  },
}

const categories = [
  {
    href: "/cases/orthopedic",
    icon: FaBone,
    title: "Orthopedic",
    description:
      "Musculoskeletal injuries, fractures, post-operative rehab, joint dysfunction and return-to-function planning.",
    count: "90+ Cases",
  },
  {
    href: "/cases/neuro",
    icon: FaBrain,
    title: "Neurological",
    description:
      "Stroke, spinal cord injury, TBI, movement disorders and neurorehabilitation decision making.",
    count: "70+ Cases",
  },
  {
    href: "/cases/pediatrics",
    icon: FaChild,
    title: "Pediatric",
    description:
      "Developmental delays, cerebral palsy, pediatric neurology and functional rehabilitation planning.",
    count: "50+ Cases",
  },
  {
    href: "/cases/sports",
    icon: FaRunning,
    title: "Sports",
    description:
      "ACL rehab, return-to-play decisions, athletic injuries and sports performance optimization.",
    count: "40+ Cases",
  },
]

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Clinical Cases",
            description:
              "Clinical rehabilitation case simulations for exam preparation and clinical reasoning development.",
            url: "https://rehabpearls.com/cases",
          }),
        }}
      />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">

        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 mb-8">
          Clinical Reasoning Platform
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 leading-tight">
          Clinical Cases
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Strengthen clinical reasoning through realistic rehabilitation case
          scenarios designed to simulate real patient encounters and exam-style
          decision making.
        </p>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">250+</div>
            <div className="text-gray-600 mt-2">Clinical Cases</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">4</div>
            <div className="text-gray-600 mt-2">Specialties</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">100%</div>
            <div className="text-gray-600 mt-2">Exam Relevant</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">Expert</div>
            <div className="text-gray-600 mt-2">Peer Reviewed</div>
          </div>

        </div>
      </section>

      {/* CASE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon

            return (
              <Link
                key={category.href}
                href={category.href}
                className="
                  group
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-lg
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                <div className="flex flex-col items-center text-center">

                  <Icon
                    className="
                      text-indigo-600
                      text-5xl
                      mb-6
                      group-hover:scale-110
                      transition-transform
                    "
                  />

                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {category.title}
                  </h2>

                  <p className="text-gray-600 mb-5">
                    {category.description}
                  </p>

                  <span className="text-sm font-semibold text-indigo-600">
                    {category.count}
                  </span>

                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY CLINICAL CASES */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Practice Clinical Cases?
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Move beyond memorization and develop the clinical reasoning
              skills required in real-world rehabilitation practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-gray-50 rounded-3xl p-8">
              <FaUserMd className="text-indigo-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-3">
                Realistic Patient Scenarios
              </h3>
              <p className="text-gray-600">
                Experience authentic rehabilitation cases based on clinical
                practice and exam standards.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <FaClipboardCheck className="text-indigo-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-3">
                Clinical Decision Making
              </h3>
              <p className="text-gray-600">
                Improve assessment, diagnosis and intervention planning through
                guided reasoning exercises.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <FaChartLine className="text-indigo-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-3">
                Exam Performance
              </h3>
              <p className="text-gray-600">
                Build confidence for certification and board examinations with
                clinically relevant scenarios.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">

          <div className="bg-white rounded-[32px] shadow-xl p-12 text-center">

            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready To Start Practicing?
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Access hundreds of rehabilitation case studies and improve your
              clinical reasoning today.
            </p>

            <Link
              href="/register"
              className="
                inline-flex
                items-center
                justify-center
                px-10
                py-4
                rounded-2xl
                bg-indigo-600
                text-white
                font-semibold
                text-lg
                hover:bg-indigo-700
                transition
              "
            >
              Start Clinical Case Practice
            </Link>

          </div>
        </div>
      </section>

    </main>
  )
}