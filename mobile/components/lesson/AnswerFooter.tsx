import { useMemo, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { AnswerResult } from '@/types'
import { aiApi, type Lang } from '@/lib/ai'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  footer: {
    paddingHorizontal: 16, paddingVertical: 20,
    paddingBottom: 32, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  correct: { backgroundColor: c.correctBg, borderTopWidth: 2, borderTopColor: c.correct },
  wrong: { backgroundColor: c.wrongBg, borderTopWidth: 2, borderTopColor: c.wrong },
  msgRow: { flex: 1 },
  resultTitle: { fontSize: 18, fontWeight: '800', color: c.text, marginBottom: 2 },
  resultSub: { fontSize: 14, color: c.textSecondary },
  bold: { fontWeight: '700', color: c.text },
  explanation: { fontSize: 13, color: c.textSecondary, marginTop: 4, fontStyle: 'italic' },
  btn: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', minWidth: 120,
  },
  btnCheck: { flex: 1, backgroundColor: c.primary },
  btnCorrect: { backgroundColor: c.primary },
  btnWrong: { backgroundColor: c.error },
  btnDisabled: { backgroundColor: c.border },
  btnText: { color: c.onPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  aiLink: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 6, alignSelf: 'flex-start',
  },
  aiLinkText: { color: c.text, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  aiBox: {
    backgroundColor: c.surface, borderRadius: 10, padding: 10, marginTop: 8,
    borderWidth: 1, borderColor: c.border,
  },
  aiTitle: { fontSize: 11, fontWeight: '800', color: c.textSecondary, letterSpacing: 1, marginBottom: 4 },
  aiText: { fontSize: 13, color: c.text, lineHeight: 18 },
  aiTip: { fontSize: 12, color: c.textSecondary, fontStyle: 'italic', marginTop: 6 },
})

interface Props {
  answer: string
  result: AnswerResult
  correctAnswer?: string
  explanation?: string
  onCheck: () => void
  onNext: () => void
  exerciseType?: string
  exercisePrompt?: string
  learningLang?: Lang
  interfaceLang?: Lang
}

export function AnswerFooter({
  answer, result, correctAnswer, explanation, onCheck, onNext,
  exerciseType, exercisePrompt, learningLang, interfaceLang,
}: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const [aiExplain, setAiExplain] = useState<{ explanation: string; tip?: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => { setAiExplain(null); setAiError(''); setAiLoading(false) }, [exercisePrompt])

  async function fetchExplain() {
    if (aiLoading || aiExplain || !exerciseType || !exercisePrompt || !learningLang || !interfaceLang) return
    setAiLoading(true); setAiError('')
    try {
      const resp = await aiApi.explain({
        exerciseType,
        prompt: exercisePrompt,
        userAnswer: answer || '',
        correctAnswer: correctAnswer || '',
        learningLang,
        interfaceLang,
      })
      setAiExplain(resp)
    } catch (e: any) {
      setAiError(e?.response?.data?.error || e?.message || 'AI xatolik')
    } finally {
      setAiLoading(false)
    }
  }

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
    const canExplain = !!(exerciseType && exercisePrompt && learningLang && interfaceLang)
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
          {canExplain && !aiExplain && (
            <TouchableOpacity style={styles.aiLink} onPress={fetchExplain} disabled={aiLoading}>
              {aiLoading ? <ActivityIndicator size="small" color={c.text} /> : null}
              <Text style={styles.aiLinkText}>{aiLoading ? "AI o'ylamoqda..." : '✨ AI tushuntirsin'}</Text>
            </TouchableOpacity>
          )}
          {aiError ? <Text style={styles.explanation}>{aiError}</Text> : null}
          {aiExplain && (
            <View style={styles.aiBox}>
              <Text style={styles.aiTitle}>✨ AI TUSHUNTIRADI</Text>
              <Text style={styles.aiText}>{aiExplain.explanation}</Text>
              {aiExplain.tip ? <Text style={styles.aiTip}>💡 {aiExplain.tip}</Text> : null}
            </View>
          )}
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
        <Text style={[styles.btnText, !answer && { color: c.textSecondary }]}>TEKSHIR</Text>
      </TouchableOpacity>
    </View>
  )
}
