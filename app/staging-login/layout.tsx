
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staging Access - Cairn Zero',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function StagingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
