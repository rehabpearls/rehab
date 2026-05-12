  import Link from "next/link"
  import { FaBone, FaBrain, FaChild, FaRunning } from "react-icons/fa"

  export const metadata = {
    title: "Rehabilitation Exam Question Bank | RehabPearls",
    description:
      "Practice with the RehabPearls QBank — a comprehensive rehabilitation exam question bank with detailed explanations for clinicians and students.",
    keywords: [
      "rehabilitation exam",
      "physical therapy questions",
      "neuro rehab qbank",
      "orthopedic exam practice",
      "rehab question bank",
    ],
    alternates: {
      canonical: "https://rehabpearls.com/qbank",
    },
    robots: "index, follow",
    openGraph: {
      title: "Rehabilitation Exam Question Bank",
      description:
        "Comprehensive rehab question bank with clinically relevant practice questions.",
      url: "https://rehabpearls.com/qbank",
      siteName: "RehabPearls",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "RehabPearls QBank",
      description:
        "Comprehensive rehab question bank for clinicians and students.",
    },
  }

  interface QBankCategory {
    id: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
  }

  const categories: QBankCategory[] = [
    {
      id: "orthopedic",
      href: "/qbank/orthopedic",
      icon: FaBone,
      title: "Orthopedic",
      description:
        "Fractures, joint injuries, biomechanics, and rehabilitation principles.",
    },
    {
      id: "neurology",
      href: "/qbank/neurology",
      icon: FaBrain,
      title: "Neurological",
      description:
        "Stroke, spinal cord injury, neuroplasticity, motor recovery and neurological rehab.",
    },
    {
      id: "pediatrics",
      href: "/qbank/pediatrics",
      icon: FaChild,
      title: "Pediatric",
      description:
        "Child development, growth milestones, pediatric conditions and therapy approaches.",
    },
    {
      id: "sports",
      href: "/qbank/sports",
      icon: FaRunning,
      title: "Sports",
      description:
        "Sports injuries, performance optimization and injury prevention strategies.",
    },
  ]

  export default function QBankPage() {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* ================= Structured Data ================= */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Rehabilitation Exam Question Bank",
              description:
                "Comprehensive rehabilitation question bank with detailed clinical explanations.",
              url: "https://rehabpearls.com/qbank",
            }),
          }}
        />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://rehabpearls.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "QBank",
                  item: "https://rehabpearls.com/qbank",
                },
              ],
            }),
          }}
        />

        {/* ================= HERO ================= */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 leading-tight">
            Rehabilitation Exam Question Bank
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600">
            Practice clinically relevant questions with detailed explanations
            designed for rehabilitation professionals preparing for exams.
          </p>
        </section>

        {/* ================= CATEGORY GRID ================= */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group bg-white rounded-3xl p-8 shadow-lg 
                            hover:shadow-2xl hover:-translate-y-2 
                            transition-all duration-300 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="text-indigo-600 text-5xl mb-6 
                                    group-hover:scale-110 transition-transform duration-300" />

                    <h2 className="text-2xl font-bold mb-3 text-gray-800">
                      {category.title}
                    </h2>

                    <p className="text-gray-600 text-base">
                      {category.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ================= FEATURE SECTION ================= */}
        <section className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Practice With Our QBank?
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Each question includes evidence-based explanations,
              clinical reasoning breakdowns, and important exam concepts.
              Designed to simulate real certification and licensing exams
              for rehabilitation professionals.
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-10 text-left">
              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">
                  ✅ Detailed Explanations
                </h3>
                <p className="text-gray-600 text-sm">
                  Understand why answers are correct — not just memorization.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">
                  🚀 Exam Simulation
                </h3>
                <p className="text-gray-600 text-sm">
                  Practice in conditions similar to real certification exams.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">
                  📊 Performance Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Track progress and identify weak knowledge areas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }
