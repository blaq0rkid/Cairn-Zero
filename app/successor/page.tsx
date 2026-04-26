
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { linkSuccessorToAuth, verifySuccessorAccess } from '@/lib/successor-auth-handler'
import { Shield, Loader2 } from 'lucide-react'

export default function SuccessorDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [successorData, setSuccessorData] = useState<any>(null)

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log('⚠️ Not authenticated, redirecting to claim')
        router.push('/claim')
        return
      }

      console.log('✅ User authenticated:', user.email)

      // First, try to verify access with existing successor_id
      let successor = await verifySuccessorAccess(user.id)

      // If not found, attempt to link the account
      if (!successor && user.email) {
        console.log('⚠️ No successor found by ID, attempting to link...')
        const linkResult = await linkSuccessorToAuth(user.email)

        if (linkResult.success) {
          console.log('✅ Linking successful, retrying verification...')
          successor = await verifySuccessorAccess(user.id)
        } else if (linkResult.needsLinking) {
          console.log('❌ Linking required but failed, redirecting to error page')
          router.push('/successor/access-error')
          return
        }
      }

      // If still no successor, redirect to error page
      if (!successor) {
        console.log('❌ No valid successor access, redirecting to error page')
        router.push('/successor/access-error')
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
          <p className="text-slate-600">Loading dashboard...</p>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-slate-900 mb-2">Guidepost Index</h2>
            <p className="text-sm text-slate-700">
              Access to founder's information and instructions will be displayed here.
            </p>
          </div>

          {/* Rest of dashboard content */}
        </div>
      </div>
    </div>
  )
}
