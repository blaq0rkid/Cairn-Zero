import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Close the Succession Gap
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Ensure your business doesn't die with you. Guarantee accessibility for the right people at the right time through zero-knowledge sovereignty.
        </p>
        <a 
          href="#pricing"
          className="inline-block px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded hover:bg-gray-800 transition-colors"
        >
          Secure Your Legacy
        </a>
      </div>
    </section>
  )
}
