
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Shield, LogOut, User, Calendar, FileText } from 'lucide-react'
import Image from 'next/image'

export default function SuccessorDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [successorData, setSuccessorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuccessorData()
  }, [])

  const loadSuccessorData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/claim')
      return
    }

    const { data: successor } = await supabase
      .from('successors')
      .select('*, profiles!successors_founder_id_fkey(email, full_name)')
      .eq('email', user.email)
      .single()

    if (successor) {
      setSuccessorData(successor)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    sessionStorage.clear()
    await supabase.auth.signOut()
    router.push('/claim')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-slate-900">Successor Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome, {successorData?.full_name || successorData?.email}
              </p>
            </div>
          </div>

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
                {successorData?.legal_accepted_at 
                  ? new Date(successorData.legal_accepted_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-purple-600" size={20} />
                <p className="text-xs font-semibold text-purple-900 uppercase">Legal Version</p>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {successorData?.legal_version || 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-slate-600" size={20} />
              <h2 className="font-semibold text-slate-900">Designated By</h2>
            </div>
            <p className="text-slate-700">
              {successorData?.profiles?.full_name || successorData?.profiles?.email}
            </p>
          </div>

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
        </div>
      </div>
    </div>
  )
}
