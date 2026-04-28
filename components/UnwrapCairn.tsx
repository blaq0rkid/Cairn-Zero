
'use client'

import { useState } from 'react'
import { zkEncryption } from '@/lib/encryption/zero-knowledge'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UnwrapCairnProps {
  cairnId: string
  onSuccess?: (decryptedData: string) => void
}

export default function UnwrapCairn({ cairnId, onSuccess }: UnwrapCairnProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [decryptedData, setDecryptedData] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  const handleUnwrap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Fetch the encrypted Cairn data
      const { data: cairn, error: fetchError } = await supabase
        .from('cairns')
        .select('*')
        .eq('id', cairnId)
        .single()

      if (fetchError) throw fetchError

      if (!cairn) {
        throw new Error('Cairn not found')
      }

      // Decrypt the data using the passphrase
      const decrypted = await zkEncryption.decrypt(
        cairn.ciphertext,
        cairn.iv,
        cairn.salt,
        passphrase
      )

      setDecryptedData(decrypted)
      onSuccess?.(decrypted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unwrap Cairn. Check your passphrase.')
    } finally {
      setLoading(false)
    }
  }

  if (decryptedData) {
    const parsedData = JSON.parse(decryptedData)
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-600">Cairn Unwrapped Successfully</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Business Name</h3>
            <p className="text-slate-900">{parsedData.businessName}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Critical Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{parsedData.criticalInfo}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Access Instructions</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">{parsedData.accessInstructions}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This information was encrypted with zero-knowledge encryption. 
            Store it securely and delete this view when done.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Unwrap Cairn</h2>
      <p className="text-slate-600 mb-6">
        Enter the passphrase to decrypt and view the Cairn contents.
      </p>

      <form onSubmit={handleUnwrap} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Passphrase
          </label>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter passphrase"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Zero-Knowledge Security:</strong> The decryption happens in your browser. 
            The passphrase never leaves your device.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Unwrapping...' : 'Unwrap Cairn'}
        </button>
      </form>
    </div>
  )
}
