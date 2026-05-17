import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function SelectImage({ exercise, answer, onAnswerChange, result }: Props) {
  const options = [exercise.correctAnswer, ...exercise.wrongAnswers].sort(
    () => Math.random() - 0.5
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
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
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

const styles = StyleSheet.create({
  container: { gap: 16 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  question: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  option: {
    width: '46%', aspectRatio: 1, borderRadius: 16,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  optionSelected: { borderColor: Colors.selectedBorder, backgroundColor: Colors.selectedBg },
  optionCorrect: { borderColor: Colors.correctBorder, backgroundColor: Colors.correctBg },
  optionWrong: { borderColor: Colors.wrongBorder, backgroundColor: Colors.wrongBg },
  optionEmoji: { fontSize: 40 },
  optionText: { fontSize: 14, fontWeight: '700', color: Colors.text, textAlign: 'center' },
})
