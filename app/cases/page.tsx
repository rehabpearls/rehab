import Head from "next/head"
import Link from "next/link"

export const metadata = {
  title: "Clinical Cases — RehabPearls",
  description:
    "RehabPearls Clinical Cases module provides real-world scenarios to enhance your clinical reasoning and decision making.",
}

export default function CasesPage() {
  return (
    <>
      <Head>
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
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
                  name: "Clinical Cases",
                  item: "https://rehabpearls.com/cases",
                },
              ],
            }),
          }}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">

        {/* HERO */}
        <section className="bg-indigo-700 text-white py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-6">
              Clinical Cases
            </h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              Dive into realistic clinical rehabilitation scenarios designed to
              sharpen your diagnostic reasoning, improve decision-making, and
              connect theoretical knowledge with practical application.
            </p>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-white shadow-sm py-6 border-b">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
            <div>
              <p className="text-3xl font-bold text-indigo-600">250+</p>
              <p className="text-sm text-gray-600">Clinical Cases</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">4</p>
              <p className="text-sm text-gray-600">Specialties</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">Expert</p>
              <p className="text-sm text-gray-600">Peer Reviewed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">100%</p>
              <p className="text-sm text-gray-600">Exam Relevant</p>
            </div>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="max-w-6xl mx-auto py-16 px-6">

          <div className="grid gap-8 md:grid-cols-2">

            {/* ORTHOPEDIC */}
            <Link
              href="/cases/orthopedic"
              className="group border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">
                Orthopedic Rehab Cases
              </h2>
              <p className="text-gray-600 mb-4">
                Musculoskeletal injuries, post-surgical rehabilitation,
                fractures, joint dysfunction and return-to-function protocols.
              </p>
              <div className="text-sm text-gray-500">
                90+ cases • Beginner → Advanced
              </div>
            </Link>

            {/* NEURO */}
            <Link
              href="/cases/neuro"
              className="group border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">
                Neuro Rehab Cases
              </h2>
              <p className="text-gray-600 mb-4">
                Stroke rehabilitation, traumatic brain injury, spinal cord
                injury, movement disorders and neuroplastic recovery.
              </p>
              <div className="text-sm text-gray-500">
                70+ cases • Moderate → Expert
              </div>
            </Link>

            {/* PEDIATRICS */}
            <Link
              href="/cases/pediatrics"
              className="group border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">
                Pediatric Rehab Cases
              </h2>
              <p className="text-gray-600 mb-4">
                Developmental delay, cerebral palsy, neuromuscular disorders
                and pediatric functional rehabilitation planning.
              </p>
              <div className="text-sm text-gray-500">
                50+ cases • Clinical Focused
              </div>
            </Link>

            {/* SPORTS */}
            <Link
              href="/cases/sports"
              className="group border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">
                Sports Rehab Cases
              </h2>
              <p className="text-gray-600 mb-4">
                Athletic injuries, ACL rehab, return-to-play criteria,
                performance optimization and injury prevention.
              </p>
              <div className="text-sm text-gray-500">
                40+ cases • Performance Oriented
              </div>
            </Link>

          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/register"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-md"
            >
              Start Clinical Case Practice
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              Already registered?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Log in to continue
              </Link>
            </p>
          </div>

        </section>

      </main>
    </>
  )
}
