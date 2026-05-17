import { User } from '@/types'

describe('User type', () => {
  it('should include interfaceLanguage and targetLanguage fields', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      // These should exist after our changes
      interfaceLanguage: 'uz',
      targetLanguage: 'en',
      gems: 0,
      totalXP: 0,
      streak: 0,
      longestStreak: 0,
      streakFreezes: 0,
      isPremium: false,
    }

    expect(user.interfaceLanguage).toBeDefined()
    expect(user.targetLanguage).toBeDefined()
  })
})