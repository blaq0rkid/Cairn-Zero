import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'founder' | 'successor'
  created_at: string
  updated_at: string
}

export type CairnDevice = {
  id: string
  cairn_id: string
  owner_id: string
  device_type: 'lite' | 'founder_guard' | 'enterprise'
  serial_number: string | null
  activation_date: string | null
  is_active: boolean
  encrypted_metadata: any
  created_at: string
  updated_at: string
}

export type Successor = {
  id: string
  founder_id: string
  successor_id: string | null
  email: string
  full_name: string | null
  sequence_order: number
  cairn_device_id: string | null
  status: 'pending' | 'active' | 'inactive'
  notified_at: string | null
  accessed_at: string | null
  created_at: string
  updated_at: string
}
