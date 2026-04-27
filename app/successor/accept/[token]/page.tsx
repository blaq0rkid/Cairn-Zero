
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function SuccessorInvitation({ params }: { params: { token: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [founderData, setFounderData] = useState<any>(null)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        // Check if token exists, is valid, and hasn't been used
        const { data, error } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .eq('invitation_token', params.token)
          .not('invitation_token', 'is', null)
          .eq('invitation_token_used', false)
          .single()

        if (error || !data) {
          // Check if user is already a successor (link was already used)
          if (user) {
            const { data: existingSuccessor } = await supabase
              .from('successors')
              .select('*')
              .eq('email', user.email)
              .eq('status', 'active')
              .single()

            if (existingSuccessor) {
              setAlreadyMember(true)
              setLoading(false)
              return
            }
          }

          setError('expired')
          setLoading(false)
          return
        }

        // Check if already accepted or declined
        if (data.status === 'active') {
          setError('already-accepted')
          setLoading(false)
          return
        }

        if (data.status === 'declined') {
          setError('already-declined')
          setLoading(false)
          return
        }

        setSuccessorData(data)
        setFounderData(data.profiles)
        setLoading(false)
      } catch (err: any) {
        console.error('Error validating token:', err)
        setError('validation-error')
        setLoading(false)
      }
    }

    validateToken()
  }, [params.token])

  const handleAccept = async () => {
    if (!acceptedTerms) {
      alert('Please accept the Successor Acceptance Declaration to continue')
      return
    }

    setProcessing(true)

    try {
      // Update status and mark token as used
      const { error: updateError } = await supabase
        .from('successors')
        .update({ 
          status: 'active',
          accessed_at: new Date().toISOString(),
          legal_accepted_at: new Date().toISOString(),
          invitation_token: null,
          invitation_token_used: true // Mark as used
        })
        .eq('invitation_token', params.token)
        .eq('invitation_token_used', false) // Safety check

      if (updateError) throw updateError

//       console.log('✅ Successor accepted, redirecting to login')
      router.push('/successor/login?welcome=true')
    } catch (err: any) {
      console.error('❌ Accept error:', err)
      setError('processing-error')
      setProcessing(false)
    }
  }

  const handleDecline = async () => {
    setProcessing(true)

    try {
      // Update status to declined and mark token as used
      const { error: updateError } = await supabase
        .from('successors')
        .update({ 
          status: 'declined',
          invitation_token: null,
          invitation_token_used: true, // Mark as used
          declined_at: new Date().toISOString(),
          legal_declined_at: new Date().toISOString()
        })
        .eq('invitation_token', params.token)
        .eq('invitation_token_used', false) // Safety check

      if (updateError) throw updateError

      // Send notification to founder
      await fetch('/api/successors/notify-founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderId: successorData.founder_id,
          successorName: successorData.full_name,
          action: 'declined'
        })
      })

