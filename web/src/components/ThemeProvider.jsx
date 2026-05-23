import { useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import { applyTheme } from '../lib/themes'

export default function ThemeProvider({ children }) {
  const themeId = useAppSelector((s) => s.theme.themeId)
  const mode = useAppSelector((s) => s.theme.mode)

  useEffect(() => {
    applyTheme(themeId, mode)
  }, [themeId, mode])

  return children
}
