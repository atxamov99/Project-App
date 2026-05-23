import { useState, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  question: { fontSize: 22, fontWeight: '800', color: c.text },
  selectedArea: {
    minHeight: 60, borderWidth: 2, borderRadius: 12, padding: 8,
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  areaNormal: { borderColor: c.border, backgroundColor: c.surface },
  areaCorrect: { borderColor: c.correctBorder, backgroundColor: c.correctBg },
  areaWrong: { borderColor: c.wrongBorder, backgroundColor: c.wrongBg },
  selectedWord: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff',
    borderWidth: 2, borderColor: c.selectedBorder, borderRadius: 8,
  },
  separator: { height: 1, backgroundColor: c.border },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  bankWord: {
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff',
    borderWidth: 2, borderColor: c.border, borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  wordText: { fontSize: 15, fontWeight: '600', color: c.text },
})

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function BuildSentence({ exercise, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const wordBank = exercise.wordBank ?? []
  const [selected, setSelected] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[]>(wordBank)

  useEffect(() => {
    setSelected([])
    setRemaining(exercise.wordBank ?? [])
  }, [exercise.id])

  const addWord = (word: string, idx: number) => {
    if (result !== null) return
    const next = [...selected, word]
    setSelected(next)
    setRemaining((r) => r.filter((_, i) => i !== idx))
    onAnswerChange(next.join(' '))
  }

  const removeWord = (word: string, idx: number) => {
    if (result !== null) return
    const next = selected.filter((_, i) => i !== idx)
    setSelected(next)
    setRemaining((r) => [...r, word])
    onAnswerChange(next.join(' '))
  }

  const areaStyle =
    result === 'correct' ? styles.areaCorrect :
    result === 'wrong'   ? styles.areaWrong   : styles.areaNormal

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Jumlani tuzing</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={[styles.selectedArea, areaStyle]}>
        {selected.map((word, i) => (
          <Animated.View key={`sel-${word}-${i}`} entering={ZoomIn.duration(150)} exiting={ZoomOut.duration(150)}>
            <TouchableOpacity onPress={() => removeWord(word, i)} style={styles.selectedWord}>
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.separator} />

      <View style={styles.wordBank}>
        {remaining.map((word, i) => (
          <TouchableOpacity
            key={`bank-${word}-${i}`}
            onPress={() => addWord(word, i)}
            style={styles.bankWord}
            activeOpacity={0.7}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
