
// app/guidepost/page.tsx - Updated Blog Index to "The Guidepost"
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function GuidepositPage() {
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
    },
    {
      id: 2,
      title: "Legacy Certainty: The Ultimate Continuity Solution",
      excerpt: "For high-stakes professionals where failure is not an option, Legacy Certainty provides white-glove succession planning with bespoke logic and multi-key sovereignty.",
      date: "April 16, 2026",
      author: "Aeron Carter, blog writer",
      category: "Business Continuity",
      slug: "legacy-certainty-ultimate-continuity",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "7 Mistakes You're Making with Cybersecurity",
      excerpt: "Small business owners often believe their cybersecurity is adequate—until they discover these critical blind spots that leave them vulnerable.",
      date: "April 15, 2026",
      author: "Aeron Carter, blog writer",
      category: "Security",
      slug: "7-mistakes-cybersecurity",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Founder Identity Matters: Why AI Deepfakes Are a Succession Crisis",
      excerpt: "AI-generated deepfakes aren't just a security threat—they're a succession nightmare that can destroy trust in your business continuity plan.",
      date: "April 14, 2026",
      author: "Aeron Carter, blog writer",
      category: "Identity Security",
      slug: "founder-identity-ai-deepfakes",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "The Founder's Guide to Endpoint Security: Why Your Laptop Is Your Biggest Risk",
      excerpt: "Your business doesn't live in the cloud—it lives on your laptop. And if you're the only person who can access it, you've created a single point of failure.",
      date: "April 13, 2026",
      author: "Aeron Carter, blog writer",
      category: "Security",
      slug: "founders-guide-endpoint-security",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "The Proactive Guide to IT Security: Stop Reacting, Start Planning",
      excerpt: "Most businesses approach security reactively—waiting for breaches, scrambling after outages. Proactive security means planning for what happens when you're not there to respond.",
      date: "April 12, 2026",
      author: "Aeron Carter, blog writer",
      category: "Security",
      slug: "proactive-guide-it-security",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 7,
      title: "Website Branding & Sovereignty Updates: Reflecting Our Zero-Knowledge Commitment",
      excerpt: "We've updated our website and branding to better reflect our core principle: Zero-Knowledge Sovereignty means we never have access to your data—and our visual identity now reinforces that commitment.",
      date: "April 11, 2026",
      author: "Aeron Carter, blog writer",
      category: "Company Updates",
      slug: "website-branding-sovereignty-updates",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 8,
      title: "The Ultimate Guide to IT Security: Why Traditional Approaches Fail Founders",
      excerpt: "Traditional IT security focuses on protecting systems from external threats. But for founders, the real vulnerability is internal: what happens when you're not there?",
      date: "April 10, 2026",
      author: "Aeron Carter, blog writer",
      category: "Security",
      slug: "ultimate-guide-it-security",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 9,
      title: "Business Asset Protection Security Secrets: What Insurance Won't Tell You",
      excerpt: "Business insurance covers physical assets, liability, and even key person insurance. But there's one critical asset most policies ignore: access itself.",
      date: "April 9, 2026",
      author: "Aeron Carter, blog writer",
      category: "Asset Protection",
      slug: "business-asset-protection-security-secrets",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 10,
      title: "10 Reasons Your Protection Plan Will Fail (And How to Fix Them)",
      excerpt: "Most founders believe they have a succession plan. But when tested, these plans collapse. Here's why—and how to build plans that actually work.",
      date: "April 8, 2026",
      author: "Aeron Carter, blog writer",
      category: "Business Continuity",
      slug: "10-reasons-protection-plan-will-fail",
      thumbnail: "/api/placeholder/400/250"
    },
    {
      id: 11,
      title: "Stop Wasting Time on Complex Managed Security: Why Simple Sovereignty Wins",
      excerpt: "Managed security providers sell complexity. But for founders, the best security is simple: physical sovereignty, zero-knowledge architecture, and succession-first design.",
      date: "April 7, 2026",
      author: "Aeron Carter, blog writer",
      category: "Security",
      slug: "stop-wasting-time-managed-security",
      thumbnail: "/api/placeholder/400/250"
    }
  ]

  return (
    <>
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">The Guidepost</h1>
          <p className="text-xl text-gray-600 mb-12">Insights on business continuity, succession planning, and Zero-Knowledge sovereignty.</p>
          
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
                    <Link href={`/guidepost/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  
                  <Link 
                    href={`/guidepost/${post.slug}`}
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
        </div>
      </div>
      <Footer />
    </>
  )
}
