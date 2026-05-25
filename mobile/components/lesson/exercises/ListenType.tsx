import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { playAudio } from '@/utils/audio'
import type { Exercise, AnswerResult } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 16, alignItems: 'center' },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600', alignSelf: 'flex-start' },
  playBtn: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: c.info, alignItems: 'center', justifyContent: 'center',
    shadowColor: c.info, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
    gap: 4,
  },
  playIcon: { fontSize: 32 },
  playText: { color: c.onPrimary, fontSize: 12, fontWeight: '700' },
  input: {
    width: '100%', minHeight: 52, borderWidth: 2, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 17, color: c.text,
  },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function ListenType({ exercise, answer, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const [playing, setPlaying] = useState(false)

  const handlePlay = async () => {
    if (!exercise.questionAudio || playing) return
    setPlaying(true)
    await playAudio(exercise.questionAudio)
    setPlaying(false)
  }

  const borderColor =
    result === 'correct' ? c.correctBorder :
    result === 'wrong'   ? c.wrongBorder   : c.border

  const bgColor =
    result === 'correct' ? c.correctBg :
    result === 'wrong'   ? c.wrongBg   : c.surface

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Eshiting va yozing</Text>

      <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.8}>
        {playing
          ? <ActivityIndicator color={c.onPrimary} />
          : <Text style={styles.playIcon}>🔊</Text>
        }
        <Text style={styles.playText}>Tinglash</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { borderColor, backgroundColor: bgColor }]}
        placeholder="Eshitganingizni yozing..."
        placeholderTextColor={c.textLight}
        value={answer}
        onChangeText={onAnswerChange}
        editable={result === null}
        autoCapitalize="none"
      />
    </View>
  )
}
