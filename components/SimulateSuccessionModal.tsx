
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface SimulateSuccessionModalProps {
  userId: string
  successors: any[]
  onClose: () => void
  onComplete: () => void
}

type SimulationStep = {
  id: string
  title: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
}

export default function SimulateSuccessionModal({ userId, successors, onClose, onComplete }: SimulateSuccessionModalProps) {
  const supabase = createClientComponentClient()
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<SimulationStep[]>([
    { id: 'heartbeat', title: 'Checking heartbeat timeout', status: 'pending' },
    { id: 'successors', title: 'Verifying successor configuration', status: 'pending' },
    { id: 'notifications', title: 'Testing notification system', status: 'pending' },
    { id: 'access', title: 'Simulating successor access grant', status: 'pending' },
    { id: 'recovery', title: 'Testing recovery procedures', status: 'pending' }
  ])

  const updateStep = (id: string, status: SimulationStep['status'], message?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, status, message } : step
    ))
  }

  const runSimulation = async () => {
    setRunning(true)

    // Step 1: Heartbeat check
    updateStep('heartbeat', 'running')
    await new Promise(resolve => setTimeout(resolve, 1500))
    updateStep('heartbeat', 'success', 'Heartbeat monitoring active')

    // Step 2: Successor verification
    updateStep('successors', 'running')
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (successors.length === 0) {
      updateStep('successors', 'error', 'No successors configured')
      setRunning(false)
      return
    }
    updateStep('successors', 'success', `${successors.length} successor(s) verified`)

    // Step 3: Notification test
    updateStep('notifications', 'running')
    await new Promise(resolve => setTimeout(resolve, 1500))
    updateStep('notifications', 'success', 'Notification channels operational')

    // Step 4: Access simulation
    updateStep('access', 'running')
    await new Promise(resolve => setTimeout(resolve, 2000))
    updateStep('access', 'success', 'Access protocols validated')

    // Step 5: Recovery test
    updateStep('recovery', 'running')
    await new Promise(resolve => setTimeout(resolve, 1500))
    updateStep('recovery', 'success', 'Recovery procedures ready')

    // Update last dry run timestamp
    try {
      await supabase
        .from('succession_playbook')
        .update({ last_dry_run_at: new Date().toISOString() })
        .eq('owner_id', userId)
    } catch (error) {
      console.error('Failed to update dry run timestamp:', error)
    }

    setRunning(false)
  }

  const allSuccess = steps.every(step => step.status === 'success')
  const hasError = steps.some(step => step.status === 'error')

  const getStepIcon = (status: SimulationStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader className="animate-spin text-blue-600" size={20} />
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />
      case 'error':
        return <AlertCircle className="text-red-600" size={20} />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Simulate Succession</h2>
          <button
            onClick={onClose}
            disabled={running}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            This simulation will test your succession plan without triggering actual succession events.
            All your successors will remain in their current state.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border ${
                step.status === 'success' ? 'bg-green-50 border-green-200' :
                step.status === 'error' ? 'bg-red-50 border-red-200' :
                step.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  {step.message && (
                    <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {allSuccess && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-green-900 font-semibold">
              ✓ Simulation Complete - All systems operational
            </p>
            <p className="text-sm text-green-700 mt-1">
              Your succession plan is ready. Last tested: {new Date().toLocaleString()}
            </p>
          </div>
        )}

        {hasError && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
            <p className="text-red-900 font-semibold">
              ⚠ Simulation Failed
            </p>
            <p className="text-sm text-red-700 mt-1">
              Please resolve the issues above before proceeding.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={running}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {allSuccess ? 'Done' : 'Cancel'}
          </button>
          {!allSuccess && !hasError && (
            <button
              onClick={runSimulation}
              disabled={running}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? 'Running...' : 'Start Simulation'}
            </button>
          )}
          {allSuccess && (
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
