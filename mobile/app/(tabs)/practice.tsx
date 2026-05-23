import { useState, useMemo } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { api } from '@/lib/api'
import type { WordReview } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  counter: { textAlign: 'center', color: c.textSecondary, marginBottom: 24, fontSize: 14 },
  card: {
    backgroundColor: c.surface, borderRadius: 20, padding: 32,
    alignItems: 'center', borderWidth: 2, borderColor: c.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    elevation: 3, minHeight: 200, justifyContent: 'center',
  },
  wordText: { fontSize: 36, fontWeight: '800', color: c.text, textAlign: 'center' },
  pronunciation: { fontSize: 16, color: c.textLight, marginTop: 8 },
  revealBtn: {
    marginTop: 24, paddingHorizontal: 32, paddingVertical: 12,
    backgroundColor: c.primary, borderRadius: 12,
  },
  revealBtnText: { color: c.onPrimary, fontSize: 15, fontWeight: '700' },
  answerSection: { alignItems: 'center', width: '100%' },
  translation: {
    fontSize: 22, fontWeight: '700', color: c.primary,
    marginTop: 16, marginBottom: 24, textAlign: 'center',
  },
  answerBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  answerBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', borderWidth: 2,
  },
  wrongBtn: { borderColor: c.error, backgroundColor: c.errorLight },
  correctBtn: { borderColor: c.primary, backgroundColor: c.correctBg },
  answerBtnText: { fontSize: 14, fontWeight: '700', color: c.text },
  strengthRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 24,
  },
  strengthDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: c.border, borderWidth: 1, borderColor: c.borderMedium,
  },
  strengthDotFilled: { backgroundColor: c.primary, borderColor: c.primaryDark },
  done: { fontSize: 64 },
  doneTitle: { fontSize: 24, fontWeight: '800', color: c.text },
  doneText: { fontSize: 15, color: c.textSecondary },
  aiCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: c.surface, borderRadius: 16, padding: 14, marginBottom: 16,
    borderWidth: 2, borderColor: c.border,
  },
  aiCardEmoji: { fontSize: 32 },
  aiCardBody: { flex: 1 },
  aiCardTitle: { fontSize: 15, fontWeight: '800', color: c.text },
  aiCardSub: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
  aiCardArrow: { fontSize: 22, color: c.primary, fontWeight: '800' },
})

export default function PracticeScreen() {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const qc = useQueryClient()
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const { data: rawWords, isLoading } = useQuery({
    queryKey: ['words-review'],
    queryFn: () => api.get('/words/review').then((r) => r.data),
  })
  const words: WordReview[] = Array.isArray(rawWords) ? rawWords : []

  const { mutate: submitReview } = useMutation({
    mutationFn: ({ id, correct }: { id: string; correct: boolean }) =>
      api.post(`/words/${id}/reviewed`, { correct }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['words-review'] })
    },
  })

  const handleAnswer = (correct: boolean) => {
    if (!words[current]) return
    submitReview({ id: words[current].id, correct })
    setRevealed(false)
    setCurrent((i) => i + 1)
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    )
  }

  if (words.length === 0 || current >= words.length) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/ai' as any)}>
          <Text style={styles.aiCardEmoji}>✨</Text>
          <View style={styles.aiCardBody}>
            <Text style={styles.aiCardTitle}>AI yordamchi</Text>
            <Text style={styles.aiCardSub}>Tutor bilan suhbat va tarjimon</Text>
          </View>
          <Text style={styles.aiCardArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.done}>🎉</Text>
          <Text style={styles.doneTitle}>Barakalla!</Text>
          <Text style={styles.doneText}>Bugungi takrorlash tugatildi.</Text>
        </View>
      </View>
    )
  }

  const word = words[current]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/ai' as any)}>
        <Text style={styles.aiCardEmoji}>✨</Text>
        <View style={styles.aiCardBody}>
          <Text style={styles.aiCardTitle}>AI yordamchi</Text>
          <Text style={styles.aiCardSub}>Tutor bilan suhbat va tarjimon</Text>
        </View>
        <Text style={styles.aiCardArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.counter}>{current + 1} / {words.length}</Text>

      <View style={styles.card}>
        <Text style={styles.wordText}>{word.text}</Text>
        {word.pronunciation && (
          <Text style={styles.pronunciation}>[{word.pronunciation}]</Text>
        )}

        {!revealed ? (
          <TouchableOpacity style={styles.revealBtn} onPress={() => setRevealed(true)}>
            <Text style={styles.revealBtnText}>Ko'rsatish</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.answerSection}>
            <Text style={styles.translation}>{word.translation}</Text>
            <View style={styles.answerBtns}>
              <TouchableOpacity
                style={[styles.answerBtn, styles.wrongBtn]}
                onPress={() => handleAnswer(false)}
              >
                <Text style={styles.answerBtnText}>Bilmadim 😞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.answerBtn, styles.correctBtn]}
                onPress={() => handleAnswer(true)}
              >
                <Text style={styles.answerBtnText}>Bildim! 🎉</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.strengthRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[styles.strengthDot, i <= word.strength && styles.strengthDotFilled]}
          />
        ))}
      </View>
    </View>
  )
}
