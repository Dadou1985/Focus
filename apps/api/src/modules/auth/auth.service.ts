import { google } from 'googleapis'
import { createOAuthClient, getGoogleAuthUrl } from '../../lib/google.js'
import { signToken } from '../../lib/jwt.js'
import { DEFAULT_MODES, type User } from '@mode/shared'
import {
  upsertUser,
  upsertOAuthToken,
  upsertModes,
  findUserById,
} from './auth.repository.js'
import type { UpsertModeInput } from './auth.schema.js'

export interface GoogleCallbackResult {
  token: string
  user: User
}

export function getAuthorizationUrl(): string {
  return getGoogleAuthUrl()
}

export async function handleGoogleCallback(code: string): Promise<GoogleCallbackResult> {
  const oauthClient = createOAuthClient()
  const { tokens } = await oauthClient.getToken(code)
  oauthClient.setCredentials(tokens)

  const oauth2 = google.oauth2({ version: 'v2', auth: oauthClient })
  const { data: profile } = await oauth2.userinfo.get()

  if (!profile.email || !profile.name) {
    throw new Error('Profil Google incomplet : email ou nom manquant')
  }

  // Le repository retourne un User DTO — le service ne voit jamais UserRow
  const user = await upsertUser({
    email: profile.email,
    name: profile.name,
    avatar_url: profile.picture ?? null,
  })

  const defaultModes: UpsertModeInput[] = DEFAULT_MODES.map((m) => ({
    user_id: user.id,
    type: m.type,
    name: m.name,
    emoji: m.emoji,
    color: m.color,
    description: m.description,
    slack_status: m.slackStatus,
    slack_emoji: m.slackEmoji,
    dnd_enabled: m.dndEnabled,
    gmail_signature: m.gmailSignature,
  }))

  await upsertModes(defaultModes)

  await upsertOAuthToken({
    user_id: user.id,
    provider: 'google',
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token ?? null,
    expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
    scopes: tokens.scope?.split(' ') ?? [],
  })

  const token = signToken({ sub: user.id, email: user.email })
  return { token, user }
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  return findUserById(userId)
}
