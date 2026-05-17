import { useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { X } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { LivesBar } from './LivesBar'

interface Props {
  value: number
  lives: number
  onClose: () => void
}

export function ProgressBar({ value, lives, onClose }: Props) {
  const progress = useSharedValue(value)

  useEffect(() => {
    progress.value = withTiming(value, { duration: 300 })
  }, [value])

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
        <X size={22} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>

      <LivesBar lives={lives} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  closeBtn: { padding: 4 },
  track: {
    flex: 1, height: 16, backgroundColor: Colors.border,
    borderRadius: 8, overflow: 'hidden',
  },
  fill: {
    height: '100%', backgroundColor: Colors.primary,
    borderRadius: 8,
  },
})
