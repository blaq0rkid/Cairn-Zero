'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function FounderDashboard() {
  const [cairnId, setCairnId] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Cairn Zero
            </Link>
            <span className="text-gray-600">Founder Dashboard</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Active Zone</h1>
        
        <div className="bg-white p-8 rounded-lg border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cairn ID Management</h2>
          <p className="text-gray-600 mb-4">
            Link your physical Cairn hardware using the 6-character ID (Format: CZ-XXXX)
          </p>
          <input
            type="text"
            placeholder="CZ-XXXX"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
            value={cairnId}
            onChange={(e) => setCairnId(e.target.value)}
            maxLength={7}
          />
          <button className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
            Register Device
          </button>
        </div>

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
