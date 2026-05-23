import { Platform } from 'react-native'
import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import type { User, LanguageCode } from '@/types'

// SecureStore is only available on native iOS/Android. On web it's a no-op,
// so fall back to AsyncStorage there.
const secureStorage: StateStorage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') return AsyncStorage.getItem(key)
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value)
      return
    }
    await SecureStore.setItemAsync(key, value)
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key)
      return
    }
    await SecureStore.deleteItemAsync(key)
  },
}

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
      storage: createJSONStorage(() => secureStorage),
    }
  )
)
