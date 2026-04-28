
'use client'

import { useState } from 'react'
import { zkEncryption } from '@/lib/encryption/zero-knowledge'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface CreateCairnProps {
  founderId: string
  onSuccess?: () => void
}

export default function CreateCairn({ founderId, onSuccess }: CreateCairnProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cairnData, setCairnData] = useState({
    businessName: '',
    criticalInfo: '',
    accessInstructions: ''
  })

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Generate a passphrase (in production, this would be more sophisticated)
      const passphrase = crypto.randomUUID()

      // Combine cairn data into a single string
      const dataToEncrypt = JSON.stringify(cairnData)

      // Encrypt the Cairn data (CLIENT-SIDE ONLY)
      const encryptedResult = await zkEncryption.encrypt(dataToEncrypt, passphrase)

      // Store only the ciphertext, IV, and salt - NOT the plaintext or passphrase
      const { data, error: dbError } = await supabase
        .from('cairns')
        .insert({
          founder_id: founderId,
          business_name: cairnData.businessName, // Metadata only
          ciphertext: encryptedResult.ciphertext,
          iv: encryptedResult.iv,
          salt: encryptedResult.salt,
          encryption_method: 'AES-256-GCM'
        })
        .select()
        .single()

      if (dbError) throw dbError

      // In production, securely share the passphrase with designated successors
      console.log('Cairn created successfully. Passphrase:', passphrase)

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Cairn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create a Cairn</h2>
      <p className="text-slate-600 mb-6">
        A Cairn is an encrypted marker containing critical business information. 
        Only designated successors will be able to access this data.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={cairnData.businessName}
            onChange={(e) => setCairnData({ ...cairnData, businessName: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Critical Information
          </label>
          <textarea
            value={cairnData.criticalInfo}
            onChange={(e) => setCairnData({ ...cairnData, criticalInfo: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Passwords, API keys, important contacts, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Access Instructions
          </label>
          <textarea
            value={cairnData.accessInstructions}
            onChange={(e) => setCairnData({ ...cairnData, accessInstructions: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="How successors should use this information..."
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Zero-Knowledge Guarantee:</strong> Your data will be encrypted 
            in your browser before being stored. The server never sees your plaintext data.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Cairn...' : 'Create Cairn'}
        </button>
      </form>
    </div>
  )
}
