import { useMemo } from 'react'
import { TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  children: React.ReactNode
  onPress?: () => void
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
  style?: ViewStyle
}

const SIZE_MAP: Record<IconButtonSize, number> = { sm: 36, md: 44, lg: 56 }

export function IconButton({
  children, onPress, variant = 'primary', size = 'md', disabled, style,
}: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const dim = SIZE_MAP[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        bgByVariant(c, variant),
        { width: dim, height: dim, borderRadius: dim / 2 },
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  )
}

const createStyles = (_c: ThemeColors) => StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
})

function bgByVariant(c: ThemeColors, v: IconButtonVariant): ViewStyle {
  switch (v) {
    case 'primary':   return { backgroundColor: c.primary }
    case 'secondary': return { backgroundColor: c.secondary }
    case 'tertiary':  return { backgroundColor: c.tertiary }
    case 'error':     return { backgroundColor: c.error }
    case 'ghost':     return { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }
  }
}
