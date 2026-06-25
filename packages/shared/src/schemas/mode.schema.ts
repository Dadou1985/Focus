import { z } from 'zod'

export const ModeTypeSchema = z.enum(['focus', 'collaboration', 'admin', 'urgence'])

export const ModeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: ModeTypeSchema,
  name: z.string().min(1).max(50),
  emoji: z.string().min(1).max(10),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur hex invalide'),
  description: z.string().max(200).nullable(),
  slackStatus: z.string().max(100).nullable(),
  slackEmoji: z.string().max(50).nullable(),
  dndEnabled: z.boolean(),
  gmailSignature: z.string().max(500).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const UpdateModeInputSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  emoji: z.string().min(1).max(10).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  description: z.string().max(200).nullable().optional(),
  slackStatus: z.string().max(100).nullable().optional(),
  slackEmoji: z.string().max(50).nullable().optional(),
  dndEnabled: z.boolean().optional(),
  gmailSignature: z.string().max(500).nullable().optional(),
})

// Types inférés — plus besoin de les écrire à la main
export type ModeType = z.infer<typeof ModeTypeSchema>
export type Mode = z.infer<typeof ModeSchema>
export type UpdateModeInput = z.infer<typeof UpdateModeInputSchema>
