import { useMemo } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  question: { fontSize: 26, fontWeight: '800', color: c.text, lineHeight: 34 },
  input: {
    minHeight: 80, borderWidth: 2, borderRadius: 12,
    padding: 14, fontSize: 17, color: c.text,
    textAlignVertical: 'top',
  },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function TranslateText({ exercise, answer, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const borderColor =
    result === 'correct' ? c.correctBorder :
    result === 'wrong'   ? c.wrongBorder   : c.border

  const bgColor =
    result === 'correct' ? c.correctBg :
    result === 'wrong'   ? c.wrongBg   : c.surface

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tarjima qiling</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <TextInput
        style={[styles.input, { borderColor, backgroundColor: bgColor }]}
        placeholder="Tarjimangizni yozing..."
        placeholderTextColor={c.textLight}
        value={answer}
        onChangeText={onAnswerChange}
        multiline
        editable={result === null}
        autoCapitalize="none"
      />
    </View>
  )
}
