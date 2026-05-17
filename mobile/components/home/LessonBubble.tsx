import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Lock, Star, CheckCircle, Trophy } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import type { LessonNode } from '@/types'

interface Props {
  lesson: LessonNode
  unitColor: string
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export function LessonBubble({ lesson, unitColor }: Props) {
  const router = useRouter()
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const canTap = lesson.status !== 'locked'

  const handlePress = () => {
    if (!canTap) return
    scale.value = withSpring(0.9, {}, () => { scale.value = withSpring(1) })
    router.push(`/lesson/${lesson.id}`)
  }

  const Icon = () => {
    if (lesson.type === 'CHECKPOINT') return <Trophy size={28} color="#fff" />
    switch (lesson.status) {
      case 'completed': return <CheckCircle size={28} color="#fff" />
      case 'locked': return <Lock size={24} color={Colors.textLight} />
      default: return <Star size={28} color="#fff" />
    }
  }

  const bubbleStyle = [
    styles.bubble,
    lesson.status === 'locked' && styles.bubbleLocked,
    lesson.status === 'current' && styles.bubbleCurrent,
    lesson.status === 'completed' && { backgroundColor: unitColor },
    lesson.status === 'available' && { backgroundColor: unitColor },
    lesson.type === 'CHECKPOINT' && styles.bubbleCheckpoint,
  ]

  return (
    <AnimatedTouchable
      style={[bubbleStyle, animStyle]}
      onPress={handlePress}
      disabled={!canTap}
      activeOpacity={0.9}
    >
      <Icon />
      {lesson.status === 'current' && <View style={styles.currentDot} />}
    </AnimatedTouchable>
  )
}

const styles = StyleSheet.create({
  bubble: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6,
    elevation: 4,
  },
  bubbleLocked: {
    backgroundColor: Colors.surfaceAlt,
    shadowOpacity: 0,
    elevation: 0,
  },
  bubbleCurrent: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
  },
  bubbleCheckpoint: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: '#FFD700',
  },
  currentDot: {
    position: 'absolute', bottom: -4, width: 8, height: 8,
    borderRadius: 4, backgroundColor: Colors.primary,
  },
})
