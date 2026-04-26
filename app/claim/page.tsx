
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClaimPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/successor/access')
  }, [router])

  return null
}
