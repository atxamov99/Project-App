import { useEffect, useMemo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { X } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { LivesBar } from './LivesBar'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  closeBtn: { padding: 4 },
  track: {
    flex: 1, height: 16, backgroundColor: c.border,
    borderRadius: 8, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: c.primary, borderRadius: 8 },
})

interface Props {
  value: number
  lives: number
  onClose: () => void
}

export function ProgressBar({ value, lives, onClose }: Props) {
  const progress = useSharedValue(value)
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  useEffect(() => {
    progress.value = withTiming(value, { duration: 300 })
  }, [value])

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
        <X size={22} color={c.textSecondary} />
      </TouchableOpacity>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>

      <LivesBar lives={lives} />
    </View>
  )
}
