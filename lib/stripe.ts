
// File: lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const createCheckoutSession = async (priceId: string, tier: string, mode: 'payment' | 'subscription') => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, tier, mode }),
  })

  const session = await response.json()
  const stripe = await stripePromise

  if (stripe) {
    await stripe.redirectToCheckout({ sessionId: session.id })
  }
}

// Live Stripe Price IDs from Master Brief Section 2A
export const STRIPE_PRICES = {
  // Cairn Lite
  LITE_SETUP: 'price_1TOMa8Crb0tVxJGI0Ta6nbIX',      // $149 one-time
  LITE_MONTHLY: 'price_1TOMa8Crb0tVxJGISMvpZGLE',    // $99/month
  
  // Founder Guard
  FOUNDER_GUARD_SETUP: 'price_1TOMa9Crb0tVxJGIzfFeecvM',    // $4,999 one-time
  FOUNDER_GUARD_MONTHLY: 'price_1TOMa7Crb0tVxJGINXfU76bj',  // $149/year
  
  // Legacy Certainty
  LEGACY_SETUP: 'price_1TOMa9Crb0tVxJGI8qbMhRwf',    // $14,999 one-time
  LEGACY_MONTHLY: 'price_1TOMaBCrb0tVxJGIOHh465bL',  // $499/month
}
