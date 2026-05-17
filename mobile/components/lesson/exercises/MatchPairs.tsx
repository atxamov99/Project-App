import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeOut } from 'react-native-reanimated'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

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
  const [pairs] = useState<Pair[]>(() => parsePairs(exercise))
  const [shuffledRight] = useState(() => [...pairs].sort(() => Math.random() - 0.5))
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

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  grid: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 10 },
  chip: {
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center',
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipWrong: { borderColor: Colors.error, backgroundColor: Colors.wrongBg },
  chipText: { fontSize: 14, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  placeholder: { height: 50 },
})
