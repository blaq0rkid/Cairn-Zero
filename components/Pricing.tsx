
// File: components/Pricing.tsx
'use client'

import { STRIPE_PRICES, createCheckoutSession } from '@/lib/stripe'

export default function Pricing() {
  const handleLiteCheckout = async () => {
    await createCheckoutSession(STRIPE_PRICES.LITE_SETUP, 'lite', 'payment')
  }

  const handleFounderGuardCheckout = async () => {
    await createCheckoutSession(STRIPE_PRICES.FOUNDER_GUARD_SETUP, 'founder_guard', 'payment')
  }

  const handleLegacyCertaintyContact = () => {
    window.location.href = 'mailto:admin@mycairnzero.com?subject=Legacy Certainty Inquiry'
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Choose Your Certainty Level
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Transparent pricing with the "Hardware + Vigilance" model. No hidden fees.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cairn Lite */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cairn Lite</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-gray-900">$149</span>
              <span className="text-gray-600"> one-time</span>
            </div>
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">$99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Setup Fee:</strong> $149 (one-time) — FIDO2/YubiKey + initial provisioning
              </p>
              <p className="text-sm text-gray-700">
                <strong>Vigilance Fee:</strong> $99/month — Zero-knowledge monitoring & succession triggers
              </p>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Continuity "Succession Ping" checks</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>FIDO2/YubiKey authentication support</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Digital Sprawl Audit workflow</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mandatory Silo Consolidation prompts</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Zero-knowledge architecture</span>
              </li>
            </ul>
            <button 
              onClick={handleLiteCheckout}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Get Cairn Lite
            </button>
          </div>
          
          {/* Founder Guard */}
          <div className="bg-gray-900 text-white p-8 rounded-lg border-4 border-gray-900 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              FLAGSHIP
            </div>
            <h3 className="text-2xl font-bold mb-4">Founder Guard</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold">$4,999</span>
              <span className="text-gray-300"> one-time</span>
            </div>
            <div className="mb-6">
              <span className="text-2xl font-bold">$149</span>
              <span className="text-gray-300">/year</span>
            </div>
            <div className="mb-6 p-4 bg-gray-800 rounded">
              <p className="text-sm text-gray-300 mb-2">
                <strong>Setup Fee:</strong> $4,999 — Continuity-in-a-Box hardware + setup
              </p>
              <p className="text-sm text-gray-300">
                <strong>Annual Maintenance:</strong> $149/year
              </p>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Everything in Cairn Lite</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Apricorn Aegis Secure Key 3NX hardware</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Etched Cairn ID (CZ-XXXX format)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>ADA-compliant Braille identification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Two-week fulfillment guarantee</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Physical sovereignty via PIN-pad device</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Active/Archive dual-key protocol</span>
              </li>
            </ul>
            <button 
              onClick={handleFounderGuardCheckout}
              className="w-full px-6 py-3 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors font-bold"
            >
              Get Founder Guard
            </button>
          </div>
          
          {/* Legacy Certainty */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Legacy Certainty</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-gray-900">$14,999</span>
              <span className="text-gray-600"> one-time</span>
            </div>
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">$499</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded">
              Concierge continuity for high-stakes professionals. Contact for custom quote.
            </p>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Everything in Founder Guard</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Bespoke succession logic design</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Multi-successor sequencing</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Premium hardware package (3 keys)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>50-year durability guarantee</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>White-glove onboarding</span>
              </li>
            </ul>
            <button 
              onClick={handleLegacyCertaintyContact}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <strong>Transparency Guarantee:</strong> No hidden fees. Month-to-month billing for Cairn Lite. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
