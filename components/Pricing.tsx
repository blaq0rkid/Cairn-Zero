
'use client'

import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe'

export default function Pricing() {
  const handleCheckout = async (setupPriceId: string, recurringPriceId: string, tier: string) => {
    // First create checkout for setup fee
    await createCheckoutSession(setupPriceId, tier, 'payment')
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees. No vendor lock-in. Just certainty.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cairn Lite */}
          <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cairn Lite</h3>
            <p className="text-gray-600 mb-6">Continuity Pings + Zero-Knowledge Index</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$149</span>
                <span className="text-gray-600">setup</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <button
              onClick={() => handleCheckout(STRIPE_PRICES.LITE_SETUP, STRIPE_PRICES.LITE_MONTHLY, 'Cairn Lite')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-6"
            >
              Get Cairn Lite
            </button>

            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Continuity "Succession Ping" checks
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                FIDO2 / YubiKey authentication
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Digital Sprawl Audit workflow
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mandatory Silo Consolidation
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zero-Knowledge model
              </li>
            </ul>
          </div>

          {/* Founder Guard */}
          <div className="border-2 border-gray-900 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
                FLAGSHIP
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Founder Guard</h3>
            <p className="text-gray-600 mb-6">Continuity-in-a-Box</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$4,999</span>
                <span className="text-gray-600">setup</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$149</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <button
              onClick={() => handleCheckout(STRIPE_PRICES.FOUNDER_GUARD_SETUP, STRIPE_PRICES.FOUNDER_GUARD_MONTHLY, 'Founder Guard')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-6"
            >
              Get Founder Guard
            </button>

            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All Cairn Lite features
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apricorn Aegis Secure Key 3NX
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Laser-etched Cairn ID (CZ-XXXX)
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ADA-compliant Braille identification
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Active/Archive state management
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Two-week fulfillment guarantee
              </li>
            </ul>
          </div>

          {/* Legacy Certainty */}
          <div className="border border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Legacy Certainty</h3>
            <p className="text-gray-600 mb-6">Bespoke Succession Logic + High-Touch Kit</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$14,999</span>
                <span className="text-gray-600">setup</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$499</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <a
              href="mailto:hello@mycairnzero.com?subject=Legacy%20Certainty%20Inquiry"
              className="w-full block text-center border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors mb-6"
            >
              Contact Us
            </a>

            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All Founder Guard features
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Bespoke succession logic design
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Multi-successor sequencing
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                High-touch onboarding
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enhanced physical kit
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                White-glove coordination
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-12">
          All tiers include our Transparency Guarantee: No hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
