export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Get user's Sarcophagus ID and check-in frequency
    const { data: profile } = await supabase
      .from('profiles')
      .select('sarcophagus_id, check_in_frequency_days')
      .eq('id', userId)
      .single()

    if (!profile?.sarcophagus_id) {
      return NextResponse.json({ error: 'No Sarcophagus found' }, { status: 404 })
    }

    // Calculate new resurrection time
    const newResurrectionTime = Math.floor(Date.now() / 1000) + 
      (profile.check_in_frequency_days * 24 * 60 * 60)

    // Rewrap Sarcophagus
    const sarcoClient = new SarcophagusClient(
      process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production' ? 'mainnet' : 'sepolia'
    )

    await sarcoClient.rewrapSarcophagus(profile.sarcophagus_id, newResurrectionTime)

    // Update database
    await supabase
      .from('profiles')
      .update({
        last_check_in: new Date().toISOString(),
        sarcophagus_resurrection_time: new Date(newResurrectionTime * 1000).toISOString()
      })
      .eq('id', userId)

    return NextResponse.json({ 
      success: true,
      newResurrectionTime 
    })
  } catch (error) {
    console.error('Rewrap error:', error)
    return NextResponse.json({ error: 'Failed to rewrap Sarcophagus' }, { status: 500 })
  }
}
