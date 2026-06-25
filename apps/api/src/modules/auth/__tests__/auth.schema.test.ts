import { describe, it, expect } from 'vitest'
import { ModeTypeSchema } from '@mode/shared'

describe('ModeTypeSchema', () => {
  it('accepte les 4 modes valides', () => {
    for (const mode of ['focus', 'collaboration', 'admin', 'urgence']) {
      expect(ModeTypeSchema.safeParse(mode).success).toBe(true)
    }
  })

  it('rejette une valeur inconnue', () => {
    expect(ModeTypeSchema.safeParse('deep-work').success).toBe(false)
  })
})
