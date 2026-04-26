
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, XCircle, FileText } from 'lucide-react'

const LEGAL_VERSION = 'v1-2026-04-25'

export default function LegalGateway() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [claimCode, setClaimCode] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [acceptCheckbox1, setAcceptCheckbox1] = useState(false)
  const [acceptCheckbox2, setAcceptCheckbox2] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeLegalGateway = async () => {
      const storedCode = sessionStorage.getItem('claim_code')

      if (!storedCode) {
        router.push('/claim')
        return
      }

      setClaimCode(storedCode)
      const normalizedCode = storedCode.toUpperCase()

      try {
        const { data, error } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .or(`invitation_token.eq.${normalizedCode},email.eq.test.successor@example.com`)
          .single()

        if (data && !error) {
          console.log('✅ Successor record found:', data)
          setSuccessorData(data)
          
          if (data.status === 'active' && data.legal_accepted_at) {
            console.log('✅ Already accepted - routing to thank you page')
            sessionStorage.clear()
            if (normalizedCode === 'CZ-2026' || normalizedCode?.startsWith('CZ-')) {
              router.push('/successor/thank-you?simulation=true')
            } else {
              router.push('/successor/thank-you')
            }
            return
          }
        }
      } catch (err) {
        console.log('⚠️ Error looking up record:', err)
      }
      
      setLoading(false)
    }

    initializeLegalGateway()
  }, [])

  const handleAcceptance = async () => {
    if (!acceptCheckbox1 || !acceptCheckbox2) {
      alert('Please accept both declarations by checking the boxes')
      return
    }

    setProcessing(true)

    try {
      const normalizedCode = claimCode?.toUpperCase()
      const { data: { user } } = await supabase.auth.getUser()

      // ATOMIC UPDATE PAYLOAD - Define with proper typing
      const atomicPayload: Record<string, any> = {
        status: 'active',
        invitation_token_used: true,
        legal_version: LEGAL_VERSION,
        legal_accepted_at: new Date().toISOString(),
        accessed_at: new Date().toISOString()
      }

      // If authenticated, also link successor_id
      if (user) {
        atomicPayload.successor_id = user.id
      }

      console.log('🔄 Starting atomic update')
      console.log('📦 Payload:', atomicPayload)

      let updateData = null
      let updateError = null

      // Update by invitation_token
      if (normalizedCode) {
        const result = await supabase
          .from('successors')
          .update(atomicPayload)
          .eq('invitation_token', normalizedCode)
          .neq('status', 'declined')
          .select()
        
        updateData = result.data
        updateError = result.error
      }

      // Fallback for test records
      if ((!updateData || updateData.length === 0) && (normalizedCode === 'CZ-2026' || normalizedCode?.startsWith('CZ-'))) {
        console.log('⚠️ Trying test record by email...')
        const result = await supabase
          .from('successors')
          .update({
            ...atomicPayload,
            invitation_token: normalizedCode
          })
          .eq('email', 'test.successor@example.com')
          .neq('status', 'declined')
          .select()
        
        updateData = result.data
        updateError = result.error
      }

      if (updateError) {
        console.error('❌ Database update error:', updateError)
        setError(`Database update failed: ${updateError.message}`)
        setProcessing(false)
        return
      }

      if (!updateData || updateData.length === 0) {
        console.error('❌ No matching record found')
        setError('Unable to update successor record. Please contact support.')
        setProcessing(false)
        return
      }

      const updated = updateData[0]
      console.log('✅ Atomic update completed:', updated)

      // Verify all fields were set
      const missingFields = []
      if (updated.status !== 'active') missingFields.push('status')
      if (!updated.invitation_token_used) missingFields.push('invitation_token_used')
      if (!updated.legal_version) missingFields.push('legal_version')
      if (!updated.legal_accepted_at) missingFields.push('legal_accepted_at')

      if (missingFields.length > 0) {
        console.error('❌ Atomic integrity violation. Missing:', missingFields)
        setError(`Database update incomplete. Missing fields: ${missingFields.join(', ')}`)
        setProcessing(false)
        return
      }

      console.log('✅ All fields verified - routing to thank you')
      sessionStorage.clear()
      
      if (normalizedCode === 'CZ-2026' || normalizedCode?.startsWith('CZ-')) {
        console.log('🎯 Routing to /successor/thank-you?simulation=true')
        router.push('/successor/thank-you?simulation=true')
      } else {
        console.log('🎯 Routing to /successor/thank-you')
        router.push('/successor/thank-you')
      }
    } catch (err: any) {
      console.error('❌ Unexpected error:', err)
      setError(`Unexpected error: ${err.message}`)
      setProcessing(false)
    }
  }

  const handleDeclination = async () => {
    setProcessing(true)

    try {
      const normalizedCode = claimCode?.toUpperCase()

      if (normalizedCode !== 'CZ-2026' && !normalizedCode?.startsWith('CZ-')) {
        const { error: updateError } = await supabase
          .from('successors')
          .update({
            status: 'declined',
            legal_declined_at: new Date().toISOString(),
            legal_version: LEGAL_VERSION,
            declined_at: new Date().toISOString(),
            invitation_token_used: true,
            invitation_token: null
          })
          .eq('invitation_token', claimCode)

        if (updateError) throw updateError
      }

      sessionStorage.clear()
      router.push('/successor/declined')
    } catch (err: any) {
      console.error('Error recording declination:', err)
      setError('Failed to record declination. Please try again.')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-slate-600">Loading legal gateway...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <FileText className="mx-auto mb-4 text-blue-600" size={56} />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Successor Acceptance Declaration
            </h1>
            <p className="text-sm text-slate-600">
              Effective Date: April 25, 2026 | Provider: Cairn Zero
            </p>
          </div>

          {successorData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 mb-1">
                <strong>Designated by:</strong> {successorData.profiles?.full_name || successorData.profiles?.email}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Your name:</strong> {successorData.full_name}
              </p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="flex flex-col gap-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold mb-2">1. Fiduciary Intent</p>
                <p>I understand that I have been designated as a key Successor for the business continuity of the Founder. I accept the responsibility to access the Archive only under the conditions specified in the Succession Bridge protocol.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">2. Duty of Care</p>
                <p>I agree to maintain the security of my access credentials and to use the accessed information solely for the preservation and continuity of the Founder's business and legacy.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">3. Zero-Knowledge Acknowledgment</p>
                <p>I acknowledge that Cairn Zero does not have access to the data I will be retrieving and that I am solely responsible for the Sovereignty of the keys provided to me.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">4. Confidentiality</p>
                <p>I agree to keep all information retrieved through the Successor Portal strictly confidential, except as required for the execution of my duties as a Successor.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white border-2 border-slate-300 rounded-lg p-4 mb-6 flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptCheckbox1}
                onChange={(e) => setAcceptCheckbox1(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
              />
              <span className="text-sm font-medium text-slate-800">
                I have read the Successor Acceptance Declaration and agree to the responsibilities of being a designated Successor.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptCheckbox2}
                onChange={(e) => setAcceptCheckbox2(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
              />
              <span className="text-sm font-medium text-slate-800">
                I understand that Cairn Zero has no access to this data and that I am now a critical link in the Sovereignty Chain.
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleAcceptance}
              disabled={!acceptCheckbox1 || !acceptCheckbox2 || processing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle size={20} />
              {processing ? 'Processing...' : 'Accept & Continue'}
            </button>

            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={processing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
            >
              <XCircle size={20} />
              Decline
            </button>
          </div>
        </div>

        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Confirm Declination
              </h3>
              <p className="text-slate-700 mb-6">
                Are you sure you want to decline this successor designation? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
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
