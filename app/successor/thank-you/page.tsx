
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SuccessorThankYou() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const isSimulation = searchParams?.get('simulation') === 'true'
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleContinue()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleContinue = () => {
    if (isSimulation) {
      router.push('/successor?simulation=true')
    } else {
      router.push('/successor/login?welcome=true')
    }
  }

  const handleExitSimulation = async () => {
    // Clear any simulation data
    sessionStorage.clear()
    // Sign out if authenticated
    await supabase.auth.signOut()
    router.push('/claim')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Succession Confirmed
            </h1>
            <p className="text-lg text-slate-600">
              You are now the designated successor for this vault
            </p>
          </div>

          {/* Status Updates */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-3">What just happened:</h2>
            <ul className="flex flex-col gap-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span>Your legal acceptance has been timestamped and recorded</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span>Your successor status has been activated</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span>The founder has been notified of your acceptance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span>The Sovereign Dashboard is now unlocked</span>
              </li>
            </ul>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-700">
              <strong>What's Next:</strong> You now have access to the Guidepost Index - the information and instructions left by the founder for business continuity.
            </p>
          </div>

          {/* Simulation Notice */}
          {isSimulation && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Simulation Mode Active:</strong> You are testing the succession flow with a demonstration key.
              </p>
              <button
                onClick={handleExitSimulation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <LogOut size={18} />
                Exit Simulation
              </button>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Continue to Sovereign Dashboard
            <ArrowRight size={24} />
          </button>

          {/* Auto-redirect Notice */}
          <p className="text-center text-sm text-slate-500 mt-4">
            Redirecting automatically in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Cairn Zero - Certainty. Sovereignty. Continuity.
        </p>
      </div>
    </div>
  )
}
