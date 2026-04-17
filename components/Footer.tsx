export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Cairn Zero</h3>
            <p className="text-gray-400">
              Closing the Succession Gap through zero-knowledge sovereignty and certainty-only principles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="/legal/succession-playbook" className="text-gray-400 hover:text-white transition-colors">
                  Succession Playbook
                </a>
              </li>
              <li>
                <a href="/legal/msa" className="text-gray-400 hover:text-white transition-colors">
                  Master Services Agreement
                </a>
              </li>
              <li>
                <a href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">admin@mycairnzero.com</p>
            <a 
              href="/successor" 
              className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              Successor Portal →
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Cairn Zero. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
