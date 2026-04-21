import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, tier } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: tier === 'lite' || tier === 'founder_guard_monthly' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/founder?success=true`,
      cancel_url: `${req.headers.get('origin')}/#pricing`,
      metadata: {
        tier,
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
