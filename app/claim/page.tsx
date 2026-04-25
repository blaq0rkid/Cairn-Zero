
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, Key } from 'lucide-react'

export default function ClaimPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [claimCode, setClaimCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const normalizedCode = claimCode.trim().toUpperCase()

    try {
      // Check if this is the simulation key
      if (normalizedCode === 'CZ-2026' || normalizedCode.startsWith('CZ-')) {
        console.log('✅ Simulation key detected:', normalizedCode)
        // Store the claim code in session storage for the legal gateway
        sessionStorage.setItem('claim_code', normalizedCode)
        router.push('/successor/legal-gateway')
        return
      }

      // Look up the claim code in the database
      const { data: successor, error: lookupError } = await supabase
        .from('successors')
        .select('*, profiles!successors_founder_id_fkey(email, full_name)')
        .eq('invitation_token', normalizedCode)
        .eq('invitation_token_used', false)
        .single()

      if (lookupError || !successor) {
        setError('Invalid or expired claim code. Please check your invitation email and try again.')
        setLoading(false)
        return
      }

      console.log('✅ Valid claim code found for:', successor.email)
      
      // Store claim information for legal gateway
      sessionStorage.setItem('claim_code', normalizedCode)
      sessionStorage.setItem('successor_data', JSON.stringify(successor))
      
      // Route directly to legal gateway
      router.push('/successor/legal-gateway')
    } catch (err: any) {
      console.error('❌ Claim validation error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="mx-auto mb-4 text-blue-600" size={56} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Successor Access</h1>
            <p className="text-gray-600">Enter your claim code to continue</p>
          </div>

          {/* Claim Code Input */}
          <form onSubmit={handleClaimSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Code
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={claimCode}
                  onChange={(e) => {
                    setClaimCode(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your claim code"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono uppercase"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Find this code in your invitation email
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !claimCode.trim()}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {loading ? 'Validating...' : 'Continue'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have a claim code?{' '}
              <span className="text-gray-800 font-medium">Contact your founder</span>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Cairn Zero - Certainty. Sovereignty. Continuity.
          </p>
        </div>
      </div>
    </div>
  )
}
