import { api } from './api'

export type Lang = 'en' | 'ru' | 'uz'
export type Level = 'beginner' | 'intermediate' | 'advanced'

const AI_TIMEOUT = 30_000

export type TranslateInput = { text: string; from: Lang; to: Lang }
export type TranslateOutput = { translation: string }

export type ExplainInput = {
  exerciseType: string
  prompt: string
  userAnswer: string
  correctAnswer: string
  learningLang: Lang
  interfaceLang: Lang
}
export type ExplainOutput = { explanation: string; tip?: string }

export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type ChatInput = {
  userMessage: string
  history: ChatMessage[]
  learningLang: Lang
  interfaceLang: Lang
  level?: Level
}
export type ChatOutput = { reply: string; correction?: string }

export type ExerciseType =
  | 'MultipleChoice'
  | 'FillInBlank'
  | 'TranslateText'
  | 'ListenType'
  | 'SelectImage'
  | 'BuildSentence'

export type GenerateExerciseInput = {
  type: ExerciseType
  word?: string
  topic?: string
  learningLang: Lang
  interfaceLang: Lang
  level?: Level
}
export type GeneratedExercise = {
  type: ExerciseType
  prompt: string
  options?: string[]
  correctAnswer: string | string[]
  hint?: string
  audioText?: string
}

export const aiApi = {
  translate: (body: TranslateInput) =>
    api.post<TranslateOutput>('/ai/translate', body, { timeout: AI_TIMEOUT }).then((r) => r.data),

  explain: (body: ExplainInput) =>
    api.post<ExplainOutput>('/ai/explain', body, { timeout: AI_TIMEOUT }).then((r) => r.data),

  chat: (body: ChatInput) =>
    api.post<ChatOutput>('/ai/chat', body, { timeout: AI_TIMEOUT }).then((r) => r.data),

  generateExercise: (body: GenerateExerciseInput) =>
    api.post<GeneratedExercise>('/ai/generate-exercise', body, { timeout: AI_TIMEOUT }).then((r) => r.data),
}
