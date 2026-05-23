// MyMemory tarjima API proxy + sodda kesh (so'rovlar limitidan saqlanish uchun)
// API: https://api.mymemory.translated.net
import { AppError } from '../../middleware/error'

const BASE = 'https://api.mymemory.translated.net/get'
// Email parametri yuborilsa kunlik limit 1000 dan 50000 ga oshadi
const CONTACT_EMAIL = process.env.MYMEMORY_EMAIL || ''

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')       // XML/HTML teglarni olib tashla
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim()
}

type CacheEntry = { value: TranslationResult; expiresAt: number }
const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 1 kun

export interface TranslationResult {
  translation: string
  source: string
  target: string
  from: string
  to: string
  match: number
  alternatives: string[]
}

const SUPPORTED_LANGS = ['uz', 'en', 'ru', 'tr', 'es', 'de', 'fr', 'ar'] as const

function validateLang(code: string, field: string) {
  if (!SUPPORTED_LANGS.includes(code as typeof SUPPORTED_LANGS[number])) {
    throw new AppError(400, `${field} til kodi noto'g'ri (qabul qilinadi: ${SUPPORTED_LANGS.join(', ')})`)
  }
}

export async function translate(q: string, from: string, to: string): Promise<TranslationResult> {
  if (!q?.trim()) throw new AppError(400, "So'z bo'sh bo'la olmaydi")
  if (q.length > 500) throw new AppError(400, "So'z juda uzun (max 500 belgi)")

  const fromLang = from.toLowerCase()
  const toLang = to.toLowerCase()
  validateLang(fromLang, 'from')
  validateLang(toLang, 'to')
  if (fromLang === toLang) throw new AppError(400, "Bir xil tilga tarjima qila olmaymiz")

  const text = q.trim()
  const cacheKey = `${fromLang}|${toLang}|${text.toLowerCase()}`

  // Cache hit
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  const params = new URLSearchParams({
    q: text,
    langpair: `${fromLang}|${toLang}`,
  })
  if (CONTACT_EMAIL) params.set('de', CONTACT_EMAIL)

  let response: Response
  try {
    response = await fetch(`${BASE}?${params.toString()}`, {
      headers: { 'User-Agent': 'LingvaUZ/1.0' },
    })
  } catch (e) {
    throw new AppError(503, "Tarjima xizmatiga ulanib bo'lmadi")
  }

  if (!response.ok) {
    throw new AppError(502, `Tarjima xizmati xatolik (${response.status})`)
  }

  const data: any = await response.json()
  if (data?.responseStatus !== 200 && data?.responseStatus !== '200') {
    throw new AppError(502, data?.responseDetails || 'Tarjima topilmadi')
  }

  const translation = cleanText((data.responseData?.translatedText || '').trim())
  if (!translation) throw new AppError(404, 'Tarjima topilmadi')

  // Alternativ variantlar — match score yuqori bo'lganlar
  const alternatives: string[] = []
  if (Array.isArray(data.matches)) {
    for (const m of data.matches.slice(0, 10)) {
      const t = cleanText((m?.translation || '').trim())
      if (t && t.toLowerCase() !== translation.toLowerCase() && !alternatives.includes(t)) {
        alternatives.push(t)
      }
      if (alternatives.length >= 4) break
    }
  }

  const result: TranslationResult = {
    translation,
    source: text,
    target: translation,
    from: fromLang,
    to: toLang,
    match: data.responseData?.match ?? 0,
    alternatives,
  }

  cache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS })

  // Kesh juda kattalashib ketmasin
  if (cache.size > 500) {
    const oldestKey = cache.keys().next().value
    if (oldestKey) cache.delete(oldestKey)
  }

  return result
}

export function listSupportedLanguages() {
  return SUPPORTED_LANGS.map((code) => ({
    code,
    name: {
      uz: "O'zbek",
      en: 'English',
      ru: 'Русский',
      tr: 'Türkçe',
      es: 'Español',
      de: 'Deutsch',
      fr: 'Français',
      ar: 'العربية',
    }[code] ?? code,
  }))
}
