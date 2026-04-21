
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Cairn Zero</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment has been processed successfully. You've taken the first step in closing your Succession Gap.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What happens next?</h2>
        <div className="flex flex-col gap-6 text-left">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Check Your Email</h3>
              <p className="text-gray-600">You'll receive a confirmation email with your order details and next steps within the next few minutes.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Hardware Shipment (Founder Guard & Legacy)</h3>
              <p className="text-gray-600">Your Apricorn Aegis Secure Key 3NX with laser-etched Cairn ID will ship within our two-week fulfillment window.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">3</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Access Your Founder Dashboard</h3>
              <p className="text-gray-600">Set up your succession logic, configure continuity triggers, and begin your Digital Sprawl Audit.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/founder"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Go to Founder Dashboard
        </Link>
        <Link 
          href="/succession-playbook"
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
        >
          Review Succession Playbook
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-4">Questions about your order or setup?</p>
        <a 
          href="mailto:hello@mycairnzero.com"
          className="text-gray-900 font-semibold hover:text-gray-700"
        >
          Contact Support: hello@mycairnzero.com
        </a>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
