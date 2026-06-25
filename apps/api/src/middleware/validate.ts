import type { Request, Response, NextFunction } from 'express'
import { z, type ZodSchema } from 'zod'

interface ValidateSchemas {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

// Middleware générique de validation — consomme des schemas Zod de @mode/shared
// Remplace req.body/params/query par les données parsées et typées (.strip() par défaut)
// Retourne 400 avec les issues Zod si la validation échoue
export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: z.ZodIssue[] = []

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body)
      if (!result.success) errors.push(...result.error.issues)
      else req.body = result.data
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params)
      if (!result.success) errors.push(...result.error.issues)
      else req.params = result.data
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query)
      if (!result.success) errors.push(...result.error.issues)
      else req.query = result.data
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Validation échouée',
        issues: errors.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      })
      return
    }

    next()
  }
}
