
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Cairn Zero</h3>
            <p className="text-gray-400 text-sm">
              Zero-Knowledge business continuity for founders who refuse to be a single point of failure.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guidepost" className="hover:text-white transition-colors">
                  The Guidepost
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>
                <Link href="/succession-playbook" className="hover:text-white transition-colors">
                  Succession Playbook
                </Link>
              </li>
              <li>
                <Link href="/msa" className="hover:text-white transition-colors">
                  Master Services Agreement
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>
                <a href="mailto:hello@mycairnzero.com" className="hover:text-white transition-colors">
                  hello@mycairnzero.com
                </a>
              </li>
              <li>
                <Link href="/founder" className="hover:text-white transition-colors">
                  Founder Portal
                </Link>
              </li>
              <li>
                <Link href="/successor" className="hover:text-white transition-colors">
                  Successor Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Cairn Zero. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
