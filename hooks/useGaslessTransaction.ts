
import { useState } from 'react'
import { ethers } from 'ethers'

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

interface MetaTransactionRequest {
  from: string
  to: string
  data: string
  nonce: number
}

export function useGaslessTransaction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signMetaTransaction = async (
    provider: ethers.BrowserProvider,
    request: MetaTransactionRequest,
    userAddress: string
  ) => {
    const signer = await provider.getSigner()
    
    const message = ethers.solidityPackedKeccak256(
      ['address', 'address', 'bytes', 'uint256'],
      [request.from, request.to, request.data, request.nonce]
    )

    return await signer.signMessage(ethers.getBytes(message))
  }

  const executeGaslessTransaction = async (request: MetaTransactionRequest) => {
    setLoading(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 provider found')
      }

      // Get user's signature via WebAuthn wallet
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signature = await signMetaTransaction(
        provider,
        request,
        request.from
      )

      // Send to relayer
      const response = await fetch('/api/relayer/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request,
          signature
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed')
      }

      return data.txHash
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    executeGaslessTransaction,
    loading,
    error
  }
}
