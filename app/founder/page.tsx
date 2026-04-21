
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function FounderDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [cairnId, setCairnId] = useState('')
  const [successors, setSuccessors] = useState<any[]>([])
  const [pingFrequency, setPingFrequency] = useState('weekly')
  const [gracePeriod, setGracePeriod] = useState(7)
  const [retreatWindow, setRetreatWindow] = useState(24)
  const [showSeparationModal, setShowSeparationModal] = useState(false)
  const [separationCertified, setSeparationCertified] = useState(false)
  const [fiduciaryStatus, setFiduciaryStatus] = useState('pending')
  const [hardwareReceived, setHardwareReceived] = useState(false)
  const [separationDeadline, setSeparationDeadline] = useState<Date | null>(null)
  const [showDryRunModal, setShowDryRunModal] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        loadCairnData(session.user.id)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const loadCairnData = async (userId: string) => {
    // TODO: Load from Supabase
    // Placeholder data for now
    setCairnId('CZ-A1B2')
    setSuccessors([
      { id: 1, name: 'John Doe', email: 'john@example.com', order: 1, status: 'active' },
    ])
    
    // Simulate hardware received - triggers 7-day countdown
    setHardwareReceived(true)
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)
    setSeparationDeadline(deadline)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const addSuccessor = () => {
    const newSuccessor = {
      id: successors.length + 1,
      name: '',
      email: '',
      order: successors.length + 1,
      status: 'pending'
    }
    setSuccessors([...successors, newSuccessor])
  }

  const handleCertifySeparation = () => {
    setSeparationCertified(true)
    setShowSeparationModal(false)
    setFiduciaryStatus('active')
    // TODO: Record digital attestation in Supabase with immutable log
  }

  const handleDryRunConfirm = () => {
    setShowDryRunModal(false)
    // TODO: Execute simulation logic per Section 9.3
    alert('SIMULATED: Succession test initiated. Check your email for test notifications.')
  }

  const calculateTimeRemaining = () => {
    if (!separationDeadline) return null
    const now = new Date()
    const diff = separationDeadline.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return hours
  }

  const timeRemaining = calculateTimeRemaining()
  const showUrgentWarning = timeRemaining !== null && timeRemaining <= 24

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Geographic Separation Warning (Section 2) */}
          {hardwareReceived && !separationCertified && (
            <div className={`mb-6 p-6 rounded-lg border-2 ${
              showUrgentWarning 
                ? 'bg-red-50 border-red-500' 
                : 'bg-yellow-50 border-yellow-500'
            }`}>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {showUrgentWarning ? 'URGENT: ' : ''}7-Day Geographic Separation Required
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Your hardware keys have been delivered. You have <strong>{timeRemaining} hours remaining</strong> to certify that your Archive key has been physically separated from your Active key.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Failure to certify separation will void your Fiduciary Safe Harbor protections and set your account to "At Risk / Non-Compliant."
                  </p>
                  <button
                    onClick={() => setShowSeparationModal(true)}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Certify Separation Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fiduciary Safe Harbor Status (Section 6) */}
          {fiduciaryStatus !== 'active' && separationCertified && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-500 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-red-900">Fiduciary Safe Harbor: VOID</h3>
                  <p className="text-sm text-red-800">Your Succession Guarantee is currently inactive. Complete all requirements to activate Safe Harbor protections.</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Founder Dashboard</h1>
              <p className="text-gray-600 mt-1">Zero-Knowledge Succession Control Center</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('successors')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'successors'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Successors
              </button>
              <button
                onClick={() => setActiveTab('triggers')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'triggers'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Continuity Triggers
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'audit'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Digital Sprawl Audit
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Status Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      fiduciaryStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900">Safe Harbor</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {fiduciaryStatus === 'active' ? 'Active' : 'Void'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {fiduciaryStatus === 'active' ? 'Protected' : 'Non-Compliant'}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900">System Status</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="text-sm text-gray-600 mt-1">All systems operational</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Cairn ID</h3>
                  <p className="text-2xl font-bold text-gray-900">{cairnId || 'Not Assigned'}</p>
                  <p className="text-sm text-gray-600 mt-1">Hardware identifier</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Successors</h3>
                  <p className="text-2xl font-bold text-gray-900">{successors.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Sequential queue</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Continuity Ping Acknowledged</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Dashboard Login</p>
                      <p className="text-sm text-gray-600">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Successors Tab */}
          {activeTab === 'successors' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sequential Succession Chain</h2>
                  <p className="text-gray-600 mt-1">Configure your sequential handoff protocol (Section 3.1)</p>
                </div>
                <button
                  onClick={addSuccessor}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add Successor
                </button>
              </div>

              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Sequential Access Logic (Anti-Succession War Protocol)</h3>
                <p className="text-sm text-blue-800">
                  Successors can ONLY access the vault in sequential order. Successor 2 cannot be activated unless Successor 1 fails to respond within the grace period OR you explicitly deactivate Successor 1.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {successors.map((successor, index) => (
                  <div key={successor.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Successor Name"
                          defaultValue={successor.name}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          defaultValue={successor.email}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        successor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {successor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Grace Period (Default: 7 Days)</h3>
                <p className="text-sm text-gray-600">
                  When a triggering event occurs, Successor 1 has 7 days to complete Digital Attestation. If they fail to respond, Successor 2 is automatically notified.
                </p>
              </div>
            </div>
          )}

          {/* Triggers Tab */}
          {activeTab === 'triggers' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Continuity Triggers & Heartbeat Configuration</h2>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    Ping Frequency (Section 4.1)
                  </label>
                  <select
                    value={pingFrequency}
                    onChange={(e) => setPingFrequency(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    How often should we check if you're available?
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(parseInt(e.target.value))}
                    min={1}
                    max={30}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Days before triggering succession after missed ping
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    Retreat Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={retreatWindow}
                    onChange={(e) => setRetreatWindow(parseInt(e.target.value))}
                    min={1}
                    max={72}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Time to cancel false positive triggers
                  </p>
                </div>

                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-fit">
                  Save Trigger Settings
                </button>
              </div>

              {/* Dry Run / Succession Simulation (Section 9) */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Your Succession Plan (Dry Run)
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Run a non-destructive simulation to validate that your succession configuration will function as intended. This will test notifications, access eligibility logic, and workflow gating WITHOUT releasing any decryption authority.
                </p>
                <button 
                  onClick={() => setShowDryRunModal(true)}
                  className="border-2 border-yellow-900 text-yellow-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-900 hover:text-white transition-colors"
                >
                  Simulate Succession Event
                </button>
              </div>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Digital Sprawl Audit</h2>
              <p className="text-gray-600 mb-6">
                Consolidate browser-stored passwords and critical access points into your Master Key Directory
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <h3 className="font-semibold text-red-900 mb-2">Level 5 Systemic Risk Detected</h3>
                <p className="text-sm text-red-800">
                  Browser-stored passwords create hidden credential silos that become unrecoverable during succession. 
                  Mandatory silo consolidation is required for Certainty compliance.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Step 1: Identify Your Silos</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">Chrome Password Manager</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">Safari Keychain</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">Firefox Sync</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">Edge Password Manager</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">iCloud Keychain</span>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Step 2: Export & Consolidate</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create your Master Key Directory (CSV or Excel format) containing all critical access points.
                  </p>
                  <button className="border border-gray-900 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors">
                    Upload Master Key Directory
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Step 3: Hardware Migration</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Migrate consolidated credentials to your Active hardware key and validate Archive key access.
                  </p>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Begin Hardware Migration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Geographic Separation Certification Modal (Section 2.2) */}
      {showSeparationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Certification of Geographic Separation</h2>
            <p className="text-gray-700 mb-6">
              To activate your Fiduciary Safe Harbor protections, you must certify under penalty of contract voidance that your Archive key has been physically separated from your Active key.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="w-5 h-5 mt-1" required />
                <span className="text-sm text-gray-900">
                  <strong>I certify under penalty of contract voidance that:</strong> My Archive key (Key B) has been physically handed to my designated successor or legal counsel and is no longer stored at my primary place of business. I understand that both keys must not be stored in the same building to maintain the Certainty Guarantee.
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCertifySeparation}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Digitally Sign & Certify
              </button>
              <button
                onClick={() => setShowSeparationModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dry Run Confirmation Modal (Section 9.2) */}
      {showDryRunModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Succession Simulation</h2>
            <p className="text-gray-700 mb-6">
              You are about to initiate a <strong>SIMULATED</strong> succession event for testing purposes only.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">What This Simulation Will Do:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                <li>Test notification delivery to all designated successors</li>
                <li>Validate access eligibility logic and sequential handoff protocols</li>
                <li>Verify decryption workflow gating (using mock data only)</li>
                <li>All messages will be clearly labeled "SIMULATED"</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What This Simulation Will NOT Do:</h3>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Release, transmit, or transfer any actual decryption keys</li>
                <li>Expose vault contents or unencrypted data to anyone</li>
                <li>Trigger any irreversible on-chain actions</li>
                <li>Count as evidence of an actual succession event</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDryRunConfirm}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Confirm & Run Simulation
              </button>
              <button
                onClick={() => setShowDryRunModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
