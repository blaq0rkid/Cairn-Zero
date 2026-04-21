export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Founder Immortality Trap
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              The dangerous belief that "I'll always be here to handle it."
            </p>
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Level 5 Systemic Risk</h3>
                <p className="text-gray-700">
                  Browser-stored passwords and unindexed digital assets create hidden credential "silos" that become unrecoverable at the exact moment a successor needs them most.
                </p>
              </div>
              <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded">
                <h3 className="font-bold text-gray-900 mb-2">The Succession Gap</h3>
                <p className="text-gray-700">
                  The period between a founder's incapacity and a successor's assumption of control—where businesses don't pause, they degrade hour by hour until collapse.
                </p>
              </div>
              <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded">
                <h3 className="font-bold text-gray-900 mb-2">The Business Death Spiral</h3>
                <p className="text-gray-700">
                  Billing fails. Payroll stalls. DNS can't be updated. Bank accounts remain frozen. Vendors shut off services. Customers churn. The business doesn't "pause"—it dies.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Succession Failure Scenario</h3>
            <p className="text-gray-300 mb-4">
              The Founder is incapacitated. The team can access the laptop, but the passwords are trapped in a browser profile that requires:
            </p>
            <ul className="flex flex-col gap-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-red-400">✗</span>
                <span>An unknown OS login password</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✗</span>
                <span>An unknown browser profile passcode</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✗</span>
                <span>A missing synced device for 2FA</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✗</span>
                <span>An expiring authentication prompt</span>
              </li>
            </ul>
            <p className="text-amber-400 font-bold mt-6">
              Fragmented browser data is the Succession Gap in its most lethal form.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
