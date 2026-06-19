export type ModeType = 'focus' | 'collaboration' | 'admin' | 'urgence'

export interface Mode {
  id: string
  userId: string
  type: ModeType
  name: string
  emoji: string
  color: string
  description: string
  slackStatus: string
  slackEmoji: string
  dndEnabled: boolean
  gmailSignature: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  timezone: string
  createdAt: string
}

export interface TimeBlock {
  id: string
  dayPlanId: string
  modeType: ModeType
  startTime: string
  endTime: string
  title?: string
  createdAt: string
}

export interface DayPlan {
  id: string
  userId: string
  date: string
  status: 'draft' | 'validated'
  timeBlocks: TimeBlock[]
  createdAt: string
  updatedAt: string
}

export interface Override {
  id: string
  userId: string
  modeType: ModeType
  reason?: string
  expiresAt: string
  createdAt: string
}

export interface StateTransition {
  id: string
  userId: string
  fromMode?: ModeType
  toMode: ModeType
  trigger: 'schedule' | 'override' | 'manual'
  triggeredAt: string
}

export interface DailyMetrics {
  id: string
  userId: string
  date: string
  focusMinutes: number
  collaborationMinutes: number
  adminMinutes: number
  urgenceMinutes: number
  overrideCount: number
}

export type WsEventType =
  | 'STATE_CHANGED'
  | 'BLOCK_ENDING_SOON'
  | 'OVERRIDE_APPLIED'
  | 'ERROR'

export interface WsMessage {
  type: WsEventType
  payload: Record<string, unknown>
  timestamp: string
}

export interface GoogleCalendarEvent {
  id: string
  summary: string
  start: { dateTime: string }
  end: { dateTime: string }
  attendees?: { email: string }[]
}

export interface ClassifiedEvent extends GoogleCalendarEvent {
  suggestedMode: ModeType
}
