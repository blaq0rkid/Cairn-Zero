export default function Problem() {
  return (
    <section id="problem" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          The Founder Immortality Trap
        </h2>
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xl font-bold">L5</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Level 5 Systemic Risk</h3>
                <p className="text-gray-600">
                  Browser-stored passwords and unindexed digital assets represent critical vulnerabilities. When a founder becomes unavailable, essential business access dies with them.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-xl font-bold">DS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Sprawl</h3>
                <p className="text-gray-600">
                  Critical business knowledge scattered across dozens of accounts, services, and devices. No centralized continuity plan for successors.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xl font-bold">SG</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Succession Gap</h3>
                <p className="text-gray-600">
                  The dangerous window between a founder's incapacitation and a successor's ability to access critical business infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
