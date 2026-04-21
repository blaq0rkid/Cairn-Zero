
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
              <span className="bg-gray-100 px-3 py-1 rounded-full">Business Continuity</span>
              <span>April 16, 2026</span>
              <span>•</span>
              <span>Aeron Carter, Certainty Strategist</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legacy Certainty: The Ultimate Continuity Solution
            </h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              For high-stakes professionals where failure is not an option, Legacy Certainty provides white-glove succession planning with bespoke logic and multi-key sovereignty.
            </p>

            <h2>Beyond Standard Business Continuity</h2>
            <p>
              Most business continuity solutions are designed for IT disasters—server failures, data breaches, ransomware attacks. But they fundamentally miss the human single point of failure: the founder who holds all the keys.
            </p>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/4PPm3gfSmbx.webp"
                alt="Legacy Certainty multi-key kit with laser-etched Cairn IDs"
                width={800}
                height={400}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                The Legacy Certainty 3-Key Kit provides physical sovereignty with deterministic succession logic
              </p>
            </div>

            <h2>The Legacy Certainty Difference</h2>
            <p>
              Legacy Certainty is not a product. It's a comprehensive succession guarantee built on three pillars:
            </p>

            <ul>
              <li><strong>Bespoke Succession Logic:</strong> Multi-successor sequencing with contingencies and escalation paths designed for your specific business structure</li>
              <li><strong>Physical Sovereignty:</strong> Three hardware keys with laser-etched Cairn IDs and ADA-compliant Braille</li>
              <li><strong>White-Glove Coordination:</strong> Hands-on onboarding ensuring successors can execute without you</li>
            </ul>

            <h2>Who Needs Legacy Certainty?</h2>
            <p>
              Legacy Certainty is designed for professionals where business continuity is a fiduciary obligation:
            </p>

            <ul>
              <li>Law firms managing sensitive client matters requiring seamless partner transition</li>
              <li>Medical practices with long-term patient care obligations</li>
              <li>Financial advisors with fiduciary duty to clients during unexpected succession</li>
              <li>Family businesses transitioning across generations</li>
              <li>Solo practitioners with high-value client relationships</li>
            </ul>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/D1cKS7pA9gv.webp"
                alt="Sequential succession management diagram"
                width={800}
                height={450}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Sequential succession prevents "succession wars" through deterministic access protocols
              </p>
            </div>

            <h2>The 90-Day Suspension Grace Period</h2>
            <p>
              Unlike standard services that immediately suspend accounts when payments fail, Legacy Certainty treats your vault as a protected high-value asset. If subscription payment fails, you enter a 90-day "Suspension Grace" where:
            </p>

            <ul>
              <li>Your vault remains protected and will NOT accidentally release due to expired credit cards</li>
              <li>The Cairn Guardian protocol programmatically "rewraps" your vault to prevent administrative triggers</li>
              <li>You have time to resolve payment issues without risking premature succession events</li>
            </ul>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/d-vfzMa3XDo.webp"
                alt="Cairn Guardian protocol rewrap mechanism"
                width={800}
                height={450}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                The Cairn Guardian ensures vault protection during payment grace periods
              </p>
            </div>

            <h2>Fiduciary Safe Harbor</h2>
            <p>
              Legacy Certainty provides legal protection through the Fiduciary Safe Harbor framework. By maintaining:
            </p>

            <ol>
              <li>Current subscription status</li>
              <li>Geographic separation certification (7-day attestation)</li>
              <li>Active heartbeat signals</li>
            </ol>

            <p>
              You demonstrate due diligence in business continuity planning, protecting you from claims of negligence in succession preparation.
            </p>

            <h2>The Investment</h2>
            <p>
              Legacy Certainty requires a $14,999 setup fee and $499/month maintenance. This includes:
            </p>

            <ul>
              <li>Comprehensive succession audit and planning session</li>
              <li>Custom multi-key hardware kit with laser engraving</li>
              <li>Bespoke succession logic implementation</li>
              <li>Ongoing succession simulation testing</li>
              <li>Priority support and coordination</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-gray-900 p-6 my-8">
              <p className="font-semibold mb-2">Is Legacy Certainty right for you?</p>
              <p className="text-gray-700 mb-4">
                If your business represents a fiduciary obligation to clients, patients, or family—and failure to plan succession would breach that duty—Legacy Certainty provides the certainty you need.
              </p>
              <Link href="/#pricing" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Contact Us About Legacy Certainty
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
