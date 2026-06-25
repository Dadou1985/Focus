import express, { type Express } from 'express'
import authRouter from './modules/auth/auth.routes.js'

export function createApp(): Express {
  const app: Express = express()

  app.use(express.json())

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // Modules
  app.use('/auth', authRouter)
  // app.use('/modes', modesRouter)     // SCRUM-94
  // app.use('/planning', planningRouter) // SCRUM-99

  return app
}
