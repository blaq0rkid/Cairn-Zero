'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SuccessorPortal() {
  const [cairnId, setCairnId] = useState('')

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white">
              Cairn Zero
            </Link>
            <span className="text-gray-400">Successor Portal</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-amber-600 rounded-full mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Archive Zone</h1>
          <p className="text-xl text-gray-400">
            Secure access for designated successors
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Enter Your Access Key</h2>
          <p className="text-gray-400 mb-6">
            Enter the 6-character Cairn ID found on your physical device to access the succession bridge.
          </p>
          <input
            type="text"
            placeholder="CZ-XXXX"
            className="w-full px-6 py-4 bg-gray-900 text-white border border-gray-700 rounded text-xl text-center tracking-widest mb-6"
            value={cairnId}
            onChange={(e) => setCairnId(e.target.value.toUpperCase())}
            maxLength={7}
          />
          <button className="w-full px-6 py-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-lg font-bold">
            Access Archive
          </button>
          
          <div className="mt-8 p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              <strong className="text-white">Zero-Knowledge Protocol:</strong> Cairn Zero has no access to this data. We provide the bridge, not the keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
