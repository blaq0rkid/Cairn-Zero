
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Founder Immortality Trap: Why Your Business Continuity Plan Is Failing",
      excerpt: "Most founders operate under a dangerous assumption: 'I'll always be here to handle it.' This cognitive bias—what we call the Founder Immortality Trap—creates a systemic vulnerability that can destroy decades of work in days.",
      date: "April 16, 2026",
      author: "Aeron Carter, blog writer",
      category: "Business Continuity",
      slug: "founder-immortality-trap",
      thumbnail: "/api/placeholder/400/250"
    }
  ]

  return (
    <>
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Cairn Zero Insights</h1>
          <p className="text-xl text-gray-600 mb-12">Thoughts on business continuity, succession planning, and Zero-Knowledge sovereignty.</p>
          
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                <Image
                  src={post.thumbnail}
                  alt={`Thumbnail for ${post.title}`}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-gray-700">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-gray-900 font-semibold hover:text-gray-700"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 italic">More articles coming soon from our team.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
