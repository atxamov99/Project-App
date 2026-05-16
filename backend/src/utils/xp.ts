export function calculateXP(baseXP: number, mistakes: number): number {
  // Har bir xato uchun 10% kamayadi, lekin minimum baseXP/2
  const penalty = Math.min(mistakes * 0.1, 0.5)
  return Math.max(1, Math.round(baseXP * (1 - penalty)))
}
