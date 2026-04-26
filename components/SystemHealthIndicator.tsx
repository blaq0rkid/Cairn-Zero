
'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

export default function SystemHealthIndicator() {
  const [status, setStatus] = useState<'active' | 'checking' | 'error'>('checking')

  useEffect(() => {
    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const checkSystemHealth = async () => {
    try {
      // Ping a health endpoint or check critical services
      const response = await fetch('/api/health')
      if (response.ok) {
        setStatus('active')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300',
          text: 'Cairn Active',
          subtext: 'Monitoring Live'
        }
      case 'checking':
        return {
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-300',
          text: 'Checking Status',
          subtext: 'Please wait...'
        }
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          text: 'System Check Failed',
          subtext: 'Contact Support'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-3 px-4 py-2 ${config.bgColor} border-2 ${config.borderColor} rounded-lg`}>
      <Icon className={config.color} size={20} />
      <div>
        <p className={`text-sm font-semibold ${config.color}`}>{config.text}</p>
        <p className={`text-xs ${config.color} opacity-75`}>{config.subtext}</p>
      </div>
    </div>
  )
}
