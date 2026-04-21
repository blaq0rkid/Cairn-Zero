
// File: app/blog/page.tsx
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function BlogPage() {
  const posts = [
    {
      id: 'effdacfc-7354-4662-91f6-96ca6366e1eb',
      title: 'The Founder Immortality Trap',
      excerpt: 'Why founders resist succession planning and how it puts their legacy at risk.',
      date: 'April 2026',
      slug: 'founder-immortality-trap'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Cairn Zero Blog
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Insights on business continuity, succession planning, and closing the gap.
          </p>
          
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {post.excerpt}
                </p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-block px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">
              More articles coming soon. Written by Penny, exploring the intersection of legacy, technology, and certainty.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
