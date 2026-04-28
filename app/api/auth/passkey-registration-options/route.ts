
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json()

    // Generate challenge
    const challenge = crypto.randomBytes(32).toString('base64url')

    // Store challenge in database
    const { error } = await supabase
      .from('webauthn_challenges')
      .insert({
        user_id: userId,
        challenge,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return WebAuthn registration options
    const options = {
      challenge,
      rp: {
        name: 'Cairn Zero',
        id: process.env.NEXT_PUBLIC_RP_ID || 'localhost'
      },
      user: {
        id: Buffer.from(userId).toString('base64url'),
        name: email,
        displayName: email
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        residentKey: 'preferred',
        userVerification: 'required'
      },
      timeout: 60000,
      attestation: 'none'
    }

    return NextResponse.json({ options })
  } catch (error) {
    console.error('Passkey registration options error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
