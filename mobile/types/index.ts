export type ExerciseType =
  | 'TRANSLATE_TEXT'
  | 'BUILD_SENTENCE'
  | 'LISTEN_AND_TYPE'
  | 'SPEAK_AND_CHECK'
  | 'MATCH_PAIRS'
  | 'SELECT_IMAGE'
  | 'FILL_IN_BLANK'
  | 'MULTIPLE_CHOICE'

export type AnswerResult = 'correct' | 'wrong' | null

export type LessonStatus = 'locked' | 'available' | 'completed' | 'current'
export type LessonType = 'REGULAR' | 'CHECKPOINT' | 'PRACTICE' | 'STORY'

export interface Exercise {
  id: string
  type: ExerciseType
  question: string
  questionAudio?: string
  questionImage?: string
  correctAnswer: string
  wrongAnswers: string[]
  explanation?: string
  wordBank?: string[]
}

export interface LessonNode {
  id: string
  order: number
  type: LessonType
  status: LessonStatus
}

export interface Unit {
  id: string
  courseId: string
  order: number
  title: string
  description?: string
  color: string
  icon: string
  lessons: LessonNode[]
}

export interface Course {
  id: string
  fromLanguage: { code: string; name: string; flag: string }
  toLanguage: { code: string; name: string; flag: string }
  units: Unit[]
}

export type LanguageCode = 'uz' | 'en' | 'ru'

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  gems: number
  totalXP: number
  streak: number
  longestStreak: number
  streakFreezes: number
  isPremium: boolean
  interfaceLanguage?: LanguageCode | null
  targetLanguage?: LanguageCode | null
}

export interface LivesState {
  current: number
  max: number
  refillAt?: string
}

export interface LeagueEntry {
  userId: string
  username: string
  displayName: string
  avatar?: string
  weeklyXP: number
  rank: number
}

export interface LeagueData {
  name: string
  color: string
  icon: string
  weeklyXP: number
  rank: number
  entries: LeagueEntry[]
}

export interface CheckAnswerResponse {
  isCorrect: boolean
  correctAnswer?: string
  explanation?: string
}

export interface CompleteLessonResponse {
  xpEarned: number
  streak: number
  newAchievements?: { title: string; icon: string }[]
}

export interface PublicProfile {
  id: string
  username: string
  displayName: string
  avatar?: string
  totalXP: number
  streak: number
  longestStreak: number
  isPremium: boolean
  createdAt: string
  isSelf: boolean
  isFollowing: boolean
  followsYou: boolean
  counts: {
    lessonResults: number
    achievements: number
    following: number
    followers: number
  }
  leagueEntry?: {
    weeklyXP: number
    league: { name: string; color: string; icon: string }
  } | null
}

export interface WordReview {
  id: string
  text: string
  translation: string
  pronunciation?: string
  audioUrl?: string
  nextReviewAt: string
  strength: number
}
