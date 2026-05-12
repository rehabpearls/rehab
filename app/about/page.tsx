import Head from "next/head"
import Link from "next/link"

export const metadata = {
  title: "About RehabPearls",
  description:
    "RehabPearls is a rehabilitation exam preparation platform providing high-quality practice questions and clinical case content.",
}

export default function AboutPage() {
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
                  name: "About",
                  item: "https://rehabpearls.com/about",
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
            <h1 className="text-5xl font-extrabold mb-6">About RehabPearls</h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              RehabPearls was built by rehabilitation professionals with a passion
              for education. Our curated content helps clinicians prepare for exams
              and improve real-world clinical decision-making.
            </p>
          </div>
        </section>

        {/* STATISTICS / MISSION */}
        <section className="py-12 max-w-5xl mx-auto px-6 grid gap-12 md:grid-cols-3 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-600">5000+</p>
            <p className="text-gray-600 text-sm mt-2">Questions Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">250+</p>
            <p className="text-gray-600 text-sm mt-2">Clinical Cases</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">100%</p>
            <p className="text-gray-600 text-sm mt-2">Exam Focused</p>
          </div>
        </section>

        {/* MISSION */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-600">
            Our mission is to provide evidence-based practice questions and
            real-world clinical cases to elevate rehabilitation knowledge worldwide.
            We aim to bridge the gap between theoretical learning and practical application.
          </p>
          <p className="text-gray-600">
            RehabPearls focuses on orthopedic, neurological, pediatric, and sports
            rehabilitation content, ensuring learners have comprehensive exam
            preparation and clinical insights.
          </p>
        </section>

        {/* CALL TO ACTION */}
        <section className="text-center py-12">
          <Link
            href="/register"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-md"
          >
            Start Practicing Now
          </Link>
        </section>

      </main>
    </>
  )
}
