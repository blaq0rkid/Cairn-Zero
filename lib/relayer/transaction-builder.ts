import { ethers } from 'ethers'
import { getRelayerConfig } from './config'
import { ForwardRequest, signMetaTransaction } from './eip712'

export class GaslessTransactionBuilder {
  private config = getRelayerConfig()
  private provider: ethers.JsonRpcProvider

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl)
  }

  /**
   * Build a meta-transaction request
   */
  async buildMetaTransaction(
    from: string,
    to: string,
    data: string,
    value: bigint = BigInt(0)
  ): Promise<ForwardRequest> {
    // Get nonce from forwarder contract
    const forwarderAbi = [
      'function getNonce(address from) view returns (uint256)'
    ]
    const forwarder = new ethers.Contract(
      this.config.forwarderAddress,
      forwarderAbi,
      this.provider
    )
    
    const nonce = await forwarder.getNonce(from)

    // Estimate gas (conservative estimate)
    const gasLimit = BigInt(300000)

    return {
      from,
      to,
      value,
      gas: gasLimit,
      nonce,
      data
    }
  }

  /**
   * Submit meta-transaction to relayer (Paymaster pays gas)
   */
  async submitMetaTransaction(
    request: ForwardRequest,
    signature: string
  ): Promise<string> {
    // Call backend relayer endpoint
    const response = await fetch('/api/relayer/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request,
        signature
      })
    })

    if (!response.ok) {
      throw new Error('Meta-transaction submission failed')
    }

    const data = await response.json()
    return data.txHash
  }
}
