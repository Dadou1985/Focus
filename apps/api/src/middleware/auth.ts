import type { Request, Response, NextFunction } from 'express'
import { parse as parseCookies } from 'cookie'
import { verifyToken } from '../lib/jwt.js'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie ?? '')
  const tokenFromCookie = cookies['mode_token']
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined

  const token = tokenFromCookie ?? tokenFromHeader

  if (!token) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}
