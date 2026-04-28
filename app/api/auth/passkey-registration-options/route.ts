import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json()

    // Verify user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate challenge
    const challenge = crypto.randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000) // 2 minutes

    // Store challenge
    await supabase
      .from('webauthn_challenges')
      .insert({
        user_id: userId,
        challenge,
        challenge_type: 'registration',
        expires_at: expiresAt.toISOString()
      })

    // WebAuthn registration options (FIDO2 compliant)
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
        { type: 'public-key', alg: -7 },  // ES256 (ECDSA w/ SHA-256)
        { type: 'public-key', alg: -257 } // RS256 (RSASSA-PKCS1-v1_5 w/ SHA-256)
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use platform authenticator (biometric)
        userVerification: 'required',
        residentKey: 'preferred'
      },
      timeout: 120000,
      attestation: 'none'
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error('Registration options error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
