
import { NextResponse } from 'next/server'
import Arweave from 'arweave'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

/**
 * Arweave Wallet Information - File-Only Mode
 * Zero-Knowledge Compliance: No env var fallback
 */
export async function GET() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    const keyfilePath = path.join(process.cwd(), 'arweave-keyfile.json')
    
    if (!fs.existsSync(keyfilePath)) {
      return NextResponse.json(
        { 
          success: false,
          walletConfigured: false,
          error: 'arweave-keyfile.json not found in project root',
          hint: 'Download keyfile from arweave.app and place in project root'
        },
        { status: 404 }
      )
    }

    let jwk
    try {
      const keyfileContent = fs.readFileSync(keyfilePath, 'utf8')
      jwk = JSON.parse(keyfileContent)
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in arweave-keyfile.json',
          details: parseError instanceof Error ? parseError.message : 'Parse failed'
        },
        { status: 500 }
      )
    }

    // Validate JWK structure
    const requiredKeys = ['kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi']
    const missingKeys = requiredKeys.filter(key => !(key in jwk))
    
    if (missingKeys.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JWK structure',
          missingKeys: missingKeys
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
      source: 'local-keyfile',
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
