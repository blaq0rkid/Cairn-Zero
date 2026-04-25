
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle } from 'lucide-react'

export default function AcceptInvitation({ params }: { params: { token: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      const { data, error } = await supabase
        .from('successors')
        .select('*')
        .eq('invitation_token', params.token)
        .single()

      if (error || !data) {
        setError('Invalid or expired invitation link')
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
      alert('Please accept the Successor Revocation Protocol terms to continue')
      return
    }

    try {
      // Update successor status to active
      const { error: updateError } = await supabase
        .from('successors')
        .update({ 
          status: 'active',
          accessed_at: new Date().toISOString()
        })
        .eq('invitation_token', params.token)

      if (updateError) throw updateError

      alert('Invitation accepted! You are now an active successor.')
      router.push('/successor')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600" size={48} />
          <p>Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h2 className="text-xl font-bold text-red-900 mb-2">Invalid Invitation</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <Shield className="mx-auto mb-4 text-blue-600" size={64} />
            <h1 className="text-3xl font-bold mb-2">Succession Designation</h1>
            <p className="text-gray-600">You have been designated as a successor</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-bold mb-2">Designation Details:</h2>
            <p><strong>Your Name:</strong> {successorData.full_name}</p>
            <p><strong>Slot:</strong> #{successorData.sequence_order}</p>
            <p><strong>Status:</strong> Pending Acceptance</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="font-bold mb-3">Successor Revocation Protocol</h3>
            <div className="text-sm space-y-2 max-h-64 overflow-y-auto">
              <p><strong>1. Role & Responsibilities:</strong> As a successor, you agree to act in good faith and follow the founder's documented instructions only upon verified trigger conditions.</p>
              
              <p><strong>2. No Premature Access:</strong> You acknowledge that accessing founder data before proper verification constitutes unauthorized access.</p>
              
              <p><strong>3. Revocation Rights:</strong> The founder retains the absolute right to revoke your designation at any time without cause.</p>
              
              <p><strong>4. Limited Liability:</strong> Cairn Zero is a technical service provider only and bears no liability for succession outcomes.</p>
              
              <p><strong>5. Data Protection:</strong> All founder data remains encrypted. You will only receive access credentials upon verified trigger conditions.</p>
              
              <p><strong>6. Waiting Period:</strong> Any "Request Access" action triggers a mandatory waiting period during which the founder is notified and can deny the request.</p>
              
              <p><strong>7. Zero-Knowledge Principle:</strong> Cairn Zero cannot decrypt, access, or provide the founder's data. You will receive decryption credentials only through the automated succession protocol.</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                I have read and agree to the Successor Revocation Protocol and understand my responsibilities as a designated successor.
              </span>
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!acceptedTerms}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Accept Designation
          </button>
        </div>
      </div>
    </div>
  )
}
