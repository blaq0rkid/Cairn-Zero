
'use client'

import { CheckCircle } from 'lucide-react'

export default function SuccessorDeclined() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
        
        <h1 className="text-3xl font-bold mb-4">Thank You</h1>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-3">
            We have notified the founder that you have declined this responsibility.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Important confirmations:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 flex flex-col gap-2">
            <li>No sensitive data was accessed</li>
            <li>Your invitation link has been permanently invalidated</li>
            <li>The founder can now appoint a new successor</li>
            <li>No further action is required from you</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600">
            Your decision has been recorded in accordance with the Successor Declination Agreement. The succession slot has been cleared and is now available for reassignment.
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Return to Home
        </a>

        <div className="mt-6 text-xs text-gray-500">
          <p>Cairn Zero - Certainty. Sovereignty. Continuity.</p>
        </div>
      </div>
    </div>
  )
}
