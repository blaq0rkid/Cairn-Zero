serve(async (req) => {
  const { userId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Mark sovereignty confirmation
  const { error } = await supabase
    .from('users')
    .update({
      sovereignty_confirmed: true,
      sovereignty_confirmed_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
