import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const createCheckoutSession = async (priceId: string, tier: string) => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, tier }),
  })

  const session = await response.json()
  const stripe = await stripePromise

  if (stripe) {
    await stripe.redirectToCheckout({ sessionId: session.id })
  }
}

// Stripe Price IDs - Replace these with your actual Stripe Price IDs
export const STRIPE_PRICES = {
  LITE_SETUP: 'price_lite_setup_149',
  LITE_MONTHLY: 'price_lite_monthly_99',
  FOUNDER_GUARD: 'price_founder_guard_4999',
  FOUNDER_GUARD_MONTHLY: 'price_founder_guard_monthly_149',
}
