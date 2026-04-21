export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
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
          <ul>
            <li><strong>Encrypted Storage:</strong> Encrypted blobs stored using Supabase with Row-Level Security</li>
            <li><strong>No Readability:</strong> Content remains unreadable to Cairn Zero without your keys</li>
            <li><strong>Not Used for Profiling/Ads:</strong> We do not use Vaulted Content for analytics or marketing</li>
          </ul>

          <h2>3. USE OF INFORMATION</h2>
          <p>We use collected Operational Data strictly for:</p>
          <ul>
            <li><strong>Service Delivery:</strong> Executing automated triggers that bridge the Succession Gap</li>
            <li><strong>Identity Verification:</strong> Ensuring only authorized successors gain access</li>
            <li><strong>Communication:</strong> Sending critical alerts regarding account status and security</li>
            <li><strong>Legal Compliance:</strong> Meeting fiduciary and statutory obligations</li>
          </ul>

          <h2>4. DATA SHARING AND DISCLOSURE</h2>
          <p>Cairn Zero does not sell your personal information. Disclosure limited to:</p>
          <ul>
            <li><strong>Designated Successors:</strong> Upon activation of Succession Trigger</li>
            <li><strong>Third-Party Processors:</strong> Limited vendors (GitHub, Netlify, payment processors) under confidentiality obligations</li>
            <li><strong>Legal Necessity:</strong> If required by law (subpoena, court order)</li>
            <li><strong>Business Transfers:</strong> In event of merger, acquisition, or sale of assets</li>
          </ul>

          <h2>5. THE SUCCESSION GAP & AUTOMATED TRIGGERS</h2>
          <ul>
            <li><strong>Trigger Mechanisms:</strong> You define parameters signaling loss of access</li>
            <li><strong>Notification:</strong> Pre-release contact attempts to prevent accidental triggering</li>
            <li><strong>Transfer of Sovereignty:</strong> Programmatic access granted to successors when conditions met</li>
          </ul>

          <h2>6. DATA SECURITY AND INTEGRITY</h2>
          <p>We utilize industry-leading security protocols:</p>
          <ul>
            <li>End-to-end encryption for sensitive transmissions</li>
            <li>Multi-factor authentication (MFA) requirements</li>
            <li>Strict internal access controls</li>
            <li>Secure hosting via GitHub/Netlify</li>
          </ul>

          <h2>7. YOUR RIGHTS AND SOVEREIGNTY (GDPR/CCPA)</h2>
          <p>Depending on jurisdiction, you may have rights to:</p>
          <ul>
            <li><strong>Access and Portability:</strong> Request access to and copy of Operational Data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate account information</li>
            <li><strong>Deletion:</strong> Request deletion of account and Operational Data</li>
            <li><strong>Objection / Restriction (GDPR):</strong> Object to or request restriction of processing</li>
            <li><strong>CCPA/CPRA Rights:</strong> Right to know, delete, and correct personal information</li>
          </ul>

          <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4"><strong>Important Zero-Knowledge Note:</strong> These rights apply to Operational Data we can access. We cannot access, correct, or export Vaulted Content in decrypted form.</p>

          <h2>8. LIMITATION OF LIABILITY</h2>
          <p>By using the Services, you acknowledge that loss of master encryption keys constitutes permanent loss of access, for which Cairn Zero shall not be held liable.</p>

          <h2>9. INTERNATIONAL DATA TRANSFERS</h2>
          <p>Information may be processed in the United States or other countries where service providers maintain facilities.</p>

          <h2>10. CHANGES TO THIS POLICY</h2>
          <p>We reserve the right to modify this Policy at any time. Updates posted on www.mycairnzero.com with revised "Effective Date."</p>

          <h2>11. CONTACT INFORMATION</h2>
          <p>
            <strong>For privacy inquiries:</strong> legal@mycairnzero.com<br/>
            <strong>For general support:</strong> hello@mycairnzero.com<br/>
            <strong>Website:</strong> www.mycairnzero.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
