
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight } from 'lucide-react'

export default function ClaimPage() {
  const router = useRouter()
  const [keyNumber, setKeyNumber] = useState('')
  const [validating, setValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidating(true)

    const normalizedKey = keyNumber.trim().toUpperCase()
    
    // Store claim code and route directly to legal gateway
    sessionStorage.setItem('claim_code', normalizedKey)
    router.push('/successor/legal-gateway')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="mx-auto mb-4 text-blue-600" size={48} />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Successor Access
            </h1>
            <p className="text-slate-600 text-sm">
              Enter your key number to continue
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="key-number" className="block text-sm font-medium text-slate-700 mb-2">
                Key Number
              </label>
              <input
                id="key-number"
                type="text"
                value={keyNumber}
                onChange={(e) => setKeyNumber(e.target.value)}
                placeholder="CZ-2026"
                className="w-full px-4 py-3 text-lg font-mono uppercase border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                required
                autoFocus
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-slate-500">
                Find this in your invitation email
              </p>
            </div>

            <button
              type="submit"
              disabled={validating || !keyNumber.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {validating ? 'Validating...' : 'Continue'}
              {!validating && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Need help? Contact your founder
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
