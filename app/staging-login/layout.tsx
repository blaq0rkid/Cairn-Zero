
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staging Access - Cairn Zero (Internal)',
  description: 'Internal testing environment - not for public use',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
}

export default function StagingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Additional meta tags for extra SEO blocking */}
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="googlebot" content="noindex, nofollow" />
      <meta name="bingbot" content="noindex, nofollow" />
      {children}
    </>
  )
}
