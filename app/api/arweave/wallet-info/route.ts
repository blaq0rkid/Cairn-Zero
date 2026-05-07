
import { NextResponse } from 'next/server'
import Arweave from 'arweave'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

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

    let jwk
    const keyfilePath = path.join(process.cwd(), 'arweave-keyfile.json')
    
    // Check for file FIRST (priority over env var)
    if (fs.existsSync(keyfilePath)) {
      try {
        const keyfileContent = fs.readFileSync(keyfilePath, 'utf8')
        jwk = JSON.parse(keyfileContent)
      } catch (fileError) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Keyfile exists but is invalid JSON',
            details: fileError instanceof Error ? fileError.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    } else {
      // Only try env var if file doesn't exist
      const walletKey = process.env.ARWEAVE_WALLET_KEY
      if (!walletKey) {
        return NextResponse.json(
          { 
            success: false,
            walletConfigured: false,
            error: 'No arweave-keyfile.json found and ARWEAVE_WALLET_KEY not set'
          },
          { status: 400 }
        )
      }
      
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
      source: fs.existsSync(keyfilePath) ? 'keyfile' : 'environment',
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
