
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

  useEffect(() => {
    const validateToken = async () => {
      // Check if token exists and is valid (not NULL)
      const { data, error } = await supabase
        .from('successors')
        .select('*')
        .eq('invitation_token', params.token)
        .not('invitation_token', 'is', null)
        .single()

      if (error || !data) {
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

      // Success - redirect to successor dashboard
      router.push('/successor?welcome=true')
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

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <h3 className="font-bold text-lg">Important: Single-Use Link</h3>
            </div>
            <p className="text-sm text-gray-700">This invitation link can only be used once. After you accept, the link will be permanently invalidated for security purposes.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Successor Revocation Protocol</h3>
            <div className="text-sm space-y-3 max-h-80 overflow-y-auto pr-2">
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">1. Role & Responsibilities</p>
                <p className="text-gray-700">As a successor, you agree to act in good faith and follow the founder's documented instructions only upon verified trigger conditions.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">2. No Premature Access</p>
                <p className="text-gray-700">You acknowledge that accessing founder data before proper verification constitutes unauthorized access and may have legal consequences.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">3. Revocation Rights</p>
                <p className="text-gray-700">The founder retains the absolute right to revoke your designation at any time without cause or prior notice.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">4. Limited Liability</p>
                <p className="text-gray-700">Cairn Zero is a technical service provider only and bears no liability for succession outcomes, disputes, or data access issues.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">5. Data Protection</p>
                <p className="text-gray-700">All founder data remains encrypted. You will only receive access credentials upon verified trigger conditions through the automated succession protocol.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">6. Waiting Period & Founder Notification</p>
                <p className="text-gray-700">Any "Request Access" action triggers a mandatory waiting period during which the founder is notified and can deny the request.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">7. Zero-Knowledge Principle</p>
                <p className="text-gray-700">Cairn Zero cannot decrypt, access, or provide the founder's data. Decryption credentials are provided only through the automated succession protocol when verified conditions are met.</p>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold mb-1">8. Hardware Key Requirement</p>
                <p className="text-gray-700">Access to founder data requires physical possession of an Archive Key (hardware security device) and entry of the Cairn Access Key (cz-XXXX format).</p>
              </div>
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
                I have read and agree to the Successor Revocation Protocol and understand my legal responsibilities as a designated successor. I acknowledge that this link is single-use and will be invalidated upon acceptance.
              </span>
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!acceptedTerms || processing}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Accept Designation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
