
import { NextResponse } from 'next/server'
import Arweave from 'arweave'

/**
 * Arweave Wallet Information
 * Verifies wallet configuration and displays balance
 */
export async function GET() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    const walletKey = process.env.ARWEAVE_WALLET_KEY
    
    if (!walletKey) {
      return NextResponse.json(
        { 
          success: false,
          walletConfigured: false,
          error: 'ARWEAVE_WALLET_KEY environment variable not set'
        },
        { status: 400 }
      )
    }

    let jwk
    try {
      jwk = JSON.parse(walletKey)
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JWK format in ARWEAVE_WALLET_KEY'
        },
        { status: 400 }
      )
    }

    const address = await arweave.wallets.jwkToAddress(jwk)
    const balanceWinston = await arweave.wallets.getBalance(address)
    const balanceAR = arweave.ar.winstonToAr(balanceWinston)

    return NextResponse.json({
      success: true,
      walletConfigured: true,
      address: address,
      balance: `${balanceAR} AR`,
      balanceWinston: balanceWinston,
      sufficientFunds: parseFloat(balanceAR) >= 0.001,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Wallet info error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve wallet information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
