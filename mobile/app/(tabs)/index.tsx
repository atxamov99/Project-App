import { useMemo } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, ChevronRight } from 'lucide-react-native'
import { api } from '@/lib/api'
import { LessonBubble } from '@/components/home/LessonBubble'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { Course } from '@/types'

export default function HomeScreen() {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const router = useRouter()

  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ['course'],
    queryFn: () => api.get('/courses/current').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    )
  }

  if (error || !course) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Ma'lumot yuklanmadi. Qayta urining.</Text>
      </View>
    )
  }

  const allLessons = course.units.flatMap((u) => u.lessons)
  const currentLesson = allLessons.find((l) => l.status === 'current') ?? allLessons.find((l) => l.status === 'available')
  const completedCount = allLessons.filter((l) => l.status === 'completed').length
  const totalCount = allLessons.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Course title */}
      <View style={styles.header}>
        <Text style={styles.courseFlag}>{course.fromLanguage.flag} → {course.toLanguage.flag}</Text>
        <Text style={styles.courseName}>{course.toLanguage.name}</Text>
      </View>

      {/* Continue card — uses primary as a hero CTA */}
      {currentLesson && (
        <Card variant="primary" padding={20} radius={24} style={styles.continueCard}>
          <View style={styles.continueHeader}>
            <Sparkles size={18} color={c.onPrimary} />
            <Text style={styles.continueLabel}>DAVOM ETING</Text>
          </View>
          <Text style={styles.continueTitle}>
            {currentLesson.type === 'CHECKPOINT' ? 'Checkpoint dars' : `Dars #${currentLesson.order}`}
          </Text>
          <Text style={styles.continueSub}>
            {progressPct}% kursi tugadi · {totalCount - completedCount} ta dars qoldi
          </Text>
          <View style={styles.continueProgressTrack}>
            <View style={[styles.continueProgressFill, { width: `${progressPct}%` }]} />
          </View>
          <View style={{ marginTop: 16 }}>
            <Button
              label="Davom etish"
              variant="inverted"
              size="md"
              onPress={() => router.push(`/lesson/${currentLesson.id}`)}
              iconRight={<ChevronRight size={18} color={c.primary} />}
            />
          </View>
        </Card>
      )}

      {/* Units */}
      {course.units.map((unit) => {
        const unitCompleted = unit.lessons.filter((l) => l.status === 'completed').length
        const unitTotal = unit.lessons.length
        const unitPct = unitTotal > 0 ? (unitCompleted / unitTotal) * 100 : 0
        return (
          <Card key={unit.id} padding="md" radius={20} style={styles.unitCard}>
            <View style={styles.unitHeader}>
              <View style={[styles.unitIconWrap, { backgroundColor: unit.color }]}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
              </View>
              <View style={styles.unitTextWrap}>
                <Text style={styles.unitOrder}>BIRLIK {unit.order}</Text>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                {unit.description ? (
                  <Text style={styles.unitDesc} numberOfLines={2}>{unit.description}</Text>
                ) : null}
              </View>
              <View style={styles.unitPctWrap}>
                <Text style={styles.unitPct}>{Math.round(unitPct)}%</Text>
              </View>
            </View>

            <View style={styles.unitProgressTrack}>
              <View style={[styles.unitProgressFill, { width: `${unitPct}%`, backgroundColor: unit.color }]} />
            </View>

            <View style={styles.bubblesRow}>
              {unit.lessons.map((lesson) => (
                <LessonBubble key={lesson.id} lesson={lesson} unitColor={unit.color} />
              ))}
            </View>
          </Card>
        )
      })}

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  content: { paddingBottom: 80 },
  center: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: c.error, fontSize: 15 },

  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4,
  },
  courseFlag: { fontSize: 11, fontWeight: '800', color: c.textSecondary, letterSpacing: 1.5 },
  courseName: { fontSize: 22, fontWeight: '800', color: c.text, marginTop: 2, letterSpacing: -0.3 },

  continueCard: {
    marginHorizontal: 16, marginTop: 16,
  },
  continueHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  continueLabel: { color: c.onPrimary, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  continueTitle: { color: c.onPrimary, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  continueSub: { color: c.onPrimary, opacity: 0.85, fontSize: 13, marginTop: 4 },
  continueProgressTrack: {
    height: 6, backgroundColor: c.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)',
    borderRadius: 999, marginTop: 12, overflow: 'hidden',
  },
  continueProgressFill: { height: '100%', backgroundColor: c.onPrimary },

  unitCard: {
    marginHorizontal: 16, marginTop: 16,
  },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  unitIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  unitIcon: { fontSize: 26 },
  unitTextWrap: { flex: 1 },
  unitOrder: { fontSize: 10, fontWeight: '800', color: c.textSecondary, letterSpacing: 1.4 },
  unitTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 2, letterSpacing: -0.2 },
  unitDesc: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
  unitPctWrap: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: c.surfaceAlt,
  },
  unitPct: { fontSize: 12, fontWeight: '800', color: c.text },

  unitProgressTrack: {
    height: 4, backgroundColor: c.surfaceAlt, borderRadius: 999, marginTop: 12, overflow: 'hidden',
  },
  unitProgressFill: { height: '100%' },

  bubblesRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 12, paddingTop: 16,
  },
})
