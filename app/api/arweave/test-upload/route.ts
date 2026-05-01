
import { NextResponse } from 'next/server'
import Arweave from 'arweave'

/**
 * Upload Test Data to Arweave
 * Creates a permanent storage transaction
 */
export async function POST(request: Request) {
  try {
    const { testData, metadata } = await request.json()

    if (!testData) {
      return NextResponse.json(
        { error: 'testData is required' },
        { status: 400 }
      )
    }

    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    })

    const walletKey = process.env.ARWEAVE_WALLET_KEY
    if (!walletKey) {
      return NextResponse.json(
        { error: 'ARWEAVE_WALLET_KEY not configured' },
        { status: 500 }
      )
    }

    const jwk = JSON.parse(walletKey)

    // Create transaction
    const transaction = await arweave.createTransaction({
      data: JSON.stringify({
        testData,
        metadata: metadata || {},
        uploadedAt: new Date().toISOString(),
        platform: 'cairn-zero',
        purpose: 'succession_rehearsal_test'
      })
    }, jwk)

    // Add tags for searchability
    transaction.addTag('Content-Type', 'application/json')
    transaction.addTag('App-Name', 'CairnZero')
    transaction.addTag('App-Version', '2.0.0')
    transaction.addTag('Purpose', 'succession-test')
    if (metadata?.cairnId) {
      transaction.addTag('Cairn-ID', metadata.cairnId)
    }

    // Sign transaction
    await arweave.transactions.sign(transaction, jwk)

    // Get cost estimate
    const costWinston = transaction.reward
    const costAR = arweave.ar.winstonToAr(costWinston)

    // Submit transaction
    const response = await arweave.transactions.post(transaction)

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: 'Data uploaded to Arweave',
        transactionId: transaction.id,
        gatewayUrl: `https://arweave.net/${transaction.id}`,
        estimatedConfirmationTime: '10-20 minutes',
        cost: {
          ar: costAR,
          winston: costWinston
        },
        status: response.status,
        statusText: response.statusText
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Upload failed',
          status: response.status,
          statusText: response.statusText
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload to Arweave',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
