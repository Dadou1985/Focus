import { vi } from 'vitest'

// Variables d'environnement pour les tests — évite de charger un vrai .env
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-must-be-at-least-32-chars!!'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_KEY = 'test-service-key'
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret'
process.env.WEB_APP_URL = 'http://localhost:3000'

// Mock global de @mode/db — les tests unitaires ne touchent jamais Supabase
vi.mock('@mode/db', () => ({
  db: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}))
