import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function FillInBlank({ exercise, answer, onAnswerChange, result }: Props) {
  const options = [exercise.correctAnswer, ...exercise.wrongAnswers].sort(
    () => Math.random() - 0.5
  )

  const parts = exercise.question.split('___')

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
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
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

const styles = StyleSheet.create({
  container: { gap: 20 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  sentenceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  sentencePart: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  sentenceText: { fontSize: 22, fontWeight: '700', color: Colors.text },
  blank: {
    minWidth: 80, paddingHorizontal: 12, paddingVertical: 4,
    borderBottomWidth: 2, borderBottomColor: Colors.textSecondary,
  },
  blankFilled: { borderBottomColor: Colors.primary },
  blankText: { fontSize: 20, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  option: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
  },
  optionSelected: { borderColor: Colors.selectedBorder, backgroundColor: Colors.selectedBg },
  optionCorrect: { borderColor: Colors.correctBorder, backgroundColor: Colors.correctBg },
  optionWrong: { borderColor: Colors.wrongBorder, backgroundColor: Colors.wrongBg },
  optionText: { fontSize: 16, fontWeight: '600', color: Colors.text },
})
