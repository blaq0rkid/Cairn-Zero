import { useState, useEffect } from 'react'
import { ZeroKnowledgeEncryption } from '@/lib/encryption/zero-knowledge'
import { Unlock, Eye, EyeOff } from 'lucide-react'

export default function UnwrapCairn({ cairnId, successorId }: {
  cairnId: string
  successorId: string
}) {
  const [decryptedData, setDecryptedData] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showData, setShowData] = useState(false)

  const handleUnwrap = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1: Fetch encrypted Cairn data
      const response = await fetch(`/api/cairn/${cairnId}`)
      const cairn = await response.json()

      if (!response.ok) {
        throw new Error(cairn.error || 'Failed to fetch Cairn')
      }

      // Step 2: Get successor's private key from secure storage
      // In production, this would be from IndexedDB or device secure storage
      const privateKeyData = localStorage.getItem(`successor_private_key_${successorId}`)
      
      if (!privateKeyData) {
        throw new Error('Private key not found. You may need to re-register.')
      }

      const privateKey = await ZeroKnowledgeEncryption.importPrivateKey(privateKeyData)

      // Step 3: Unwrap the data key
      const dataKey = await ZeroKnowledgeEncryption.unwrapDataKey(
        cairn.wrapped_key,
        privateKey
      )

      // Step 4: Decrypt the Cairn data
      const decrypted = await ZeroKnowledgeEncryption.decryptData(
        cairn.encrypted_data,
        cairn.iv,
        dataKey
      )

      setDecryptedData(decrypted)
      setShowData(true)

      // Log unwrap event
      await fetch('/api/cairn/log-unwrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cairnId, successorId })
      })
    } catch (err: any) {
      setError(err.message || 'Failed to unwrap Cairn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Unlock className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Unwrap Cairn</h2>
            <p className="text-sm text-slate-600">Access protected information</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!decryptedData && (
          <button
            onClick={handleUnwrap}
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Unwrapping Cairn...' : 'Unwrap Cairn'}
          </button>
        )}

        {decryptedData && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Decrypted Information
              </label>
              <button
                onClick={() => setShowData(!showData)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                {showData ? (
                  <>
                    <EyeOff size={16} />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {showData ? decryptedData : '••••••••••••••••••••••••••••••••'}
              </pre>
            </div>

            <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ Cairn successfully unwrapped. The founder has been notified.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
