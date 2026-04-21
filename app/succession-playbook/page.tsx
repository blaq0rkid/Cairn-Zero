
// File: app/succession-playbook/page.tsx
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function SuccessionPlaybookPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-gray">
          <h1>CAIRN ZERO SUCCESSION PLAYBOOK (TEMPLATE)</h1>
          <p className="text-sm text-gray-600">
            Protocol Version: 1.0 (April 2026)<br/>
            Classification: Confidential / Founder's Eyes Only<br/>
            Company: Cairn Zero
          </p>

          <h2>1. PURPOSE AND OBJECTIVE</h2>
          <p>
            This Succession Playbook (the "Playbook") serves as the definitive operational and legal bridge between the Founder/Key Decision-Maker (the "Founder") and their designated successors. In alignment with Cairn Zero's "Certainty-Only" Principle, this document ensures that business sovereignty is transferred without interruption, mitigating the "Founder Immortality Trap" and closing the "Succession Gap."
          </p>

          <h2>2. THE SUCCESSION CHAIN (REDUNDANCY PROTOCOL)</h2>
          <p>
            To prevent a single point of failure within the succession line, the Founder hereby designates a tiered hierarchy of access.
          </p>
          <ul>
            <li><strong>Primary Successor:</strong> [Name/Entity]</li>
            <li><strong>Secondary Successor (The Successor's Successor):</strong> [Name/Entity]</li>
            <li><strong>Tertiary Successor (Final Contingency):</strong> [Name/Entity]</li>
          </ul>
          <p>
            <strong>The Handover Trigger:</strong> In the event the Primary Successor fails to acknowledge or activate their Cairn Key within [Number, e.g., 14] days of a Trigger Event, the Secondary Successor is hereby authorized to initiate the "Succession Claim" via the Cairn Zero Dashboard.
          </p>

          <h2>3. MANDATORY GEOGRAPHIC SEPARATION & PHYSICAL CUSTODY</h2>
          <p>
            To maintain "Zero-Knowledge Sovereignty" and prevent total asset loss due to localized disaster (fire, theft, or casualty), the following physical custody rules are mandatory:
          </p>
          <ul>
            <li>
              <strong>The 7-Day Handoff Rule:</strong> Within seven (7) business days of receiving the Dual-Key hardware shipment from Cairn Zero, the Founder MUST transfer the "Archive" key to the Primary Successor or a designated legal representative (e.g., corporate counsel).
            </li>
            <li>
              <strong>Storage Requirements:</strong> The Active and Archive keys shall not be stored in the same building. It is recommended that the Archive key be stored in a fireproof safe at a separate residential or commercial location.
            </li>
            <li>
              <strong>Separate Location Requirement (Single Point of Failure):</strong> The Archive key must be stored in a separate physical location (e.g., a vault or with a successor) to close the "Single Point of Failure" loop.
            </li>
          </ul>

          <h2>4. THE ASSET MAP (THE "NOW WHAT?" INDEX)</h2>
          <p>
            The following table serves as the directory for the successor. Cairn Zero does not host this data; this map directs the successor to the "Keys to the Kingdom."
          </p>
          <p className="italic">
            Instruction: Fill this out, print it, and store it in your safety deposit box or with your lawyer.
          </p>

          <h2>5. MANDATORY SILO CONSOLIDATION (LEVEL 5 SUCCESSION RISK)</h2>
          <p>
            Browser-stored passwords and fragmented account logins (Chrome, Safari, Firefox, Edge, iCloud Keychain, Google Password Manager, etc.) are <strong>Level 5 Succession Risks</strong>. They create hidden credential "silos" that routinely become unrecoverable at the exact moment a successor needs them most.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <h3 className="text-red-800 font-bold">Succession Failure Scenario (Business Death Spiral):</h3>
            <p className="text-red-700">
              The Founder is incapacitated. The team can access the laptop, but the passwords are trapped in a browser profile that requires an unknown OS login, an unknown browser profile passcode, a missing synced device, or an expiring authentication prompt. Billing fails. Payroll stalls. DNS cannot be updated during an outage. The bank account cannot be accessed to approve wire transfers. Vendors shut off services. Customers churn. The business doesn't "pause"—it degrades hour by hour until it collapses. Fragmented browser data is the Succession Gap in its most lethal form.
            </p>
          </div>

          <p><strong>Objective:</strong> Export credentials and critical business URLs into one consolidated file named: <strong>Master Key Directory</strong> (recommended filename: Master-Key-Directory.csv or Master-Key-Directory.xlsx)</p>

          <h3>Mandatory checklist (complete in full):</h3>
          <ol>
            <li>Identify and list every silo you use (no exceptions)</li>
            <li>Export credentials from each browser silo (Chrome, Safari, Firefox, Edge)</li>
            <li>Consolidate into a single Master Key Directory file</li>
            <li>Add critical business URLs that may not have saved passwords</li>
            <li>Migrate to hardware (Active + Archive) and validate</li>
            <li>Purge the browser silos (required)</li>
            <li>Update cadence: quarterly minimum</li>
          </ol>

          <h2>6. "RETREAT MODE" & THE STALL MECHANISM</h2>
          <p>
            To prevent "False Positive" handovers (e.g., the Founder is temporarily incapacitated or off-grid), the following "Stall" protocol is established:
          </p>
          <ul>
            <li><strong>The Cairn Guardian:</strong> [Name of Trusted Party/Attorney]</li>
            <li><strong>Authority:</strong> The Cairn Guardian is granted the power to pause a countdown trigger for a period of [Number, e.g., 30] days.</li>
            <li><strong>Zero-Knowledge Limitation:</strong> The Guardian has NO access to the encrypted data. Their sole power is to delay the automated handover to ensure the Founder is truly unavailable.</li>
          </ul>

          <h2>7. SUCCESSION ATTESTATION (FIDUCIARY SAFE HARBOR)</h2>
          <p>Upon the activation of a Successor Key, the Successor hereby agrees to the following:</p>
          <ul>
            <li><strong>Acknowledgment of Responsibility:</strong> The Successor acknowledges that Cairn Zero is a "Zero-Knowledge" provider and cannot recover lost passwords or keys if the Successor loses their hardware device.</li>
            <li><strong>Assumption of Fiduciary Duty:</strong> The Successor agrees that upon handover, they assume the fiduciary duty to act in the best interest of the business entity.</li>
            <li><strong>Release of Liability:</strong> The Successor holds Cairn Zero harmless for any business losses, technical errors, or mismanagement occurring during or after the transition period.</li>
          </ul>

          <h2>8. THE CAIRN CONTINGENCY (HARDWARE REPLACEMENT)</h2>
          <p>
            In accordance with the Cairn Zero Terms of Service, if a hardware key is lost prior to a Trigger Event, the Founder may invoke the "Cairn Contingency" for a 50% replacement cost, provided proof of purchase is verified.
          </p>

          <h2>9. ANNUAL CERTAINTY AUDIT</h2>
          <p>The Founder agrees to review this Playbook and the Cairn Zero Dashboard every twelve (12) months to:</p>
          <ul>
            <li>Update Successor contact information.</li>
            <li>Verify the physical location of both keys.</li>
            <li>Update the Asset Map to reflect new corporate accounts or holdings.</li>
          </ul>

          <div className="mt-12 border-t-2 border-gray-300 pt-6">
            <p><strong>Founder Signature:</strong> ___________________________ <strong>Date:</strong> _______________</p>
            <p><strong>Primary Successor Acknowledgment:</strong> ___________________________ <strong>Date:</strong> _______________</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
