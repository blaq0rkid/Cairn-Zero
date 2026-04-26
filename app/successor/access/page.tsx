
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function SuccessorAccessPage() {
  const [keyCode, setKeyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const cleanCode = keyCode.trim().toUpperCase()
      console.log('Looking up code:', cleanCode)

      const { data: successors, error: lookupError } = await supabase
        .from('successors')
        .select('*')
        .ilike('invitation_token', cleanCode)

      console.log('Query result:', { successors, lookupError })

      if (lookupError) {
        console.error('Database error:', lookupError)
        setError('Database error. Please try again.')
        setLoading(false)
        return
      }

      if (!successors || successors.length === 0) {
        setError('Invalid key code. Please check and try again.')
        setLoading(false)
        return
      }

      const successor = successors[0]
      console.log('Found successor:', successor)

      sessionStorage.setItem('successor_token', successor.invitation_token)
      sessionStorage.setItem('successor_email', successor.email)
      
      if (successor.legal_accepted_at) {
        router.push('/successor')
      } else {
        router.push('/successor/legal-gateway')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Shield className="text-blue-600" size={40} />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Welcome
              </h1>
              <p className="text-slate-600 text-lg">
                Enter your key number to access the succession portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <input
                  type="text"
                  value={keyCode}
                  onChange={(e) => setKeyCode(e.target.value)}
                  placeholder="CZ-2026"
                  className="w-full px-6 py-5 text-center text-2xl font-mono border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all uppercase"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !keyCode.trim()}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Access Portal'}
                {!loading && <ArrowRight size={24} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
