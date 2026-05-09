import { describe, expect, it } from 'vitest'
import { nextStrength, nextReviewAt } from './spacedRepetition'

describe('nextStrength', () => {
  it('increments on correct, capped at 5', () => {
    expect(nextStrength(0, true)).toBe(1)
    expect(nextStrength(4, true)).toBe(5)
    expect(nextStrength(5, true)).toBe(5)
  })

  it('decrements on wrong, floored at 0', () => {
    expect(nextStrength(3, false)).toBe(2)
    expect(nextStrength(1, false)).toBe(0)
    expect(nextStrength(0, false)).toBe(0)
  })
})

describe('nextReviewAt', () => {
  it('returns dates in the future according to interval', () => {
    const from = new Date('2026-05-01T00:00:00Z')

    const r0 = nextReviewAt(0, from) // 1 day
    expect(r0.toISOString().slice(0, 10)).toBe('2026-05-02')

    const r2 = nextReviewAt(2, from) // 4 days
    expect(r2.toISOString().slice(0, 10)).toBe('2026-05-05')

    const r5 = nextReviewAt(5, from) // 32 days
    expect(r5.toISOString().slice(0, 10)).toBe('2026-06-02')
  })
})
