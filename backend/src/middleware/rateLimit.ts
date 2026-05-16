import rateLimit from 'express-rate-limit'

// Auth uchun qattiq cheklov: 10 ta urinish / 15 daqiqa / IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.' },
})

// Umumiy API: 100 / 1 daqiqa / IP
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'So\'rovlar soni juda ko\'p. Bir muncha vaqtdan keyin qayta urinib ko\'ring.' },
})
