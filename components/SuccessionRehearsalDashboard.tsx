import { useState, useEffect } from 'react'
import { Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function SuccessionRehearsalDashboard({ founderId }: { founderId: string }) {
  const [gate, setGate] = useState(null)
  const [rehearsal, setRehearsal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOnboardingStatus()
  }, [])

  const fetchOnboardingStatus = async () => {
    const response = await fetch(`/api/onboarding/status?founderId=${founderId}`)
    const data = await response.json()
    setGate(data.gate)
    setRehearsal(data.rehearsal)
    setLoading(false)
  }

  const createTestMarker = async () => {
    setLoading(true)
    const response = await fetch('/api/rehearsal/create-test-marker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        founderId,
        successorId: 'successor-id-here',
        testMessage: 'Succession bridge test successful!'
      })
    })
    await fetchOnboardingStatus()
    setLoading(false)
  }

  if (loading) return <div className="p-8">Loading...</div>

  const checkpoints = [
    { key: 'email_verified', label: 'Email Verified', icon: Shield },
    { key: 'passkey_created', label: 'Passkey Created', icon: Shield },
    { key: 'wallet_derived', label: 'Wallet Derived', icon: Shield },
    { key: 'sovereignty_confirmed', label: 'Sovereignty Confirmed', icon: Shield },
    { key: 'successor_designated', label: 'Successor Designated', icon: Shield },
    { key: 'rehearsal_completed', label: 'Rehearsal Completed', icon: CheckCircle }
  ]

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Onboarding Progress</h1>

      {/* Progress Checklist */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Checklist</h2>
        <div className="flex flex-col gap-3">
          {checkpoints.map(({ key, label, icon: Icon }) => {
            const completed = gate?.[key]
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  completed ? 'bg-green-500' : 'bg-slate-200'
                }`}>
                  {completed && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={completed ? 'text-slate-900' : 'text-slate-500'}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rehearsal Section */}
      {gate?.successor_designated && !gate?.rehearsal_completed && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">
                Succession Rehearsal Required
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                Before your Cairn becomes active, you must complete a succession rehearsal. 
                This ensures the succession bridge is functional.
              </p>
              <button
                onClick={createTestMarker}
                disabled={loading}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Creating Test Marker...' : 'Start Rehearsal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rehearsal Status */}
      {rehearsal && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold mb-4">Rehearsal Status</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Test Marker ID:</span>
              <span className="font-mono text-sm">{rehearsal.test_marker_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className={`font-semibold ${
                rehearsal.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {rehearsal.status.toUpperCase()}
              </span>
            </div>
            {rehearsal.verified_at && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✓ Rehearsal Complete! Your succession bridge is verified and functional.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Complete */}
      {gate?.onboarding_complete && (
        <div className="mt-8 p-6 bg-green-500 text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-2">🎉 Onboarding Complete</h2>
          <p>Your Cairn is now active and protecting your business continuity.</p>
        </div>
      )}
    </div>
  )
}
