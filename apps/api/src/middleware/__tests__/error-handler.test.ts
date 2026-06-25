import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../error-handler.js'
import { AppError } from '../../lib/errors.js'

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
}

const req = {} as Request
const next = vi.fn() as NextFunction

describe('errorHandler', () => {
  it('formate une AppError avec son status et code', () => {
    const res = mockRes()
    const err = new AppError('Non authentifié', 401, 'UNAUTHORIZED')
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Non authentifié', code: 'UNAUTHORIZED' })
  })

  it('retourne 500 pour une erreur inattendue', () => {
    const res = mockRes()
    errorHandler(new Error('boom'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erreur serveur interne',
      code: 'INTERNAL_ERROR',
    })
  })

  it('ne divulgue pas les détails d\'une erreur inattendue', () => {
    const res = mockRes()
    errorHandler(new Error('détail sensible interne'), req, res, next)
    const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(JSON.stringify(response)).not.toContain('détail sensible interne')
  })
})
