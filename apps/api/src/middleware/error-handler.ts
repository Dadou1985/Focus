import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors.js'

// Middleware d'erreur Express — doit avoir 4 paramètres pour être reconnu comme tel
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
    })
    return
  }

  // Erreur inattendue — on log sans exposer les détails au client
  console.error('[unhandled error]', err)
  res.status(500).json({
    error: 'Erreur serveur interne',
    code: 'INTERNAL_ERROR',
  })
}
