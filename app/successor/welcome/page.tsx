
'use client'

import { useEffect, useState } from 'react'
import { Shield, Heart, Key, CheckCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SuccessorWelcomePage() {
  const router = useRouter()
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <img 
              src="https://cdn.marblism.com/JsSjox_nhRL.webp" 
              alt="Cairn Zero" 
              className="h-12 w-12 object-contain mr-3"
            />
            <span className="text-2xl font-bold text-slate-900">Cairn Zero</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Heart className="text-blue-600" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to Your Succession Portal
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            You've been designated as a trusted successor. This is your gateway to access 
            important information left for you by someone who cares.
          </p>
        </div>

        {/* What is Cairn Zero Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                What is Cairn Zero?
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Cairn Zero is a digital continuity platform that helps people preserve and 
                transfer important information to their trusted successors. Think of it as a 
                secure vault that only opens when you're meant to have access.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We operate on <strong>Zero-Knowledge Sovereignty</strong> principles—meaning 
                even we cannot access what's been entrusted to you. Your access is protected 
                by cryptographic security, and only you can unlock what's been left for you.
              </p>
            </div>
          </div>
        </div>

        {/* Why You're Here Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Why Am I Here?
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Someone you know has designated you as their successor through Cairn Zero. 
                This means they trust you to receive important information, instructions, or 
                access to digital resources when the time comes.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You should have received a <strong>unique invitation code</strong> (formatted as CZ-XXXX). 
                This code is your key to access the succession vault that's been prepared for you.
              </p>
            </div>
          </div>
        </div>

        {/* How to Access Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How to Authenticate
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Enter Your Invitation Code</h3>
                    <p className="text-slate-600 text-sm">
                      Use the unique CZ-XXXX code you received via email or notification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Review Legal Terms</h3>
                    <p className="text-slate-600 text-sm">
                      Accept the terms of service and privacy policy to proceed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Access Your Vault</h3>
                    <p className="text-slate-600 text-sm">
                      View the information, instructions, or resources left for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <Shield size={20} />
            Important Security Notes
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex gap-2">
              <span>•</span>
              <span>Your invitation code is unique and should be kept confidential</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>You can only access what has been specifically designated for you</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Cairn Zero cannot reset or recover access codes—keep yours safe</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>If you believe you received this in error, contact the person who designated you</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/successor/access')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Continue to Access Portal
            <ArrowRight size={24} />
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Ready to enter your invitation code and access your vault
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Questions or concerns?
          </p>
          <a 
            href="/contact" 
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            Contact Cairn Zero Support
          </a>
        </div>
      </main>
    </div>
  )
}
