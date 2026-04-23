
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You for Subscribing!
          </h1>
          
          <p className="text-lg text-gray-700 mb-6">
            You're now part of The Guidepost community.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-800 mb-4">
              You'll receive insights on succession planning, digital sovereignty, and founder continuity directly to your inbox.
            </p>
            <p className="text-sm text-gray-600">
              Check your email to confirm your subscription and get access to exclusive content.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              While You're Here
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/guidepost" className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span className="font-semibold text-gray-900">Browse The Guidepost</span>
                <span className="text-sm text-gray-600">Read our latest articles</span>
              </Link>

              <Link href="/#pricing" className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span className="font-semibold text-gray-900">Explore Solutions</span>
                <span className="text-sm text-gray-600">Close your succession gap</span>
              </Link>
            </div>
          </div>

          <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Return to Home
          </Link>

          <p className="text-sm text-gray-500 mt-8">
            Join founders who are building succession certainty into their businesses.
          </p>
        </div>
      </div>
    </div>
  )
}
