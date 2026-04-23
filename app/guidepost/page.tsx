
import Link from 'next/link'
import Image from 'next/image'

export default function GuidepostPage() {
  const posts = [
    {
      id: '10-reasons-protection-plan-will-fail',
      title: '10 Reasons Your Protection Plan Will Fail',
      excerpt: 'Security is not just about keeping people out; it\'s about letting the right people in when it matters most. Close the gap with Zero-Knowledge Sovereignty.',
      date: 'April 23, 2026',
      author: 'Aeron Carter',
      slug: '10-reasons-protection-plan-will-fail',
      thumbnail: 'https://cdn.marblism.com/iMugfe5Nb5G.webp'
    },
    {
      id: '7-mistakes-cybersecurity',
      title: '7 Mistakes You\'re Making with Cybersecurity (And How to Fix Them)',
      excerpt: 'Small business security fails when critical access stay trapped in one person. Fix these seven gaps to reduce risk with Zero-Knowledge Sovereignty.',
      date: 'April 15, 2026',
      author: 'Aeron Carter',
      slug: '7-mistakes-cybersecurity',
      thumbnail: 'https://cdn.marblism.com/d-vfzMa3XDo.webp'
    },
    {
      id: 'business-asset-protection-security-secrets',
      title: 'Business Asset Protection Security Secrets: How to Pass the Keys to the Kingdom Without Giving Up Control',
      excerpt: 'If your access lives only with you, your business is exposed. Learn how to pass the keys without giving up control or sovereignty.',
      date: 'April 23, 2026',
      author: 'Aeron Carter',
      slug: 'business-asset-protection-security-secrets',
      thumbnail: 'https://cdn.marblism.com/D3ZCjn_-PZY.webp'
    },
    {
      id: 'founder-identity-ai-deepfakes',
      title: 'Founder Identity Matters: Why AI Deepfakes Are the New Cyber Threat to Business Continuity',
      excerpt: 'If founder identity is your final approval layer, AI deepfakes are an operational threat. Reduce risk by separating authority and consolidating silos.',
      date: 'April 16, 2026',
      author: 'Aeron Carter',
      slug: 'founder-identity-ai-deepfakes',
      thumbnail: 'https://cdn.marblism.com/IeWvsmYgiT3.webp'
    },
    {
      id: 'founder-immortality-trap',
      title: 'The Founder Immortality Trap',
      excerpt: 'If your business only operates when you are available, it is exposed. This trap turns private knowledge into a single point of operational failure.',
      date: 'April 21, 2026',
      author: 'Aeron Carter',
      slug: 'founder-immortality-trap',
      thumbnail: 'https://cdn.marblism.com/uOEP4NQAY4G.webp'
    },
    {
      id: 'founders-guide-endpoint-security',
      title: 'The Founder\'s Guide to Endpoint Security for Business: End the Single Point of Failure',
      excerpt: 'Endpoint security does not solve succession risk. You must separate daily access from continuity access and build a controlled handoff model.',
      date: 'April 23, 2026',
      author: 'Aeron Carter',
      slug: 'founders-guide-endpoint-security',
      thumbnail: 'https://cdn.marblism.com/Os-ivmzZMAh.webp'
    },
    {
      id: 'legacy-certainty-ultimate-continuity',
      title: 'Legacy Certainty: The Ultimate Continuity Solution for High-Stakes Professionals',
      excerpt: 'High-stakes professionals cannot leave continuity to memory or goodwill. Cairn Zero closes the succession gap by separating Active and Archive systems.',
      date: 'April 21, 2026',
      author: 'Aeron Carter',
      slug: 'legacy-certainty-ultimate-continuity',
      thumbnail: 'https://cdn.marblism.com/zbQ5RjHePxD.webp'
    },
    {
      id: 'proactive-guide-it-security',
      title: 'The Proactive Guide to IT Security',
      excerpt: 'Stop reacting to threats and start building a security posture that anticipates problems before they happen.',
      date: 'March 30, 2026',
      author: 'Aeron Carter',
      slug: 'proactive-guide-it-security',
      thumbnail: 'https://cdn.marblism.com/proactive-shield.webp'
    },
    {
      id: 'stop-wasting-time-managed-security',
      title: 'Stop Wasting Time on Complex Managed Security Services: Why You Need Certainty, Not Tooling Sprawl',
      excerpt: 'Small businesses fail when access is trapped with one person. Stop buying more tools if they do not guarantee successor access.',
      date: 'April 23, 2026',
      author: 'Aeron Carter',
      slug: 'stop-wasting-time-managed-security',
      thumbnail: 'https://cdn.marblism.com/i8qWQt2HvgZ.webp'
    },
    {
      id: 'ultimate-guide-it-security',
      title: 'The Ultimate Guide to IT Security for Founders',
      excerpt: 'A comprehensive roadmap to building unbreakable security practices for your growing company.',
      date: 'March 25, 2026',
      author: 'Aeron Carter',
      slug: 'ultimate-guide-it-security',
      thumbnail: 'https://cdn.marblism.com/H_O6LIJb092.webp'
    },
    {
      id: 'website-branding-sovereignty-updates',
      title: 'Draft Layout: Website Branding & Sovereignty Updates',
      excerpt: 'Aligning branding with Zero-Knowledge Sovereignty and the Certainty-Only principle to reduce operational uncertainty for successors.',
      date: 'April 23, 2026',
      author: 'Aeron Carter',
      slug: 'website-branding-sovereignty-updates',
      thumbnail: 'https://cdn.marblism.com/zrH5r56aHOY.webp'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">The Guidepost</h1>
          <p className="text-xl text-gray-600">
            Insights on succession planning, digital sovereignty, and founder continuity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <Link href={`/guidepost/${post.slug}`}>
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>•</span>
                  <span className="truncate">{post.author}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <Link href={`/guidepost/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/guidepost/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 text-white rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest insights on succession planning and digital sovereignty delivered to your inbox.
            </p>
            <form 
              name="newsletter" 
              method="POST" 
              data-netlify="true"
              action="/thank-you"
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="px-4 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
