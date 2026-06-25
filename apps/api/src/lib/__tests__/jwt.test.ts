import { describe, it, expect } from 'vitest'
import { signToken, verifyToken } from '../jwt.js'

describe('jwt', () => {
  const payload = { sub: 'user-uuid-123', email: 'test@example.com' }

  it('signe et vérifie un token valide', () => {
    const token = signToken(payload)
    const decoded = verifyToken(token)

    expect(decoded.sub).toBe(payload.sub)
    expect(decoded.email).toBe(payload.email)
  })

  it('lève une erreur sur un token invalide', () => {
    expect(() => verifyToken('token.invalide.xxx')).toThrow()
  })

  it('lève une erreur sur un token falsifié', () => {
    const token = signToken(payload)
    const tampered = token.slice(0, -5) + 'xxxxx'
    expect(() => verifyToken(tampered)).toThrow()
  })
})
