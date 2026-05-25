import { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { api } from '@/lib/api'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  flame: { fontSize: 20 },
  count: { fontSize: 15, fontWeight: '800', color: c.streak },
})

export function StreakFlame() {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const { data } = useQuery({
    queryKey: ['streak'],
    queryFn: () => api.get('/streak').then((r) => r.data.streak as number),
    staleTime: 60_000,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{data ?? 0}</Text>
    </View>
  )
}
