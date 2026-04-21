
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPost() {
  return (
    <>
      <Navigation />
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/guidepost" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to The Guidepost
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full">Company Updates</span>
              <span>April 11, 2026</span>
              <span>•</span>
              <span>Aeron Carter, Certainty Strategist</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Website Branding & Sovereignty Updates: Reflecting Our Zero-Knowledge Commitment
            </h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              We've updated our website and branding to better reflect our core principle: Zero-Knowledge Sovereignty means we never have access to your data—and our visual identity now reinforces that commitment.
            </p>

            <h2>The Cairn Symbol: A Marker in the Wilderness</h2>
            <p>
              Our new logo represents the essence of what we do. A cairn is a carefully stacked pile of stones used as a trail marker—a guide that helps travelers find their way even in unfamiliar territory.
            </p>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/D3ZCjn_-PZY.webp"
                alt="Cairn Zero's minimalist cairn logo design"
                width={800}
                height={400}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Our cairn symbol represents guidance and certainty in business continuity
              </p>
            </div>

            <p>
              Just as a cairn marks the path when visibility is low, Cairn Zero marks the succession path when founders are unavailable. We don't control the journey—we simply ensure the trail is clear.
            </p>

            <h2>Nomenclature Updates: Active/Archive Protocol</h2>
            <p>
              We've deprecated the "Master/Shadow" terminology in favor of clearer, more precise language:
            </p>

            <ul>
              <li><strong>Active:</strong> Your primary operational key (formerly "Master")</li>
              <li><strong>Archive:</strong> Your successor's key (formerly "Shadow")</li>
            </ul>

            <p>
              This change reflects our commitment to clarity in high-stakes scenarios. When your successor is accessing the system during an emergency, terminology must be instantly understandable—not technical jargon requiring interpretation.
            </p>

            <h2>Visual Identity: Grounded and Minimalist</h2>
            <p>
              Our new color palette reflects the "Certainty-Only" principle:
            </p>

            <ul>
              <li><strong>Neutrals (White/Black/Gray):</strong> Professional, timeless, accessible</li>
              <li><strong>Earthy Tones:</strong> Grounded, physical, tangible—like the hardware we provide</li>
              <li><strong>High Contrast:</strong> WCAG 2.1 AA compliant for accessibility across all ages</li>
            </ul>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/d-vfzMa3XDo.webp"
                alt="Cairn Zero's minimalist color palette and design system"
                width={800}
                height={450}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Our design system prioritizes clarity and accessibility over decorative elements
              </p>
            </div>

            <h2>The "Level 5 Systemic Risk" Classification</h2>
            <p>
              We've formally classified browser-stored passwords and unindexed digital assets as "Level 5 Systemic Risk"—the highest tier of succession vulnerability.
            </p>

            <p>
              This classification appears throughout our updated site, documentation, and legal framework. It's not marketing language—it's a technical designation that reflects the real-world impact of failing to consolidate critical access points.
            </p>

            <h2>Mandatory Protocols: No Longer Optional</h2>
            <p>
              Our updated messaging emphasizes two non-negotiable components:
            </p>

            <ol>
              <li><strong>Digital Sprawl Audit:</strong> Systematically identify every system where your absence blocks operations</li>
              <li><strong>Mandatory Silo Consolidation:</strong> Aggregate scattered credentials into a single, encrypted, hardware-secured directory</li>
            </ol>

            <p>
              These aren't "recommended practices"—they're the minimum viable approach to closing the succession gap.
            </p>

            <h2>Transparency in Pricing</h2>
            <p>
              We've made our pricing structure more explicit on the updated website:
            </p>

            <ul>
              <li><strong>Cairn Lite:</strong> $149 setup + $99/month</li>
              <li><strong>Founder Guard:</strong> $4,999 setup + $149/month</li>
              <li><strong>Legacy Certainty:</strong> $14,999 setup + $499/month</li>
            </ul>

            <p>
              No hidden fees. No surprise charges. Cancel anytime. This transparency aligns with our zero-knowledge commitment—we're upfront about everything except your data, which we never see.
            </p>

            <h2>What Hasn't Changed</h2>
            <p>
              While our branding evolves, our core principle remains absolute: <strong>Zero-Knowledge Sovereignty.</strong>
            </p>

            <p>
              We provide the tools, enforce the discipline, and ensure the bridge—but we never access your data. The updated website reinforces this at every touchpoint, from legal documentation to product descriptions.
            </p>

            <div className="bg-gray-50 border-l-4 border-gray-900 p-6 my-8">
              <p className="font-semibold mb-2">Experience the Updated Site</p>
              <p className="text-gray-700 mb-4">
                Explore our refreshed website and see how our branding reflects our commitment to certainty and sovereignty.
              </p>
              <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Explore Cairn Zero
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
