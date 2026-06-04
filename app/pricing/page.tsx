import Link from "next/link"

export const metadata = {
  title: "Pricing Plans | RehabPearls",
  description:
    "Choose the perfect RehabPearls subscription plan for QBank access, clinical cases, analytics and rehabilitation exam preparation.",
}

interface Plan {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "$0",
    description: "Explore the platform with limited access.",
    features: [
      "Sample QBank Questions",
      "Limited Clinical Cases",
      "Community Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Monthly",
    price: "$49",
    description: "Most popular option for active learners.",
    popular: true,
    features: [
      "Limited QBank Access",
      "Full Clinical Cases Library",
      "Performance Analytics",
      "Progress Tracking",
      "Email Support",
    ],
    cta: "Start Monthly Plan",
  },
  {
    name: "Yearly",
    price: "$249",
    description: "Best value for long-term preparation.",
    features: [
      "Unlimited QBank Access",
      "Full Clinical Cases Library",
      "Performance Analytics",
      "Priority Support",
      "Save $99 Per Year",
    ],
    cta: "Start Yearly Plan",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">

        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 mb-8">
          Flexible Learning Plans
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700">
          Pricing Plans
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Gain access to thousands of rehabilitation practice questions,
          clinical cases, detailed explanations, and advanced analytics.
        </p>

      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">5000+</div>
            <div className="text-gray-600 mt-2">Practice Questions</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">250+</div>
            <div className="text-gray-600 mt-2">Clinical Cases</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">4</div>
            <div className="text-gray-600 mt-2">Specialties</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">24/7</div>
            <div className="text-gray-600 mt-2">Platform Access</div>
          </div>

        </div>
      </section>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                bg-white rounded-3xl p-8 shadow-lg
                hover:shadow-2xl hover:-translate-y-2
                transition-all duration-300 relative
                ${plan.popular ? "border-2 border-indigo-600 ring-4 ring-indigo-100" : ""}
              `}
            >

              {plan.popular && (
                <div className="inline-flex rounded-full bg-indigo-600 text-white px-3 py-1 text-xs font-semibold mb-6">
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h2>

              <p className="text-gray-600 mb-6">
                {plan.description}
              </p>

              <div className="text-5xl font-extrabold text-indigo-600 mb-8">
                {plan.price}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-gray-600">
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition">
                {plan.cta}
              </button>

            </div>
          ))}

        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Everything Included
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Every plan is designed to support rehabilitation learning with real clinical depth.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">

            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="font-bold text-xl mb-2">QBank Access</h3>
              <p className="text-gray-600">
                Thousands of exam-style rehabilitation questions.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="font-bold text-xl mb-2">Clinical Cases</h3>
              <p className="text-gray-600">
                Real-world patient scenarios for clinical reasoning.
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="font-bold text-xl mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track progress and identify weak areas.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-white rounded-[32px] shadow-xl p-12 text-center">

            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready To Start Learning?
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Join RehabPearls and start improving your clinical reasoning today.
            </p>

            <Link
              href="/register"
              className="inline-flex px-10 py-4 rounded-3xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Start Now
            </Link>

          </div>

        </div>
      </section>

    </main>
  )
}