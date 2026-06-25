import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAuthorizationUrl } from '../auth.service.js'

// Les fonctions qui touchent Google OAuth et la DB sont mockées
// — le service est testé pour sa logique pure uniquement
vi.mock('../auth.repository.js', () => ({
  upsertUser: vi.fn(),
  upsertOAuthToken: vi.fn(),
  upsertModes: vi.fn(),
  findUserById: vi.fn(),
}))

vi.mock('../../lib/google.js', () => ({
  getGoogleAuthUrl: vi.fn(() => 'https://accounts.google.com/oauth?mock=true'),
  createOAuthClient: vi.fn(() => ({
    getToken: vi.fn(),
    setCredentials: vi.fn(),
  })),
}))

describe('auth.service', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getAuthorizationUrl()', () => {
    it('retourne l\'URL Google OAuth', () => {
      const url = getAuthorizationUrl()
      expect(url).toContain('accounts.google.com')
    })
  })
})
