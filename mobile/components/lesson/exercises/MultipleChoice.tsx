import { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'
import { shuffle } from '@/utils/shuffle'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 16 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  question: { fontSize: 24, fontWeight: '800', color: c.text, lineHeight: 32 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
  },
  optionSelected: { borderColor: c.selectedBorder, backgroundColor: c.selectedBg },
  optionCorrect: { borderColor: c.correctBorder, backgroundColor: c.correctBg },
  optionWrong: { borderColor: c.wrongBorder, backgroundColor: c.wrongBg },
  optionLetter: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: c.border,
    alignItems: 'center', justifyContent: 'center',
  },
  letterText: { fontSize: 13, fontWeight: '800', color: c.textSecondary },
  optionText: { fontSize: 16, fontWeight: '600', color: c.text, flex: 1 },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function MultipleChoice({ exercise, answer, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.wrongAnswers]),
    [exercise.id],
  )

  const getStyle = (opt: string) => {
    if (answer !== opt) return styles.option
    if (result === 'correct') return [styles.option, styles.optionCorrect]
    if (result === 'wrong') return [styles.option, styles.optionWrong]
    return [styles.option, styles.optionSelected]
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>To'g'ri variantni tanlang</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.options}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={opt}
            style={getStyle(opt)}
            onPress={() => result === null && onAnswerChange(opt)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.letterText}>{String.fromCharCode(65 + i)}</Text>
            </View>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
