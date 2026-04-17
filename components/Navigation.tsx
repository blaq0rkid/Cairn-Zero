import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image 
              src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
              alt="Cairn Zero Logo - Stylized cairn symbol representing business continuity"
              width={40}
              height={40}
            />
            <span className="ml-3 text-xl font-bold text-gray-900">Cairn Zero</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#problem" className="text-gray-700 hover:text-gray-900 transition-colors">
              The Problem
            </a>
            <a href="#solution" className="text-gray-700 hover:text-gray-900 transition-colors">
              The Solution
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <Link 
              href="/founder" 
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Founder Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
