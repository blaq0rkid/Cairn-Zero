
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Heart, AlertCircle, Settings } from 'lucide-react'

export default function FounderCheckIn() {
  const supabase = createClientComponentClient()
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  const [checkInFrequency, setCheckInFrequency] = useState(30) // days
  const [daysUntilDue, setDaysUntilDue] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCheckInStatus()
  }, [])

  useEffect(() => {
    if (lastCheckIn) {
      calculateDaysUntilDue()
    }
  }, [lastCheckIn, checkInFrequency])

  const loadCheckInStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('last_check_in, check_in_frequency_days')
      .eq('id', user.id)
      .single()

    if (profile) {
      setLastCheckIn(profile.last_check_in ? new Date(profile.last_check_in) : null)
      setCheckInFrequency(profile.check_in_frequency_days || 30)
    }
  }

  const calculateDaysUntilDue = () => {
    if (!lastCheckIn) {
      setDaysUntilDue(0)
      return
    }

    const nextDue = new Date(lastCheckIn)
    nextDue.setDate(nextDue.getDate() + checkInFrequency)
    
    const today = new Date()
    const diffTime = nextDue.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    setDaysUntilDue(diffDays)
  }

  const handleCheckIn = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ 
        last_check_in: new Date().toISOString(),
        check_in_count: supabase.rpc('increment', { row_id: user.id })
      })
      .eq('id', user.id)

    if (!error) {
      setLastCheckIn(new Date())
    }
    setLoading(false)
  }

  const handleUpdateFrequency = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ check_in_frequency_days: checkInFrequency })
      .eq('id', user.id)

    setShowSettings(false)
  }

  const getStatusColor = () => {
    if (!daysUntilDue) return 'bg-red-100 border-red-300 text-red-900'
    if (daysUntilDue <= 7) return 'bg-yellow-100 border-yellow-300 text-yellow-900'
    return 'bg-green-100 border-green-300 text-green-900'
  }

  const getStatusMessage = () => {
    if (!daysUntilDue || daysUntilDue <= 0) return 'Check-in overdue!'
    if (daysUntilDue <= 7) return `Check-in due in ${daysUntilDue} days`
    return `Next check-in in ${daysUntilDue} days`
  }

  return (
    <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-900">Presence Confirmation</h3>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Settings size={20} className="text-slate-600" />
        </button>
      </div>

      {showSettings ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">Check-in Frequency</h4>
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-700">
              Remind me every:
            </label>
            <select
              value={checkInFrequency}
              onChange={(e) => setCheckInFrequency(Number(e.target.value))}
              className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
            </select>
            <button
              onClick={handleUpdateFrequency}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`${getStatusColor()} border-2 rounded-lg p-4 mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} />
              <span className="font-semibold">{getStatusMessage()}</span>
            </div>
            {lastCheckIn && (
              <p className="text-sm">
                Last confirmed: {lastCheckIn.toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-700">
              Regular check-ins prevent accidental succession triggers. This confirms 
              you're actively managing your account and your succession plan should 
              remain on standby.
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Heart size={20} />
            {loading ? 'Confirming...' : 'Confirm Presence'}
          </button>
        </>
      )}
    </div>
  )
}
