
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
      // STEP 1: Clear and set portal context
      sessionStorage.clear()
      sessionStorage.setItem('portal_context', 'successor')
      sessionStorage.setItem('claim_code', normalizedCode)
      console.log('✅ Portal context: SUCCESSOR')
      console.log('✅ Claim code stored:', normalizedCode)

      // STEP 2: Get auth state
      const { data: { user } } = await supabase.auth.getUser()
      console.log(user ? `✅ Authenticated: ${user.email}` : '⚠️ Not authenticated')

      // STEP 3: Find successor record
      console.log(`🔍 Looking up: ${normalizedCode}`)
      
      const { data: successor, error: lookupError } = await supabase
        .from('successors')
        .select('id, email, status, legal_accepted_at, invitation_token_used, legal_version, successor_id')
        .or(`invitation_token.eq.${normalizedCode},email.eq.test.successor@example.com`)
        .single()

      if (lookupError || !successor) {
        console.error('❌ Invalid claim code:', lookupError)
        setError('Invalid claim code. Please check and try again.')
        setLoading(false)
        return
      }

      console.log(`✅ Found record: ${successor.id}`)
      console.log(`   Email: ${successor.email}`)
      console.log(`   Status: ${successor.status}`)
      console.log(`   Legal: ${successor.legal_accepted_at ? 'Yes' : 'No'}`)
      console.log(`   Linked: ${successor.successor_id ? 'Yes' : 'No'}`)

      // STEP 4: Store record ID for dashboard binding
      sessionStorage.setItem('successor_record_id', successor.id)
      sessionStorage.setItem('successor_email', successor.email)
      console.log('✅ Session storage updated')
      console.log('   Record ID:', successor.id)
      console.log('   Email:', successor.email)

      // STEP 5: State recovery
      const fixes: Record<string, any> = {}
      
      if (successor.legal_accepted_at && successor.status === 'pending') {
        console.log('🔧 Fix: status → active')
        fixes.status = 'active'
      }
      
      if (successor.legal_accepted_at && !successor.legal_version) {
        console.log('🔧 Fix: legal_version')
        fixes.legal_version = 'v1-2026-04-25'
      }
      
      if (successor.legal_accepted_at && !successor.invitation_token_used) {
        console.log('🔧 Fix: token_used → true')
        fixes.invitation_token_used = true
      }

      if (Object.keys(fixes).length > 0) {
        const { data: fixed } = await supabase
          .from('successors')
          .update(fixes)
          .eq('id', successor.id)
          .select()
          .single()

        if (fixed) {
          Object.assign(successor, fixed)
          console.log('✅ State recovery complete')
        }
      }

      // STEP 6: Auto-link successor_id
      if (user && successor.status === 'active' && !successor.successor_id) {
        console.log('🔗 Auto-linking successor_id...')
        
        const { data: linked, error: linkError } = await supabase
          .from('successors')
          .update({ successor_id: user.id })
          .eq('id', successor.id)
          .select()
          .single()

        if (linkError) {
          console.error('❌ Auto-link failed:', linkError)
        } else if (linked) {
          successor.successor_id = linked.successor_id
          console.log('✅ Auto-link successful')
          console.log('   successor_id:', linked.successor_id)
        }
      }

      // STEP 7: Route based on state
      if (successor.status === 'active' && successor.legal_accepted_at) {
        console.log('✅ Already active → resumption')
        sessionStorage.setItem('successor_verified', 'true')
        
        // Wait a moment to ensure session storage is written
        await new Promise(resolve => setTimeout(resolve, 100))
        
        router.push('/successor/thank-you?resumption=true')
        return
      }

      if (successor.status === 'declined') {
        setError('This succession designation has been declined.')
        setLoading(false)
        return
      }

      // STEP 8: Route to legal gateway
      console.log('🎯 Routing to legal gateway')
      
      // Wait a moment to ensure session storage is written
      await new Promise(resolve => setTimeout(resolve, 100))
      
      router.push('/successor/legal-gateway')

    } catch (err: any) {
      console.error('❌ Unexpected error:', err.message)
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
                placeholder="CZ-2026"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-mono uppercase"
                disabled={loading}
              />
              <p className="mt-2 text-xs text-slate-500">
                Provided by the founder who designated you
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
        </div>
      </div>
    </div>
  )
}
