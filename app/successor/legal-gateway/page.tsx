
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function LegalGatewayPage() {
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successorData, setSuccessorData] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadSuccessorData()
  }, [])

  const loadSuccessorData = async () => {
    const token = sessionStorage.getItem('successor_token')
    const email = sessionStorage.getItem('successor_email')

//     console.log('Legal Gateway: Checking session', { token, email })

    if (!token || !email) {
      router.push('/successor/access')
      return
    }

    const { data } = await supabase
      .from('successors')
      .select('*')
      .eq('invitation_token', token)
      .eq('email', email)
      .single()

    if (data) {
      setSuccessorData(data)
      
      if (data.legal_accepted_at) {
//         console.log('Legal Gateway: Already accepted, redirecting to thank you')
        router.push('/successor/thank-you')
      }
    } else {
      router.push('/successor/access')
    }
  }

  const handleAccept = async () => {
    if (!accepted || !successorData) return

    setLoading(true)
    setError('')

    try {
//       console.log('Step 1: Starting acceptance process')

      // Atomic update - all fields in one transaction
      const updatePayload = {
        status: 'active',
        invitation_token_used: true,
        legal_version: 'v1-2026-04-25',
        legal_accepted_at: new Date().toISOString(),
        digital_attestation_signed_at: new Date().toISOString()
      }

//       console.log('Step 2: Update payload', updatePayload)

      const { data: updatedSuccessor, error: updateError } = await supabase
        .from('successors')
        .update(updatePayload)
        .eq('invitation_token', successorData.invitation_token)
        .eq('email', successorData.email)
        .select()
        .single()

//       console.log('Step 3: Update result', { updatedSuccessor, updateError })

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`)
      }

      if (!updatedSuccessor) {
        throw new Error('Update succeeded but no data returned')
      }

      // Verify all fields were set
      const missingFields = []
      if (updatedSuccessor.status !== 'active') missingFields.push('status')
      if (!updatedSuccessor.invitation_token_used) missingFields.push('invitation_token_used')
      if (!updatedSuccessor.legal_version) missingFields.push('legal_version')
      if (!updatedSuccessor.legal_accepted_at) missingFields.push('legal_accepted_at')

      if (missingFields.length > 0) {
        console.error('Step 4: Missing fields', missingFields)
        throw new Error(`Atomic update incomplete. Missing: ${missingFields.join(', ')}`)
      }

//       console.log('Step 5: All fields verified, routing to thank you')

      // Success - route to thank you page
      const isTestKey = successorData.invitation_token?.toLowerCase() === 'cz-2026'
      const destination = isTestKey 
        ? '/successor/thank-you?simulation=true'
        : '/successor/thank-you'

//       console.log('Step 6: Navigating to', destination)
      router.push(destination)

    } catch (err) {
      console.error('Acceptance error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleTryAgain = () => {
    setError('')
    setLoading(false)
  }

  if (!successorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
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

      <div className="max-w-4xl mx-auto p-4 py-12">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Successor Acceptance Declaration
            </h1>
            <p className="text-slate-600">
              Please review and accept the following terms
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">Legal Agreement</h2>
            <div className="text-sm text-slate-700 flex flex-col gap-4">
              <p>
                By accepting this designation, you acknowledge that you have been designated as a successor 
                by the account holder and agree to the following terms:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>You will only access this account under the circumstances defined by the designator</li>
                <li>You understand the responsibilities associated with this role</li>
                <li>You agree to maintain confidentiality of all accessed information</li>
                <li>You acknowledge this is a legally binding agreement</li>
              </ul>
              <p className="text-xs text-slate-500 mt-4">
                Version: v1-2026-04-25 | Last Updated: April 25, 2026
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-2">Acceptance Failed</p>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <button
                    onClick={handleTryAgain}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="accept" className="text-sm text-slate-700 cursor-pointer">
              I have read and agree to the Successor Acceptance Declaration. I understand my 
              responsibilities and agree to fulfill them in accordance with the designator's wishes.
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!accepted || loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Accept & Continue'}
            {!loading && accepted && <CheckCircle size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
