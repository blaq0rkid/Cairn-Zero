
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClaimPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediate redirect to successor access page
    router.replace('/successor/access')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-slate-600">Redirecting to Successor Portal...</p>
      </div>
    </div>
  )
}
