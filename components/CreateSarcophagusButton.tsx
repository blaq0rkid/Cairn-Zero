
'use client'

import { useState } from 'react'
import { useGaslessTransaction } from '@/hooks/useGaslessTransaction'

interface CreateSarcophagusButtonProps {
  successorAddress: string
  encryptedData: string 
}

export default function CreateSarcophagusButton({ 
  successorAddress, 
  encryptedData 
}: CreateSarcophagusButtonProps) {
  const { executeGaslessTransaction, loading } = useGaslessTransaction()
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    try {
      setError(null)
      
      // Encode Sarcophagus creation call
      // In production, this would use the actual Sarcophagus v2 contract ABI
      const txData = encodeSarcophagusCreation(successorAddress, encryptedData)

      // Execute via gasless relayer
      const txHash = await executeGaslessTransaction({
        from: '0x...', // User's derived address
        to: process.env.NEXT_PUBLIC_SARCOPHAGUS_CONTRACT!,
        data: txData,
        nonce: 0 // Would be fetched from contract
      })

      console.log('Sarcophagus created:', txHash)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Sarcophagus')
    }
  }

  return (
    <div>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Sarcophagus'}
      </button>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

// Helper function to encode Sarcophagus creation
function encodeSarcophagusCreation(recipient: string, data: string): string {
  // In production, use ethers.Interface to encode the contract call
  // This is a placeholder for the actual implementation
  return '0x' + Buffer.from(`create:${recipient}:${data}`).toString('hex')
}
