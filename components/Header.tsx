
'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
              alt="Cairn Zero" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-slate-900">Cairn Zero</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/#problem" className="text-slate-600 hover:text-slate-900 transition-colors">
              The Problem
            </Link>
            <Link href="/#solution" className="text-slate-600 hover:text-slate-900 transition-colors">
              The Solution
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Founder Portal
            </Link>
            <Link href="/claim" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Successor Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
