import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rflkeeurnvljuteawrth.supabase.co'
const supabaseAnonKey = 'sb_publishable_SBqxjMzzIXk5ymdChZVNmA_Suk35JlH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
