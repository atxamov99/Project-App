import { useMemo } from 'react'
import { View, StyleSheet, type ViewProps, type ViewStyle } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

interface Props extends ViewProps {
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary' | 'outlined'
  padding?: number | 'sm' | 'md' | 'lg'
  radius?: number
}

const PAD_MAP = { sm: 12, md: 16, lg: 24 } as const

export function Card({ variant = 'surface', padding = 'md', radius = 20, style, children, ...rest }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const pad = typeof padding === 'number' ? padding : PAD_MAP[padding]

  return (
    <View
      {...rest}
      style={[
        styles.base,
        bgByVariant(c, variant),
        { padding: pad, borderRadius: radius },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const createStyles = (_c: ThemeColors) => StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
})

function bgByVariant(c: ThemeColors, v: NonNullable<Props['variant']>): ViewStyle {
  switch (v) {
    case 'surface':
      return {
        backgroundColor: c.surface,
        borderWidth: 1, borderColor: c.border,
      }
    case 'primary':
      return { backgroundColor: c.primary }
    case 'secondary':
      return { backgroundColor: c.secondary }
    case 'tertiary':
      return { backgroundColor: c.tertiary }
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 2, borderColor: c.border,
      }
  }
}
