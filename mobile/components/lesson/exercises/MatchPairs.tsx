import { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Exercise, AnswerResult } from '@/types'
import { shuffle } from '@/utils/shuffle'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 14, color: c.textSecondary, fontWeight: '600' },
  grid: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 10 },
  chip: {
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
    alignItems: 'center',
  },
  chipSelected: { borderColor: c.primary, backgroundColor: c.primaryLight },
  chipWrong: { borderColor: c.error, backgroundColor: c.wrongBg },
  chipText: { fontSize: 14, fontWeight: '600', color: c.text, textAlign: 'center' },
  placeholder: { height: 50 },
})

interface Pair {
  id: string
  word: string
  translation: string
}

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

function parsePairs(exercise: Exercise): Pair[] {
  const words = exercise.correctAnswer.split(';')
  const translations = exercise.wrongAnswers
  return words.map((w, i) => ({
    id: `pair-${i}`,
    word: w.trim(),
    translation: translations[i]?.trim() ?? w,
  }))
}

export function MatchPairs({ exercise, onAnswerChange, result }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const [pairs] = useState<Pair[]>(() => parsePairs(exercise))
  const [shuffledRight] = useState(() => shuffle(pairs))
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongFlash, setWrongFlash] = useState<Set<string>>(new Set())

  const selectLeft = (id: string) => {
    if (matched.has(id) || result !== null) return
    setSelectedLeft(id)
    if (selectedRight) checkMatch(id, selectedRight)
  }

  const selectRight = (id: string) => {
    if (matched.has(id) || result !== null) return
    setSelectedRight(id)
    if (selectedLeft) checkMatch(selectedLeft, id)
  }

  const checkMatch = (leftId: string, rightId: string) => {
    const pair = pairs.find((p) => p.id === leftId)
    const rightPair = pairs.find((p) => p.id === rightId)
    if (!pair || !rightPair) return

    if (leftId === rightId) {
      const next = new Set(matched).add(leftId)
      setMatched(next)
      setSelectedLeft(null)
      setSelectedRight(null)
      if (next.size === pairs.length) onAnswerChange('matched')
    } else {
      setWrongFlash(new Set([leftId, rightId]))
      setTimeout(() => {
        setWrongFlash(new Set())
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 600)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Juftlashtiring</Text>
      <View style={styles.grid}>
        <View style={styles.column}>
          {pairs.map((p) => {
            if (matched.has(p.id)) return <View key={p.id} style={styles.placeholder} />
            const isSelected = selectedLeft === p.id
            const isWrong = wrongFlash.has(p.id)
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, isSelected && styles.chipSelected, isWrong && styles.chipWrong]}
                onPress={() => selectLeft(p.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{p.word}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.column}>
          {shuffledRight.map((p) => {
            if (matched.has(p.id)) return <View key={p.id} style={styles.placeholder} />
            const isSelected = selectedRight === p.id
            const isWrong = wrongFlash.has(p.id)
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, isSelected && styles.chipSelected, isWrong && styles.chipWrong]}
                onPress={() => selectRight(p.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{p.translation}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}
