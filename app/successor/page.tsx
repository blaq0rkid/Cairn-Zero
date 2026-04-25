
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, Key, Clock, CheckCircle, Lock, Unlock, AlertTriangle, FileText } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

const SANDBOX_MODE = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'sandbox'

export default function SuccessorDashboard() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [founderData, setFounderData] = useState<any>(null)
  const [accessKey, setAccessKey] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showWelcome, setShowWelcome] = useState(searchParams?.get('welcome') === 'true')
  const [validationError, setValidationError] = useState('')
  const [showLegalGate, setShowLegalGate] = useState(false)
  
  const [isArchiveKeyInserted] = useState(SANDBOX_MODE ? true : false)

  useEffect(() => {
    const fetchSuccessorInfo = async () => {
      try {
        console.log('🔍 Fetching user session...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.log('❌ No authenticated user')
          router.push('/successor/login')
          return
        }

        console.log('✅ User authenticated:', user.email)

        // Find successor record
        const { data: successor, error: successorError } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .eq('email', user.email)
          .single()

        if (successorError || !successor) {
          console.error('❌ Not a successor:', successorError)
          setError('You are not registered as a successor.')
          setLoading(false)
          return
        }

        console.log('✅ Successor record found:', successor)

        // CRITICAL: Legal gating check
        if (!successor.legal_accepted_at) {
          console.log('🚨 LEGAL GATE TRIGGERED: No legal acceptance timestamp')
          setShowLegalGate(true)
          setLoading(false)
          return
        }

        if (successor.status !== 'active') {
          console.log('⚠️ Successor status is:', successor.status)
          setError(`Your successor status is "${successor.status}". Please accept your invitation first.`)
          setLoading(false)
          return
        }

        console.log('✅ Legal gate passed, loading dashboard')
        setSuccessorData(successor)
        setFounderData(successor.profiles)
        setLoading(false)
      } catch (err: any) {
        console.error('❌ Unexpected error:', err)
        setError(`An unexpected error occurred: ${err.message}`)
        setLoading(false)
      }
    }

    fetchSuccessorInfo()
  }, [])

  const handleAccessKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    
    const trimmedKey = accessKey.trim()
    const normalizedKey = trimmedKey.toUpperCase()
    
    // Sandbox: Accept CZ-2026 or any CZ- prefix
    if (SANDBOX_MODE) {
      if (normalizedKey === 'CZ-2026' || normalizedKey.startsWith('CZ-')) {
        console.log('✅ Sandbox mode: Access key validated -', trimmedKey)
        setIsUnlocked(true)
        return
      } else {
        setValidationError('Access key must start with "CZ-" (e.g., CZ-2026)')
        return
      }
    }
    
    setValidationError('Invalid access key. Please verify and try again.')
  }

  // LEGAL GATE: Block all dashboard access until legal terms accepted
  if (showLegalGate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <FileText className="mx-auto mb-4 text-red-600" size={64} />
            <h1 className="text-3xl font-bold mb-2 text-red-900">Legal Gateway Required</h1>
            <p className="text-gray-600">You must accept the Successor Acceptance Declaration before accessing this portal.</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-red-800 font-semibold mb-3">Access Denied: Missing Legal Acceptance</p>
            <p className="text-sm text-gray-700">
              In accordance with Zero-Knowledge Sovereignty principles, you must formally accept the legal responsibilities 
              of being a successor before any technical systems or data can be accessed.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Next Steps:</strong>
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-700 mt-2 flex flex-col gap-1">
              <li>Check your email for the original invitation link</li>
              <li>Click the invitation link to view the legal declaration</li>
              <li>Accept the terms to activate your successor status</li>
              <li>Return here to access the dashboard</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/successor/login')}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Back to Login
            </button>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-gray-600">Loading successor dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-600" size={64} />
          <h2 className="text-2xl font-bold text-red-900 mb-3">Access Error</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/successor/login')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {showWelcome && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-green-900 mb-1">Welcome, {successorData.full_name}!</h3>
              <p className="text-green-700">You have successfully accepted your designation as Successor #{successorData.sequence_order}. Your access is currently in <strong>Standby Mode</strong>.</p>
              <button 
                onClick={() => setShowWelcome(false)}
                className="mt-3 text-sm text-green-600 hover:text-green-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold">Successor Dashboard</h1>
              <p className="text-gray-600">Designated by: {founderData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Your Slot</p>
              <p className="text-2xl font-bold text-blue-600">#{successorData.sequence_order}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Trigger Status</p>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-600" size={20} />
                <p className="text-xl font-bold text-yellow-600">Standby</p>
              </div>
            </div>

            <div className={`border rounded-lg p-4 ${isArchiveKeyInserted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm text-gray-600 mb-1">Archive Key</p>
              <div className="flex items-center gap-2">
                <Key className={isArchiveKeyInserted ? 'text-green-600' : 'text-red-600'} size={20} />
                <p className={`text-xl font-bold ${isArchiveKeyInserted ? 'text-green-600' : 'text-red-600'}`}>
                  {isArchiveKeyInserted ? 'Connected' : 'Not Detected'}
                </p>
              </div>
              {SANDBOX_MODE && isArchiveKeyInserted && (
                <p className="text-xs text-green-600 mt-1">Sandbox Mode Active</p>
              )}
            </div>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-gray-600" size={24} />
              <h2 className="text-xl font-bold">Access Locked</h2>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Founder Status: Active</p>
                  <p className="text-gray-700">The founder is currently active. Access to duties and data is restricted until succession trigger conditions are verified.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAccessKeySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cairn Access Key
                </label>
                <input
                  type="text"
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value)
                    setValidationError('')
                  }}
                  placeholder={SANDBOX_MODE ? "Enter CZ-2026" : "Enter CZ-XXXX"}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                  disabled={!isArchiveKeyInserted}
                />
                {!isArchiveKeyInserted && (
                  <p className="text-sm text-red-600 mt-2">Archive Key must be connected</p>
                )}
                {SANDBOX_MODE && (
                  <p className="text-xs text-blue-600 mt-2">
                    🧪 Sandbox Mode: Enter "CZ-2026" to unlock dashboard
                  </p>
                )}
                {validationError && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {validationError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isArchiveKeyInserted || !accessKey.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Unlock size={20} />
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">Access Granted</p>
                <p className="text-sm text-green-700">Cairn ID: {accessKey.toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Unlock className="text-green-600" size={24} />
                <h2 className="text-xl font-bold">Succession Dashboard</h2>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> In production, this view displays the founder's succession duties and encrypted data access instructions. Currently showing sandbox placeholder content.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Shield className="text-blue-600" size={20} />
                    Succession Duties
                  </h3>
                  <ul className="list-disc list-inside flex flex-col gap-2 text-gray-700 text-sm">
                    <li>Access company email accounts using provided credentials</li>
                    <li>Notify key business contacts of succession event</li>
                    <li>Transfer domain registrations to designated party</li>
                    <li>Archive critical business documents to secure storage</li>
                    <li>Execute documented business continuity procedures</li>
                  </ul>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Key className="text-blue-600" size={20} />
                    Encrypted Data Vaults
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">The following data vaults are available for decryption:</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="text-sm font-medium">Business Credentials Vault</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        Decrypt
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="text-sm font-medium">Legal Documents Archive</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        Decrypt
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="text-sm font-medium">Client Contact Database</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        Decrypt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
