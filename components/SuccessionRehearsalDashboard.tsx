
'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock, Users } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface OnboardingGate {
  id: string
  founder_id: string
  email_verified: boolean
  sovereignty_confirmed: boolean
  passkey_created: boolean
  successor_designated: boolean
  rehearsal_completed: boolean
  onboarding_complete: boolean
  completed_at: string | null
}

interface SuccessionRehearsal {
  id: string
  founder_id: string
  successor_id: string
  test_marker_id: string
  status: string
  sent_at: string
  unwrapped_at: string | null
  verified_at: string | null
}

export default function SuccessionRehearsalDashboard() {
  const supabase = createClientComponentClient()
  const [gate, setGate] = useState<OnboardingGate | null>(null)
  const [rehearsals, setRehearsals] = useState<SuccessionRehearsal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch onboarding gate
      const { data: gateData, error: gateError } = await supabase
        .from('onboarding_gates')
        .select('*')
        .eq('founder_id', user.id)
        .single()

      if (gateError) throw gateError
      setGate(gateData)

      // Fetch rehearsals
      const { data: rehearsalData, error: rehearsalError } = await supabase
        .from('succession_rehearsals')
        .select('*')
        .eq('founder_id', user.id)
        .order('sent_at', { ascending: false })

      if (rehearsalError) throw rehearsalError
      setRehearsals(rehearsalData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Succession Rehearsal Dashboard</h1>

        {/* Onboarding Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Onboarding Progress</h2>
          <div className="space-y-3">
            <ProgressItem 
              completed={gate?.email_verified || false} 
              label="Email Verified" 
            />
            <ProgressItem 
              completed={gate?.sovereignty_confirmed || false} 
              label="Sovereignty Waiver Confirmed" 
            />
            <ProgressItem 
              completed={gate?.passkey_created || false} 
              label="Passkey Created" 
            />
            <ProgressItem 
              completed={gate?.successor_designated || false} 
              label="Successor Designated" 
            />
            <ProgressItem 
              completed={gate?.rehearsal_completed || false} 
              label="Rehearsal Completed" 
            />
          </div>
        </div>

        {/* Rehearsal Section */}
        {gate?.successor_designated && !gate?.rehearsal_completed && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-900">Rehearsal Pending</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  Complete your succession rehearsal to ensure your bridge is functional.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/rehearsal/start'}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
            >
              Start Rehearsal
            </button>
          </div>
        )}

        {/* Rehearsal History */}
        {rehearsals.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Rehearsal History</h2>
            <div className="space-y-4">
              {rehearsals.map((rehearsal) => (
                <div 
                  key={rehearsal.id}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rehearsal.status === 'verified' ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : rehearsal.status === 'unwrapped' ? (
                        <Clock className="text-blue-600" size={24} />
                      ) : (
                        <Users className="text-slate-400" size={24} />
                      )}
                      <div>
                        <p className="font-medium">Test Marker: {rehearsal.test_marker_id}</p>
                        <p className="text-sm text-slate-600">
                          Status: <span className="capitalize">{rehearsal.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>Sent: {new Date(rehearsal.sent_at).toLocaleDateString()}</p>
                      {rehearsal.verified_at && (
                        <p className="text-green-600">
                          Verified: {new Date(rehearsal.verified_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {gate?.onboarding_complete && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mt-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h3 className="font-semibold text-green-900">Onboarding Complete!</h3>
                <p className="text-green-800 text-sm mt-1">
                  Your succession bridge is fully configured and tested.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressItem({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
      )}
      <span className={completed ? 'text-slate-900' : 'text-slate-500'}>
        {label}
      </span>
    </div>
  )
}
