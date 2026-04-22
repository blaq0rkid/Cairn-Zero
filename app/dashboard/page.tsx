
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardSkeleton from '@/components/DashboardSkeleton'
import { calculateSafeHarborStatus, type Successor, type SuccessionPlaybook, type SeparationAttestation, type Heartbeat } from '@/lib/safeHarbor'
import { logSafeHarborStatusChange } from '@/lib/safeHarborLogger'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [successors, setSuccessors] = useState<Successor[]>([])
  const [successionPlaybook, setSuccessionPlaybook] = useState<SuccessionPlaybook | null>(null)
  const [separationAttestation, setSeparationAttestation] = useState<SeparationAttestation | null>(null)
  const [heartbeat, setHeartbeat] = useState<Heartbeat | null>(null)

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/login')
        return
      }

      setUserId(session.user.id)
      
      // Fetch all dashboard data
      const [successorsRes, playbookRes, attestationRes, heartbeatRes] = await Promise.all([
        supabase.from('successors').select('*').eq('founder_id', session.user.id),
        supabase.from('succession_playbook').select('*').eq('founder_id', session.user.id).single(),
        supabase.from('separation_attestation').select('*').eq('founder_id', session.user.id).single(),
        supabase.from('heartbeat').select('*').eq('founder_id', session.user.id).order('created_at', { ascending: false }).limit(1).single()
      ])

      setSuccessors(successorsRes.data || [])
      setSuccessionPlaybook(playbookRes.data)
      setSeparationAttestation(attestationRes.data)
      setHeartbeat(heartbeatRes.data)
      
      setLoading(false)
    }

    initializeDashboard()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  if (loading) {
    return <DashboardSkeleton />
  }

  // Calculate Safe Harbor status
  const safeHarborState = calculateSafeHarborStatus(
    successors,
    successionPlaybook,
    'CURRENT', // This should come from your subscription system
    separationAttestation,
    heartbeat
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'VOID':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Founder Portal</h1>
          <p className="text-gray-600">Manage your succession plan and Safe Harbor status</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Safe Harbor Status</h2>
              <p className="text-sm text-gray-600">
                {safeHarborState.reason || 'All protections active'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(safeHarborState.status)}`}>
              {safeHarborState.status}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Designated Successors</h2>
          {successors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No successors designated yet</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Successor
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {successors.map((successor) => (
                <div key={successor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Slot {successor.slot_number}: {successor.name}</p>
                    <p className="text-sm text-gray-600">{successor.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    successor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {successor.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Your Plan</h2>
          <p className="text-gray-600 mb-4">
            Run a simulation to verify your succession configuration works correctly
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Simulate Succession
          </button>
        </div>
      </div>
    </div>
  )
}
