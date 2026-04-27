
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import SovereigntyWarning from '@/components/SovereigntyWarning'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [showWarning, setShowWarning] = useState(false)
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Check if user has accepted sovereignty warning
    const { data: profile } = await supabase
      .from('profiles')
      .select('sovereignty_warning_accepted')
      .eq('email', email)
      .single()

    if (!profile?.sovereignty_warning_accepted) {
      setPendingCredentials({ email, password })
      setShowWarning(true)
      return
    }

    // Proceed with login
    await performLogin(email, password)
  }

  const performLogin = async (email: string, password: string) => {
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleAcceptSovereignty = async () => {
    if (!pendingCredentials) return

    const { data: { user } } = await supabase.auth.signInWithPassword({
      email: pendingCredentials.email,
      password: pendingCredentials.password
    })

    if (user) {
      await supabase
        .from('profiles')
        .update({
          sovereignty_warning_accepted: true,
          sovereignty_warning_accepted_at: new Date().toISOString()
        })
        .eq('id', user.id)

      router.push('/dashboard')
    }
  }

  const handleDeclineSovereignty = () => {
    setShowWarning(false)
    setPendingCredentials(null)
    setError('You must accept the Zero-Knowledge Sovereignty terms to continue.')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {showWarning && (
        <SovereigntyWarning
          onAccept={handleAcceptSovereignty}
          onDecline={handleDeclineSovereignty}
        />
      )}

      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <img 
            src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
            alt="Cairn Zero" 
            className="h-16 w-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your Cairn Zero account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            By signing in, you acknowledge our Zero-Knowledge Sovereignty principles. 
            We cannot recover your password or access your data.
          </p>
        </div>
      </div>
    </div>
  )
}
