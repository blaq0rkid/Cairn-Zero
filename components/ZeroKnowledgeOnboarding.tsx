import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, Key, Mail, CheckCircle } from 'lucide-react'

export default function ZeroKnowledgeOnboarding() {
  const [step, setStep] = useState<'email' | 'otp' | 'passkey' | 'sovereignty'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  // Step 1: Email Entry & OTP Generation
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: OTP Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setUserId(data.userId)
      setStep('passkey')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: WebAuthn Passkey Creation
  const handlePasskeyCreation = async () => {
    setLoading(true)
    setError('')

    try {
      // Get registration options from backend
      const optionsResponse = await fetch('/api/auth/passkey-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      })

      const options = await optionsResponse.json()

      if (!optionsResponse.ok) throw new Error(options.error)

      // Convert base64 strings to ArrayBuffer
      const publicKeyOptions = {
        ...options,
        challenge: base64ToArrayBuffer(options.challenge),
        user: {
          ...options.user,
          id: base64ToArrayBuffer(options.user.id)
        }
      }

      // Create credential using WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      }) as PublicKeyCredential

      if (!credential) throw new Error('Passkey creation failed')

      // Prepare credential for backend storage
      const attestationResponse = credential.response as AuthenticatorAttestationResponse
      const credentialData = {
        credentialId: arrayBufferToBase64(credential.rawId),
        publicKey: arrayBufferToBase64(attestationResponse.getPublicKey()!),
        transports: attestationResponse.getTransports?.() || []
      }

      // Store public key on backend (private key stays in hardware)
      const storeResponse = await fetch('/api/auth/store-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...credentialData })
      })

      const storeData = await storeResponse.json()

      if (!storeResponse.ok) throw new Error(storeData.error)

      setStep('sovereignty')
    } catch (err: any) {
      setError(err.message || 'Passkey creation failed')
    } finally {
      setLoading(false)
    }
  }

  // Step 4: Sovereignty Confirmation
  const handleSovereigntyConfirmation = async () => {
    setLoading(true)

    try {
      await fetch('/api/auth/confirm-sovereignty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Confirmation failed')
      setLoading(false)
    }
  }

  // Utility functions
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        
        {/* Email Entry Step */}
        {step === 'email' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="text-blue-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Identity Verification</h2>
            <p className="text-slate-600 text-center mb-6">Enter your email to receive a verification code</p>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Enter Verification Code</h2>
            <p className="text-slate-600 text-center mb-6">Check your email for the 6-digit code</p>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-center text-2xl font-mono focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </div>
        )}

        {/* Passkey Creation Step */}
        {step === 'passkey' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Key className="text-purple-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Sovereignty Handshake</h2>
            <p className="text-slate-600 text-center mb-6">
              Create your passkey. Your private key will be stored securely in your device's hardware enclave.
            </p>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900 font-semibold mb-2">Important:</p>
              <ul className="text-xs text-yellow-800 list-disc list-inside flex flex-col gap-1">
                <li>Your private key never leaves your device</li>
                <li>Only you can access your account</li>
                <li>We cannot recover your access if you lose your device</li>
              </ul>
            </div>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePasskeyCreation}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Creating Passkey...' : 'Create Passkey'}
            </button>
          </div>
        )}

        {/* Sovereignty Confirmation Step */}
        {step === 'sovereignty' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Sovereignty Confirmation</h2>
            <p className="text-slate-600 text-center mb-6">
              Your passkey has been created successfully
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-3">I acknowledge that:</h3>
              <ul className="text-sm text-blue-800 flex flex-col gap-2">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>I am the sole holder of my private key</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>My private key is stored in my device's hardware enclave</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Cairn Zero cannot access or recover my private key</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>I am responsible for maintaining access to my authentication device</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Loss of my device may result in permanent loss of account access</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSovereigntyConfirmation}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'I Accept Zero-Knowledge Sovereignty'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
