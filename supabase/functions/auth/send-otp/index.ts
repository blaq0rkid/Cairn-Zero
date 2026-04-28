import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // Store OTP in database
  const { error } = await supabase
    .from('otp_verifications')
    .insert({
      email,
      otp_code: otp,
      expires_at: expiresAt.toISOString(),
      verified: false
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  // Send OTP via email (using Resend or similar)
  // Implementation depends on your email service
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'auth@cairnzero.com',
      to: email,
      subject: 'Your Cairn Zero Verification Code',
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    })
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})

// supabase/functions/auth/verify-otp/index.ts
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
