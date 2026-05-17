import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { Colors } from '@/constants/colors'

type Mood = 'happy' | 'sad' | 'celebrate' | 'idle'

interface Props {
  mood?: Mood
  size?: number
}

const MOODS: Record<Mood, string> = {
  happy: '🍉😊',
  sad: '🍉😢',
  celebrate: '🍉🎉',
  idle: '🍉',
}

export function Mascot({ mood = 'idle', size = 80 }: Props) {
  const rotation = useSharedValue(0)
  const translateY = useSharedValue(0)

  useEffect(() => {
    if (mood === 'celebrate') {
      rotation.value = withRepeat(
        withSequence(withSpring(-10), withSpring(10)), 3, true
      )
    } else if (mood === 'idle') {
      translateY.value = withRepeat(
        withSequence(withSpring(-6), withSpring(0)), -1, true
      )
    }
  }, [mood])

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateY: translateY.value },
    ],
  }))

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={[styles.emoji, { fontSize: size }]}>{MOODS[mood]}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  emoji: { textAlign: 'center' },
})
