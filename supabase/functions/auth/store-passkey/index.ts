serve(async (req) => {
  const { userId, credentialId, publicKey, transports } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Store ONLY the public key and credential ID (Zero-Knowledge principle)
  const { error } = await supabase
    .from('passkeys')
    .insert({
      user_id: userId,
      credential_id: credentialId,
      public_key: publicKey,
      transports: transports,
      created_at: new Date().toISOString()
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
