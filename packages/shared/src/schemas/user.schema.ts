import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().nullable(),
  timezone: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
})

export const UpdateUserInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).max(50).optional(),
})

export type User = z.infer<typeof UserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>
