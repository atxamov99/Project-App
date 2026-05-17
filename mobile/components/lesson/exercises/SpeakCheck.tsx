import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import * as Speech from 'expo-speech'
import { Colors } from '@/constants/colors'
import type { Exercise, AnswerResult } from '@/types'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (a: string) => void
  result: AnswerResult
}

export function SpeakCheck({ exercise, onAnswerChange, result }: Props) {
  const [recording, setRecording] = useState(false)

  const handleSpeak = () => {
    if (result !== null) return

    setRecording(true)
    onAnswerChange(exercise.correctAnswer)
    setTimeout(() => setRecording(false), 2000)
  }

  const borderColor =
    result === 'correct' ? Colors.correctBorder :
    result === 'wrong'   ? Colors.wrongBorder   : 'transparent'

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gapiring</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={[styles.card, { borderColor, borderWidth: result ? 2 : 0 }]}>
        <Text style={styles.target}>{exercise.correctAnswer}</Text>
      </View>

      <TouchableOpacity
        style={[styles.micBtn, recording && styles.micBtnActive]}
        onPress={handleSpeak}
        activeOpacity={0.8}
        disabled={result !== null}
      >
        {recording
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.micIcon}>🎤</Text>
        }
        <Text style={styles.micText}>{recording ? 'Tinglayapman...' : 'Bosib gapiring'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16, alignItems: 'center' },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', alignSelf: 'flex-start' },
  question: { fontSize: 18, color: Colors.textSecondary, alignSelf: 'flex-start' },
  card: {
    width: '100%', padding: 20, borderRadius: 16,
    backgroundColor: Colors.surface, alignItems: 'center',
  },
  target: { fontSize: 28, fontWeight: '800', color: Colors.text },
  micBtn: {
    paddingHorizontal: 32, paddingVertical: 16, borderRadius: 40,
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: Colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  micBtnActive: { backgroundColor: Colors.error },
  micIcon: { fontSize: 24 },
  micText: { color: '#fff', fontSize: 15, fontWeight: '700' },
})
