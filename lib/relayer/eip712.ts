import { ethers } from 'ethers'

export interface ForwardRequest {
  from: string
  to: string
  value: bigint
  gas: bigint
  nonce: bigint
  data: string
}

export function getEIP712Domain(chainId: number, forwarderAddress: string) {
  return {
    name: 'CairnZeroForwarder',
    version: '1',
    chainId,
    verifyingContract: forwarderAddress
  }
}

export function getForwardRequestType() {
  return {
    ForwardRequest: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'gas', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'data', type: 'bytes' }
    ]
  }
}

/**
 * Sign a meta-transaction using EIP-712
 * User signs with their WebAuthn-derived wallet (no gas fees)
 */
export async function signMetaTransaction(
  provider: ethers.BrowserProvider,
  request: ForwardRequest,
  chainId: number,
  forwarderAddress: string
): Promise<string> {
  const signer = await provider.getSigner()
  
  const domain = getEIP712Domain(chainId, forwarderAddress)
  const types = getForwardRequestType()

  // Sign using EIP-712 typed data
  const signature = await signer.signTypedData(domain, types, request)
  
  return signature
}
