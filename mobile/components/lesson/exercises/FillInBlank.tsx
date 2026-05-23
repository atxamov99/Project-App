import { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'
import { shuffle } from '@/utils/shuffle'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 20 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  sentenceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  sentencePart: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  sentenceText: { fontSize: 22, fontWeight: '700', color: c.text },
  blank: {
    minWidth: 80, paddingHorizontal: 12, paddingVertical: 4,
    borderBottomWidth: 2, borderBottomColor: c.textSecondary,
  },
  blankFilled: { borderBottomColor: c.primary },
  blankText: { fontSize: 20, fontWeight: '700', color: c.primary, textAlign: 'center' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  option: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
  },
  optionSelected: { borderColor: c.selectedBorder, backgroundColor: c.selectedBg },
  optionCorrect: { borderColor: c.correctBorder, backgroundColor: c.correctBg },
  optionWrong: { borderColor: c.wrongBorder, backgroundColor: c.wrongBg },
  optionText: { fontSize: 16, fontWeight: '600', color: c.text },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function FillInBlank({ exercise, answer, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.wrongAnswers]),
    [exercise.id],
  )
  const parts = useMemo(() => exercise.question.split('___'), [exercise.id])

  const getOptionStyle = (opt: string) => {
    if (answer !== opt) return styles.option
    if (result === 'correct') return [styles.option, styles.optionCorrect]
    if (result === 'wrong') return [styles.option, styles.optionWrong]
    return [styles.option, styles.optionSelected]
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bo'shliqni to'ldiring</Text>

      <View style={styles.sentenceRow}>
        {parts.map((part, i) => (
          <View key={i} style={styles.sentencePart}>
            <Text style={styles.sentenceText}>{part.trim()}</Text>
            {i < parts.length - 1 && (
              <View style={[styles.blank, answer && styles.blankFilled]}>
                <Text style={styles.blankText}>{answer || '____'}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={getOptionStyle(opt)}
            onPress={() => result === null && onAnswerChange(opt)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
