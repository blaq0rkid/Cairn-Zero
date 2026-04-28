import { useState } from 'react'
import { ZeroKnowledgeEncryption } from '@/lib/encryption/zero-knowledge'
import { Lock, Shield, Key } from 'lucide-react'

export default function CreateCairn({ founderId, successorId }: { 
  founderId: string
  successorId: string 
}) {
  const [cairnData, setCairnData] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleCreateCairn = async () => {
    if (!cairnData.trim()) {
      setError('Please enter data to protect')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Generate data encryption key (AES-256)
      const dataKey = await ZeroKnowledgeEncryption.generateDataKey()

      // Step 2: Encrypt the Cairn data (CLIENT-SIDE ONLY)
      const { ciphertext, iv } = await ZeroKnowledgeEncryption.encryptData(
        cairnData,
        dataKey
      )

      // Step 3: Get successor's public key
      const successorResponse = await fetch(`/api/successors/${successorId}`)
      const successorData = await successorResponse.json()
      
      if (!successorData.public_key) {
        throw new Error('Successor has not registered encryption key')
      }

      const successorPublicKey = await ZeroKnowledgeEncryption.importPublicKey(
        successorData.public_key
      )

      // Step 4: Wrap data key with successor's public key
      const wrappedKey = await ZeroKnowledgeEncryption.wrapDataKey(
        dataKey,
        successorPublicKey
      )

      // Step 5: Store ONLY encrypted data and wrapped key (zero-knowledge)
      const response = await fetch('/api/cairn/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderId,
          successorId,
          encryptedData: ciphertext,
          iv,
          wrappedKey
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create Cairn')
      }

      setSuccess(true)
      setCairnData('')
    } catch (err: any) {
      setError(err.message || 'Failed to create Cairn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Create Your Cairn</h2>
            <p className="text-sm text-slate-600">Zero-knowledge encrypted data</p>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Zero-Knowledge Encryption</p>
              <ul className="text-xs text-blue-800 flex flex-col gap-1">
                <li>• Your data is encrypted in your browser</li>
                <li>• Private key never leaves your device</li>
                <li>• Cairn Zero cannot decrypt your data</li>
                <li>• Only your designated successor can access</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <Key size={20} />
              <span className="font-semibold">Cairn created successfully!</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Protected Information
          </label>
          <textarea
            value={cairnData}
            onChange={(e) => setCairnData(e.target.value)}
            placeholder="Enter passwords, access codes, or critical business information..."
            rows={8}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            This data will be encrypted locally before transmission. Maximum 10,000 characters.
          </p>
        </div>

        <button
          onClick={handleCreateCairn}
          disabled={loading || !cairnData.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Encrypting & Creating Cairn...' : 'Create Cairn'}
        </button>
      </div>
    </div>
  )
}
