import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { LeagueData, LeagueEntry } from '@/types'

function EntryRow({ entry, rank }: { entry: LeagueEntry; rank: number }) {
  const { user } = useAuthStore()
  const router = useRouter()
  const isMe = entry.userId === user?.id
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

  return (
    <TouchableOpacity
      style={[styles.row, isMe && styles.rowMe]}
      onPress={() => router.push(`/user/${entry.username}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.rankWrap}>
        {medal
          ? <Text style={styles.medal}>{medal}</Text>
          : <Text style={styles.rank}>{rank}</Text>
        }
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{entry.displayName[0].toUpperCase()}</Text>
      </View>
      <View style={styles.nameWrap}>
        <Text style={[styles.name, isMe && styles.nameMe]}>
          {entry.displayName} {isMe && '(Men)'}
        </Text>
        <Text style={styles.username}>@{entry.username}</Text>
      </View>
      <Text style={styles.xp}>{entry.weeklyXP} XP</Text>
    </TouchableOpacity>
  )
}

export default function LeaderboardScreen() {
  const { data, isLoading } = useQuery<LeagueData>({
    queryKey: ['league'],
    queryFn: () => api.get('/league').then((r) => r.data),
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (!data) return null

  return (
    <View style={styles.container}>
      <View style={[styles.leagueHeader, { backgroundColor: data.color }]}>
        <Text style={styles.leagueIcon}>{data.icon}</Text>
        <Text style={styles.leagueName}>{data.name} Ligasi</Text>
        <Text style={styles.leagueSub}>Sizning haftalik XP: {data.weeklyXP}</Text>
      </View>

      <FlatList
        data={data.entries}
        keyExtractor={(e) => e.userId}
        renderItem={({ item, index }) => <EntryRow entry={item} rank={index + 1} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  leagueHeader: {
    padding: 24, alignItems: 'center',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  leagueIcon: { fontSize: 48, marginBottom: 4 },
  leagueName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  leagueSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  list: { padding: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12,
  },
  rowMe: { backgroundColor: Colors.primaryLight },
  rankWrap: { width: 32, alignItems: 'center' },
  rank: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  medal: { fontSize: 22 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 10,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  nameWrap: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text },
  nameMe: { color: Colors.primaryDark },
  username: { fontSize: 12, color: Colors.textLight },
  xp: { fontSize: 15, fontWeight: '800', color: Colors.warning },
  separator: { height: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
})
