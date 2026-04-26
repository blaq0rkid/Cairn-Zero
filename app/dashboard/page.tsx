
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, Users, Clock, CheckCircle, XCircle, AlertCircle, LogOut, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default function FounderDashboard() {
  const supabase = createClientComponentClient()
  const [successors, setSuccessors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [founderId, setFounderId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSuccessor, setNewSuccessor] = useState({
    email: '',
    full_name: '',
    slot_number: 1
  })

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (profile) {
      setFounderId(profile.id)
      await loadSuccessors(profile.id)
      subscribeToRealtimeUpdates(profile.id)
    }
  }

  const loadSuccessors = async (founderId: string) => {
    const { data, error } = await supabase
      .from('successors')
      .select('*')
      .eq('founder_id', founderId)
      .order('slot_number', { ascending: true })

    if (!error && data) {
      setSuccessors(data)
    }
    setLoading(false)
  }

  const subscribeToRealtimeUpdates = (founderId: string) => {
    const channel = supabase
      .channel('successor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'successors',
          filter: `founder_id=eq.${founderId}`
        },
        (payload) => {
          console.log('🔔 Real-time update:', payload)
          
          if (payload.eventType === 'INSERT') {
            setSuccessors(prev => [...prev, payload.new].sort((a, b) => a.slot_number - b.slot_number))
          } else if (payload.eventType === 'UPDATE') {
            setSuccessors(prev => 
              prev.map(s => s.id === payload.new.id ? payload.new : s)
            )
          } else if (payload.eventType === 'DELETE') {
            setSuccessors(prev => 
              prev.filter(s => s.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleAddSuccessor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!founderId) return

    const invitationToken = `CZ-${Date.now().toString().slice(-4)}`
    
    const { error } = await supabase
      .from('successors')
      .insert({
        founder_id: founderId,
        email: newSuccessor.email,
        full_name: newSuccessor.full_name,
        slot_number: newSuccessor.slot_number,
        invitation_token: invitationToken,
        status: 'pending'
      })

    if (error) {
      alert('Failed to add successor: ' + error.message)
      console.error(error)
    } else {
      setShowAddForm(false)
      setNewSuccessor({ email: '', full_name: '', slot_number: 1 })
    }
  }

  const deleteSuccessorSlot = async (successorId: string) => {
    if (!confirm('Are you sure you want to delete this successor slot? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('successors')
      .delete()
      .eq('id', successorId)

    if (error) {
      alert('Failed to delete successor slot')
      console.error(error)
    }
  }

  const getStatusBadge = (successor: any) => {
    const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300', label: 'Active' },
      accepted: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Accepted' },
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
      invited: { icon: Clock, color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Invited' },
      revoked: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', label: 'Revoked' },
      declined: { icon: XCircle, color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Declined' }
    }

    const config = statusConfig[successor.status] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${config.color}`}>
        <Icon size={16} />
        <span className="text-sm font-semibold">{config.label}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Logo */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
                alt="Cairn Zero" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-slate-900">Cairn Zero</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <Shield className="text-blue-600" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">Founder Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your succession plan</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-slate-700" size={24} />
                <h2 className="text-xl font-semibold text-slate-900">Successor Slots</h2>
                <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  LIVE
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Successor
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Status updates appear in real-time as successors accept or decline invitations
            </p>
          </div>

          {/* Add Successor Form */}
          {showAddForm && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Add New Successor</h3>
              <form onSubmit={handleAddSuccessor} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newSuccessor.full_name}
                    onChange={(e) => setNewSuccessor({ ...newSuccessor, full_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newSuccessor.email}
                    onChange={(e) => setNewSuccessor({ ...newSuccessor, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slot Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newSuccessor.slot_number}
                    onChange={(e) => setNewSuccessor({ ...newSuccessor, slot_number: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Successor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Successor List */}
          {successors.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-slate-400" size={48} />
              <p className="text-slate-600">No successors designated yet</p>
              <p className="text-sm text-slate-500 mt-2">Click "Add Successor" to get started</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {successors.map((successor) => (
                <div
                  key={successor.id}
                  className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded">
                          Slot {successor.slot_number}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {successor.full_name || 'Unnamed Successor'}
                      </h3>
                      <p className="text-sm text-slate-600">{successor.email}</p>
                      {successor.invitation_token && (
                        <p className="text-xs text-blue-600 font-mono mt-2">
                          Code: {successor.invitation_token}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(successor)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    {successor.legal_accepted_at && (
                      <div>
                        <span className="text-slate-500">Accepted:</span>
                        <span className="ml-2 text-slate-900 font-medium">
                          {new Date(successor.legal_accepted_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {successor.legal_version && (
                      <div>
                        <span className="text-slate-500">Legal Version:</span>
                        <span className="ml-2 text-slate-900 font-medium">
                          {successor.legal_version}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSuccessorSlot(successor.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
