
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { founderId, successorName, action } = await request.json()

    // Get founder details
    const { data: founder, error: founderError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', founderId)
      .single()

    if (founderError || !founder) {
      return NextResponse.json({ error: 'Founder not found' }, { status: 404 })
    }

    // Send email notification
    const emailSubject = action === 'declined' 
      ? 'Action Required: Successor Declined Invitation'
      : 'Successor Status Update'

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Action Required: Succession Gap Detected</h2>
        <p>Dear ${founder.full_name || 'Founder'},</p>
        <p>Your designated successor <strong>${successorName}</strong> has <strong>declined</strong> the invitation to serve as your successor.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">What this means:</p>
          <ul style="margin: 10px 0;">
            <li>Your business continuity plan has a gap</li>
            <li>The declined slot is now empty</li>
            <li>No data was accessed by the declined successor</li>
          </ul>
        </div>

        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Log in to your Cairn Zero dashboard</li>
          <li>Appoint a new successor for this slot</li>
          <li>Ensure all succession slots are filled for maximum continuity</li>
        </ol>

        <p style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 14px;">
          Cairn Zero - Certainty. Sovereignty. Continuity.<br/>
          This is an automated notification from your succession planning system.
        </p>
      </div>
    `

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: founder.email,
      subject: emailSubject,
      html: emailHtml
    })

    console.log(`✅ Founder notified of ${action}:`, founder.email)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error notifying founder:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
