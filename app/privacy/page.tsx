
export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1>Cairn Zero Privacy Policy</h1>
        <p className="text-sm text-gray-600">
          Effective Date: April 16, 2026<br/>
          Last Updated: April 16, 2026
        </p>

        <p>This Privacy Policy outlines the practices of Cairn Zero regarding the collection, use, and protection of information in connection with our website, www.mycairnzero.com, and our business continuity services.</p>

        <h2>1. THE ZERO-KNOWLEDGE SOVEREIGNTY MANDATE (NO-ACCESS GUARANTEE)</h2>
        <p>Cairn Zero is architected so that we have <strong>zero access</strong> to your sensitive business data, credentials, or "keys to the kingdom."</p>
        
        <ul>
          <li><strong>No-Access Guarantee:</strong> We do not, and cannot, view, decrypt, access, or otherwise read your Vaulted Content or private keys.</li>
          <li><strong>No Key Custody:</strong> We do not hold your private keys, master passwords, seed phrases, recovery phrases, or decryption keys.</li>
          <li><strong>No Recovery by Cairn Zero:</strong> Because we do not have your decryption keys, we cannot recover, restore, or reset access to your encrypted Vaulted Content.</li>
          <li><strong>Sovereignty:</strong> You maintain 100% control over your data.</li>
          <li><strong>Law Enforcement / Subpoenas:</strong> Due to our Zero-Knowledge architecture, we cannot provide decrypted Vaulted Content because we do not possess it in readable form.</li>
        </ul>

        <h2>2. INFORMATION WE COLLECT (DATA MINIMIZATION)</h2>
        <p>We collect only the minimum necessary to provide the Services.</p>

        <h3>A. Operational Data (Personal Information)</h3>
        <ul>
          <li><strong>Identity Information:</strong> Full name and professional title</li>
          <li><strong>Contact Information:</strong> Email address and phone number</li>
          <li><strong>Billing Information:</strong> Billing address and payment details (processed via PCI-compliant processors)</li>
          <li><strong>Successor Information:</strong> Names and contact details of designated successors</li>
        </ul>

        <h3>B. Technical Metadata (Limited)</h3>
        <ul>
          <li>Log data (IP address, browser type, timestamps)</li>
          <li>Device and session information</li>
          <li>Authentication and security event logs</li>
        </ul>

        <h3>C. Vaulted Content (Zero-Knowledge Exclusion)</h3>
        <p><strong>Zero-Knowledge Sovereignty / Client-Side Encryption:</strong> All sensitive content is encrypted client-side. Cairn Zero never receives plaintext and never has access to decryption keys.</p>

        <h2>3. USE OF INFORMATION</h2>
        <p>We use collected Operational Data strictly for service delivery, identity verification, communication, and legal compliance.</p>

        <h2>4. DATA SHARING AND DISCLOSURE</h2>
        <p>Cairn Zero does not sell your personal information. Disclosure limited to designated successors, third-party processors, legal necessity, and business transfers.</p>

        <h2>5. DATA SECURITY AND INTEGRITY</h2>
        <p>We utilize industry-leading security protocols including end-to-end encryption, multi-factor authentication, and strict internal access controls.</p>

        <h2>6. YOUR RIGHTS AND SOVEREIGNTY (GDPR/CCPA)</h2>
        <p>Depending on jurisdiction, you may have rights to access, correction, deletion, and objection.</p>

        <h2>7. CONTACT INFORMATION</h2>
        <p>
          <strong>For privacy inquiries:</strong> legal@mycairnzero.com<br/>
          <strong>For general support:</strong> hello@mycairnzero.com
        </p>
      </div>
    </div>
  )
}
