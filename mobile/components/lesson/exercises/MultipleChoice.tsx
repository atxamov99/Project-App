import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function MultipleChoice({ exercise, answer, onAnswerChange, result }: Props) {
  const options = [exercise.correctAnswer, ...exercise.wrongAnswers].sort(
    () => Math.random() - 0.5
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
            key={i}
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

const styles = StyleSheet.create({
  container: { gap: 16 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  question: { fontSize: 24, fontWeight: '800', color: Colors.text, lineHeight: 32 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
  },
  optionSelected: { borderColor: Colors.selectedBorder, backgroundColor: Colors.selectedBg },
  optionCorrect: { borderColor: Colors.correctBorder, backgroundColor: Colors.correctBg },
  optionWrong: { borderColor: Colors.wrongBorder, backgroundColor: Colors.wrongBg },
  optionLetter: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  letterText: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  optionText: { fontSize: 16, fontWeight: '600', color: Colors.text, flex: 1 },
})
