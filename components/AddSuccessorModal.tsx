
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X } from 'lucide-react'

interface AddSuccessorModalProps {
  userId: string
  existingSuccessors: any[]
  onClose: () => void
  onSuccess: () => void
}

export default function AddSuccessorModal({ userId, existingSuccessors, onClose, onSuccess }: AddSuccessorModalProps) {
  const supabase = createClientComponentClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [slotNumber, setSlotNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableSlots = [1, 2, 3].filter(
    slot => !existingSuccessors.some(s => s.slot_number === slot)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('successors')
        .insert({
          owner_id: userId,
          name,
          email,
          slot_number: slotNumber,
          status: 'pending'
        })

      if (insertError) throw insertError

      // TODO: Send invitation email to successor
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to add successor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Successor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="slot" className="block text-sm font-semibold text-gray-900 mb-2">
              Successor Slot
            </label>
            <select
              id="slot"
              value={slotNumber}
              onChange={(e) => setSlotNumber(parseInt(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  Slot {slot}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              You can designate up to 3 successors
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || availableSlots.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Successor'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Your successor will receive an invitation email to verify their identity and accept the role.
          </p>
        </div>
      </div>
    </div>
  )
}
