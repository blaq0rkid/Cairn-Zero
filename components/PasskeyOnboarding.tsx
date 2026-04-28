
import { useState } from 'react'
import { Shield, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react'

export default function PasskeyOnboarding() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)
  const [ethereumAddress, setEthereumAddress] = useState(null)

  // Step 1: Email Entry
  const handleEmailSubmit = async (e) => {
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
      if (!response.ok) throw new Error(data.error)

      setStep('verification')
    } catch (err) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Email Verification
  const handleVerificationSubmit = async (e) => {
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
      if (!response.ok) throw new Error(data.error)

      setUserId(data.userId)
      setStep('passkey')
    } catch (err) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Passkey Creation & Immediate Wallet Derivation
  const handlePasskeyCreation = async () => {
    setLoading(true)
    setError('')

    try {
      // Get WebAuthn registration options from backend
      const optionsResponse = await fetch('/api/auth/passkey-registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      })

      const options = await optionsResponse.json()
      if (!optionsResponse.ok) throw new Error(options.error)

      // Convert base64 challenge and user ID to ArrayBuffer
      const publicKeyOptions = {
        ...options,
        challenge: base64ToArrayBuffer(options.challenge),
        user: {
          ...options.user,
          id: base64ToArrayBuffer(options.user.id)
        }
      }

      // Create WebAuthn credential (Passkey)
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      })

      if (!credential) throw new Error('Passkey creation cancelled')

      // Extract credential data
      const attestationResponse = credential.response
      const credentialData = {
        credentialId: arrayBufferToBase64(credential.rawId),
        publicKey: arrayBufferToBase64(attestationResponse.getPublicKey()),
        transports: attestationResponse.getTransports?.() || [],
        authenticatorData: arrayBufferToBase64(attestationResponse.getAuthenticatorData()),
        clientDataJSON: arrayBufferToBase64(attestationResponse.clientDataJSON),
        attestationObject: arrayBufferToBase64(attestationResponse.attestationObject)
      }

      // Store passkey and derive wallet address (Manifesto §3: Immediate upon Passkey creation)
      const storeResponse = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          ...credentialData 
        })
      })

      const storeData = await storeResponse.json()
      if (!storeResponse.ok) throw new Error(storeData.error)

      // Wallet address returned from deterministic derivation
      setEthereumAddress(storeData.ethereumAddress)
      setStep('sovereignty')
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Passkey creation was cancelled. Please try again.')
      } else {
        setError(err.message || 'Failed to create passkey')
      }
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
    } catch (err) {
      setError(err.message || 'Confirmation failed')
      setLoading(false)
    }
  }

  // Utility functions
  const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        
        {/* Email Entry */}
        {step === 'email' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="text-blue-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Create Your Cairn</h2>
            <p className="text-slate-600 text-center mb-6">
              Begin with email verification
            </p>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
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
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Email Verification */}
        {step === 'verification' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Verify Your Email</h2>
            <p className="text-slate-600 text-center mb-6">
              Enter the 6-digit code sent to {email}
            </p>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-center text-2xl font-mono focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        )}

        {/* Passkey Creation */}
        {step === 'passkey' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Key className="text-purple-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Create Your Passkey</h2>
            <p className="text-slate-600 text-center mb-6">
              Your device will secure your identity
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-semibold mb-2">Zero-Knowledge Security:</p>
              <ul className="text-xs text-blue-800 flex flex-col gap-1">
                <li>• Your passkey stays on your device</li>
                <li>• Cairn Zero never sees your private key</li>
                <li>• You maintain complete sovereignty</li>
              </ul>
            </div>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handlePasskeyCreation}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating Passkey...' : 'Create Passkey'}
            </button>
          </div>
        )}

        {/* Sovereignty Confirmation */}
        {step === 'sovereignty' && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Sovereignty Established</h2>
            <p className="text-slate-600 text-center mb-6">
              Your passkey has been created
            </p>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-600 mb-2">Your Ethereum Address:</p>
              <p className="font-mono text-sm text-slate-900 break-all">{ethereumAddress}</p>
              <p className="text-xs text-slate-500 mt-2">
                Derived from your passkey (no private key stored)
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-3">I acknowledge:</h3>
              <ul className="text-sm text-blue-800 flex flex-col gap-2">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>I am the sole holder of my private key</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>My passkey is stored in my device hardware</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Cairn Zero cannot access my private key</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>I am responsible for device security</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Loss of device may result in loss of access</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSovereigntyConfirmation}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Confirming...' : 'Accept Zero-Knowledge Sovereignty'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
