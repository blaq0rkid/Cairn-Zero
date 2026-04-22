
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Super Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hardware + Vigilance Model: Separate the physical anchor from digital continuity. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cairn Lite */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cairn Lite</h3>
              <p className="text-gray-600 mb-6">Essential succession certainty for solo founders</p>
              
              {/* Setup Fee */}
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="ml-2 text-gray-600">one-time</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">Initial Implementation Fee</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Enterprise-grade hardware security key (YubiKey)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Initial provisioning and configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Succession Playbook access</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="ml-2 text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">Vigilance & Continuity Fee</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Zero-Knowledge monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Automated succession triggers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Secure infrastructure hosting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Ongoing succession support</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://buy.stripe.com/test_4gw6oE0NWgYtf96144"
                className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
              <p className="text-xs text-gray-500 text-center mt-4">Month-to-month billing. Cancel anytime.</p>
            </div>
          </div>

          {/* Founder Guard */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
              POPULAR
            </div>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Founder Guard</h3>
              <p className="text-gray-600 mb-6">Advanced protection with enterprise hardware</p>
              
              {/* Setup Fee */}
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">$4,999</span>
                  <span className="ml-2 text-gray-600">one-time</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">Initial Implementation Fee</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Apricorn Aegis Secure Key 3NX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Multi-party succession support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Secondary backup keys</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="ml-2 text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">Vigilance & Continuity Fee</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Everything in Cairn Lite, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Priority succession support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Advanced trigger customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Multiple successor slots</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://buy.stripe.com/test_fZe4gw8gocIdfYAfYZ"
                className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
              <p className="text-xs text-gray-500 text-center mt-4">Month-to-month billing. Cancel anytime.</p>
            </div>
          </div>

          {/* Legacy Certainty */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Legacy Certainty</h3>
              <p className="text-gray-600 mb-6">Custom enterprise solutions for complex succession</p>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm text-gray-600 font-semibold mb-4">Bespoke Pricing</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Everything in Founder Guard, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>White-glove onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Custom succession workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Dedicated support team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Multi-vault architecture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Legal coordination support</span>
                  </li>
                </ul>
              </div>

              <a
                href="mailto:admin@mycairnzero.com?subject=Legacy%20Certainty%20Inquiry"
                className="block w-full bg-gray-900 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Transparency Guarantee */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Transparency Guarantee</h3>
          <p className="text-gray-700 text-lg">
            No hidden fees. What you see is what you pay. Month-to-month billing for all tiers. Cancel anytime.
          </p>
        </div>

        {/* Key Concepts */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Understanding the Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">Hardware + Vigilance Model</h4>
              <p className="text-gray-600">
                We separate the physical security hardware (your anchor) from the digital monitoring service (our vigilance). 
                You own the hardware. We maintain the bridge.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">Zero-Knowledge Sovereignty</h4>
              <p className="text-gray-600">
                You retain 100% control of your data. We have zero access to your secured information. 
                Your keys, your control, your certainty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
