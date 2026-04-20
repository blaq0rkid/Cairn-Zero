'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { CairnDevice } from '@/lib/supabase'

export default function FounderDashboard() {
  const [cairnId, setCairnId] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [devices, setDevices] = useState<CairnDevice[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    checkUser()
    loadDevices()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) {
      // Redirect to login or show auth UI
      setError('Please sign in to access the founder dashboard')
    }
  }

  async function loadDevices() {
    if (!user) return
    
    const { data, error } = await supabase
      .from('cairn_devices')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading devices:', error)
    } else {
      setDevices(data || [])
    }
  }

  async function registerDevice() {
    setError('')
    setSuccess('')
    setLoading(true)

    if (!cairnId.match(/^CZ-[A-Z0-9]{4}$/)) {
      setError('Invalid Cairn ID format. Use CZ-XXXX')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cairn_devices')
        .insert({
          cairn_id: cairnId,
          owner_id: user.id,
          device_type: 'founder_guard',
          is_active: true
        })
        .select()

      if (error) throw error

      setSuccess('Device registered successfully!')
      setCairnId('')
      loadDevices()
    } catch (err: any) {
      setError(err.message || 'Failed to register device')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access the Founder Dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Cairn Zero
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Founder Dashboard</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Active Zone</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cairn ID Management</h2>
          <p className="text-gray-600 mb-4">
            Link your physical Cairn hardware using the 6-character ID (Format: CZ-XXXX)
          </p>
          <input
            type="text"
            placeholder="CZ-XXXX"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 uppercase"
            value={cairnId}
            onChange={(e) => setCairnId(e.target.value.toUpperCase())}
            maxLength={7}
          />
          <button 
            onClick={registerDevice}
            disabled={loading}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Device'}
          </button>
        </div>

        {devices.length > 0 && (
          <div className="bg-white p-8 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Registered Devices</h2>
            <div className="flex flex-col gap-3">
              {devices.map((device) => (
                <div key={device.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-lg">{device.cairn_id}</span>
                      <span className={`ml-3 px-2 py-1 text-xs rounded ${device.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {device.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {device.device_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continuity Triggers</h2>
          <p className="text-gray-600 mb-4">
            Configure your succession pings and automated triggers
          </p>
          <button className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
            Configure Pings
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Digital Sprawl Audit</h2>
          <p className="text-gray-600 mb-4">
            Track and consolidate your critical business access points
          </p>
          <button className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
            Start Audit
          </button>
        </div>
      </div>
    </div>
  )
}
