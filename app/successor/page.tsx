
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { determinePortalRoute } from '@/lib/portal-router'
import { Shield, Loader2, AlertTriangle } from 'lucide-react'

export default function SuccessorDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [successorData, setSuccessorData] = useState<any>(null)
  const [routingDecision, setRoutingDecision] = useState<any>(null)

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log('⚠️ Not authenticated, redirecting to claim')
        router.push('/claim')
        return
      }

      console.log('✅ User authenticated:', user.email)

      // Use portal router to determine correct routing
      const decision = await determinePortalRoute(user.id, user.email || '', '/successor')
      setRoutingDecision(decision)

      console.log('🔀 Portal routing decision:', decision)

      // If should route to founder instead, redirect
      if (decision.shouldRouteToFounder && !decision.shouldRouteToSuccessor) {
        console.log('🔄 Redirecting to founder portal')
        router.push('/dashboard')
        return
      }

      // If no successor record, redirect to claim
      if (!decision.debug.hasSuccessorRecord) {
        console.log('❌ No successor record, redirecting to claim')
        router.push('/claim')
        return
      }

      // Fetch full successor data
      const { data: successor, error: successorError } = await supabase
        .from('successors')
        .select('*, profiles!successors_founder_id_fkey(email, full_name)')
        .eq('email', user.email)
        .single()

      if (successorError || !successor) {
        console.log('❌ Failed to load successor data')
        router.push('/successor/access-error')
        return
      }

      // Check legal gating
      if (successor.status !== 'active' || !successor.legal_accepted_at) {
        console.log('⚠️ Legal acceptance required')
        router.push('/claim')
        return
      }

      console.log('✅ Successor access verified:', successor)
      setSuccessorData(successor)
      setLoading(false)

    } catch (err) {
      console.error('Error initializing dashboard:', err)
      router.push('/successor/access-error')
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

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-blue-600" size={40} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Successor Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Welcome, {successorData?.full_name}
              </p>
            </div>
          </div>

          {routingDecision?.context === 'dual' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="text-sm text-slate-700">
                <p className="font-medium mb-1">Dual Role Detected</p>
                <p>You have both Founder and Successor access. You're currently viewing the Successor Portal. To access your Founder Dashboard, navigate to /dashboard.</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-3">Guidepost Index</h2>
            <p className="text-sm text-slate-700 mb-4">
              Information and instructions from: {successorData?.profiles?.full_name || successorData?.profiles?.email}
            </p>
            <div className="bg-white border border-slate-200 rounded p-4">
              <p className="text-sm text-slate-600 italic">
                Guidepost content will be displayed here once configured by the founder.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Legal Acceptance</p>
              <p className="text-sm text-slate-700">{new Date(successorData?.legal_accepted_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Version</p>
              <p className="text-sm text-slate-700">{successorData?.legal_version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
