import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { Colors } from '@/constants/colors'
import type { AnswerResult } from '@/types'

interface Props {
  answer: string
  result: AnswerResult
  correctAnswer?: string
  explanation?: string
  onCheck: () => void
  onNext: () => void
}

export function AnswerFooter({ answer, result, correctAnswer, explanation, onCheck, onNext }: Props) {
  if (result === 'correct') {
    return (
      <Animated.View entering={SlideInDown.duration(250)} style={[styles.footer, styles.correct]}>
        <View style={styles.msgRow}>
          <Text style={styles.resultTitle}>Ajoyib! 🎉</Text>
          <Text style={styles.resultSub}>To'g'ri javob!</Text>
        </View>
        <TouchableOpacity style={[styles.btn, styles.btnCorrect]} onPress={onNext}>
          <Text style={styles.btnText}>DAVOM</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  if (result === 'wrong') {
    return (
      <Animated.View entering={SlideInDown.duration(250)} style={[styles.footer, styles.wrong]}>
        <View style={styles.msgRow}>
          <Text style={styles.resultTitle}>Noto'g'ri 😢</Text>
          {correctAnswer && (
            <Text style={styles.resultSub}>
              To'g'ri javob: <Text style={styles.bold}>{correctAnswer}</Text>
            </Text>
          )}
          {explanation && <Text style={styles.explanation}>{explanation}</Text>}
        </View>
        <TouchableOpacity style={[styles.btn, styles.btnWrong]} onPress={onNext}>
          <Text style={styles.btnText}>DAVOM</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.btn, styles.btnCheck, !answer && styles.btnDisabled]}
        onPress={onCheck}
        disabled={!answer}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>TEKSHIR</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16, paddingVertical: 20,
    paddingBottom: 32, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  correct: { backgroundColor: Colors.correctBg, borderTopWidth: 2, borderTopColor: Colors.correct },
  wrong: { backgroundColor: Colors.wrongBg, borderTopWidth: 2, borderTopColor: Colors.wrong },
  msgRow: { flex: 1 },
  resultTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  resultSub: { fontSize: 14, color: Colors.textSecondary },
  bold: { fontWeight: '700', color: Colors.text },
  explanation: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  btn: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', minWidth: 120,
  },
  btnCheck: { flex: 1, backgroundColor: Colors.primary },
  btnCorrect: { backgroundColor: Colors.primary },
  btnWrong: { backgroundColor: Colors.error },
  btnDisabled: { backgroundColor: Colors.border },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
})
