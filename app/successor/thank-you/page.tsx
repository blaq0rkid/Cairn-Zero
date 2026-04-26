
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SuccessorThankYou() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSimulation = searchParams?.get('simulation') === 'true'

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      if (isSimulation) {
        router.push('/successor?welcome=true&simulation=true')
      } else {
        router.push('/successor/login?welcome=true')
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isSimulation])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Thank You
            </h1>
            <p className="text-lg text-slate-600">
              Your acceptance has been recorded
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-3">What happens next:</h2>
            <ul className="flex flex-col gap-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your legal acceptance has been timestamped and recorded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>The founder has been notified of your acceptance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your successor status is now active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>You can now access your successor dashboard</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> You are now a critical link in the Sovereignty Chain. Your role is to maintain business continuity according to the founder's documented instructions.
            </p>
          </div>

          <button
            onClick={() => {
              if (isSimulation) {
                router.push('/successor?welcome=true&simulation=true')
              } else {
                router.push('/successor/login?welcome=true')
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
            <ArrowRight size={20} />
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            Redirecting automatically in 5 seconds...
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Cairn Zero - Certainty. Sovereignty. Continuity.
        </p>
      </div>
    </div>
  )
}
