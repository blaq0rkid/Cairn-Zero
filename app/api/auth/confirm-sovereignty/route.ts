export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Mark sovereignty confirmed
    const { error } = await supabase
      .from('profiles')
      .update({
        sovereignty_confirmed: true,
        sovereignty_confirmed_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sovereignty confirmation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
