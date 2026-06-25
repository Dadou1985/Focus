import type { Request, Response, NextFunction } from 'express'
import { parse as parseCookies } from 'cookie'
import { verifyToken } from '../lib/jwt.js'
import { Errors } from '../lib/errors.js'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie ?? '')
  const tokenFromCookie = cookies['mode_token']
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined

  const token = tokenFromCookie ?? tokenFromHeader

  if (!token) return void next(Errors.unauthorized())

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    next(Errors.unauthorized('Token invalide ou expiré'))
  }
}
