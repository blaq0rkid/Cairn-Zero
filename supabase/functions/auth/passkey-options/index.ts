serve(async (req) => {
  const { userId, email } = await req.json()

  // Generate WebAuthn registration options
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  const challengeBase64 = btoa(String.fromCharCode(...challenge))

  const options = {
    challenge: challengeBase64,
    rp: {
      name: 'Cairn Zero',
      id: Deno.env.get('RP_ID') || 'localhost'
    },
    user: {
      id: btoa(userId),
      name: email,
      displayName: email
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },  // ES256
      { type: 'public-key', alg: -257 } // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred'
    },
    timeout: 60000,
    attestation: 'none'
  }

  // Store challenge for later verification
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  await supabase
    .from('webauthn_challenges')
    .insert({
      user_id: userId,
      challenge: challengeBase64,
      expires_at: new Date(Date.now() + 60000).toISOString()
    })

  return new Response(JSON.stringify(options), { status: 200 })
})
