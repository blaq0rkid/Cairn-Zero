'use client'

import Link from 'next/link'  
import { useEffect, useState } from 'react'  
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Footer() {  
  const [isAuthenticated, setIsAuthenticated] = useState(false)  
  const supabase = createClientComponentClient()

  useEffect(() => {  
    const checkSession = async () => {  
      const { data: { session } } = await supabase.auth.getSession()  
      setIsAuthenticated(!!session)  
    }  
    checkSession()  
  }, [supabase])

  return (  
    <footer className="bg-gray-900 text-white">  
      {/* Other footer content */}  
        
      {/* Founder Portal Link - Auth-Protected */}  
      {isAuthenticated ? (  
        <Link href="/dashboard" className="hover:text-gray-300">  
          Founder Portal  
        </Link>  
      ) : (  
        <Link href="/login" className="hover:text-gray-300">  
          Founder Portal  
        </Link>  
      )}  
    </footer>  
  )  
}  
