
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Package, Clock, CheckCircle } from 'lucide-react'

interface SuccessionRehearsal {
  id: string
  test_marker_id: string
  test_payload: string
  status: string
  sent_at: string
}

export default function SuccessorPortal({ isTestMode = false }: { isTestMode?: boolean }) {
  const [rehearsals, setRehearsals] = useState<SuccessionRehearsal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMarker, setSelectedMarker] = useState<SuccessionRehearsal | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRehearsals()
  }, [])

  const fetchRehearsals = async () => {
    try {
      // In test mode, fetch via API route to bypass RLS
      if (isTestMode) {
        const response = await fetch('/api/test/rehearsals')
        if (!response.ok) throw new Error('Failed to fetch test rehearsals')
        const data = await response.json()
        setRehearsals(data.rehearsals || [])
      } else {
        // Normal authenticated query
        const { data, error } = await supabase
          .from('succession_rehearsals')
          .select('*')
          .eq('status', 'sent')
          .order('sent_at', { ascending: false })

        if (error) throw error
        setRehearsals(data || [])
      }
    } catch (err) {
      console.error('Error fetching rehearsals:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewMarker = (rehearsal: SuccessionRehearsal) => {
    setSelectedMarker(rehearsal)
  }

  if (selectedMarker) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => setSelectedMarker(null)}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to list
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Test Marker Unwrapped</h2>
            <p className="text-sm text-slate-600">{selectedMarker.test_marker_id}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-700 mb-3">Test Payload:</h3>
          <div className="bg-white border-2 border-slate-200 rounded p-4">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {selectedMarker.test_payload}
            </pre>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Test Mode:</strong> This is simulated data for succession rehearsal purposes.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading markers...</p>
          </div>
        </div>
      </div>
    )
  }

  if (rehearsals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Available Items</h2>
        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-8 text-center">
          <Package className="text-slate-400 mx-auto mb-3" size={48} />
          <p className="text-slate-600">
            No items available at this time.
          </p>
          {isTestMode && (
            <p className="text-xs text-slate-500 mt-2">
              Debug: Test mode active, but no rehearsals found in database
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-4">Available Test Markers</h2>
      
      <div className="space-y-4">
        {rehearsals.map((rehearsal) => (
          <div
            key={rehearsal.id}
            className="border-2 border-slate-200 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => handleViewMarker(rehearsal)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {rehearsal.test_marker_id}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={14} />
                    <span>
                      Sent: {new Date(rehearsal.sent_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {rehearsal.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
