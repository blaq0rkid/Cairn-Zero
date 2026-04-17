export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Choose Your Certainty Level
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cairn Lite</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Continuity pings and automated succession triggers</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>YubiKey/FIDO2 hardware authentication</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Digital Sprawl Audit tools</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Cloud-based encrypted storage</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
              Start with Lite
            </button>
          </div>
          
          <div className="bg-gray-900 text-white p-8 rounded-lg border-4 border-gray-900 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              FLAGSHIP
            </div>
            <h3 className="text-2xl font-bold mb-4">Founder Guard</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$4,999</span>
              <span className="text-gray-300"> one-time</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Everything in Cairn Lite</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Continuity-in-a-Box: Apricorn Aegis Secure Key 3NX</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span>Unique etched Cairn ID (CZ-XXXX format)</span>
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
                <span>Physical sovereignty and offline redundancy</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors font-bold">
              Secure Founder Guard
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cairn Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Custom</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Everything in Founder Guard</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Multi-founder succession planning</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Institutional-grade security protocols</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Custom integration with existing systems</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>Dedicated support and onboarding</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
