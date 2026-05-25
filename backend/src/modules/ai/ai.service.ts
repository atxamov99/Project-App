import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../config/env'

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']

let genAI: GoogleGenerativeAI | null = null
function client() {
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')
  if (!genAI) genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  return genAI
}

async function generate(prompt: string, opts?: { json?: boolean }): Promise<string> {
  let lastErr: unknown
  for (const modelName of MODELS) {
    try {
      const model = client().getGenerativeModel({
        model: modelName,
        generationConfig: opts?.json ? { responseMimeType: 'application/json' } : undefined,
      })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (e) {
      lastErr = e
      const msg = String((e as Error)?.message || e)
      if (msg.includes('429') || msg.includes('503') || msg.toLowerCase().includes('unavailable') || msg.toLowerCase().includes('quota')) continue
      throw e
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('All AI models unavailable')
}

function stripFences(s: string) {
  return s.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

function parseJson<T>(text: string): T {
  const cleaned = stripFences(text)
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const m = cleaned.match(/[\[{][\s\S]*[\]}]/)
    if (!m) throw new Error('AI response is not valid JSON')
    return JSON.parse(m[0]) as T
  }
}

const LANG_NAMES: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  uz: 'Uzbek',
}

function langName(code: string): string {
  return LANG_NAMES[code.toLowerCase()] || code
}

export type Lang = 'en' | 'ru' | 'uz'

export async function translateText(
  text: string,
  from: Lang | 'auto',
  to: Lang,
): Promise<{ translation: string; detectedLang?: string; alternatives?: string[] }> {
  const fromPart =
    from === 'auto'
      ? 'the language of the following text (auto-detect it)'
      : langName(from)

  const prompt = `Translate the following text from ${fromPart} to ${langName(to)}.
${from === 'auto' ? 'Include "detectedLang" as an ISO 639-1 code (e.g. "en", "ru", "uz").' : ''}
If there are 1-3 meaningful alternative translations, include them in "alternatives" (omit if none).
Return ONLY a JSON object with these keys (omit unused ones):
{"translation":"...","detectedLang":"...","alternatives":["...","..."]}
No markdown, no explanations.

Text: ${JSON.stringify(text)}`
  const raw = await generate(prompt, { json: true })
  return parseJson<{ translation: string; detectedLang?: string; alternatives?: string[] }>(raw)
}

export async function explainAnswer(params: {
  exerciseType: string
  prompt: string
  userAnswer: string
  correctAnswer: string
  learningLang: Lang
  interfaceLang: Lang
}): Promise<{ explanation: string; tip?: string }> {
  const p = `You are a friendly language tutor for a Duolingo-style app.
The user is learning ${langName(params.learningLang)}. Respond in ${langName(params.interfaceLang)}.
Exercise type: ${params.exerciseType}
Question/prompt: ${JSON.stringify(params.prompt)}
User's answer: ${JSON.stringify(params.userAnswer)}
Correct answer: ${JSON.stringify(params.correctAnswer)}

Explain briefly (2-3 sentences max) WHY the user's answer is wrong (or partially correct) and what the rule is.
Optionally include one short tip for remembering this.
Return ONLY a JSON object: {"explanation": "...", "tip": "..."}.
The tip field is optional, omit it if there is nothing useful to add.`
  const raw = await generate(p, { json: true })
  return parseJson<{ explanation: string; tip?: string }>(raw)
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function chatReply(params: {
  history: ChatMessage[]
  userMessage: string
  learningLang: Lang
  interfaceLang: Lang
  level?: 'beginner' | 'intermediate' | 'advanced'
}): Promise<{ reply: string; correction?: string }> {
  const level = params.level || 'beginner'
  const historyText = params.history
    .map((m) => `${m.role === 'user' ? 'User' : 'Tutor'}: ${m.content}`)
    .join('\n')
  const p = `You are a friendly ${langName(params.learningLang)} conversation tutor for a ${level} learner.
Reply in ${langName(params.learningLang)}, keeping vocabulary appropriate for the ${level} level (short sentences, common words).
If the user made a grammar or vocabulary mistake in their last message, mention the correction in the "correction" field in ${langName(params.interfaceLang)}.
Always continue the conversation by asking a short follow-up question.

Conversation so far:
${historyText || '(empty)'}

User's new message: ${JSON.stringify(params.userMessage)}

Return ONLY a JSON object: {"reply": "<reply in ${langName(params.learningLang)}>", "correction": "<correction in ${langName(params.interfaceLang)} or empty>"}.`
  const raw = await generate(p, { json: true })
  return parseJson<{ reply: string; correction?: string }>(raw)
}

export type ExerciseType =
  | 'MultipleChoice'
  | 'FillInBlank'
  | 'TranslateText'
  | 'ListenType'
  | 'SelectImage'
  | 'BuildSentence'

export interface GeneratedExercise {
  type: ExerciseType
  prompt: string
  options?: string[]
  correctAnswer: string | string[]
  hint?: string
  audioText?: string
}

export async function generateExercise(params: {
  type: ExerciseType
  word?: string
  topic?: string
  learningLang: Lang
  interfaceLang: Lang
  level?: 'beginner' | 'intermediate' | 'advanced'
}): Promise<GeneratedExercise> {
  const level = params.level || 'beginner'
  const targetWord = params.word ? `\nTarget word/phrase: ${JSON.stringify(params.word)}` : ''
  const topic = params.topic ? `\nTopic: ${JSON.stringify(params.topic)}` : ''

  const typeSpecific: Record<ExerciseType, string> = {
    MultipleChoice: `Create a multiple choice question. Provide:
- prompt: the question (in ${langName(params.interfaceLang)})
- options: array of 4 strings (in ${langName(params.learningLang)}), one correct
- correctAnswer: the correct option string (must match one of options exactly)`,
    FillInBlank: `Create a fill-in-the-blank sentence in ${langName(params.learningLang)}.
- prompt: the sentence with one blank marked as "___" (e.g. "I ___ apples")
- correctAnswer: the missing word
- options: array of 4 plausible words including the correct one (optional but recommended for beginners)`,
    TranslateText: `Create a translation exercise.
- prompt: a short sentence in ${langName(params.interfaceLang)} to translate
- correctAnswer: the translation in ${langName(params.learningLang)}`,
    ListenType: `Create a listening exercise. The user will hear a sentence in ${langName(params.learningLang)} and must type it.
- prompt: short instruction in ${langName(params.interfaceLang)} (e.g. "Type what you hear")
- audioText: the sentence in ${langName(params.learningLang)} to be spoken
- correctAnswer: the same sentence (the user must type it exactly)`,
    SelectImage: `Create a select-image exercise.
- prompt: a word or short phrase in ${langName(params.learningLang)} (e.g. "an apple")
- options: array of 4 image-describing nouns in ${langName(params.learningLang)} (one matches prompt)
- correctAnswer: the matching option`,
    BuildSentence: `Create a build-sentence exercise.
- prompt: short instruction in ${langName(params.interfaceLang)} (e.g. "Build the sentence")
- options: array of words in ${langName(params.learningLang)} in shuffled order (4-8 words; may include 1-2 distractors)
- correctAnswer: array of words in the CORRECT order`,
  }

  const p = `Generate a ${params.type} exercise for a ${level} learner of ${langName(params.learningLang)}.
Interface language (for instructions): ${langName(params.interfaceLang)}.${targetWord}${topic}

${typeSpecific[params.type]}

Keep vocabulary appropriate for the ${level} level.
Return ONLY a JSON object with the keys described above (omit unused fields).`
  const raw = await generate(p, { json: true })
  const parsed = parseJson<Omit<GeneratedExercise, 'type'>>(raw)
  return { type: params.type, ...parsed }
}
