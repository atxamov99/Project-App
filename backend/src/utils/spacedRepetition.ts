// SM-2 algoritmi: takrorlash kunlari intervallari
const INTERVALS_DAYS = [1, 2, 4, 8, 16, 32]

export function nextStrength(currentStrength: number, correct: boolean): number {
  if (correct) return Math.min(currentStrength + 1, 5)
  return Math.max(currentStrength - 1, 0)
}

export function nextReviewAt(strength: number, from: Date = new Date()): Date {
  const days = INTERVALS_DAYS[Math.min(strength, INTERVALS_DAYS.length - 1)]
  const next = new Date(from)
  next.setDate(next.getDate() + days)
  return next
}
