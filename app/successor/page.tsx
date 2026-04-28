
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Unlock, Shield, AlertCircle } from 'lucide-react'
import SuccessorPortal from '@/components/SuccessorPortal'

export default function SuccessorPortalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  // Get test key code from URL params or env
  const testKeyCode = searchParams.get('testKey') || process.env.NEXT_PUBLIC_TEST_KEY_CODE
  const isTestMode = testKeyCode === 'cz-2026'

  useEffect(() => {
    checkAuthorization()
  }, [])

  const checkAuthorization = async () => {
    try {
      // BYPASS LOGIC: Test Key Code cz-2026 (Article II §2.3)
      if (isTestMode) {
        console.log('✓ Test Key Code verified: cz-2026 - Bypassing auth check')
        setIsAuthorized(true)
        setLoading(false)
        return
      }

      // Normal authorization check
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        // Redirect to login ONLY if not in test mode
        console.error('No active session - redirecting to login')
        router.push('/login?redirect=/successor')
        return
      }

      // Check if user is actually a designated successor
      const { data: successor, error: successorError } = await supabase
        .from('successors')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (successorError || !successor) {
        setError('You are not authorized to access this portal.')
        setLoading(false)
        return
      }

      // Check if successor has signed access agreement
      if (!successor.access_agreement_signed) {
        router.push(`/successor/agreement?successorId=${successor.id}`)
        return
      }

      setIsAuthorized(true)
      setLoading(false)
    } catch (err) {
      console.error('Authorization check error:', err)
      setError('Failed to verify authorization')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying authorization...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold">Access Denied</h2>
          </div>
          <p className="text-slate-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Should never reach here due to redirects
  }

  // MAIN SUCCESSOR PORTAL (authorized access)
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Test Mode Banner */}
        {isTestMode && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="text-yellow-600" size={20} />
              <span className="font-semibold text-yellow-900">
                TEST MODE ACTIVE (cz-2026)
              </span>
            </div>
            <p className="text-sm text-yellow-800 mt-1">
              This is a succession rehearsal. No real credentials at risk.
            </p>
          </div>
        )}

        {/* Portal Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Unlock className="text-purple-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Successor Portal</h1>
              <p className="text-slate-600">Access protected information</p>
            </div>
          </div>

          {/* Available Cairns/Test Markers */}
          <SuccessorPortal isTestMode={isTestMode} />
        </div>
      </div>
    </div>
  )
}
