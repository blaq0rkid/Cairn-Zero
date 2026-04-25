
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

export default function AcceptInvitation({ params }: { params: { token: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if user is already signed in
        const { data: { user } } = await supabase.auth.getUser()

        // Check if token exists and is valid (not NULL)
        const { data, error } = await supabase
          .from('successors')
          .select('*')
          .eq('invitation_token', params.token)
          .not('invitation_token', 'is', null)
          .single()

        if (error || !data) {
          // Token is invalid or expired - check if user is already a successor
          if (user) {
            const { data: existingSuccessor } = await supabase
              .from('successors')
              .select('*')
              .eq('email', user.email)
              .eq('status', 'active')
              .single()

            if (existingSuccessor) {
              // User is already a member!
              setAlreadyMember(true)
              setLoading(false)
              return
            }
          }

          setError('This invitation link has expired or has already been used. Please contact the founder to request a new invitation.')
          setLoading(false)
          return
        }

        // Check if already accepted
        if (data.status === 'active') {
          setError('This invitation has already been accepted. Please sign in to access your successor dashboard.')
          setLoading(false)
          return
        }

        setSuccessorData(data)
        setLoading(false)
      } catch (err: any) {
        console.error('Error validating token:', err)
        setError('An error occurred while validating your invitation.')
        setLoading(false)
      }
    }

    validateToken()
  }, [params.token])

  const handleAccept = async () => {
    if (!acceptedTerms) {
      alert('Please accept the Successor Revocation Protocol to continue')
      return
    }

    setProcessing(true)

    try {
      // Update successor status to active and invalidate token
      const { error: updateError } = await supabase
        .from('successors')
        .update({ 
          status: 'active',
          accessed_at: new Date().toISOString(),
          legal_accepted_at: new Date().toISOString(),
          invitation_token: null // INVALIDATE TOKEN - single use only
        })
        .eq('invitation_token', params.token)

      if (updateError) throw updateError

      // Success - redirect to successor login to create account
      router.push('/successor/login?welcome=true')
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-gray-600">Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (alreadyMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
          <h2 className="text-2xl font-bold text-green-900 mb-3">You've Already Joined!</h2>
          <p className="text-green-700 mb-6">This invitation link has expired, but you're already registered as a successor.</p>
          <button
            onClick={() => router.push('/successor')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Go to Your Successor Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={64} />
          <h2 className="text-2xl font-bold text-red-900 mb-3">Link Expired</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="bg-white border border-red-200 rounded p-4 text-left text-sm">
            <p className="font-semibold mb-2">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Contact the founder who designated you</li>
              <li>Request a new invitation link</li>
              <li>Use the new link immediately (single-use only)</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Rest of acceptance form - same as before */}
          <div className="text-center mb-8">
            <Shield className="mx-auto mb-4 text-blue-600" size={64} />
            <h1 className="text-3xl font-bold mb-2">Succession Designation</h1>
            <p className="text-gray-600">You have been designated as a successor</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg mb-3">Designation Details</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Your Name:</span> {successorData.full_name}</p>
              <p><span className="font-semibold">Succession Slot:</span> #{successorData.sequence_order}</p>
              <p><span className="font-semibold">Status:</span> <span className="text-yellow-600 font-semibold">Pending Acceptance</span></p>
            </div>
          </div>

          <div className="mb-6 bg-white border-2 border-gray-300 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
              />
              <span className="text-sm font-medium">
                I have read and agree to the Successor Revocation Protocol and understand my legal responsibilities as a designated successor.
              </span>
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!acceptedTerms || processing}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : 'Accept Designation'}
          </button>
        </div>
      </div>
    </div>
  )
}
