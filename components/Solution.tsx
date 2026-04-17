export default function Solution() {
  return (
    <section id="solution" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Zero-Knowledge Sovereignty
        </h2>
        <div className="flex flex-col gap-6 mb-12">
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Succession Bridge</h3>
            <p className="text-gray-600 mb-4">
              Cairn Zero creates an automated bridge between your active business operations and designated successors. We provide the infrastructure, not the access.
            </p>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Continuity Pings:</strong> Automated check-ins ensure the bridge activates only when needed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Active/Archive Protocol:</strong> Your data remains encrypted and inaccessible until succession triggers activate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Physical Sovereignty:</strong> Hardware-based security with Braille-integrated Cairn IDs for emergency access</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">The Cairn Zero Guarantee</h3>
            <p className="text-gray-300 mb-4">
              We maintain 100% client data privacy. You control the keys, we provide the vault. Zero-knowledge architecture ensures we can never access your encrypted data.
            </p>
            <p className="text-gray-300">
              When the time comes, your successors receive the keys—not from us, but from the system you designed.
            </p>
          </div>
        </div>
        <div className="text-center">
          <a 
            href="#pricing"
            className="inline-block px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded hover:bg-gray-800 transition-colors"
          >
            Build Your Bridge
          </a>
        </div>
      </div>
    </section>
  )
}
