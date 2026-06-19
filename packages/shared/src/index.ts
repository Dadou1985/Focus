export * from './types'

export const MODE_COLORS: Record<string, string> = {
  focus: '#6366f1',
  collaboration: '#22c55e',
  admin: '#f59e0b',
  urgence: '#ef4444',
}

export const MODE_EMOJIS: Record<string, string> = {
  focus: '🎯',
  collaboration: '🤝',
  admin: '📋',
  urgence: '🚨',
}

export const DEFAULT_MODES = [
  {
    type: 'focus' as const,
    name: 'Focus',
    emoji: '🎯',
    color: '#6366f1',
    description: 'Travail profond, pas de distractions',
    slackStatus: 'En mode Focus — ne pas déranger',
    slackEmoji: ':no_entry_sign:',
    dndEnabled: true,
    gmailSignature: 'Je suis en mode concentration. Je répondrai dès que possible.',
  },
  {
    type: 'collaboration' as const,
    name: 'Collaboration',
    emoji: '🤝',
    color: '#22c55e',
    description: 'Disponible pour les échanges et réunions',
    slackStatus: 'Disponible pour collaborer',
    slackEmoji: ':handshake:',
    dndEnabled: false,
    gmailSignature: 'Disponible pour échanger. N\'hésitez pas à me contacter.',
  },
  {
    type: 'admin' as const,
    name: 'Admin',
    emoji: '📋',
    color: '#f59e0b',
    description: 'Tâches administratives et emails',
    slackStatus: 'Mode Admin — emails et tâches',
    slackEmoji: ':clipboard:',
    dndEnabled: false,
    gmailSignature: 'Je traite mes emails et tâches administratives.',
  },
  {
    type: 'urgence' as const,
    name: 'Urgence',
    emoji: '🚨',
    color: '#ef4444',
    description: 'Situation urgente — disponible immédiatement',
    slackStatus: '🚨 URGENCE — disponible immédiatement',
    slackEmoji: ':rotating_light:',
    dndEnabled: false,
    gmailSignature: 'Situation urgente en cours. Je suis disponible immédiatement.',
  },
]
