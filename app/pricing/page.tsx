import Head from "next/head";

export const metadata = {
  title: "Pricing Plans — RehabPearls",
  description:
    "Choose a plan that fits your study goals. RehabPearls offers flexible monthly and yearly pricing with premium features.",
};

export default function PricingPage() {
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
                  name: "Pricing",
                  item: "https://rehabpearls.com/pricing",
                },
              ],
            }),
          }}
        />
      </Head>

      <main className="min-h-screen bg-gray-100 text-gray-900 py-16 px-6 lg:px-24">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
            Pricing Plans
          </h1>
          <p className="text-lg text-gray-700">
            Flexible subscription plans for students and professionals. Choose
            monthly or yearly with full access to QBank, Clinical Cases, and
            Dashboard analytics.
          </p>
        </section>

        {/* Plans Grid */}
        <section className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transform hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Basic
            </h2>
            <p className="text-gray-600 mb-4">
              Free access to sample questions
            </p>
            <p className="text-4xl font-bold text-indigo-600 mb-6">$0</p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>Limited QBank access</li>
              <li>Sample Clinical Cases</li>
              <li>Community Support</li>
            </ul>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Get Started
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-indigo-600 text-white rounded-2xl shadow-2xl p-8 border-2 border-indigo-700 transform scale-105">
            <h2 className="text-2xl font-bold mb-2">Monthly</h2>
            <p className="text-indigo-200 mb-4">
              Full access, billed monthly
            </p>
            <p className="text-5xl font-extrabold mb-6">$29</p>
            <ul className="space-y-2 mb-6">
              <li>Unlimited QBank Access</li>
              <li>All Clinical Cases</li>
              <li>Progress Dashboard</li>
              <li>Email Support</li>
            </ul>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
              Choose Monthly
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transform hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Yearly
            </h2>
            <p className="text-gray-600 mb-4">
              Best value for full access
            </p>
            <p className="text-4xl font-bold text-indigo-600 mb-6">$249</p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>Unlimited QBank Access</li>
              <li>All Clinical Cases</li>
              <li>Progress Dashboard</li>
              <li>Priority Support</li>
              <li>Save $99/year</li>
            </ul>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Choose Yearly
            </button>
          </div>
        </section>

        {/* Features / Details */}
        <section className="mt-16 max-w-4xl mx-auto space-y-8 text-gray-800">
          <h2 className="text-3xl font-bold text-center text-indigo-700">
            What’s Included
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Unlimited access to thousands of practice questions</li>
            <li>Detailed explanations and references</li>
            <li>Real-world clinical case simulations</li>
            <li>Progress analytics & performance tracking</li>
            <li>Mobile friendly learning interface</li>
          </ul>
        </section>
      </main>
    </>
  );
}
