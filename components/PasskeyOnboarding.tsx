
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Key, Shield } from 'lucide-react'

export default function PasskeyOnboarding() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'email' | 'verify' | 'passkey' | 'complete'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Helper function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Step 1: Email Entry
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify Email Code
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      // Store user ID for next step
      localStorage.setItem('tempUserId', data.userId)
      setStep('passkey')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Create Passkey
  const handleCreatePasskey = async () => {
    setLoading(true)
    setError('')

    try {
      const userId = localStorage.getItem('tempUserId')
      if (!userId) throw new Error('User ID not found')

      // Get WebAuthn registration options
      const optionsResponse = await fetch('/api/auth/passkey-registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      })

      const { options } = await optionsResponse.json()

      // Create credential using WebAuthn
      const credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
          user: {
            ...options.user,
            id: Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0))
          }
        }
      }) as PublicKeyCredential

      if (!credential) throw new Error('Failed to create passkey')

      const response = credential.response as AuthenticatorAttestationResponse

      // Complete registration - using helper function instead of spread operator
      const registrationResponse = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          credentialId: credential.id,
          publicKey: arrayBufferToBase64(response.getPublicKey()!),
          transports: response.getTransports ? response.getTransports() : [],
          authenticatorData: arrayBufferToBase64(response.getAuthenticatorData()),
          clientDataJSON: arrayBufferToBase64(response.clientDataJSON)
        })
      })

      const data = await registrationResponse.json()

      if (!registrationResponse.ok) {
        throw new Error(data.error || 'Failed to complete registration')
      }

      localStorage.removeItem('tempUserId')
      setStep('complete')

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Email Step */}
        {step === 'email' && (
          <div>
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
              <Mail className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Welcome to Cairn Zero</h2>
            <p className="text-slate-600 text-center mb-6">Enter your email to begin</p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Verification Step */}
        {step === 'verify' && (
          <div>
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <Shield className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Check Your Email</h2>
            <p className="text-slate-600 text-center mb-6">
              We sent a verification code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </div>
        )}

        {/* Passkey Creation Step */}
        {step === 'passkey' && (
          <div>
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-6">
              <Key className="text-purple-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Create Your Passkey</h2>
            <p className="text-slate-600 text-center mb-6">
              Use biometric authentication for secure, password-free access
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCreatePasskey}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Passkey...' : 'Create Passkey'}
            </button>
          </div>
        )}

        {/* Completion Step */}
        {step === 'complete' && (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <Shield className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">All Set!</h2>
            <p className="text-slate-600 mb-4">
              Your account has been created successfully.
            </p>
            <div className="animate-pulse text-blue-600">
              Redirecting to dashboard...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
