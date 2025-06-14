import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Modern Store',
  description: 'A premium shopping experience',
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='antialiased' suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <div className='relative flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
