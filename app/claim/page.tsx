
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, ArrowRight, AlertCircle } from 'lucide-react'

export default function SuccessorClaimPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [claimCode, setClaimCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!claimCode.trim()) {
      setError('Please enter a claim code')
      return
    }

    setLoading(true)
    setError(null)

    const normalizedCode = claimCode.trim().toUpperCase()

    try {
      // CRITICAL: Store successor context flag BEFORE any navigation
      sessionStorage.setItem('portal_context', 'successor')
      sessionStorage.setItem('claim_code', normalizedCode)
      
      console.log('🔑 Claim code entered:', normalizedCode)
      console.log('✅ Portal context set to: successor')

      // Lookup successor record (without authentication requirement)
      const { data: successor, error: lookupError } = await supabase
        .from('successors')
        .select('id, email, status, legal_accepted_at, invitation_token_used')
        .or(`invitation_token.eq.${normalizedCode},email.eq.test.successor@example.com`)
        .single()

      if (lookupError || !successor) {
        console.error('❌ Invalid claim code:', lookupError)
        setError('Invalid claim code. Please check and try again.')
        setLoading(false)
        return
      }

      console.log('✅ Successor record found:', successor)

      // Check if already accepted and active
      if (successor.status === 'active' && successor.legal_accepted_at) {
        console.log('✅ Already accepted - routing to successor dashboard')
        sessionStorage.setItem('successor_verified', 'true')
        
        // EXPLICIT SUCCESSOR ROUTE - bypasses any founder dashboard logic
        router.push('/successor/thank-you?resumption=true')
        return
      }

      // Check if invitation has been used but not completed
      if (successor.invitation_token_used && !successor.legal_accepted_at) {
        console.log('⚠️ Invitation used but not completed')
        setError('This invitation link has already been used. Please contact the founder.')
        setLoading(false)
        return
      }

      // Route to legal gateway for acceptance
      console.log('🎯 Routing to legal gateway')
      router.push('/successor/legal-gateway')

    } catch (err: any) {
      console.error('❌ Error processing claim:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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

            <button
              type="submit"
              disabled={loading || !claimCode.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Continue'}
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
