import { describe, it, expect } from 'vitest'
import { AppError, Errors } from '../errors.js'

describe('AppError', () => {
  it('construit une erreur avec les bons attributs', () => {
    const err = new AppError('Non autorisé', 401, 'UNAUTHORIZED')
    expect(err.message).toBe('Non autorisé')
    expect(err.status).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
    expect(err).toBeInstanceOf(Error)
  })

  it('Errors.unauthorized() retourne un 401 UNAUTHORIZED', () => {
    const err = Errors.unauthorized()
    expect(err.status).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })

  it('Errors.notFound() retourne un 404 NOT_FOUND', () => {
    const err = Errors.notFound()
    expect(err.status).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
  })

  it('Errors.internal() retourne un 500 INTERNAL_ERROR', () => {
    const err = Errors.internal()
    expect(err.status).toBe(500)
    expect(err.code).toBe('INTERNAL_ERROR')
  })
})
