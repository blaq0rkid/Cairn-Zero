
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
              alt="Cairn Zero - Zero-Knowledge Business Continuity"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-gray-900">Cairn Zero</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-gray-700 hover:text-gray-900 transition-colors">
              The Problem
            </a>
            <a href="#solution" className="text-gray-700 hover:text-gray-900 transition-colors">
              The Solution
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <Link href="/faq" className="text-gray-700 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <Link 
              href="/founder"
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Founder Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <a 
                href="#problem" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                The Problem
              </a>
              <a 
                href="#solution" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                The Solution
              </a>
              <a 
                href="#pricing" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
              <Link 
                href="/faq" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/blog" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/founder"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 text-center"
                onClick={() => setIsOpen(false)}
              >
                Founder Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
