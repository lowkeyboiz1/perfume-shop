import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import { EnhancedHeader } from "@/components/enhanced-header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Modern Store",
  description: "A premium shopping experience",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <EnhancedHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
