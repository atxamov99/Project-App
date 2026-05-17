import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { UnitHeader } from '@/components/home/UnitHeader'
import { LessonBubble } from '@/components/home/LessonBubble'
import { Colors } from '@/constants/colors'
import type { Course } from '@/types'

export default function HomeScreen() {
  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ['course'],
    queryFn: () => api.get('/courses/current').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (error || !course) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ma'lumot yuklanmadi. Qayta urining.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.courseTitle}>
        {course.fromLanguage.flag} → {course.toLanguage.flag} {course.toLanguage.name}
      </Text>

      {course.units.map((unit) => (
        <View key={unit.id} style={styles.unitBlock}>
          <UnitHeader unit={unit} />
          <View style={styles.bubblesRow}>
            {unit.lessons.map((lesson) => (
              <LessonBubble key={lesson.id} lesson={lesson} unitColor={unit.color} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  courseTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.textSecondary,
    textAlign: 'center', paddingVertical: 16,
  },
  unitBlock: { marginBottom: 8 },
  bubblesRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', paddingHorizontal: 16, gap: 12, paddingVertical: 16,
  },
  errorText: { color: Colors.error, fontSize: 15 },
})
