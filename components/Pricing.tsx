
import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Super Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hardware + Vigilance Model. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Cairn Lite */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cairn Lite</h3>
            <p className="text-gray-600 mb-6 flex-grow">Essential succession certainty</p>
            
            <div className="mb-4">
              <div className="flex items-baseline mb-1">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="ml-2 text-gray-600">setup</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">$99</span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
            </div>

            <ul className="mb-8 flex flex-col gap-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>YubiKey hardware anchor</span>
              </li>
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
                <span>Succession Playbook</span>
              </li>
            </ul>

            <a
              href="https://buy.stripe.com/test_4gw6oE0NWgYtf96144"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
            >
              Get Started
            </a>
          </div>

          {/* Founder Guard */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-8 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Founder Guard</h3>
            <p className="text-gray-600 mb-6 flex-grow">Advanced protection</p>
            
            <div className="mb-4">
              <div className="flex items-baseline mb-1">
                <span className="text-3xl font-bold text-gray-900">$4,999</span>
                <span className="ml-2 text-gray-600">setup</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
            </div>

            <ul className="mb-8 flex flex-col gap-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Apricorn Aegis Secure Key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Everything in Lite, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Multi-party succession</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Secondary backup keys</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Priority support</span>
              </li>
            </ul>

            <a
              href="https://buy.stripe.com/test_fZe4gw8gocIdfYAfYZ"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
            >
              Get Started
            </a>
          </div>

          {/* Legacy Certainty */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Legacy Certainty</h3>
            <p className="text-gray-600 mb-6 flex-grow">Enterprise solutions</p>
            
            <div className="mb-4">
              <div className="flex items-baseline mb-1">
                <span className="text-3xl font-bold text-gray-900">Custom</span>
              </div>
              <p className="text-sm text-gray-600">Bespoke Pricing</p>
            </div>

            <ul className="mb-8 flex flex-col gap-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Everything in Founder Guard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>White-glove onboarding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Custom workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Dedicated support team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Legal coordination</span>
              </li>
            </ul>

            <a
              href="mailto:admin@mycairnzero.com?subject=Legacy%20Certainty%20Inquiry"
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-auto"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold">
            View detailed pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
