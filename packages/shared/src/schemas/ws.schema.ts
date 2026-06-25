import { z } from 'zod'

export const WsEventTypeSchema = z.enum([
  'STATE_CHANGED',
  'BLOCK_ENDING_SOON',
  'OVERRIDE_APPLIED',
  'ERROR',
])

export const WsMessageSchema = z.object({
  type: WsEventTypeSchema,
  payload: z.record(z.unknown()),
  timestamp: z.string().datetime(),
})

export type WsEventType = z.infer<typeof WsEventTypeSchema>
export type WsMessage = z.infer<typeof WsMessageSchema>
