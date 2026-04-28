import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { getRelayerConfig } from '@/lib/relayer/config'
import { getEIP712Domain, getForwardRequestType } from '@/lib/relayer/eip712'

const FORWARDER_ABI = [
  'function execute(tuple(address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) req, bytes signature) payable returns (bool, bytes)',
  'function verify(tuple(address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) req, bytes signature) view returns (bool)'
]

export async function POST(req: NextRequest) {
  try {
    const { request, signature } = await req.json()

    const config = getRelayerConfig()
    
    // Initialize provider with relayer's private key (Paymaster wallet)
    const provider = new ethers.JsonRpcProvider(config.rpcUrl)
    const relayerWallet = new ethers.Wallet(
      process.env.RELAYER_PRIVATE_KEY!,
      provider
    )

    // Connect to forwarder contract
    const forwarder = new ethers.Contract(
      config.forwarderAddress,
      FORWARDER_ABI,
      relayerWallet
    )

    // Verify signature before submitting
    const domain = getEIP712Domain(config.chainId, config.forwarderAddress)
    const types = getForwardRequestType()
    
    const recoveredAddress = ethers.verifyTypedData(
      domain,
      types,
      request,
      signature
    )

    if (recoveredAddress.toLowerCase() !== request.from.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Submit transaction (Paymaster pays gas)
    const tx = await forwarder.execute(request, signature, {
      gasLimit: 500000
    })

    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    })
  } catch (error) {
    console.error('Relayer submission error:', error)
    return NextResponse.json(
      { error: 'Transaction submission failed' },
      { status: 500 }
    )
  }
}
