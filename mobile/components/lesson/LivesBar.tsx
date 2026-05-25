import { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import type { LivesState } from '@/types'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  heart: { fontSize: 18 },
  heartEmpty: { opacity: 0.3 },
  compact: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  compactCount: { fontSize: 14, fontWeight: '700', color: c.heart },
})

interface Props {
  lives?: number
  compact?: boolean
}

export function LivesBar({ lives, compact = false }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const token = useAuthStore((s) => s.token)

  const { data } = useQuery<LivesState>({
    queryKey: ['lives'],
    queryFn: () => api.get('/lives').then((r) => r.data),
    enabled: lives === undefined && !!token,
    staleTime: 30_000,
  })

  const effectiveLives = lives ?? data?.current ?? 5
  const maxLives = data?.max ?? 5

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.heart}>❤️</Text>
        <Text style={styles.compactCount}>{effectiveLives}</Text>
      </View>
    )
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: maxLives }).map((_, i) => (
        <Text key={i} style={[styles.heart, i >= effectiveLives && styles.heartEmpty]}>
          {i < effectiveLives ? '❤️' : '🖤'}
        </Text>
      ))}
    </View>
  )
}
