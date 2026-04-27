
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Edit } from 'lucide-react'
import FounderCheckIn from '@/components/FounderCheckIn'
import SystemHealthIndicator from '@/components/SystemHealthIndicator'

interface Successor {
  id: string
  email: string
  full_name: string
  invitation_token: string
  status: string
  slot_number: number
  guidepost_instructions: string | null
  legal_accepted_at: string | null
  created_at: string
}

export default function FounderDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [successors, setSuccessors] = useState<Successor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGuidepost, setEditingGuidepost] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    loadSuccessors()
    setupRealtimeSubscription()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    }
  }

  const loadSuccessors = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('successors')
      .select('*')
      .eq('founder_id', user.id)
      .order('slot_number', { ascending: true })

    if (error) {
      return
    }

    setSuccessors(data || [])
    setLoading(false)
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('successors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'successors'
        },
        () => {
          loadSuccessors()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAddSuccessor = async (email: string, fullName: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const nextSlot = successors.length > 0 
      ? Math.max(...successors.map(s => s.slot_number)) + 1 
      : 1

    const invitationToken = `CZ-${Date.now().toString().slice(-4)}`

    const { error } = await supabase
      .from('successors')
      .insert({
        founder_id: user.id,
        email,
        full_name: fullName,
        invitation_token: invitationToken,
        slot_number: nextSlot,
        sequence_order: nextSlot,
        status: 'pending'
      })

    if (!error) {
      setShowAddModal(false)
      loadSuccessors()
    }
  }

  const handleDeleteSuccessor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this successor? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('successors')
      .delete()
      .eq('id', id)

    if (!error) {
      loadSuccessors()
    }
  }

  const handleUpdateGuidepost = async (successorId: string, instructions: string) => {
    const { error } = await supabase
      .from('successors')
      .update({ guidepost_instructions: instructions })
      .eq('id', successorId)

    if (!error) {
      setEditingGuidepost(null)
      loadSuccessors()
    }
  }

  const getStatusBadge = (status: string, legalAccepted: string | null) => {
    if (legalAccepted) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
          Active
        </span>
      )
    }

    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
            Pending
          </span>
        )
      case 'declined':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
            Declined
          </span>
        )
      case 'revoked':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
            Revoked
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
                alt="Cairn Zero" 
                className="h-10 w-10 object-contain" 
              />
              <span className="text-xl font-bold text-slate-900">Cairn Zero</span>
            </div>
            <div className="flex items-center gap-4">
              <SystemHealthIndicator />
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Founder Dashboard</h1>
          <p className="text-slate-600">Manage your digital succession plan</p>
        </div>

        {/* Check-In Widget */}
        <div className="mb-8">
          <FounderCheckIn />
        </div>

        {/* Successors Section */}
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Successors</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Successor
            </button>
          </div>

          {successors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No successors added yet</p>
              <p className="text-sm text-slate-500">
                Add your first successor to begin your succession plan
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {successors.map((successor) => (
                <div
                  key={successor.id}
                  className="border-2 border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Slot {successor.slot_number}: {successor.full_name || 'Unnamed'}
                        </h3>
                        {getStatusBadge(successor.status, successor.legal_accepted_at)}
                      </div>
                      <p className="text-sm text-slate-600">{successor.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Code: <span className="font-mono font-semibold">{successor.invitation_token}</span>
                      </p>
                      {successor.legal_accepted_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Accepted: {new Date(successor.legal_accepted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSuccessor(successor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Guidepost Section */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    {editingGuidepost === successor.id ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Guidepost Instructions
                        </label>
                        <textarea
                          defaultValue={successor.guidepost_instructions || ''}
                          rows={4}
                          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none"
                          placeholder="Enter instructions for this successor..."
                          onBlur={(e) => handleUpdateGuidepost(successor.id, e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement
                              handleUpdateGuidepost(successor.id, textarea.value)
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingGuidepost(null)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Guidepost Instructions
                          </span>
                          <button
                            onClick={() => setEditingGuidepost(successor.id)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                          {successor.guidepost_instructions || 'No instructions set yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Successor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Successor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddSuccessor(
                  formData.get('email') as string,
                  formData.get('fullName') as string
                )
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Successor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
