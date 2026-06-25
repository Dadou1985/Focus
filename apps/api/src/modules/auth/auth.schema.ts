// Types DB row — représentation brute Supabase (snake_case, colonnes techniques)
// Ne jamais exposer ces types à l'extérieur du module
export interface UserRow {
  id: string
  email: string
  name: string
  avatar_url: string | null
  timezone: string
  created_at: string
  updated_at: string
}

export interface OAuthTokenRow {
  id: string
  user_id: string
  provider: 'google' | 'slack'
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  scopes: string[]
}

export interface ModeRow {
  id: string
  user_id: string
  type: 'focus' | 'collaboration' | 'admin' | 'urgence'
  name: string
  emoji: string
  color: string
  description: string | null
  slack_status: string | null
  slack_emoji: string | null
  dnd_enabled: boolean
  gmail_signature: string | null
  created_at: string
  updated_at: string
}

// Inputs pour les opérations Supabase — restent locaux au module
export type UpsertUserInput = Pick<UserRow, 'email' | 'name' | 'avatar_url'>
export type UpsertOAuthTokenInput = Omit<OAuthTokenRow, 'id'>
export type UpsertModeInput = Omit<ModeRow, 'id' | 'created_at' | 'updated_at'>
