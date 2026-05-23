import { createSlice } from '@reduxjs/toolkit'
import { THEMES } from '../../lib/themes'

const STORAGE_KEY = 'lingvauz-theme'
const DEFAULT_THEME = 'terracotta'
const DEFAULT_MODE = 'light'

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const themeId = THEMES[parsed.themeId] ? parsed.themeId : DEFAULT_THEME
    const mode = parsed.mode === 'dark' ? 'dark' : 'light'
    return { themeId, mode }
  } catch {
    return null
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ themeId: state.themeId, mode: state.mode }),
    )
  } catch { /* quota / private mode */ }
}

const persisted = readPersisted()

const initialState = {
  themeId: persisted?.themeId ?? DEFAULT_THEME,
  mode: persisted?.mode ?? DEFAULT_MODE,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      if (THEMES[action.payload]) {
        state.themeId = action.payload
        persist(state)
      }
    },
    setMode: (state, action) => {
      const next = action.payload === 'dark' ? 'dark' : 'light'
      state.mode = next
      persist(state)
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      persist(state)
    },
  },
})

export const { setTheme, setMode, toggleMode } = themeSlice.actions
export default themeSlice.reducer
