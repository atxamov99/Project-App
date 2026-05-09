// Haftaning boshlanishi (dushanba 00:00 UTC)
export function weekStart(date: Date = new Date()): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay() // 0 = sun, 1 = mon
  const diff = (day + 6) % 7 // dushanbagacha qancha kun ortda
  d.setUTCDate(d.getUTCDate() - diff)
  return d
}

export function weekKey(date: Date = new Date()): string {
  return weekStart(date).toISOString().slice(0, 10) // "2026-05-04"
}
