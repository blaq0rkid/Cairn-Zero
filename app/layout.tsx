
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cairn Zero - Legacy Certainty for the Digital Age',
  description: 'Zero-knowledge succession planning for founders. Deterministic asset transfer with physical sovereignty and sequential succession protocols.',
  keywords: 'succession planning, business continuity, digital legacy, zero-knowledge, founder succession',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
