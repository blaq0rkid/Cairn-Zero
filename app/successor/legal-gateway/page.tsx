
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, XCircle, FileText } from 'lucide-react'

export default function LegalGateway() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [claimCode, setClaimCode] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Retrieve claim code from session storage
    const storedCode = sessionStorage.getItem('claim_code')
    const storedData = sessionStorage.getItem('successor_data')

    if (!storedCode) {
      console.log('❌ No claim code found, redirecting to /claim')
      router.push('/claim')
      return
    }

    setClaimCode(storedCode)
    
    if (storedData) {
      setSuccessorData(JSON.parse(storedData))
    }

    setLoading(false)
  }, [])

  const handleAcceptance = async () => {
    if (!acceptedTerms) {
      alert('Please accept the terms by checking the boxes below')
      return
    }

    setProcessing(true)

    try {
      // If this is a simulation key (CZ-2026), bypass database update
      if (claimCode?.startsWith('CZ-')) {
        console.log('✅ Simulation mode: Legal acceptance recorded')
        sessionStorage.setItem('legal_accepted', 'true')
        sessionStorage.setItem('legal_accepted_at', new Date().toISOString())
        router.push('/successor?welcome=true')
        return
      }

      // Update successor record with legal acceptance
      const { error: updateError } = await supabase
        .from('successors')
        .update({
          status: 'active',
          legal_accepted_at: new Date().toISOString(),
          accessed_at: new Date().toISOString(),
          invitation_token_used: true,
          invitation_token: null
        })
        .eq('invitation_token', claimCode)
        .eq('invitation_token_used', false)

      if (updateError) throw updateError

      console.log('✅ Legal acceptance recorded in database')
      
      // Clear session storage
      sessionStorage.removeItem('claim_code')
      sessionStorage.removeItem('successor_data')

      // Redirect to successor login to create account
      router.push('/successor/login?welcome=true')
    } catch (err: any) {
      console.error('❌ Error recording acceptance:', err)
      alert('An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  const handleDeclination = async () => {
    setProcessing(true)

    try {
      if (!claimCode?.startsWith('CZ-')) {
        // Update database for real successor
        const { error: updateError } = await supabase
          .from('successors')
          .update({
            status: 'declined',
            legal_declined_at: new Date().toISOString(),
            declined_at: new Date().toISOString(),
            invitation_token_used: true,
            invitation_token: null
          })
          .eq('invitation_token', claimCode)
          .eq('invitation_token_used', false)

        if (updateError) throw updateError

        // Notify founder
        if (successorData) {
          await fetch('/api/successors/notify-founder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              founderId: successorData.founder_id,
              successorName: successorData.full_name,
              action: 'declined'
            })
          })
        }
      }

      // Clear session storage
      sessionStorage.clear()
      router.push('/successor/declined')
    } catch (err: any) {
      console.error('❌ Error recording declination:', err)
      alert('An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-gray-600">Loading legal gateway...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <FileText className="mx-auto mb-4 text-blue-600" size={64} />
            <h1 className="text-3xl font-bold mb-2">Legal Gateway</h1>
            <p className="text-gray-600">Please review and accept the following declaration</p>
          </div>

          {/* Successor Info */}
          {successorData && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Designated by:</strong> {successorData.profiles?.full_name || successorData.profiles?.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Your name:</strong> {successorData.full_name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Slot:</strong> #{successorData.sequence_order}
              </p>
            </div>
          )}

          {/* Legal Declaration */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Successor Acceptance Declaration</h2>
            <p className="text-xs text-gray-600 mb-4">Effective Date: April 25, 2026 | Provider: Cairn Zero</p>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">1. Fiduciary Intent</p>
                <p className="text-gray-700">I understand that I have been designated as a key Successor for the business continuity of the Founder. I accept the responsibility to access the "Archive" only under the conditions specified in the Succession Bridge protocol.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">2. Duty of Care</p>
                <p className="text-gray-700">I agree to maintain the security of my access credentials (including physical hardware keys if provided) and to use the accessed information solely for the preservation and continuity of the Founder's business and legacy.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">3. Zero-Knowledge Acknowledgment</p>
                <p className="text-gray-700">I acknowledge that Cairn Zero does not have access to the data I will be retrieving and that I am solely responsible for the "Sovereignty" of the keys provided to me.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">4. Confidentiality</p>
                <p className="text-gray-700">I agree to keep all information retrieved through the Successor Portal strictly confidential, except as required for the execution of my duties as a Successor.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">5. Zero-Knowledge and Sovereignty Disclosure</p>
                <p className="text-gray-700">I understand that Cairn Zero is a "Certainty-Only" provider and does not store passwords or provide recovery services. If I lose my credentials after a Succession Event, the data may be permanently lost.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">6. Revocation and Termination</p>
                <p className="text-gray-700">I acknowledge that the Founder retains the absolute right to revoke my successor status at any time without prior notice.</p>
              </div>

              <div>
                <p className="font-semibold mb-1">7. Limitation of Liability</p>
                <p className="text-gray-700">I agree to indemnify and hold harmless Cairn Zero from any and all claims, losses, or damages resulting from my handling of the Archive assets.</p>
              </div>
            </div>
          </div>

          {/* Acceptance Checkboxes */}
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

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleAcceptance}
              disabled={!acceptedTerms || processing}
              className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={24} />
              {processing ? 'Processing...' : 'Accept & Continue'}
            </button>

            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={processing}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={24} />
              Decline
            </button>
          </div>
        </div>

        {/* Decline Confirmation Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Confirm Declination</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to decline this successor designation? This action cannot be undone, and the founder will be notified.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclination}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Declination
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
