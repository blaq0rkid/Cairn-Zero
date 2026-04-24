
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function AcceptSuccessionPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [successor, setSuccessor] = useState<any>(null)
  const [founder, setFounder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const fetchSuccessorDetails = async () => {
      try {
        const { data: successorData, error: successorError } = await supabase
          .from('successors')
          .select('*, founder:founder_id(email)')
          .eq('invitation_token', params.token)
          .single()

        if (successorError || !successorData) {
          setError('Invalid or expired invitation link')
          setLoading(false)
          return
        }

        if (successorData.status === 'active') {
          setAccepted(true)
        }

        setSuccessor(successorData)
        setFounder(successorData.founder)
      } catch (err) {
        setError('Failed to load invitation details')
      } finally {
        setLoading(false)
      }
    }

    fetchSuccessorDetails()
  }, [params.token, supabase])

  const handleAccept = async () => {
    setAccepting(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('successors')
        .update({ 
          status: 'active',
          accessed_at: new Date().toISOString()
        })
        .eq('invitation_token', params.token)

      if (updateError) throw updateError

      setAccepted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to accept designation')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Designation Confirmed</h1>
            <p className="text-gray-600 mb-6">
              You have successfully accepted your role as a successor.
            </p>
            <p className="text-sm text-gray-500">
              You will receive notifications according to the Heartbeat protocol configured by the Designator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold">Succession Designation Notice</h1>
            <p className="text-gray-300 mt-2">Cairn Zero - Zero-Knowledge Sovereignty Platform</p>
          </div>

          <div className="p-8">
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="text-gray-900">
                <strong>{founder?.email || 'A Cairn Zero user'}</strong> has designated you, <strong>{successor?.full_name}</strong>, as Successor #{successor?.sequence_order}.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Succession Notification Disclaimers and Terms</h2>
            <p className="text-sm text-gray-600 mb-6">Effective Date: April 24, 2026 | Company: Cairn Zero</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Nature of Designation</h3>
                <p>
                  By receiving this notification, you have been designated as a "Successor" by a primary account holder (the "Designator") within the Cairn Zero system. This designation is intended to ensure business continuity and digital asset accessibility in the event of the Designator's incapacity or unavailability. Acceptance of this role constitutes an agreement to the terms outlined herein and within the Cairn Zero Master Terms of Service.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Zero-Knowledge Sovereignty and Data Privacy</h3>
                <p className="mb-2">Cairn Zero operates under the "Certainty-Only" Principle of Zero-Knowledge Sovereignty:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>No Access:</strong> Cairn Zero does not possess, manage, or have the technical ability to view the contents of the Designator's secured data.</li>
                  <li><strong>Encryption:</strong> All data is encrypted client-side. Cairn Zero facilitates the transfer of decryption keys or access protocols to the Successor only upon the fulfillment of specific "Heartbeat" triggers.</li>
                  <li><strong>Sub-Processing:</strong> You acknowledge that Cairn Zero utilizes third-party sub-processors, including Resend, for the delivery of transactional notifications. Your contact information is used solely for the purpose of maintaining this succession bridge.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. The Trigger Mechanism (7-Day Handoff Rule)</h3>
                <p className="mb-2">Access to the Designator's assets is governed by the Cairn Zero "Heartbeat" system:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Activation:</strong> The transition of control to the Successor is triggered only after a sustained failure of the Designator to respond to system pings (the "Heartbeat").</li>
                  <li><strong>Cooling-Off Period:</strong> Per the 7-Day Handoff Rule, the Designator maintains a final window to override the handoff. Cairn Zero is not liable for the timing of the handoff provided the automated triggers were executed according to the Designator's pre-set configurations.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Key Acknowledgments</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>NO LEGAL OR FIDUCIARY ADVICE:</strong> Cairn Zero is a technical service provider. This notification does not constitute legal, financial, or estate planning advice.</li>
                  <li><strong>ZERO-KNOWLEDGE SOVEREIGNTY:</strong> Cairn Zero has zero access to the underlying data. Access is granted solely through automated triggers set by the Founder.</li>
                  <li><strong>ACCESS CONDITIONS:</strong> Access to the "keys to the kingdom" is strictly governed by the conditions (Heartbeat/7-Day Handoff) defined by the Founder.</li>
                  <li><strong>CONFIDENTIALITY:</strong> This invitation is intended solely for the designated recipient. Unauthorized sharing of the acceptance link may compromise the security of the entity.</li>
                  <li><strong>LIMITATION OF LIABILITY:</strong> Cairn Zero is not responsible for the content, validity, or accessibility of the data managed by the Founder.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Successor Responsibilities</h3>
                <p className="mb-2">Upon accepting this designation, the Successor acknowledges that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Verification:</strong> They must maintain a valid and secure email address to receive system alerts.</li>
                  <li><strong>Authority:</strong> They represent that they have the legal right or corporate authority to act upon the Designator's assets in accordance with applicable local laws.</li>
                  <li><strong>Security:</strong> They are responsible for maintaining the security of their own Cairn Zero credentials to prevent unauthorized access during a handoff event.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Termination of Designation</h3>
                <p>
                  The Designator may revoke the Successor's status at any time without prior notice, at which point all pending access tokens and invitation links shall become void. The Successor may also decline the designation at any time, which will trigger a notification to the Designator to select an alternative.
                </p>
              </section>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <p className="text-gray-900 font-semibold mb-2">
                By clicking "Accept Designation" below, you confirm that you have:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Read and understood these Disclaimers and Terms</li>
                <li>Agreed to the responsibilities outlined above</li>
                <li>Acknowledged the Zero-Knowledge Sovereignty model</li>
                <li>Understood the trigger mechanism and access conditions</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {accepting ? 'Processing...' : 'Accept Designation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
