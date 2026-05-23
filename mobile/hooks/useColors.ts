import { useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { buildColors } from '@/store/themeStore'

export const useColors = () => {
  const themeId = useThemeStore((s) => s.themeId)
  const mode = useThemeStore((s) => s.mode)
  return useMemo(() => buildColors(themeId, mode), [themeId, mode])
}
