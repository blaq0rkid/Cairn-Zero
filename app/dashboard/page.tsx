
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import AddSuccessorModal from '@/components/AddSuccessorModal'
import { Shield, Mail, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Successor {
  id: string
  email: string
  full_name: string | null
  sequence_order: number
  status: string
  notified_at: string | null
  accessed_at: string | null
}

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [successors, setSuccessors] = useState<Successor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchSuccessors = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('successors')
      .select('*')
      .eq('founder_id', user.id)
      .neq('status', 'revoked')
      .order('sequence_order')

    if (error) {
      console.error('Error fetching successors:', error)
    } else {
      setSuccessors(data || [])
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSuccessors()

      // Set up real-time subscription
      const channel = supabase
        .channel('successors-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'successors',
            filter: `founder_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time update:', payload)
            // Refetch successors when any change occurs
            fetchSuccessors()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const handleSendInvitation = async (successor: Successor) => {
    try {
      const response = await fetch('/api/successors/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successorEmail: successor.email,
          successorName: successor.full_name,
          founderEmail: user?.email
        })
      })

      if (response.ok) {
        alert('Invitation sent successfully!')
        fetchSuccessors()
      } else {
        const error = await response.json()
        alert(`Failed to send invitation: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Failed to send invitation')
    }
  }

  const handleRevoke = async (successorId: string) => {
    if (!confirm('Are you sure you want to revoke this successor?')) return

    try {
      const response = await fetch('/api/successors/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successorId })
      })

      if (response.ok) {
        alert('Successor revoked successfully')
        fetchSuccessors()
      } else {
        const error = await response.json()
        alert(`Failed to revoke: ${error.error}`)
      }
    } catch (error) {
      console.error('Error revoking successor:', error)
      alert('Failed to revoke successor')
    }
  }

  const getStatusIcon = (successor: Successor) => {
    if (successor.accessed_at) {
      return <CheckCircle className="text-green-600" size={20} />
    } else if (successor.notified_at) {
      return <Clock className="text-yellow-600" size={20} />
    }
    return <Mail className="text-gray-400" size={20} />
  }

  const getStatusText = (successor: Successor) => {
    if (successor.accessed_at) {
      return 'Active'
    } else if (successor.notified_at) {
      return 'Invited'
    }
    return 'Pending'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const occupiedSlots = successors.map(s => s.sequence_order)
  const availableSlots = [1, 2, 3].filter(slot => !occupiedSlots.includes(slot))

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Founder Dashboard</h1>
          <p className="text-gray-600">Manage your succession plan</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Successors</h2>
            {availableSlots.length > 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Successor
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(slot => {
              const successor = successors.find(s => s.sequence_order === slot)
              
              return (
                <div
                  key={slot}
                  className={`border-2 rounded-lg p-4 ${
                    successor ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">Slot {slot}</h3>
                    {successor && getStatusIcon(successor)}
                  </div>

                  {successor ? (
                    <div>
                      <p className="font-semibold">{successor.full_name}</p>
                      <p className="text-sm text-gray-600">{successor.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          successor.accessed_at ? 'bg-green-100 text-green-800' :
                          successor.notified_at ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(successor)}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {!successor.notified_at && (
                          <button
                            onClick={() => handleSendInvitation(successor)}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Send Invite
                          </button>
                        )}
                        <button
                          onClick={() => handleRevoke(successor.id)}
                          className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-4">
                      <Shield size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Available</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddSuccessorModal
          userId={user!.id}
          existingSuccessors={successors}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchSuccessors()
          }}
        />
      )}
    </div>
  )
}
