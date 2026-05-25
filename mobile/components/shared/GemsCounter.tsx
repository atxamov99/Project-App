import { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  gem: { fontSize: 18 },
  count: { fontSize: 15, fontWeight: '800', color: c.gem },
})

export function GemsCounter() {
  const { user } = useAuthStore()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const { data } = useQuery({
    queryKey: ['gems'],
    queryFn: () => api.get('/users/me').then((r) => r.data.gems as number),
    staleTime: 120_000,
    initialData: user?.gems,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.gem}>💎</Text>
      <Text style={styles.count}>{data ?? 0}</Text>
    </View>
  )
}
