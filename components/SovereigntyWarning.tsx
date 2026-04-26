
'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Lock } from 'lucide-react'

interface SovereigntyWarningProps {
  onAccept: () => void
  onDecline: () => void
}

export default function SovereigntyWarning({ onAccept, onDecline }: SovereigntyWarningProps) {
  const [understood, setUnderstood] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="text-yellow-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Critical: Zero-Knowledge Sovereignty
          </h2>
          <p className="text-slate-600">
            Please read and acknowledge this important information
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-red-900 text-lg mb-2">
                Cairn Zero CANNOT Recover Your Password
              </h3>
              <p className="text-sm text-red-800 mb-3">
                We operate on a principle of Zero-Knowledge Sovereignty. This means:
              </p>
              <ul className="text-sm text-red-800 space-y-2 list-disc list-inside">
                <li>We do not store, access, or have any ability to reset your master password</li>
                <li>We cannot decrypt or access your vault contents</li>
                <li>If you lose your password, your data is permanently inaccessible</li>
                <li>There are no "forgot password" recovery options</li>
                <li>Customer support cannot help you regain access to a locked account</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Your Responsibilities</h3>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Store your password in a secure password manager</li>
                <li>Designate a trusted successor through our succession planning system</li>
                <li>Perform regular "presence confirmations" to prevent accidental succession triggers</li>
                <li>Keep your succession plan updated</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-400 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">
              <strong>I understand and accept</strong> that Cairn Zero operates under Zero-Knowledge 
              Sovereignty principles. I acknowledge that if I lose my password, my data will be 
              permanently inaccessible, and that Cairn Zero has no technical ability to recover it. 
              I take full responsibility for password security and succession planning.
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
          >
            I Do Not Accept
          </button>
          <button
            onClick={onAccept}
            disabled={!understood}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            I Accept - Continue
          </button>
        </div>
      </div>
    </div>
  )
}
