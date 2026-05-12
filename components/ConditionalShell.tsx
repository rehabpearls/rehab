"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LeadPopup from "@/components/LeadPopup"

const NO_HEADER_PATHS = ["/login", "/register", "/auth"]
const NO_FOOTER_PATHS = ["/login", "/register", "/auth",]

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideHeader = NO_HEADER_PATHS.some(p => pathname.startsWith(p))
  const hideFooter = NO_FOOTER_PATHS.some(p => pathname.startsWith(p))

  return (
    <>
      {!hideHeader && <Header />}
      <main className="min-h-screen relative">
        {children}
      </main>
      {!hideFooter && <LeadPopup />}
      {!hideFooter && <Footer />}
    </>
  )
}
