import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { User, LanguageCode } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  interfaceLanguage: LanguageCode | null
  targetLanguage: LanguageCode | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  setLanguages: (interfaceLang: LanguageCode, targetLang: LanguageCode) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      interfaceLanguage: null,
      targetLanguage: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLanguages: (interfaceLanguage, targetLanguage) =>
        set({ interfaceLanguage, targetLanguage }),
      logout: () =>
        set({ token: null, user: null, interfaceLanguage: null, targetLanguage: null }),
    }),
    {
      name: 'lingvauz-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
