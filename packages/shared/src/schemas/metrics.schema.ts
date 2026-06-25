import { z } from 'zod'

export const DailyMetricsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  focusMinutes: z.number().int().min(0),
  collaborationMinutes: z.number().int().min(0),
  adminMinutes: z.number().int().min(0),
  urgenceMinutes: z.number().int().min(0),
  overrideCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type DailyMetrics = z.infer<typeof DailyMetricsSchema>
