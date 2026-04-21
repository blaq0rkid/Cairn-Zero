export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Succession Bridge
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zero-Knowledge Sovereignty meets automated certainty. Your business doesn't die with you—it transfers with precision.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Zero-Knowledge Architecture</h3>
            <p className="text-gray-600">
              We provide the infrastructure for continuity, but we have <strong>zero access</strong> to your private data. You retain 100% control of your encryption keys.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Succession Triggers</h3>
            <p className="text-gray-600">
              Continuity "Pings" monitor your status. When triggers are met, the "keys to the kingdom" are automatically made available to your designated successors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Physical Sovereignty</h3>
            <p className="text-gray-600">
              Founder Guard includes PIN-pad hardware (Apricorn Aegis Secure Key 3NX) with laser-etched Cairn ID and ADA-compliant Braille for emergency identification.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">The Cairn Protocol</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Active/Archive Dual-Key System</h4>
              <p className="text-gray-300 mb-4">
                Your <strong>Active Key</strong> is for daily access. Your <strong>Archive Key</strong> is stored separately (vault, legal counsel) for successor access—closing the "Single Point of Failure" loop.
              </p>
              <p className="text-sm text-gray-400">
                7-Day Handoff Rule: Within 7 days of receiving hardware, the Archive key must be transferred to a separate geographic location.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Mandatory Silo Consolidation</h4>
              <p className="text-gray-300 mb-4">
                Export all browser-stored passwords (Chrome, Safari, Firefox, Edge) into a single <strong>Master Key Directory</strong> stored on both your Active and Archive keys.
              </p>
              <p className="text-sm text-gray-400">
                Purge browser silos after migration to eliminate split-brain credential storage and reduce post-incident ambiguity.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="#pricing"
            className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold text-lg"
          >
            Secure Your Legacy
          </a>
        </div>
      </div>
    </section>
  )
}
