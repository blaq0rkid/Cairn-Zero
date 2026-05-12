
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface SuccessionRehearsal {
  id: string
  test_marker_id: string
  status: 'pending' | 'sent' | 'unwrapped' | 'verified' | 'failed'
  payload: string
  encrypted_payload?: string
  sent_at: string
  updated_at?: string
}

export default function SuccessorPortal() {
  const searchParams = useSearchParams()
  const testKey = searchParams?.get('testKey')
  const [rehearsals, setRehearsals] = useState<SuccessionRehearsal[]>([])
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRehearsals()
  }, [])

  async function fetchRehearsals() {
    setLoading(true)
    try {
      const response = await fetch('/api/test/rehearsals')
      const data = await response.json()
      
      if (data.success && data.rehearsals) {
        setRehearsals(data.rehearsals)
      }
    } catch (error) {
      console.error('Error fetching rehearsals:', error)
    }
    setLoading(false)
  }

  const isTestMode = testKey === 'cz-2026'

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      unwrapped: 'bg-green-100 text-green-800',
      verified: 'bg-purple-100 text-purple-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPayloadContent = (rehearsal: SuccessionRehearsal): string => {
    return rehearsal.payload || rehearsal.encrypted_payload || 'No payload available'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isTestMode && (
        <div className="max-w-4xl mx-auto mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-800 font-bold">TEST MODE ACTIVE ({testKey})</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            This is a succession rehearsal. No real credentials at risk.
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Successor Portal</h1>
          <p className="text-gray-600 mb-8">Access protected information</p>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Available Test Markers</h2>
            <button
              onClick={fetchRehearsals}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>

          {rehearsals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No succession rehearsals found
            </div>
          ) : (
            <div className="space-y-4">
              {rehearsals.map((rehearsal) => (
                <div
                  key={rehearsal.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rehearsal.test_marker_id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(rehearsal.status)}`}>
                          {rehearsal.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Sent: {new Date(rehearsal.sent_at).toLocaleDateString()}</p>
                        {rehearsal.updated_at && rehearsal.status === 'unwrapped' && (
                          <p className="text-green-600 font-medium">
                            Unwrapped: {new Date(rehearsal.updated_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPayload(
                        selectedPayload === rehearsal.id ? null : rehearsal.id
                      )}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      disabled={rehearsal.status !== 'unwrapped'}
                    >
                      {selectedPayload === rehearsal.id ? 'Hide' : 'View'}
                    </button>
                  </div>

                  {selectedPayload === rehearsal.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Encrypted Payload:
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-800 break-all">
                        {getPayloadContent(rehearsal)}
                      </div>
                      {rehearsal.status === 'unwrapped' && getPayloadContent(rehearsal) !== 'No payload available' && (
                        <div className="mt-3 text-xs text-green-600 font-medium">
                          ✓ Payload successfully retrieved
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
