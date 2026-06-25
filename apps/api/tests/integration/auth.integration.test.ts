import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app.js'

// Mock du service auth — le test d'intégration vérifie le contrat HTTP,
// pas la logique métier ni la DB
vi.mock('../../src/modules/auth/auth.service.js', () => ({
  getAuthorizationUrl: vi.fn(() => 'https://accounts.google.com/oauth?mock'),
  handleGoogleCallback: vi.fn(),
  getCurrentUser: vi.fn(),
}))

const app = createApp()

describe('GET /health', () => {
  it('retourne 200 avec status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /auth/google', () => {
  it('redirige vers Google OAuth', async () => {
    const res = await request(app).get('/auth/google')
    expect(res.status).toBe(302)
    expect(res.headers.location).toContain('accounts.google.com')
  })
})

describe('GET /auth/me', () => {
  it('retourne 401 sans cookie', async () => {
    const res = await request(app).get('/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.code).toBe('UNAUTHORIZED')
  })

  it('retourne 401 avec un token invalide', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', 'mode_token=token.invalide.xxx')
    expect(res.status).toBe(401)
    expect(res.body.code).toBe('UNAUTHORIZED')
  })
})
