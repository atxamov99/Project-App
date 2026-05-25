import { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Speech from 'expo-speech'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 16, alignItems: 'center' },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600', alignSelf: 'flex-start' },
  question: { fontSize: 18, color: c.textSecondary, alignSelf: 'flex-start' },
  card: {
    width: '100%', padding: 20, borderRadius: 16,
    backgroundColor: c.surface, alignItems: 'center',
  },
  target: { fontSize: 28, fontWeight: '800', color: c.text, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  btn: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 32,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  listenBtn: { backgroundColor: c.surface, borderWidth: 2, borderColor: c.border },
  confirmBtn: { backgroundColor: c.primary },
  confirmBtnDisabled: { opacity: 0.5 },
  btnIcon: { fontSize: 20 },
  btnText: { fontSize: 15, fontWeight: '700' },
  listenText: { color: c.text },
  confirmText: { color: c.onPrimary },
  hint: { fontSize: 12, color: c.textLight, textAlign: 'center', paddingHorizontal: 12 },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function SpeakCheck({ exercise, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const [confirmed, setConfirmed] = useState(false)

  const handleListen = () => {
    Speech.stop()
    Speech.speak(exercise.correctAnswer, { rate: 0.95 })
  }

  const handleConfirm = () => {
    if (result !== null) return
    setConfirmed(true)
    onAnswerChange(exercise.correctAnswer)
  }

  const borderColor =
    result === 'correct' ? c.correctBorder :
    result === 'wrong'   ? c.wrongBorder   : 'transparent'

  const disabled = result !== null || confirmed

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gapiring va tasdiqlang</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={[styles.card, { borderColor, borderWidth: result ? 2 : 0 }]}>
        <Text style={styles.target}>{exercise.correctAnswer}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.listenBtn]}
          onPress={handleListen}
          activeOpacity={0.8}
        >
          <Text style={styles.btnIcon}>🔊</Text>
          <Text style={[styles.btnText, styles.listenText]}>Eshitish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.confirmBtn, disabled && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.btnIcon}>🎤</Text>
          <Text style={[styles.btnText, styles.confirmText]}>
            {confirmed ? "Aytdim ✓" : 'Aytdim'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Yuqoridagi jumlani ovoz chiqarib o'qing, so'ng "Aytdim"ni bosing
      </Text>
    </View>
  )
}
