import { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'
import { shuffle } from '@/utils/shuffle'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 16 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  question: { fontSize: 28, fontWeight: '800', color: c.text, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  option: {
    width: '46%', aspectRatio: 1, borderRadius: 16,
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  optionSelected: { borderColor: c.selectedBorder, backgroundColor: c.selectedBg },
  optionCorrect: { borderColor: c.correctBorder, backgroundColor: c.correctBg },
  optionWrong: { borderColor: c.wrongBorder, backgroundColor: c.wrongBg },
  optionEmoji: { fontSize: 40 },
  optionText: { fontSize: 14, fontWeight: '700', color: c.text, textAlign: 'center' },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function SelectImage({ exercise, answer, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.wrongAnswers]),
    [exercise.id],
  )

  const getStyle = (option: string) => {
    if (answer !== option) return styles.option
    if (result === 'correct') return [styles.option, styles.optionCorrect]
    if (result === 'wrong') return [styles.option, styles.optionWrong]
    return [styles.option, styles.optionSelected]
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rasmni tanlang</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.grid}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={getStyle(opt)}
            onPress={() => result === null && onAnswerChange(opt)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionEmoji}>🖼️</Text>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
