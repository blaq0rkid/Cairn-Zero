
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, Loader2, AlertTriangle, FileText, User, Calendar, ArrowRight } from 'lucide-react'

export default function SuccessorDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (msg: string) => {
    console.log(msg)
    setDebugInfo(prev => [...prev, msg])
  }

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      addDebug('🔍 Initializing dashboard...')

      // Check portal context
      const portalContext = sessionStorage.getItem('portal_context')
      addDebug(`Portal context: ${portalContext}`)

      if (portalContext !== 'successor') {
        sessionStorage.setItem('portal_context', 'successor')
        addDebug('⚠️ Fixed portal context to successor')
      }

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        addDebug('❌ Not authenticated, redirecting to claim')
        router.push('/claim')
        return
      }

      addDebug(`✅ Authenticated: ${user.email}`)

      // MULTI-STRATEGY LOOKUP
      let successor = null

      // STRATEGY 1: Try stored record ID from session
      const storedRecordId = sessionStorage.getItem('successor_record_id')
      if (storedRecordId) {
        addDebug(`📋 Strategy 1: Fetching by stored ID: ${storedRecordId}`)
        const { data, error } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .eq('id', storedRecordId)
          .single()

        if (!error && data) {
          successor = data
          addDebug('✅ Strategy 1: Success')
        } else {
          addDebug('⚠️ Strategy 1: Failed')
        }
      }

      // STRATEGY 2: Try by successor_id (if linked)
      if (!successor) {
        addDebug('📋 Strategy 2: Fetching by successor_id')
        const { data, error } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .eq('successor_id', user.id)
          .single()

        if (!error && data) {
          successor = data
          addDebug('✅ Strategy 2: Success')
        } else {
          addDebug('⚠️ Strategy 2: Failed')
        }
      }

      // STRATEGY 3: Try by email (last resort)
      if (!successor) {
        addDebug('📋 Strategy 3: Fetching by email')
        const { data, error } = await supabase
          .from('successors')
          .select('*, profiles!successors_founder_id_fkey(email, full_name)')
          .eq('email', user.email)
          .single()

        if (!error && data) {
          successor = data
          addDebug('✅ Strategy 3: Success')

          // AUTO-LINK if found by email
          if (!successor.successor_id) {
            addDebug('🔗 Auto-linking successor_id...')
            await supabase
              .from('successors')
              .update({ successor_id: user.id })
              .eq('id', successor.id)
            
            successor.successor_id = user.id
            addDebug('✅ Auto-link complete')
          }
        } else {
          addDebug('❌ Strategy 3: Failed')
        }
      }

      // NO SUCCESSOR FOUND
      if (!successor) {
        addDebug('❌ All strategies failed - no successor record found')
        setError('No successor record found. Please enter your claim code.')
        setLoading(false)
        return
      }

      addDebug(`✅ Successor loaded: ${successor.id}`)
      addDebug(`   Status: ${successor.status}`)
      addDebug(`   Legal accepted: ${successor.legal_accepted_at ? 'Yes' : 'No'}`)

      // LEGAL GATING CHECK
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        addDebug('⚠️ Legal acceptance required, redirecting to claim')
        router.push('/claim')
        return
      }

      addDebug('✅ Access verified, rendering dashboard')
      setSuccessorData(successor)
      setLoading(false)

    } catch (err: any) {
      addDebug(`❌ Unexpected error: ${err.message}`)
      console.error('Error initializing dashboard:', err)
      setError('Failed to load dashboard. Please try again.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
          <p className="text-slate-600">Loading successor dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Access Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            
            {debugInfo.length > 0 && (
              <div className="bg-white border border-red-200 rounded p-3 mb-4 max-h-40 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-700 mb-2">Debug Log:</p>
                <div className="text-xs text-slate-600 font-mono text-left space-y-1">
                  {debugInfo.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/claim')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Enter Claim Code
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <Shield className="text-blue-600" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                Successor Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Welcome, {successorData?.full_name || successorData?.email}
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-green-600" size={20} />
                <p className="text-xs font-semibold text-green-900 uppercase">Status</p>
              </div>
              <p className="text-2xl font-bold text-green-700">Active</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-blue-600" size={20} />
                <p className="text-xs font-semibold text-blue-900 uppercase">Accepted</p>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {new Date(successorData?.legal_accepted_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-purple-600" size={20} />
                <p className="text-xs font-semibold text-purple-900 uppercase">Legal Version</p>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {successorData?.legal_version}
              </p>
            </div>
          </div>

          {/* Founder Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-slate-600" size={20} />
              <h2 className="font-semibold text-slate-900">Designated By</h2>
            </div>
            <p className="text-slate-700">
              {successorData?.profiles?.full_name || successorData?.profiles?.email}
            </p>
          </div>

          {/* Guidepost Index */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-3 text-lg">Guidepost Index</h2>
            <p className="text-sm text-slate-700 mb-4">
              Information and instructions left for you by the founder
            </p>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-sm text-slate-600 italic text-center">
                Guidepost content will be displayed here once configured by the founder.
              </p>
            </div>
          </div>

          {/* Debug Info (dev only) */}
          {debugInfo.length > 0 && (
            <details className="mt-6">
              <summary className="text-xs text-slate-500 cursor-pointer">Show debug log</summary>
              <div className="bg-slate-50 border border-slate-200 rounded p-3 mt-2">
                <div className="text-xs text-slate-600 font-mono space-y-1">
                  {debugInfo.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
