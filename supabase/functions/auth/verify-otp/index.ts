serve(async (req) => {
  const { email, otp } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Verify OTP
  const { data, error } = await supabase
    .from('otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('otp_code', otp)
    .eq('verified', false)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Invalid or expired OTP' }), { status: 400 })
  }

  // Mark OTP as verified
  await supabase
    .from('otp_verifications')
    .update({ verified: true })
    .eq('id', data.id)

  // Create or get user
  let userId
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    userId = existingUser.id
  } else {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ email })
      .select('id')
      .single()

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 400 })
    }

    userId = newUser.id
  }

  return new Response(JSON.stringify({ userId }), { status: 200 })
})
