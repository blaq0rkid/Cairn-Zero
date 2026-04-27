
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AlertCircle, RefreshCw, LogOut, Mail } from 'lucide-react'
import { linkSuccessorToAuth } from '@/lib/successor-auth-handler'

export default function SuccessorAccessError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [linking, setLinking] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'not_linked' | 'not_found' | 'not_active' | 'unknown'>('unknown')

  useEffect(() => {
    checkAccessIssue()
  }, [])

  const checkAccessIssue = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setErrorType('not_found')
        setLoading(false)
        return
      }

      setUserEmail(user.email || null)

      // Check if successor record exists for this email
      const { data: successor, error } = await supabase
        .from('successors')
        .select('id, successor_id, email, status, legal_accepted_at')
        .eq('email', user.email)
        .single()

      if (error || !successor) {
        console.error('No successor record found:', error)
        setErrorType('not_found')
        setLoading(false)
        return
      }

      // Check if successor_id needs linking
      if (!successor.successor_id || successor.successor_id !== user.id) {
//         console.log('⚠️ Successor record exists but not linked to auth user')
        setErrorType('not_linked')
        setLoading(false)
        return
      }

      // Check if not active
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
//         console.log('⚠️ Successor exists and linked but not active')
        setErrorType('not_active')
        setLoading(false)
        return
      }

      // If we get here, access should work - redirect to dashboard
//       console.log('✅ Access should be valid, redirecting...')
      router.push('/successor')

    } catch (err) {
      console.error('Error checking access:', err)
      setErrorType('unknown')
      setLoading(false)
    }
  }

  const handleRetryLinking = async () => {
    if (!userEmail) return

    setLinking(true)

    const result = await linkSuccessorToAuth(userEmail)

    if (result.success) {
//       console.log('✅ Linking successful, redirecting to dashboard')
      router.push('/successor')
    } else {
      console.error('❌ Linking failed:', result.error)
      alert(`Failed to link account: ${result.error}`)
      setLinking(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/claim')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
          <p className="text-slate-600">Checking access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8">
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto mb-4 text-orange-600" size={56} />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Access Issue Detected
            </h1>
          </div>

          {errorType === 'not_linked' && (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700 mb-3">
                  <strong>Account Linking Required:</strong> Your successor record exists but hasn't been linked to your login yet. This can happen due to a timing issue during registration.
                </p>
                {userEmail && (
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <Mail size={14} />
                    {userEmail}
                  </p>
                )}
              </div>

              <button
                onClick={handleRetryLinking}
                disabled={linking}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
              >
                <RefreshCw size={20} className={linking ? 'animate-spin' : ''} />
                {linking ? 'Linking Account...' : 'Link Account Now'}
              </button>
            </>
          )}

          {errorType === 'not_found' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>No Successor Record Found:</strong> We couldn't find a successor designation for your account.
                </p>
                <p className="text-xs text-slate-600">
                  Please check with the founder who invited you or use the correct claim code.
                </p>
              </div>

              <button
                onClick={() => router.push('/claim')}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
              >
                Return to Claim Entry
              </button>
            </>
          )}

          {errorType === 'not_active' && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Legal Acceptance Required:</strong> Your account exists but you haven't completed the legal acceptance process.
                </p>
                <p className="text-xs text-slate-600">
                  You need to accept the Successor Declaration before accessing the dashboard.
                </p>
              </div>

              <button
                onClick={() => router.push('/claim')}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
              >
                Complete Legal Acceptance
              </button>
            </>
          )}

          {errorType === 'unknown' && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700">
                  An unexpected error occurred while checking your access. Please try again or contact support.
                </p>
              </div>

              <button
                onClick={checkAccessIssue}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
              >
                <RefreshCw size={20} />
                Retry
              </button>
            </>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Cairn Zero - Certainty. Sovereignty. Continuity.
        </p>
      </div>
    </div>
  )
}
