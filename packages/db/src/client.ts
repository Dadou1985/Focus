import { createClient } from '@supabase/supabase-js'
import { env } from '@mode/config'

export const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
