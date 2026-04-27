
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import SovereigntyWarning from '@/components/SovereigntyWarning'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [showWarning, setShowWarning] = useState(false)
  const [pendingCredentials, setPendingCredentials] = useState<{
    email: string
    password: string
    fullName: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const fullName = formData.get('fullName') as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    // Store credentials and show sovereignty warning
    setPendingCredentials({ email, password, fullName })
    setShowWarning(true)
  }

  const handleAcceptSovereignty = async () => {
    if (!pendingCredentials) return

    setLoading(true)
    setError('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: pendingCredentials.email,
      password: pendingCredentials.password,
      options: {
        data: {
          full_name: pendingCredentials.fullName
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      setShowWarning(false)
      return
    }

    if (authData.user) {
      // Create profile with sovereignty acceptance
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: pendingCredentials.email,
          full_name: pendingCredentials.fullName,
          sovereignty_warning_accepted: true,
          sovereignty_warning_accepted_at: new Date().toISOString()
        })

      if (profileError) {
        setError('Account created but profile setup failed. Please contact support.')
        setLoading(false)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    }
  }

  const handleDeclineSovereignty = () => {
    setShowWarning(false)
    setPendingCredentials(null)
    setError('You must accept the Zero-Knowledge Sovereignty terms to create an account.')
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
          <p className="text-slate-600">Start your digital succession plan</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-900 font-semibold mb-2">
              ⚠️ Important: Zero-Knowledge Sovereignty
            </p>
            <p className="text-xs text-yellow-800">
              Before creating your account, you will be asked to acknowledge that Cairn Zero 
              operates under Zero-Knowledge principles. We cannot recover your password or 
              access your data under any circumstances.
            </p>
          </div>
          <p className="text-xs text-slate-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
