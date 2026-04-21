
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
              <span className="bg-gray-100 px-3 py-1 rounded-full">Security</span>
              <span>April 15, 2026</span>
              <span>•</span>
              <span>Aeron Carter, Certainty Strategist</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              7 Mistakes You're Making with Cybersecurity
            </h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Small business owners often believe their cybersecurity is adequate—until they discover these critical blind spots that leave them vulnerable.
            </p>

            <h2>Mistake #1: Treating Passwords as IT Problems</h2>
            <p>
              Most founders think password management is an IT issue. But when you're the only person who knows where the AWS credentials are stored, or which email account controls your domain registration, you've created a business continuity crisis waiting to happen.
            </p>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/d-vfzMa3XDo.webp"
                alt="Scattered password silos across multiple browsers and devices"
                width={800}
                height={400}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Browser-stored passwords create fragmented silos that become unrecoverable during succession
              </p>
            </div>

            <p>
              <strong>The Fix:</strong> Password management is a succession problem first, security problem second. Your team needs access after you're unavailable—not your passwords while you're here.
            </p>

            <h2>Mistake #2: Assuming "Strong Passwords" Solve Security</h2>
            <p>
              A 24-character randomly generated password is useless if it's stored in Chrome's password manager and you're the only person who has the laptop login.
            </p>

            <p>
              <strong>The Fix:</strong> Physical sovereignty beats password strength. Hardware keys with PIN-pad entry ensure no cloud provider, browser sync, or remote attacker can compromise your access—and designated successors can reach them when needed.
            </p>

            <h2>Mistake #3: No "Test Run" of Your Succession Plan</h2>
            <p>
              You have backups. You have a password manager. You even wrote down some credentials for your business partner. But have you ever tested whether they can actually access the systems when you're not available to help?
            </p>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/TU7YuumZwcm.webp"
                alt="Succession simulation workflow showing testing without live access"
                width={800}
                height={450}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Dry run succession simulations validate your plan without exposing real credentials
              </p>
            </div>

            <p>
              <strong>The Fix:</strong> Run succession simulations regularly. Cairn Zero's "Test My Plan" feature lets you validate notification delivery, access eligibility, and handoff mechanics without exposing real credentials.
            </p>

            <h2>Mistake #4: Ignoring the "Heartbeat" Problem</h2>
            <p>
              How does your business know you're unavailable? Most founders assume it's obvious—but by the time it's obvious, critical systems have been locked, bills have gone unpaid, and customers are leaving.
            </p>

            <p>
              <strong>The Fix:</strong> Implement automated continuity pings. Cairn Zero sends regular "heartbeat" checks via email/SMS. Missing the check triggers succession protocols before business operations stall.
            </p>

            <h2>Mistake #5: Simultaneous Successor Access</h2>
            <p>
              Giving multiple people access "just in case" creates succession wars. Who's authorized to make decisions? Who represents the business to clients? Simultaneous access causes chaos, not continuity.
            </p>

            <div className="my-8">
              <Image
                src="https://cdn.marblism.com/tCf66eZ1AYO.webp"
                alt="Sequential succession preventing conflicts"
                width={800}
                height={450}
                className="rounded-lg"
                unoptimized
              />
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                Sequential succession maintains clear authority during handoff
              </p>
            </div>

            <p>
              <strong>The Fix:</strong> Sequential succession. Successor 1 gets a 7-day window to respond. Only after they fail to claim access does Successor 2 get notified. This prevents conflicts and maintains clear authority.
            </p>

            <h2>Mistake #6: Storing Recovery Seeds in "Safe Places"</h2>
            <p>
              Safe deposit boxes sound secure—until your executor needs a death certificate to access them. And by then, your domain has expired, your hosting shut down, and your clients have moved on.
            </p>

            <p>
              <strong>The Fix:</strong> Time-based triggers, not death-based triggers. Your succession plan activates when you fail to respond to heartbeat checks, not when someone proves you're deceased.
            </p>

            <h2>Mistake #7: Believing "My Partner Knows Everything"</h2>
            <p>
              Your partner might know the business. But do they know:
            </p>

            <ul>
              <li>Which email account controls DNS?</li>
              <li>Where the Stripe account password is stored?</li>
              <li>How to access the backup encryption keys?</li>
              <li>Which accounts require 2FA and where those devices are?</li>
            </ul>

            <p>
              <strong>The Fix:</strong> Mandatory silo consolidation. Create a Master Key Directory—one encrypted, hardware-secured index of every critical system, account, and credential your successor needs.
            </p>

            <div className="bg-gray-50 border-l-4 border-gray-900 p-6 my-8">
              <p className="font-semibold mb-2">Ready to fix these mistakes?</p>
              <p className="text-gray-700 mb-4">
                Cairn Zero's Zero-Knowledge Sovereignty architecture ensures your security doesn't create succession gaps.
              </p>
              <Link href="/#pricing" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Explore Founder Guard
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
