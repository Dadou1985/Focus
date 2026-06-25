import { z } from 'zod'
import { ModeTypeSchema } from './mode.schema.js'

export const TimeBlockSchema = z.object({
  id: z.string().uuid(),
  dayPlanId: z.string().uuid(),
  modeType: ModeTypeSchema,
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM attendu'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM attendu'),
  title: z.string().max(100).nullable(),
  createdAt: z.string().datetime(),
})

export const CreateTimeBlockInputSchema = z.object({
  modeType: ModeTypeSchema,
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().max(100).optional(),
})

export const DayPlanSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD attendu'),
  status: z.enum(['draft', 'validated']),
  timeBlocks: z.array(TimeBlockSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateDayPlanInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeBlocks: z.array(CreateTimeBlockInputSchema).min(1),
})

export type TimeBlock = z.infer<typeof TimeBlockSchema>
export type CreateTimeBlockInput = z.infer<typeof CreateTimeBlockInputSchema>
export type DayPlan = z.infer<typeof DayPlanSchema>
export type CreateDayPlanInput = z.infer<typeof CreateDayPlanInputSchema>
