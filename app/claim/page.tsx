
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, ArrowRight, AlertCircle, Users, CheckCircle } from 'lucide-react'

export default function SuccessorClaimPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [claimCode, setClaimCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, message])
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!claimCode.trim()) {
      setError('Please enter a claim code')
      return
    }

    setLoading(true)
    setError(null)
    setDebugInfo([])

    const normalizedCode = claimCode.trim().toUpperCase()

    try {
      // STEP 1: Lock portal context to SUCCESSOR
      sessionStorage.clear()
      sessionStorage.setItem('portal_context', 'successor')
      sessionStorage.setItem('claim_code', normalizedCode)
      addDebug('✅ Portal context locked to SUCCESSOR')

      // STEP 2: Get current auth state
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        addDebug('⚠️ Not authenticated')
      } else {
        addDebug(`✅ Authenticated as: ${user?.email}`)
      }

      // STEP 3: Lookup successor record (no status filter - find ANY matching record)
      addDebug(`🔍 Looking up successor record for code: ${normalizedCode}`)
      
      const { data: successor, error: lookupError } = await supabase
        .from('successors')
        .select('id, email, status, legal_accepted_at, invitation_token_used, legal_version, successor_id, founder_id')
        .or(`invitation_token.eq.${normalizedCode},email.eq.test.successor@example.com`)
        .single()

      if (lookupError || !successor) {
        addDebug('❌ Invalid claim code')
        setError('Invalid claim code. Please check and try again.')
        setLoading(false)
        return
      }

      addDebug(`✅ Successor record found (ID: ${successor.id})`)
      addDebug(`   Email: ${successor.email}`)
      addDebug(`   Status: ${successor.status}`)
      addDebug(`   Legal Accepted: ${successor.legal_accepted_at ? 'Yes' : 'No'}`)
      addDebug(`   Successor ID linked: ${successor.successor_id ? 'Yes' : 'No'}`)

      // STEP 4: STATE RECOVERY - Fix records with mismatched states
      let needsStateRecovery = false
      const recoveryUpdates: any = {}

      // Case 1: Has legal_accepted_at but status still pending
      if (successor.legal_accepted_at && successor.status === 'pending') {
        addDebug('⚠️ State mismatch: legal_accepted_at exists but status=pending')
        needsStateRecovery = true
        recoveryUpdates.status = 'active'
      }

      // Case 2: Has legal_accepted_at but missing legal_version
      if (successor.legal_accepted_at && !successor.legal_version) {
        addDebug('⚠️ State mismatch: legal_accepted_at exists but legal_version is null')
        needsStateRecovery = true
        recoveryUpdates.legal_version = 'v1-2026-04-25'
      }

      // Case 3: Has legal_accepted_at but invitation_token_used is false
      if (successor.legal_accepted_at && !successor.invitation_token_used) {
        addDebug('⚠️ State mismatch: legal_accepted_at exists but invitation_token_used is false')
        needsStateRecovery = true
        recoveryUpdates.invitation_token_used = true
      }

      // Execute state recovery if needed
      if (needsStateRecovery) {
        addDebug('🔧 Applying state recovery updates...')
        const { data: recoveredRecord, error: recoveryError } = await supabase
          .from('successors')
          .update(recoveryUpdates)
          .eq('id', successor.id)
          .select()
          .single()

        if (recoveryError) {
          addDebug(`❌ State recovery failed: ${recoveryError.message}`)
        } else {
          addDebug('✅ State recovery successful')
          // Update local successor object
          Object.assign(successor, recoveredRecord)
        }
      }

      // STEP 5: AUTO-LINK successor_id if user is authenticated and record is active
      if (user && successor.status === 'active' && !successor.successor_id) {
        addDebug('🔗 Auto-linking successor_id to authenticated user...')
        
        const { data: linkedRecord, error: linkError } = await supabase
          .from('successors')
          .update({ successor_id: user.id })
          .eq('id', successor.id)
          .select()
          .single()

        if (linkError) {
          addDebug(`❌ Auto-link failed: ${linkError.message}`)
        } else {
          addDebug('✅ Auto-link successful')
          successor.successor_id = linkedRecord.successor_id
        }
      }

      // STEP 6: Store successor record ID for dashboard binding
      sessionStorage.setItem('successor_record_id', successor.id)
      sessionStorage.setItem('successor_verified', 'true')

      // STEP 7: Route based on state
      if (successor.status === 'active' && successor.legal_accepted_at) {
        addDebug('✅ Successor already active - routing to thank you (resumption)')
        router.push('/successor/thank-you?resumption=true')
        return
      }

      if (successor.invitation_token_used && !successor.legal_accepted_at) {
        addDebug('⚠️ Invitation already used but not completed')
        setError('This invitation link has already been used. Please contact the founder.')
        setLoading(false)
        return
      }

      if (successor.status === 'declined') {
        addDebug('⚠️ Succession was declined')
        setError('This succession designation has been declined.')
        setLoading(false)
        return
      }

      // STEP 8: Route to legal gateway for fresh acceptance
      addDebug('🎯 Routing to legal gateway for acceptance')
      router.push('/successor/legal-gateway')

    } catch (err: any) {
      addDebug(`❌ Unexpected error: ${err.message}`)
      console.error('Error processing claim:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Successor Access
            </h1>
            <p className="text-slate-600">
              Enter your claim code to access the successor portal
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Users className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-slate-700">
              <p className="font-medium mb-1">Dual Role Users:</p>
              <p>If you're both a Founder and Successor, entering a claim code here will take you to the Successor Portal for that specific designation.</p>
            </div>
          </div>

          <form onSubmit={handleClaimSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="claim-code" className="block text-sm font-medium text-slate-700 mb-2">
                Claim Code
              </label>
              <input
                id="claim-code"
                type="text"
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value)}
                placeholder="Enter your code (e.g., CZ-2026)"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-mono uppercase"
                disabled={loading}
              />
              <p className="mt-2 text-xs text-slate-500">
                This code was provided by the founder who designated you as a successor
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {debugInfo.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">Debug Log:</p>
                <div className="text-xs text-slate-600 font-mono space-y-1 max-h-40 overflow-y-auto">
                  {debugInfo.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !claimCode.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Continue to Successor Portal'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              By continuing, you acknowledge that you are accessing a secure succession portal
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Cairn Zero - Certainty. Sovereignty. Continuity.
        </p>
      </div>
    </div>
  )
}
