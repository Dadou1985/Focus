import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../validate.js'

function mockReqRes(body = {}, params = {}, query = {}) {
  const req = { body, params, query } as unknown as Request
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next }
}

const NameSchema = z.object({ name: z.string().min(1) })

describe('validate middleware', () => {
  it('appelle next() si le body est valide', () => {
    const { req, res, next } = mockReqRes({ name: 'Focus' })
    validate({ body: NameSchema })(req, res, next)
    expect(next).toHaveBeenCalledWith()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('retourne 400 si le body est invalide', () => {
    const { req, res, next } = mockReqRes({ name: '' })
    validate({ body: NameSchema })(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('strip les champs inconnus du body', () => {
    const { req, res, next } = mockReqRes({ name: 'Focus', hacked: true })
    validate({ body: NameSchema })(req, res, next)
    expect(req.body).toEqual({ name: 'Focus' })
    expect(req.body.hacked).toBeUndefined()
  })

  it('valide body et params simultanément', () => {
    const ParamsSchema = z.object({ id: z.string().uuid() })
    const { req, res, next } = mockReqRes(
      { name: 'Focus' },
      { id: 'not-a-uuid' },
    )
    validate({ body: NameSchema, params: ParamsSchema })(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('retourne les issues Zod formatées', () => {
    const { req, res, next } = mockReqRes({})
    validate({ body: NameSchema })(req, res, next)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation échouée',
        issues: expect.arrayContaining([
          expect.objectContaining({ path: 'name' }),
        ]),
      }),
    )
  })
})
