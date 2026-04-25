
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Cairn Zero</h3>
            <p className="text-gray-400 text-sm">
              Business continuity through sovereign succession planning.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/guidepost" className="hover:text-white">Guidepost</a></li>
              <li><a href="/succession-playbook" className="hover:text-white">Succession Playbook</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Access</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="/login" className="hover:text-white">Founder Login</a></li>
              <li><a href="/claim" className="hover:text-white">Successor Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/msa" className="hover:text-white">Master Services Agreement</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cairn Zero. Certainty. Sovereignty. Continuity.</p>
        </div>
      </div>
    </footer>
  )
}
