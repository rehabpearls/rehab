// app/layout.tsx

import type { Metadata } from "next"
import { DM_Sans, DM_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import ConditionalShell from "@/components/ConditionalShell"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://rehabpearls.com"),

  title: {
    default:
      "RehabPearls | Clinical QBank for PT, OT, SLP & Neuro Rehab",
    template: "%s | RehabPearls",
  },

  description:
    "RehabPearls Clinical QBank helps PT, OT, SLP and rehabilitation professionals master neuro rehab, clinical reasoning, board exam preparation, stroke rehab, spinal cord injury, Parkinson disease, ALS and evidence-based therapy learning.",

  keywords: [
    "rehab qbank",
    "rehabilitation exam prep",
    "PT board exam prep",
    "occupational therapy questions",
    "speech therapy board prep",
    "neuro rehab",
    "clinical reasoning",
    "stroke rehabilitation",
    "spinal cord injury rehab",
    "ALS rehabilitation",
    "Parkinson disease rehab",
    "physical therapy practice questions",
    "occupational therapy exam prep",
    "rehabilitation education",
    "therapy clinical cases",
    "rehabpearls",
  ],

  authors: [{ name: "RehabPearls" }],
  creator: "RehabPearls",
  publisher: "RehabPearls",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://rehabpearls.com",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],

    shortcut: ["/favicon.ico"],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rehabpearls.com",

    title:
      "RehabPearls | Clinical QBank for Rehab Certification & Clinical Reasoning",

    description:
      "Modern rehabilitation education platform with QBank practice questions, neuro rehab learning tracks, clinical cases, analytics, PT/OT/SLP exam prep and evidence-based therapy education.",

    siteName: "RehabPearls",

    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "RehabPearls Clinical QBank",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "RehabPearls | Clinical QBank for Rehab Professionals",

    description:
      "Advanced rehab certification preparation platform with neuro rehab, PT, OT, SLP and clinical reasoning education.",

    images: ["/og-cover.png"],
  },

  category: "education",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        <ConditionalShell>{children}</ConditionalShell>

        {/* Schema.org SEO */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@graph": [
                {
                  "@type": "Organization",

                  name: "RehabPearls",

                  url: "https://rehabpearls.com",

                  logo:
                    "https://rehabpearls.com/brand/rehabpearls-logo.png",

                  sameAs: [
                    "https://rehabpearls.com",
                  ],
                },

                {
                  "@type": "WebSite",

                  name: "RehabPearls",

                  url: "https://rehabpearls.com",

                  potentialAction: {
                    "@type": "SearchAction",

                    target:
                      "https://rehabpearls.com/search?q={search_term_string}",

                    "query-input":
                      "required name=search_term_string",
                  },
                },

                {
                  "@type": "EducationalOrganization",

                  name: "RehabPearls Clinical QBank",

                  description:
                    "Evidence-based rehabilitation education platform for PT, OT, SLP and neuro rehab certification preparation.",

                  educationalCredentialAwarded:
                    "Rehabilitation Knowledge & Clinical Preparation",

                  teaches: [
                    "Neuro Rehabilitation",
                    "Stroke Rehabilitation",
                    "Spinal Cord Injury",
                    "Parkinson Disease",
                    "ALS",
                    "Clinical Reasoning",
                    "Physical Therapy",
                    "Occupational Therapy",
                    "Speech Therapy",
                  ],
                },
              ],
            }),
          }}
        />

       {/* Google Analytics */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-4D3FHH2ZKM"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];

    function gtag(){
      dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'G-4D3FHH2ZKM');
  `}
</Script>
      </body>
    </html>
  )
}