import { supabase } from '../../lib/supabase.js'
import type {
  UserRow,
  UpsertUserInput,
  UpsertOAuthTokenInput,
  UpsertModeInput,
} from './auth.schema.js'

export async function upsertUser(input: UpsertUserInput): Promise<UserRow> {
  const { data, error } = await supabase
    .from('users')
    .upsert(input, { onConflict: 'email', ignoreDuplicates: false })
    .select('id, email, name, avatar_url, timezone, created_at')
    .single()

  if (error || !data) throw new Error(`upsertUser: ${error?.message}`)
  return data as UserRow
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, name, avatar_url, timezone, created_at')
    .eq('id', id)
    .single()

  return (data as UserRow | null) ?? null
}

export async function upsertOAuthToken(input: UpsertOAuthTokenInput): Promise<void> {
  const { error } = await supabase
    .from('oauth_tokens')
    .upsert(input, { onConflict: 'user_id,provider' })

  if (error) throw new Error(`upsertOAuthToken: ${error.message}`)
}

export async function upsertModes(modes: UpsertModeInput[]): Promise<void> {
  const { error } = await supabase
    .from('modes')
    .upsert(modes, { onConflict: 'user_id,type', ignoreDuplicates: true })

  if (error) throw new Error(`upsertModes: ${error.message}`)
}
