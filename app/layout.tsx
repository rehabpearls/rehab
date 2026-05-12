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
    default: "RehabPearls | Rehab Exam Preparation",
    template: "%s | RehabPearls",
  },
  description:
    "Practice rehabilitation exam questions with detailed explanations. Track progress and improve clinical knowledge with RehabPearls.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://rehabpearls.com",
    title: "RehabPearls | Rehab Exam Platform",
    description:
      "Professional question bank for rehabilitation professionals with progress tracking.",
    siteName: "RehabPearls",
  },
  twitter: {
    card: "summary_large_image",
    title: "RehabPearls",
    description: "Advanced rehab exam preparation platform.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
        <ConditionalShell>{children}</ConditionalShell>

        {/* Structured Data */}
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
                  logo: "https://rehabpearls.com/logo.png",
                },
                {
                  "@type": "WebSite",
                  url: "https://rehabpearls.com",
                  name: "RehabPearls",
                },
              ],
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXX');`}
        </Script>
      </body>
    </html>
  )
}
