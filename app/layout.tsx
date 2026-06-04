import type { Metadata, Viewport } from "next"
import { DM_Mono, DM_Sans } from "next/font/google"
import Script from "next/script"
import ConditionalShell from "@/components/common/ConditionalShell"
import "./globals.css"

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: "#2563eb",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://rehabpearls.com"),
  title: {
    default: "RehabPearls | NPTE QBank & Clinical Reasoning Platform",
    template: "%s | RehabPearls",
  },
  description:
    "RehabPearls is an adaptive clinical reasoning QBank for NPTE, PT board exam prep, OT, SLP, neuro rehab, orthopedic rehab, pediatric therapy, acute care, and evidence-based rehabilitation practice.",
  keywords: [
    "NPTE QBank",
    "NPTE prep",
    "NPTE practice questions",
    "physical therapy board exam prep",
    "PT board exam questions",
    "clinical reasoning QBank",
    "rehabilitation QBank",
    "adaptive QBank",
    "physical therapy exam prep",
    "occupational therapy exam prep",
    "SLP exam prep",
    "neuro rehab questions",
    "orthopedic rehab questions",
    "pediatric therapy exam prep",
    "acute care rehab questions",
    "evidence based rehabilitation",
    "clinical case simulations",
    "rehab board exam prep",
    "UWorld alternative for rehab",
    "RehabPearls",
  ],
  authors: [{ name: "RehabPearls", url: "https://rehabpearls.com" }],
  creator: "RehabPearls",
  publisher: "RehabPearls",
  applicationName: "RehabPearls",
  category: "education",
  alternates: {
    canonical: "https://rehabpearls.com",
    languages: {
      "en-US": "https://rehabpearls.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      noimageindex: false,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rehabpearls.com",
    siteName: "RehabPearls",
    title: "RehabPearls | NPTE QBank & Clinical Reasoning Platform",
    description:
      "Adaptive rehab exam prep for PT, OT, and SLP learners. Practice NPTE-style questions, clinical cases, and evidence-based explanations.",
    images: [
      {
        url: "/brand/og-cover.png",
        width: 1200,
        height: 630,
        alt: "RehabPearls clinical reasoning QBank platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RehabPearls | NPTE QBank & Clinical Reasoning Prep",
    description:
      "Board-style rehabilitation questions, clinical cases, and adaptive exam prep for PT, OT, and SLP learners.",
    images: ["/brand/og-cover.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RehabPearls",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  referrer: "strict-origin-when-cross-origin",
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RehabPearls",
  alternateName: "Rehab Pearls",
  url: "https://rehabpearls.com",
  logo: "https://rehabpearls.com/brand/rehabpearls-logo.png.png",
  description:
    "Adaptive rehabilitation QBank and clinical reasoning platform for NPTE, PT, OT, and SLP exam preparation.",
  sameAs: [
    "https://twitter.com/rehabpearls",
    "https://linkedin.com/company/rehabpearls",
    "https://facebook.com/rehabpearls",
    "https://instagram.com/rehabpearls",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@rehabpearls.com",
    availableLanguage: ["en"],
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RehabPearls",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://rehabpearls.com",
  description:
    "Adaptive QBank platform for NPTE, PT board exam, OT, and SLP exam preparation with clinical cases and evidence-based rationales.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "3247",
    bestRating: "5",
    worstRating: "1",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free trial access",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Organization",
    name: "RehabPearls",
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RehabPearls",
  url: "https://rehabpearls.com",
  description:
    "Adaptive rehabilitation QBank and clinical reasoning platform for NPTE and board exam preparation.",
  potentialAction: {
    "@type": "Action",
    target: "https://rehabpearls.com/register",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
      </head>

      <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
        <ConditionalShell>{children}</ConditionalShell>

        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <Script
          id="schema-software"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />

        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4D3FHH2ZKM"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4D3FHH2ZKM', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `}
        </Script>
      </body>
    </html>
  )
}