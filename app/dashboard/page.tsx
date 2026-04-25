
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardSkeleton from '@/components/DashboardSkeleton'
import AddSuccessorModal from '@/components/AddSuccessorModal'
import SimulateSuccessionModal from '@/components/SimulateSuccessionModal'
import { Mail, CheckCircle, Clock, Trash2 } from 'lucide-react'

interface Successor {
  id: string
  founder_id: string
  successor_id: string | null
  email: string
  full_name: string | null
  sequence_order: number
  cairn_device_id: string | null
  status: string
  invitation_token: string | null
  notified_at: string | null
  accessed_at: string | null
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [successors, setSuccessors] = useState<Successor[]>([])
  const [showAddSuccessor, setShowAddSuccessor] = useState(false)
  const [showSimulate, setShowSimulate] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  useEffect(() => {
    const initializeDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/login')
        return
      }

      setUserId(session.user.id)
      await fetchDashboardData(session.user.id)
    }

    initializeDashboard()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const fetchDashboardData = async (userId: string) => {
    const { data: successorsData } = await supabase
      .from('successors')
      .select('*')
      .eq('founder_id', userId)
      .neq('status', 'revoked')

    setSuccessors(successorsData || [])
    setLoading(false)
  }

  const handleSuccessorAdded = () => {
    if (userId) {
      fetchDashboardData(userId)
    }
    setShowAddSuccessor(false)
  }

  const handleSimulationComplete = () => {
    if (userId) {
      fetchDashboardData(userId)
    }
    setShowSimulate(false)
  }

  const handleRevoke = async (successorId: string, successorName: string) => {
    if (!confirm(`Are you sure you want to revoke ${successorName}'s designation? This action cannot be undone and will require re-invitation.`)) {
      return
    }

    setRevokingId(successorId)

    try {
      const response = await fetch('/api/successors/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ successorId })
      })

      if (!response.ok) {
        throw new Error('Failed to revoke successor')
      }

      if (userId) {
        await fetchDashboardData(userId)
      }
    } catch (error) {
      alert('Failed to revoke successor. Please try again.')
    } finally {
      setRevokingId(null)
    }
  }

  const getStatusBadge = (successor: Successor) => {
    if (successor.status === 'active' && successor.accessed_at) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          <CheckCircle size={16} />
          Active
        </span>
      )
    }
    
    if (successor.notified_at) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          <Mail size={16} />
          Invitation Sent
        </span>
      )
    }
    
    return (
      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
        <Clock size={16} />
        Pending
      </span>
    )
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Founder Portal</h1>
            <p className="text-gray-600">Manage your succession plan</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Designated Successors</h2>
            {successors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No successors designated yet</p>
                <button 
                  onClick={() => setShowAddSuccessor(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Successor
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-4">
                  {successors.map((successor) => (
                    <div key={successor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Slot {successor.sequence_order}: {successor.full_name}</p>
                        <p className="text-sm text-gray-600">{successor.email}</p>
                        {successor.notified_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Invited {new Date(successor.notified_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(successor)}
                        <button
                          onClick={() => handleRevoke(successor.id, successor.full_name || 'this successor')}
                          disabled={revokingId === successor.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Revoke designation"
                        >
                          {revokingId === successor.id ? (
                            <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {successors.length < 3 && (
                  <button 
                    onClick={() => setShowAddSuccessor(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Another Successor
                  </button>
                )}
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Your Plan</h2>
            <p className="text-gray-600 mb-4">
              Run a simulation to verify your succession configuration works correctly
            </p>
            <button 
              onClick={() => setShowSimulate(true)}
              disabled={successors.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simulate Succession
            </button>
            {successors.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Add at least one successor to run simulations</p>
            )}
          </div>
        </div>
      </div>

      {showAddSuccessor && (
        <AddSuccessorModal
          userId={userId!}
          existingSuccessors={successors}
          onClose={() => setShowAddSuccessor(false)}
          onSuccess={handleSuccessorAdded}
        />
      )}

      {showSimulate && (
        <SimulateSuccessionModal
          userId={userId!}
          successors={successors}
          onClose={() => setShowSimulate(false)}
          onComplete={handleSimulationComplete}
        />
      )}
    </>
  )
}
