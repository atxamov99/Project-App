import { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { useLesson } from '@/hooks/useLesson'
import { useLessonStore } from '@/store/lessonStore'
import { useAuthStore } from '@/store/authStore'
import type { Lang } from '@/lib/ai'
import { ProgressBar } from '@/components/lesson/ProgressBar'
import { ExerciseRenderer } from '@/components/lesson/ExerciseRenderer'
import { AnswerFooter } from '@/components/lesson/AnswerFooter'
import { CompleteScreen } from '@/components/lesson/CompleteScreen'
import { NoLivesScreen } from '@/components/lesson/NoLivesScreen'
import { LoadingScreen } from '@/components/lesson/LoadingScreen'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  exerciseArea: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
})

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { answer, setAnswer } = useLessonStore()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const {
    phase, currentExercise, progress, lives,
    result, correctAnswer, explanation,
    completionData, checkAnswer, next,
  } = useLesson(id)

  const learningLang = (useAuthStore((s) => s.targetLanguage) ?? 'en') as Lang
  const interfaceLang = (useAuthStore((s) => s.interfaceLanguage) ?? 'uz') as Lang

  if (phase === 'loading') return <LoadingScreen />
  if (phase === 'complete') {
    return (
      <CompleteScreen
        xpEarned={completionData?.xpEarned ?? 0}
        streak={completionData?.streak ?? 0}
        onContinue={() => router.replace('/(tabs)')}
      />
    )
  }
  if (phase === 'no_lives') {
    return <NoLivesScreen onClose={() => router.replace('/(tabs)')} />
  }
  if (!currentExercise) return null

  return (
    <View style={styles.container}>
      <ProgressBar
        value={progress}
        lives={lives}
        onClose={() => router.replace('/(tabs)')}
      />

      <Animated.View
        key={currentExercise.id}
        entering={FadeIn.duration(200)}
        style={styles.exerciseArea}
      >
        <ExerciseRenderer
          exercise={currentExercise}
          answer={answer}
          onAnswerChange={setAnswer}
          result={result}
        />
      </Animated.View>

      <AnswerFooter
        answer={answer}
        result={result}
        correctAnswer={correctAnswer}
        explanation={explanation}
        onCheck={checkAnswer}
        onNext={next}
        exerciseType={currentExercise.type}
        exercisePrompt={currentExercise.question}
        learningLang={learningLang}
        interfaceLang={interfaceLang}
      />
    </View>
  )
}
