import Head from "next/head"

export const metadata = {
  title: "FAQ — RehabPearls",
  description:
    "Frequently Asked Questions about RehabPearls QBank, Clinical Cases, pricing, accounts and general usage.",
}

export default function FAQPage() {

  const faqItems = [
    {
      question: "What is RehabPearls?",
      answer:
        "RehabPearls is a rehabilitation exam preparation platform featuring a question bank, clinical cases, and performance tracking to help clinicians and therapists prepare for certification exams.",
    },
    {
      question: "How do I sign up?",
      answer:
        "To sign up, go to the Register page, enter your email and password, and follow the instructions. You may need to confirm your email before logging in.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a free basic plan where you can try sample questions. Full access requires a subscription plan.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Use the 'Forgot Password' link on the Login page and follow the instructions to reset your password.",
    },
    {
      question: "Can I access QBank on multiple devices?",
      answer:
        "Yes, your account can be used on multiple devices as long as you are logged in with the same credentials.",
    },
  ]

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Frequently Asked Questions</h1>

        {faqItems.map((item, i) => (
          <div key={i} className="border-b pb-4">
            <h3 className="text-xl font-semibold text-indigo-700">{item.question}</h3>
            <p className="mt-2 text-gray-600">{item.answer}</p>
          </div>
        ))}
      </main>
    </>
  )
}

