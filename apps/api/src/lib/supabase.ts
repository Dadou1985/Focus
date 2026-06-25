import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL et SUPABASE_SERVICE_KEY sont requis')
}

// Service role — bypass RLS pour les opérations internes (auth, cron)
// Ne jamais exposer ce client côté frontend
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
