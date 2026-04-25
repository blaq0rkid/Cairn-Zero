
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, Key, Clock, CheckCircle, Lock, Unlock, AlertTriangle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

// SANDBOX MODE - Hardware key emulation
const SANDBOX_MODE = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'sandbox'

export default function SuccessorDashboard() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [founderData, setFounderData] = useState<any>(null)
  const [accessKey, setAccessKey] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showWelcome, setShowWelcome] = useState(searchParams?.get('welcome') === 'true')
  
  // Sandbox: Simulate archive key always inserted
  const [isArchiveKeyInserted] = useState(SANDBOX_MODE ? true : false)

  useEffect(() => {
    const fetchSuccessorInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }

      // Find successor record for this user
      const { data: successor, error } = await supabase
        .from('successors')
        .select('*, profiles!successors_founder_id_fkey(email, created_at)')
        .eq('email', user.email)
        .eq('status', 'active')
        .single()

      if (error || !successor) {
        console.error('Not a valid successor:', error)
        return
      }

      // Check if legal terms were accepted
      if (!successor.legal_accepted_at) {
        alert('You must accept the Successor Revocation Protocol before accessing this dashboard.')
        return
      }

      setSuccessorData(successor)
      setFounderData(successor.profiles)
      setLoading(false)
    }

    fetchSuccessorInfo()
  }, [])

  const handleAccessKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sandbox: Accept any cz- prefixed key
    if (SANDBOX_MODE) {
      if (accessKey.toLowerCase().startsWith('cz-')) {
        setIsUnlocked(true)
        return
      }
    }
    
    // Production: Validate actual access key
    // TODO: Implement real validation against encrypted founder data
    alert('Invalid access key. Please check and try again.')
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

            <form onSubmit={handleAccessKeySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cairn Access Key (cz-XXXX)
                </label>
                <input
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder={SANDBOX_MODE ? "Enter cz-2026 (sandbox)" : "Enter cz-XXXX"}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  disabled={!isArchiveKeyInserted}
                />
                {!isArchiveKeyInserted && (
                  <p className="text-sm text-red-600 mt-1">Archive Key must be connected</p>
                )}
                {SANDBOX_MODE && (
                  <p className="text-xs text-gray-500 mt-1">Sandbox: Any key starting with "cz-" will work</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isArchiveKeyInserted || !accessKey}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <Unlock size={20} />
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Unlock className="text-green-600" size={24} />
                <h2 className="text-xl font-bold">Access Granted</h2>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-700">
                  <strong>Note:</strong> You have unlocked the dashboard view. In production, this would display the founder's succession duties and encrypted data access instructions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Succession Duties</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Access company email accounts using provided credentials</li>
                    <li>Notify key business contacts of succession event</li>
                    <li>Transfer domain registrations to designated party</li>
                    <li>Archive critical business documents</li>
                  </ul>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Encrypted Data Access</h3>
                  <p className="text-sm text-gray-600 mb-3">The following data vaults are available:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm font-medium">Business Credentials Vault</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Decrypt
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm font-medium">Legal Documents Archive</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
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
