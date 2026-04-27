
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CheckCircle, Shield, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function SuccessorThankYouPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [successorData, setSuccessorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const isSimulation = searchParams.get('simulation') === 'true'

  useEffect(() => {
    loadSuccessorData()
  }, [])

  const loadSuccessorData = async () => {
    const token = sessionStorage.getItem('successor_token')
    const email = sessionStorage.getItem('successor_email')

//     console.log('Thank You: Checking sessionStorage', { token, email, isSimulation })

    if (!token || !email) {
//       console.log('Thank You: No session data, redirecting')
      router.push('/successor/access')
      return
    }

    const { data: successor, error } = await supabase
      .from('successors')
      .select('*')
      .eq('invitation_token', token)
      .eq('email', email)
      .single()

//     console.log('Thank You: Query result', { successor, error })

    if (error || !successor) {
//       console.log('Thank You: Invalid data')
      sessionStorage.clear()
      router.push('/successor/access')
      return
    }

    setSuccessorData(successor)
    setLoading(false)
  }

  const handleContinue = () => {
    router.push('/successor')
  }

  const handleExitSimulation = () => {
    sessionStorage.clear()
    router.push('/successor/access')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
                alt="Cairn Zero" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-slate-900">Cairn Zero</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Succession Confirmed
              </h1>
              <p className="text-slate-600 text-lg">
                You are now the designated successor for this vault.
              </p>
            </div>

            {isSimulation && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  🧪 Simulation Mode Active
                </p>
                <p className="text-sm text-yellow-800">
                  This is a test environment. Your actions here do not affect live succession plans.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-3">What happens next?</h2>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>Your legal acceptance has been recorded</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>You now have access to the Successor Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>You can view the Guidepost Index left by the founder</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700">
                <strong>Designation Status:</strong> Active<br />
                <strong>Email:</strong> {successorData?.email}<br />
                <strong>Legal Version:</strong> {successorData?.legal_version || 'v1-2026-04-25'}<br />
                <strong>Accepted:</strong> {successorData?.legal_accepted_at ? new Date(successorData.legal_accepted_at).toLocaleString() : 'Just now'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Dashboard
                <ArrowRight size={24} />
              </button>

              {isSimulation && (
                <button
                  onClick={handleExitSimulation}
                  className="w-full px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Exit Simulation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
