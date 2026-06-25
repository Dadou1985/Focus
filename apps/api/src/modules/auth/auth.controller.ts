import type { Request, Response } from 'express'
import {
  getAuthorizationUrl,
  handleGoogleCallback,
  getCurrentUser,
} from './auth.service.js'

const IS_PROD = process.env.NODE_ENV === 'production'
const WEB_APP_URL = process.env.WEB_APP_URL ?? 'http://localhost:3000'

const COOKIE_OPTIONS = {
  httpOnly: true,                     // inaccessible au JS du navigateur (protection XSS)
  secure: IS_PROD,                    // HTTPS uniquement en production
  sameSite: 'lax' as const,          // protection CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 jours
  path: '/',
}

export async function redirectToGoogle(_req: Request, res: Response): Promise<void> {
  const url = getAuthorizationUrl()
  res.redirect(url)
}

export async function googleCallback(req: Request, res: Response): Promise<void> {
  const { code, error } = req.query

  if (error || !code || typeof code !== 'string') {
    res.redirect(`${WEB_APP_URL}/login?error=oauth_denied`)
    return
  }

  try {
    const { token } = await handleGoogleCallback(code)
    res.cookie('mode_token', token, COOKIE_OPTIONS)
    res.redirect(`${WEB_APP_URL}/dashboard`)
  } catch (err) {
    console.error('[auth] callback error:', err)
    res.redirect(`${WEB_APP_URL}/login?error=server_error`)
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('mode_token', { path: '/' })
  res.json({ success: true })
}

export async function me(req: Request, res: Response): Promise<void> {
  // req.user est injecté par le middleware requireAuth
  const user = await getCurrentUser(req.user!.sub)

  if (!user) {
    res.status(404).json({ error: 'Utilisateur introuvable' })
    return
  }

  res.json(user)
}
