import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { THEMES, type ThemeId, type ThemeMode, type ThemeColors } from '@/constants/themes'

interface ThemeState {
  themeId: ThemeId
  mode: ThemeMode
  setTheme: (id: ThemeId) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'terracotta',
      mode: 'light',
      setTheme: (themeId) => set({ themeId }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'lingvauz-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export function buildColors(themeId: ThemeId, mode: ThemeMode): ThemeColors {
  const theme = THEMES[themeId] ?? THEMES.terracotta
  const safeMode: ThemeMode = mode === 'dark' ? 'dark' : 'light'
  const modeColors = theme[safeMode] ?? theme.light
  // Dark-mode primaries are bright/vibrant (Cyber #00E5FF, Emerald #2ECC71) → dark text
  // Light-mode primaries are deeper/muted (Terracotta #7D4E3A) → white text
  const onAccent = safeMode === 'dark' ? '#111827' : '#FFFFFF'
  return {
    ...modeColors,
    id: theme.id,
    label: theme.label,
    emoji: theme.emoji,
    mode,
    onPrimary: onAccent,
    onSecondary: onAccent,
    onTertiary: onAccent,
  }
}

export const getThemeColors = (): ThemeColors => {
  const { themeId, mode } = useThemeStore.getState()
  return buildColors(themeId, mode)
}
