import { z } from 'zod'
import { ModeTypeSchema } from './mode.schema.js'

export const OverrideSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  modeType: ModeTypeSchema,
  reason: z.string().max(200).nullable(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export const CreateOverrideInputSchema = z.object({
  modeType: ModeTypeSchema,
  reason: z.string().max(200).optional(),
  durationMinutes: z.number().int().min(5).max(480),
})

export const StateTransitionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fromMode: ModeTypeSchema.nullable(),
  toMode: ModeTypeSchema,
  trigger: z.enum(['schedule', 'override', 'manual']),
  triggeredAt: z.string().datetime(),
})

export type Override = z.infer<typeof OverrideSchema>
export type CreateOverrideInput = z.infer<typeof CreateOverrideInputSchema>
export type StateTransition = z.infer<typeof StateTransitionSchema>