//       console.log('✅ Successor declined, redirecting to thank you page')
      router.push('/successor/declined')
    } catch (err: any) {
      console.error('❌ Decline error:', err)
      setError('processing-error')
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
          <p className="text-red-700 mb-6">
            {error === 'expired' && 'This invitation link has expired or has already been used.'}
            {error === 'already-accepted' && 'This invitation has already been accepted.'}
            {error === 'already-declined' && 'This invitation was previously declined.'}
            {error === 'processing-error' && 'An error occurred while processing your request.'}
            {error === 'validation-error' && 'An error occurred while validating your invitation.'}
          </p>
          <div className="bg-white border border-red-200 rounded p-4 text-left text-sm">
            <p className="font-semibold mb-2">Next Steps:</p>
            <ol className="list-decimal list-inside flex flex-col gap-1 text-gray-700">
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

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-bold text-lg mb-3">Designation Details</h2>
            <div className="flex flex-col gap-2">
              <p><span className="font-semibold">Designated by:</span> {founderData?.full_name || founderData?.email}</p>
              <p><span className="font-semibold">Your Name:</span> {successorData.full_name}</p>
              <p><span className="font-semibold">Succession Slot:</span> #{successorData.sequence_order}</p>
              <p><span className="font-semibold">Status:</span> <span className="text-yellow-600 font-semibold">Awaiting Decision</span></p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm">
                <p className="font-semibold mb-1">Important: Single-Use Link</p>
                <p className="text-gray-700">This invitation link can only be used once. Your decision (accept or decline) will permanently invalidate this link.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowAcceptModal(true)}
              disabled={processing}
              className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={24} />
              Accept Succession Responsibility
            </button>

            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={processing}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={24} />
              Decline Invitation
            </button>
          </div>
        </div>

        {/* Accept Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-4">Successor Acceptance Declaration</h2>
              <p className="text-sm text-gray-600 mb-4">Effective Date: April 25, 2026 | Provider: Cairn Zero</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">1. Fiduciary Intent</p>
                    <p className="text-gray-700">I understand that I have been designated as a key Successor for the business continuity of the Founder. I accept the responsibility to access the "Archive" only under the conditions specified in the Succession Bridge protocol.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">2. Duty of Care</p>
                    <p className="text-gray-700">I agree to maintain the security of my access credentials (including physical hardware keys if provided) and to use the accessed information solely for the preservation and continuity of the Founder's business and legacy.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">3. Zero-Knowledge Acknowledgment</p>
                    <p className="text-gray-700">I acknowledge that Cairn Zero does not have access to the data I will be retrieving and that I am solely responsible for the "Sovereignty" of the keys provided to me.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">4. Confidentiality</p>
                    <p className="text-gray-700">I agree to keep all information retrieved through the Successor Portal strictly confidential, except as required for the execution of my duties as a Successor.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">5. Notification of Activation</p>
                    <p className="text-gray-700">I understand that my access is monitored and that the Founder (or their estate) may be notified upon the activation of my succession credentials.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">6. Zero-Knowledge and Sovereignty Disclosure</p>
                    <p className="text-gray-700">I understand that Cairn Zero is a "Certainty-Only" provider and does not store passwords or provide recovery services. If I lose my credentials after a Succession Event, the data may be permanently lost.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">7. Revocation Rights</p>
                    <p className="text-gray-700">I acknowledge that the Founder retains the absolute right to revoke my successor status at any time without prior notice.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">8. Limitation of Liability</p>
                    <p className="text-gray-700">I agree to indemnify and hold harmless Cairn Zero from any and all claims, losses, or damages resulting from my handling of the Archive assets. Cairn Zero provides the bridge; the Successor and Founder are solely responsible for the traffic crossing it.</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">
                    I have read the Successor Acceptance Declaration and agree to the responsibilities of being a designated Successor.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 flex-shrink-0"
                    disabled
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I understand that Cairn Zero has no access to this data and that I am now a critical link in the Sovereignty Chain.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAcceptModal(false)
                    setAcceptedTerms(false)
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!acceptedTerms || processing}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {processing ? 'Processing...' : 'Confirm Acceptance'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-4">Successor Declination Agreement</h2>
              <p className="text-sm text-gray-600 mb-4">Document ID: SDA-2026-CZ | Effective Date: April 25, 2026</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">1. Acknowledgment of Declination</p>
                    <p className="text-gray-700">By declining, you formally refuse the appointment as a successor and acknowledge you will not hold any fiduciary, operational, or technical responsibilities associated with the Subscriber's Archive.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">2. Revocation of Access and Credentials</p>
                    <p className="text-gray-700">All invitation links, tokens, and access credentials are immediately and permanently revoked. Your profile will be purged from the Succession Bridge logic.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">3. Founder Notification / Succession Gap</p>
                    <p className="text-gray-700">The founder will be immediately notified of your declination to ensure they can appoint an alternative successor and maintain business continuity.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">4. Data Privacy; Confidentiality and Non-Disclosure</p>
                    <p className="text-gray-700">No sensitive Subscriber data was exposed to you. If you became aware of any proprietary information during this process, you agree to maintain strict confidentiality.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">5. Limitation of Liability</p>
                    <p className="text-gray-700">Cairn Zero operates under a "Zero-Knowledge Sovereignty" model and holds no liability for any "Succession Gap" created by this declination.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">6. Finality of Declination</p>
                    <p className="text-gray-700">This declination is final. Should you wish to serve as a Successor in the future, a new invitation must be initiated by the Subscriber.</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>This decision is final.</strong> If you wish to serve as a successor in the future, the founder must send you a new invitation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-semibold"
                >
                  Go Back
                </button>
                <button
                  onClick={handleDecline}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {processing ? 'Processing...' : 'Confirm Declination'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
