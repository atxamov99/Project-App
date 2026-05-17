import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function TranslateText({ exercise, answer, onAnswerChange, result }: Props) {
  const borderColor =
    result === 'correct' ? Colors.correctBorder :
    result === 'wrong'   ? Colors.wrongBorder   : Colors.border

  const bgColor =
    result === 'correct' ? Colors.correctBg :
    result === 'wrong'   ? Colors.wrongBg   : Colors.surface

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tarjima qiling</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <TextInput
        style={[styles.input, { borderColor, backgroundColor: bgColor }]}
        placeholder="Tarjimangizni yozing..."
        placeholderTextColor={Colors.textLight}
        value={answer}
        onChangeText={onAnswerChange}
        multiline
        editable={result === null}
        autoCapitalize="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  question: { fontSize: 26, fontWeight: '800', color: Colors.text, lineHeight: 34 },
  input: {
    minHeight: 80, borderWidth: 2, borderRadius: 12,
    padding: 14, fontSize: 17, color: Colors.text,
    textAlignVertical: 'top',
  },
})
