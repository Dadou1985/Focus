import type { Request, Response, NextFunction } from 'express'
import { getAuthorizationUrl, handleGoogleCallback, getCurrentUser } from './auth.service.js'
import { Errors } from '../../lib/errors.js'

const IS_PROD = process.env.NODE_ENV === 'production'
const WEB_APP_URL = process.env.WEB_APP_URL ?? 'http://localhost:3000'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

export async function redirectToGoogle(_req: Request, res: Response): Promise<void> {
  res.redirect(getAuthorizationUrl())
}

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { code, error } = req.query

  if (error || !code || typeof code !== 'string') {
    // Redirect OAuth refusé — cas UX, pas une erreur serveur
    res.redirect(`${WEB_APP_URL}/login?error=oauth_denied`)
    return
  }

  try {
    const { token } = await handleGoogleCallback(code)
    res.cookie('mode_token', token, COOKIE_OPTIONS)
    res.redirect(`${WEB_APP_URL}/dashboard`)
  } catch (err) {
    next(err)
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('mode_token', { path: '/' })
  res.json({ success: true })
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getCurrentUser(req.user!.sub)
    if (!user) return void next(Errors.notFound('Utilisateur introuvable'))
    res.json(user)
  } catch (err) {
    next(err)
  }
}
