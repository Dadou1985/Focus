// Interfaces représentant les lignes en base — miroir du schéma SQL
export interface UserRow {
  id: string
  email: string
  name: string
  avatar_url: string | null
  timezone: string
  created_at: string
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
}

// Inputs pour les opérations CRUD
export type UpsertUserInput = Pick<UserRow, 'email' | 'name' | 'avatar_url'>

export type UpsertOAuthTokenInput = Omit<OAuthTokenRow, 'id'>

export type UpsertModeInput = Omit<ModeRow, 'id'>
