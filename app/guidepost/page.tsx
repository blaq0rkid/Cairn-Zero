
import Link from 'next/link'

export default function GuidepostPage() {
  const posts = [
    {
      id: 'understanding-succession-certainty',
      title: 'The Guidepost: Understanding Succession Certainty',
      excerpt: 'Explore the fundamental principles behind Cairn Zero\'s approach to digital legacy and why traditional solutions fall short.',
      date: 'April 20, 2026',
      author: 'Penny',
      slug: 'understanding-succession-certainty'
    },
    {
      id: '10-reasons-protection-plan-will-fail',
      title: '10 Reasons Your Protection Plan Will Fail',
      excerpt: 'Discover the common pitfalls in succession planning that leave founders vulnerable and how to avoid them.',
      date: 'April 18, 2026',
      author: 'Penny',
      slug: '10-reasons-protection-plan-will-fail'
    },
    {
      id: '7-mistakes-cybersecurity',
      title: '7 Critical Cybersecurity Mistakes Founders Make',
      excerpt: 'Learn about the security vulnerabilities that put your business at risk and how to fix them.',
      date: 'April 15, 2026',
      author: 'Penny',
      slug: '7-mistakes-cybersecurity'
    },
    {
      id: 'business-asset-protection-security-secrets',
      title: 'Business Asset Protection: Security Secrets You Need to Know',
      excerpt: 'Uncover the hidden strategies that protect your most valuable business assets from unauthorized access.',
      date: 'April 12, 2026',
      author: 'Penny',
      slug: 'business-asset-protection-security-secrets'
    },
    {
      id: 'founder-identity-ai-deepfakes',
      title: 'Founder Identity in the Age of AI Deepfakes',
      excerpt: 'How artificial intelligence threats are changing the game for founder authentication and what you can do about it.',
      date: 'April 10, 2026',
      author: 'Penny',
      slug: 'founder-identity-ai-deepfakes'
    },
    {
      id: 'founder-immortality-trap',
      title: 'The Founder Immortality Trap',
      excerpt: 'Why the belief that "I\'ll always be here" is the most dangerous assumption in business continuity.',
      date: 'April 8, 2026',
      author: 'Penny',
      slug: 'founder-immortality-trap'
    },
    {
      id: 'founders-guide-endpoint-security',
      title: 'The Founder\'s Guide to Endpoint Security',
      excerpt: 'Practical strategies for securing every device that accesses your critical business systems.',
      date: 'April 5, 2026',
      author: 'Penny',
      slug: 'founders-guide-endpoint-security'
    },
    {
      id: 'legacy-certainty-ultimate-continuity',
      title: 'Legacy Certainty: The Ultimate Business Continuity',
      excerpt: 'Moving beyond backup plans to create true succession certainty for your digital empire.',
      date: 'April 3, 2026',
      author: 'Penny',
      slug: 'legacy-certainty-ultimate-continuity'
    },
    {
      id: 'proactive-guide-it-security',
      title: 'The Proactive Guide to IT Security',
      excerpt: 'Stop reacting to threats and start building a security posture that anticipates problems before they happen.',
      date: 'March 30, 2026',
      author: 'Penny',
      slug: 'proactive-guide-it-security'
    },
    {
      id: 'stop-wasting-time-managed-security',
      title: 'Stop Wasting Time: Why Managed Security Makes Sense',
      excerpt: 'The compelling case for outsourcing security operations so you can focus on building your business.',
      date: 'March 28, 2026',
      author: 'Penny',
      slug: 'stop-wasting-time-managed-security'
    },
    {
      id: 'ultimate-guide-it-security',
      title: 'The Ultimate Guide to IT Security for Founders',
      excerpt: 'A comprehensive roadmap to building unbreakable security practices for your growing company.',
      date: 'March 25, 2026',
      author: 'Penny',
      slug: 'ultimate-guide-it-security'
    },
    {
      id: 'website-branding-sovereignty-updates',
      title: 'Website Branding & Sovereignty Updates',
      excerpt: 'How we\'re evolving the Cairn Zero brand to better reflect our zero-knowledge architecture and founder-first values.',
      date: 'March 22, 2026',
      author: 'Penny',
      slug: 'website-branding-sovereignty-updates'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">The Guidepost</h1>
          <p className="text-xl text-gray-600">
            Insights on succession planning, digital sovereignty, and founder continuity
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>•</span>
                  <span>By {post.author}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  <Link href={`/guidepost/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
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
