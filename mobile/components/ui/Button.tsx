import { useMemo } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, type ViewStyle, type TextStyle } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  label: string
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  style?: ViewStyle
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  fullWidth, loading, disabled, icon, iconRight, style,
}: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const variantStyles = stylesByVariant(c, variant)
  const sizeStyles = stylesBySize(size)

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.label.color as string} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.labelBase, variantStyles.label, sizeStyles.label]}>
            {label}
          </Text>
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  )
}

const createStyles = (_c: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 999, gap: 8,
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelBase: { fontWeight: '700', letterSpacing: 0.2 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },
})

function stylesByVariant(c: ThemeColors, v: ButtonVariant): { container: ViewStyle; label: TextStyle } {
  switch (v) {
    case 'primary':
      return {
        container: { backgroundColor: c.primary },
        label: { color: c.mode === 'dark' ? c.text : '#FFFFFF' },
      }
    case 'secondary':
      return {
        container: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
        label: { color: c.text },
      }
    case 'inverted':
      return {
        container: { backgroundColor: c.text },
        label: { color: c.background },
      }
    case 'outlined':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: c.primary },
        label: { color: c.primary },
      }
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        label: { color: c.textSecondary },
      }
  }
}

function stylesBySize(s: ButtonSize): { container: ViewStyle; label: TextStyle } {
  switch (s) {
    case 'sm':
      return { container: { paddingVertical: 8,  paddingHorizontal: 16 }, label: { fontSize: 13 } }
    case 'md':
      return { container: { paddingVertical: 12, paddingHorizontal: 22 }, label: { fontSize: 15 } }
    case 'lg':
      return { container: { paddingVertical: 16, paddingHorizontal: 28 }, label: { fontSize: 17 } }
  }
}
