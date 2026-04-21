
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the callback parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const queryParams = new URLSearchParams(window.location.search)
        
        // Check for error in URL params
        const errorParam = queryParams.get('error') || hashParams.get('error')
        if (errorParam) {
          setError('Authentication failed. Please try again.')
          return
        }

        // Get the code from either hash or query params (depending on provider)
        const code = queryParams.get('code') || hashParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setError('Failed to complete authentication. Please try again.')
            console.error('Auth exchange error:', exchangeError.message)
            return
          }

          // Successfully authenticated - redirect to founder dashboard
          router.push('/founder')
        } else {
          setError('No authentication code found. Please try logging in again.')
        }
      } catch (err) {
        setError('An unexpected error occurred during authentication.')
        console.error('Callback error:', err)
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Completing authentication...</p>
      </div>
    </div>
  )
}
