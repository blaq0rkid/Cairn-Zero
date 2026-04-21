
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function MSAPage() {
  return (
    <>
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-gray">
          <h1>CAIRN ZERO "CERTAINTY TIER" MASTER SERVICE AGREEMENT</h1>
          <p className="text-sm text-gray-600">Effective Date: April 16, 2026</p>
          
          <p>This Master Service Agreement (the "Agreement") is entered into by and between Cairn Zero, a business continuity and cybersecurity firm ("Company"), and the party executing this Agreement ("Client").</p>

          <h2>1. DEFINITIONS</h2>
          <dl>
            <dt><strong>1.1 "Cairn"</strong></dt>
            <dd>refers to the digital and physical architecture provided by the Company to facilitate the storage and transfer of critical business information.</dd>
            
            <dt><strong>1.2 "Successor"</strong></dt>
            <dd>refers to the individual(s) designated by the Client to receive access to the Cairn upon the occurrence of a Triggering Event.</dd>
            
            <dt><strong>1.3 "Zero-Knowledge Sovereignty"</strong></dt>
            <dd>refers to the technical protocol where the Company has no access to, visibility of, or ability to decrypt the Client's stored data, and where the Client retains 100% control over encryption keys, access configuration, and release conditions.</dd>
            
            <dt><strong>1.4 "Succession Gap"</strong></dt>
            <dd>refers to the period of operational paralysis occurring between a Founder's incapacity and a Successor's assumption of control.</dd>
            
            <dt><strong>1.5 "Sequential Handoff"</strong></dt>
            <dd>refers to the prioritized logic where access is granted to Successors in a non-simultaneous, tiered order, including configurable delays between Successors.</dd>
            
            <dt><strong>1.6 "Digital Attestation"</strong></dt>
            <dd>refers to the legally binding, in-dashboard affirmation by a Successor of (i) the Successor's identity and authority, and (ii) the status of the Founder, as a condition precedent to any release of access shards, recovery materials, or keys.</dd>
            
            <dt><strong>1.7 "Hardware Key"</strong></dt>
            <dd>refers to the high-durability physical access device provided by Company, including laser-etched identifiers and/or NFC-enabled access.</dd>
            
            <dt><strong>1.8 "Active Key"</strong></dt>
            <dd>means the primary Hardware Key designated by Client for routine access, updates, and operational use.</dd>
            
            <dt><strong>1.9 "Archive Key"</strong></dt>
            <dd>means the secondary Hardware Key designated by Client for secure, long-term storage (e.g., a vault), intended to serve as continuity backup and successor-ready access.</dd>
          </dl>

          <h2>2. THE CERTAINTY TIER SERVICE SCOPE</h2>
          
          <h3>APPENDIX / PRICING (Cairn Zero Lite):</h3>
          <ul>
            <li><strong>Setup Fee (One-Time):</strong> One Hundred Forty-Nine Dollars (US $149)</li>
            <li><strong>Subscription Fee (Monthly):</strong> Ninety-Nine Dollars (US $99) per month</li>
          </ul>

          <h3>APPENDIX / PRICING (Founder Guard):</h3>
          <ul>
            <li><strong>Setup Fee (One-Time):</strong> Four Thousand Nine Hundred Ninety-Nine Dollars (US $4,999)</li>
            <li><strong>Annual Recurring Fee:</strong> One Hundred Forty-Nine Dollars (US $149) per year</li>
          </ul>

          <h3>2.3 "Legacy Certainty" Tier (Fees & Inclusions):</h3>
          <ul>
            <li><strong>Legacy Fee (One-Time):</strong> Fourteen Thousand Nine Hundred Ninety-Nine Dollars (US $14,999)</li>
            <li><strong>"Heartbeat & Cloud Storage" Maintenance Fee (Annual):</strong> Nine Hundred Ninety-Nine Dollars (US $999) per year</li>
            <li><strong>Included Premium Hardware Package:</strong> Three (3) laser-etched stainless steel hardware keys in premium case</li>
            <li><strong>Conditioned Durability Guarantee (50-Year):</strong> Fifty (50) year durability guarantee for laser-etched legibility, conditioned on maintaining annual maintenance</li>
          </ul>

          <h2>3. HARDWARE SPECIFICATIONS & PERSISTENCE</h2>
          <p><strong>3.1 Hardware Keys:</strong> Company shall provide Client with Apricorn Aegis Secure Key 3NX (64GB) including:</p>
          <ul>
            <li><strong>Laser Etching:</strong> Unique Cairn ID (CZ-XXXX format) and Successor Portal URL</li>
            <li><strong>NFC Integration:</strong> Passive Near Field Communication chips for tap-to-access functionality</li>
          </ul>

          <h2>4. SUCCESSION LOGIC (SEQUENTIAL PROTOCOL)</h2>
          <p><strong>4.1 Sequential Order:</strong> Sequential Handoff model prevents "Succession Wars"</p>
          <p><strong>4.2 Sequential Succession Logic (Grace Period):</strong> Access granted to Successor A first</p>
          <p><strong>4.3 Default Grace Period:</strong> Seven (7) days default, customizable via Dashboard</p>

          <h2>5. CLIENT RESPONSIBILITIES</h2>
          <p><strong>5.1 Indexing:</strong> Client solely responsible for accuracy and currency of stored information</p>
          <p><strong>5.2 Successor Vetting:</strong> Client represents all successors are vetted and legally capable</p>

          <h2>6. LIMITATION OF LIABILITY</h2>
          <p><strong>6.1 No Fiduciary Duty:</strong> Company provides technical tools only, not fiduciary services</p>
          <p><strong>6.2 Loss of Data:</strong> Company not liable for data loss due to Zero-Knowledge architecture</p>
          <p><strong>6.3 Indirect Damages:</strong> No liability for consequential, indirect, or incidental damages including business interruption</p>

          <h2>7. GOVERNING LAW</h2>
          <p>This Agreement shall be governed by the laws of the State in which Cairn Zero is incorporated. Disputes resolved through binding arbitration.</p>

          <div className="mt-12 border-t-2 border-gray-300 pt-6">
            <h3>CLIENT ACKNOWLEDGMENT:</h3>
            <p>By activating the Certainty Tier, I acknowledge that I have read and understood the Zero-Knowledge Sovereignty requirements and the Sequential Handoff logic. I accept that Cairn Zero cannot recover my data if I fail to follow the protocol.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
