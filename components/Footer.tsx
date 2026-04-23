
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Cairn Zero</h3>
            <p className="text-gray-400 text-sm">
              Legacy Certainty for the Digital Age
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/guidepost" className="text-gray-400 hover:text-white transition-colors">
                  The Guidepost
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="font-semibold mb-4">Access</h4>
            <ul className="flex flex-col gap-2">
              <li>
                {isAuthenticated ? (
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Founder Portal
                  </Link>
                ) : (
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Founder Portal
                  </Link>
                )}
              </li>
              <li>
                <Link href="/successor" className="text-gray-400 hover:text-white transition-colors">
                  Successor Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cairn Zero. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Contact: <a href="mailto:admin@mycairnzero.com" className="hover:text-white transition-colors">
              admin@mycairnzero.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
