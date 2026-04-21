
// File: app/faq/page.tsx
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const faqs = [
    {
      q: "What is a \"Cairn\"?",
      a: "A cairn is a man-made pile of stones used as a marker in the wilderness. We are your digital marker, guiding your successors when the path is no longer clear."
    },
    {
      q: "What does \"Zero\" mean?",
      a: "It refers to our \"Zero-Knowledge\" architecture. We provide the infrastructure for continuity, but we have zero access to your private data."
    },
    {
      q: "What is the \"Succession Gap\"?",
      a: "The dangerous period after a founder's departure where critical knowledge is locked away and inaccessible to heirs or partners."
    },
    {
      q: "How is this different from a password manager?",
      a: "Password managers are for daily use; Cairn Zero is for certainty. We provide the automated triggers and physical hardware bridges that ensure those passwords actually reach your successor when they need to."
    },
    {
      q: "What is Zero-Knowledge Sovereignty?",
      a: "It means you retain 100% control (Sovereignty) over your encryption keys. We cannot see, share, or recover your data."
    },
    {
      q: "Can Cairn Zero see my data?",
      a: "No. All data is encrypted client-side before it ever touches our system."
    },
    {
      q: "What happens if I lose my physical key?",
      a: "Because of our Zero-Knowledge architecture, we cannot recover your data. We recommend secondary backups (included in Founder Guard)."
    },
    {
      q: "How do \"Continuity Pings\" work?",
      a: "The system sends regular \"heartbeat\" checks. If you fail to respond within your designated timeframe, the succession protocol initiates."
    },
    {
      q: "What is a \"False Positive\" or \"Retreat Mode\"?",
      a: "If a trigger is tripped accidentally, you have a \"Retreat\" window to cancel the succession before keys are released to your successor."
    },
    {
      q: "How do I designate a successor?",
      a: "Through your Founder Dashboard, where you assign specific digital vaults to designated \"Cairn IDs.\""
    },
    {
      q: "What hardware is included?",
      a: "Lite users receive a YubiKey/FIDO2 anchor. Founder Guard users receive an Apricorn Aegis Secure Key 3NX."
    },
    {
      q: "Why is there a monthly \"Vigilance Fee\"?",
      a: "This covers the continuous monitoring of your heartbeats, automated trigger hosting, and secure data sharding."
    },
    {
      q: "Is my data stored in the cloud?",
      a: "We use the Sarcophagus protocol to shard your data across decentralized storage. It only reassembles when triggers are met."
    },
    {
      q: "What is the \"Founder Immortality Trap\"?",
      a: "The mistaken belief that \"I'll always be here to handle it,\" leading to a lack of indexed succession data."
    },
    {
      q: "How do I test my succession plan?",
      a: "The dashboard allows for \"Dry Run\" simulations to ensure your successor receives the necessary alerts."
    },
    {
      q: "Can I have multiple successors?",
      a: "Yes, Enterprise and Founder Guard tiers support complex multi-party succession."
    },
    {
      q: "What if my successor isn't tech-savvy?",
      a: "Every kit comes with a physical \"Succession Playbook\" that provides simple, step-by-step instructions."
    },
    {
      q: "Do you have a mobile app?",
      a: "Our platform is a web-based dashboard optimized for secure desktop and mobile browser access."
    },
    {
      q: "How long does onboarding take?",
      a: "Typically less than 30 minutes to set up your primary heartbeats and first digital vault."
    },
    {
      q: "What is \"Physical Sovereignty\"?",
      a: "The principle that the most important keys should exist on hardware you physically own, not just in a cloud account."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Everything you need to know about Cairn Zero and the Succession Bridge.
          </p>
          
          <div className="flex flex-col gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {index + 1}. {faq.q}
                </h3>
                <p className="text-gray-700">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gray-900 text-white rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-300 mb-6">
              We're here to help you close your Succession Gap with certainty.
            </p>
            <Link 
              href="mailto:admin@mycairnzero.com"
              className="inline-block px-6 py-3 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors font-bold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
