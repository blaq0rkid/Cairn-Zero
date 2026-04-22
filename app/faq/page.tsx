
export default function FAQPage() {
  const faqs = [
    {
      question: "What is a \"Cairn\"?",
      answer: "A cairn is a man-made pile of stones used as a marker in the wilderness. We are your digital marker, guiding your successors when the path is no longer clear."
    },
    {
      question: "What does \"Zero\" mean?",
      answer: "It refers to our \"Zero-Knowledge\" architecture. We provide the infrastructure for continuity, but we have zero access to your private data."
    },
    {
      question: "What is the \"Succession Gap\"?",
      answer: "The dangerous period after a founder's departure where critical knowledge is locked away and inaccessible to heirs or partners."
    },
    {
      question: "How is this different from a password manager?",
      answer: "Password managers are for daily use; Cairn Zero is for certainty. We provide the automated triggers and physical hardware bridges that ensure those passwords actually reach your successor when they need to."
    },
    {
      question: "What is Zero-Knowledge Sovereignty?",
      answer: "It means you retain 100% control (Sovereignty) over your encryption keys. We cannot see, share, or recover your data."
    },
    {
      question: "Can Cairn Zero see my data?",
      answer: "No. All data is encrypted client-side before it ever touches our system."
    },
    {
      question: "What happens if I lose my physical key?",
      answer: "Because of our Zero-Knowledge architecture, we cannot recover your data. We recommend secondary backups (included in Founder Guard)."
    },
    {
      question: "How do \"Continuity Pings\" work?",
      answer: "The system sends regular \"heartbeat\" checks. If you fail to respond within your designated timeframe, the succession protocol initiates."
    },
    {
      question: "What is a \"False Positive\" or \"Retreat Mode\"?",
      answer: "If a trigger is tripped accidentally, you have a \"Retreat\" window to cancel the succession before keys are released to your successor."
    },
    {
      question: "How do I designate a successor?",
      answer: "Through your Founder Dashboard, where you assign specific digital vaults to designated \"Cairn IDs.\""
    },
    {
      question: "What hardware is included?",
      answer: "Lite users receive a YubiKey/FIDO2 anchor. Founder Guard users receive an Apricorn Aegis Secure Key 3NX."
    },
    {
      question: "Why is there a monthly \"Vigilance Fee\"?",
      answer: "This covers the continuous monitoring of your heartbeats, automated trigger hosting, and secure data sharding."
    },
    {
      question: "Is my data stored in the cloud?",
      answer: "We use the Sarcophagus protocol to shard your data across decentralized storage. It only reassembles when triggers are met."
    },
    {
      question: "What is the \"Founder Immortality Trap\"?",
      answer: "The mistaken belief that \"I'll always be here to handle it,\" leading to a lack of indexed succession data."
    },
    {
      question: "How do I test my succession plan?",
      answer: "The dashboard allows for \"Dry Run\" simulations to ensure your successor receives the necessary alerts."
    },
    {
      question: "Can I have multiple successors?",
      answer: "Yes, Enterprise and Founder Guard tiers support complex multi-party succession."
    },
    {
      question: "What if my successor isn't tech-savvy?",
      answer: "Every kit comes with a physical \"Succession Playbook\" that provides simple, step-by-step instructions."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Our platform is a web-based dashboard optimized for secure desktop and mobile browser access."
    },
    {
      question: "How long does onboarding take?",
      answer: "Typically less than 30 minutes to set up your primary heartbeats and first digital vault."
    },
    {
      question: "What is \"Physical Sovereignty\"?",
      answer: "The principle that the most important keys should exist on hardware you physically own, not just in a cloud account."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about Cairn Zero and succession certainty
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-4">
            Our team is here to help you understand how Cairn Zero can provide certainty for your digital legacy.
          </p>
          <a
            href="mailto:admin@mycairnzero.com"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
