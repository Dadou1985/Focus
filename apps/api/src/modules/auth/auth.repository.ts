import { db } from '@mode/db'
import type { User } from '@mode/shared'
import type {
  UserRow,
  UpsertUserInput,
  UpsertOAuthTokenInput,
  UpsertModeInput,
} from './auth.schema.js'

// ── Transformers DB row → DTO ─────────────────────────────────────────────────
// Seule couche qui connaît le mapping snake_case (DB) → camelCase (DTO)
// Colonnes techniques (updated_at, tokens) ne franchissent jamais cette frontière

function toUserDTO(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    timezone: row.timezone,
    createdAt: row.created_at,
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function upsertUser(input: UpsertUserInput): Promise<User> {
  const { data, error } = await db
    .from('users')
    .upsert(input, { onConflict: 'email', ignoreDuplicates: false })
    .select('id, email, name, avatar_url, timezone, created_at, updated_at')
    .single()

  if (error || !data) throw new Error(`upsertUser: ${error?.message}`)
  return toUserDTO(data as UserRow)
}

export async function findUserById(id: string): Promise<User | null> {
  const { data } = await db
    .from('users')
    .select('id, email, name, avatar_url, timezone, created_at, updated_at')
    .eq('id', id)
    .single()

  if (!data) return null
  return toUserDTO(data as UserRow)
}

export async function upsertOAuthToken(input: UpsertOAuthTokenInput): Promise<void> {
  const { error } = await db
    .from('oauth_tokens')
    .upsert(input, { onConflict: 'user_id,provider' })

  if (error) throw new Error(`upsertOAuthToken: ${error.message}`)
}

export async function upsertModes(modes: UpsertModeInput[]): Promise<void> {
  const { error } = await db
    .from('modes')
    .upsert(modes, { onConflict: 'user_id,type', ignoreDuplicates: true })

  if (error) throw new Error(`upsertModes: ${error.message}`)
}
