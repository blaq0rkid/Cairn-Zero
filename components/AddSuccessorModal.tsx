
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X } from 'lucide-react'

interface Successor {
  id: string
  email: string
  full_name: string | null
  sequence_order: number
}

interface AddSuccessorModalProps {
  userId: string
  existingSuccessors: Successor[]
  onClose: () => void
  onSuccess: () => void
}

export default function AddSuccessorModal({ userId, existingSuccessors, onClose, onSuccess }: AddSuccessorModalProps) {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine which slots are occupied (have valid email and id)
  const occupiedSlots = existingSuccessors
    .filter(s => s.email && s.id)
    .map(s => s.sequence_order)

  const availableSlots = [1, 2, 3].filter(slot => !occupiedSlots.includes(slot))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSlot) {
      setError('Please select a slot')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Insert successor record
      const { error: insertError } = await supabase
        .from('successors')
        .insert({
          founder_id: userId,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          sequence_order: selectedSlot,
          status: 'pending'
        })

      if (insertError) throw insertError

      onSuccess()
    } catch (err: any) {
      console.error('Error adding successor:', err)
      setError(err.message || 'Failed to add successor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Successor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Slot
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map(slot => {
                const isOccupied = occupiedSlots.includes(slot)
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !isOccupied && setSelectedSlot(slot)}
                    disabled={isOccupied}
                    className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-colors ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isOccupied
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    Slot {slot}
                    {isOccupied && <div className="text-xs mt-1">Occupied</div>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSlot}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Successor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
