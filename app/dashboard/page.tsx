'use client'

import { useEffect, useState } from 'react'  
import { useRouter } from 'next/navigation'  
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardPage() {  
  const router = useRouter()  
  const supabase = createClientComponentClient()  
  const [loading, setLoading] = useState(true)  
  const [session, setSession] = useState(null)

  useEffect(() => {  
    const initializeAuth = async () => {  
      const { data: { session } } = await supabase.auth.getSession()  
        
      if (!session) {  
        router.replace('/login')  
        return  
      }  
        
      setSession(session)  
      setLoading(false)  
    }

    initializeAuth()  
  }, [router, supabase])

  // Don't render anything until auth check completes  
  if (loading) {  
    return null // Or render loading skeleton (see Priority 3)  
  }

  // Session is guaranteed to exist here  
  return (  
    <div className="dashboard-content">  
      {/* Dashboard UI */}  
    </div>  
  )  
}  
