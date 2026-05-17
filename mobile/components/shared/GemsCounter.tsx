import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'

export function GemsCounter() {
  const { user } = useAuthStore()

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

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  gem: { fontSize: 18 },
  count: { fontSize: 15, fontWeight: '800', color: Colors.gem },
})
