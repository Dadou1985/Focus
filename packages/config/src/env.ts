import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),

  // Supabase
  SUPABASE_URL: z.string().url('SUPABASE_URL doit être une URL valide'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY est requis'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID est requis'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET est requis'),
  GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:3001/auth/google/callback'),

  // URLs
  WEB_APP_URL: z.string().url().default('http://localhost:3000'),

  // Chiffrement des tokens OAuth stockés en base
  ENCRYPTION_KEY: z.string().min(32).optional(),

  // Slack (optionnel — configuré en SCRUM-102)
  SLACK_CLIENT_ID: z.string().optional(),
  SLACK_CLIENT_SECRET: z.string().optional(),
  SLACK_REDIRECT_URI: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Variables d'environnement invalides :\n${issues}`)
  }

  return result.data
}

// Singleton — parsé une seule fois au démarrage
export const env: Env = parseEnv()
