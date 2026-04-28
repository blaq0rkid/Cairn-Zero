import { useState } from 'react'
import { ethers } from 'ethers'
import { GaslessTransactionBuilder } from '@/lib/relayer/transaction-builder'
import { signMetaTransaction } from '@/lib/relayer/eip712'
import { getRelayerConfig } from '@/lib/relayer/config'

export function useGaslessTransaction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeGasless = async (
    userAddress: string,
    targetContract: string,
    callData: string,
    value: bigint = BigInt(0)
  ) => {
    setLoading(true)
    setError(null)

    try {
      // Initialize builder
      const builder = new GaslessTransactionBuilder()
      const config = getRelayerConfig()

      // Build meta-transaction
      const request = await builder.buildMetaTransaction(
        userAddress,
        targetContract,
        callData,
        value
      )

      // Get user's signature via WebAuthn wallet
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signature = await signMetaTransaction(
        provider,
        request,
        config.chainId,
        config.forwarderAddress
      )

      // Submit to relayer (backend pays gas)
      const txHash = await builder.submitMetaTransaction(request, signature)

      setLoading(false)
      return txHash
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
      setLoading(false)
      throw err
    }
  }

  return { executeGasless, loading, error }
}
