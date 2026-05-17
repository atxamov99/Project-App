import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Colors } from '@/constants/colors'
import { useLesson } from '@/hooks/useLesson'
import { useLessonStore } from '@/store/lessonStore'
import { ProgressBar } from '@/components/lesson/ProgressBar'
import { ExerciseRenderer } from '@/components/lesson/ExerciseRenderer'
import { AnswerFooter } from '@/components/lesson/AnswerFooter'
import { CompleteScreen } from '@/components/lesson/CompleteScreen'
import { NoLivesScreen } from '@/components/lesson/NoLivesScreen'
import { LoadingScreen } from '@/components/lesson/LoadingScreen'

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { answer, setAnswer } = useLessonStore()

  const {
    phase, currentExercise, progress, lives,
    result, correctAnswer, explanation,
    completionData, checkAnswer, next,
  } = useLesson(id)

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
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  exerciseArea: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
})
