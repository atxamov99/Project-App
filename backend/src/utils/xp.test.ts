import { describe, expect, it } from 'vitest'
import { calculateXP } from './xp'

describe('calculateXP', () => {
  it('returns full XP when no mistakes', () => {
    expect(calculateXP(10, 0)).toBe(10)
    expect(calculateXP(20, 0)).toBe(20)
  })

  it('reduces XP by 10% per mistake', () => {
    expect(calculateXP(10, 1)).toBe(9)
    expect(calculateXP(10, 2)).toBe(8)
    expect(calculateXP(10, 3)).toBe(7)
  })

  it('caps penalty at 50% (5+ mistakes)', () => {
    expect(calculateXP(10, 5)).toBe(5)
    expect(calculateXP(10, 10)).toBe(5)
    expect(calculateXP(10, 100)).toBe(5)
  })

  it('always returns at least 1', () => {
    expect(calculateXP(1, 100)).toBe(1)
  })
})
