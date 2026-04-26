
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function SuccessorDebugPage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function diagnose() {
      const results: any = {
        auth: null,
        successor: null,
        session: {},
        errors: []
      }

      try {
        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) {
          results.errors.push(`Auth error: ${authError.message}`)
        }
        results.auth = user ? {
          id: user.id,
          email: user.email
        } : null

        // Check session storage
        results.session = {
          portal_context: sessionStorage.getItem('portal_context'),
          claim_code: sessionStorage.getItem('claim_code'),
          successor_record_id: sessionStorage.getItem('successor_record_id'),
          successor_email: sessionStorage.getItem('successor_email'),
          successor_verified: sessionStorage.getItem('successor_verified')
        }

        // Check successor record
        if (user) {
          const { data: successor, error: successorError } = await supabase
            .from('successors')
            .select('*')
            .eq('email', user.email)
            .single()

          if (successorError) {
            results.errors.push(`Successor lookup error: ${successorError.message}`)
          }
          results.successor = successor
        }

      } catch (err: any) {
        results.errors.push(`Unexpected error: ${err.message}`)
      }

      setData(results)
      setLoading(false)
    }

    diagnose()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Running diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Successor Portal Diagnostics</h1>

          {/* Auth Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {data.auth ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              <h2 className="text-lg font-semibold">Authentication</h2>
            </div>
            {data.auth ? (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-sm"><strong>User ID:</strong> {data.auth.id}</p>
                <p className="text-sm"><strong>Email:</strong> {data.auth.email}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">Not authenticated</p>
              </div>
            )}
          </div>

          {/* Session Storage */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-yellow-600" size={24} />
              <h2 className="text-lg font-semibold">Session Storage</h2>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm">
              <pre>{JSON.stringify(data.session, null, 2)}</pre>
            </div>
          </div>

          {/* Successor Record */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {data.successor ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              <h2 className="text-lg font-semibold">Successor Record</h2>
            </div>
            {data.successor ? (
              <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(data.successor, null, 2)}</pre>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">No successor record found</p>
              </div>
            )}
          </div>

          {/* Errors */}
          {data.errors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="text-red-600" size={24} />
                <h2 className="text-lg font-semibold">Errors</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-4">
                {data.errors.map((error: string, idx: number) => (
                  <p key={idx} className="text-sm text-red-700">{error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Diagnosis</h2>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
              {!data.auth && <p className="mb-2">❌ You are not authenticated. Go to /claim and enter your code.</p>}
              {data.auth && !data.successor && <p className="mb-2">❌ No successor record found for {data.auth.email}. The claim code may be invalid.</p>}
              {data.successor && !data.successor.legal_accepted_at && <p className="mb-2">⚠️ Successor record exists but legal_accepted_at is NULL. You need to accept the legal declaration.</p>}
              {data.successor && data.successor.status !== 'active' && <p className="mb-2">⚠️ Status is "{data.successor.status}" (expected "active")</p>}
              {data.successor && data.successor.legal_accepted_at && data.successor.status === 'active' && (
                <p className="mb-2">✅ Everything looks correct! The middleware should allow access.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
