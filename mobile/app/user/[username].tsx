import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { api } from '@/lib/api'
import type { PublicProfile } from '@/types'

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillValue}>{value}</Text>
      <Text style={styles.statPillLabel}>{label}</Text>
    </View>
  )
}

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery<PublicProfile>({
    queryKey: ['user-profile', username],
    queryFn: () => api.get(`/users/${username}`).then((r) => r.data),
    enabled: !!username,
  })

  const followMutation = useMutation({
    mutationFn: () =>
      data?.isFollowing
        ? api.delete(`/friends/${username}`)
        : api.post('/friends', { username }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-profile', username] })
    },
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Orqaga</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.errorText}>Foydalanuvchi topilmadi</Text>
        </View>
      </SafeAreaView>
    )
  }

  const joinYear = new Date(data.createdAt).getFullYear()

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Orqaga</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{data.displayName[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.displayName}>{data.displayName}</Text>
          <Text style={styles.username}>@{data.username}</Text>

          <View style={styles.badgeRow}>
            {data.isPremium && (
              <View style={[styles.badge, styles.premiumBadge]}>
                <Text style={styles.badgeText}>💎 Premium</Text>
              </View>
            )}
            {data.leagueEntry && (
              <View style={[styles.badge, { backgroundColor: data.leagueEntry.league.color + '22' }]}>
                <Text style={styles.badgeText}>
                  {data.leagueEntry.league.icon} {data.leagueEntry.league.name}
                </Text>
              </View>
            )}
            {data.followsYou && !data.isSelf && (
              <View style={[styles.badge, styles.followsBadge]}>
                <Text style={styles.badgeText}>Sizni kuzatadi</Text>
              </View>
            )}
          </View>

          {!data.isSelf && (
            <TouchableOpacity
              style={[styles.followBtn, data.isFollowing && styles.followingBtn]}
              onPress={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              activeOpacity={0.8}
            >
              {followMutation.isPending
                ? <ActivityIndicator color={data.isFollowing ? Colors.primary : '#fff'} size="small" />
                : <Text style={[styles.followBtnText, data.isFollowing && styles.followingBtnText]}>
                    {data.isFollowing ? 'Kuzatilmoqda ✓' : '+ Kuzatish'}
                  </Text>
              }
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatPill label="Umumiy XP" value={data.totalXP.toLocaleString()} />
          <StatPill label="Streak" value={`${data.streak} 🔥`} />
          <StatPill label="Rekord" value={`${data.longestStreak} kun`} />
        </View>

        <View style={styles.socialRow}>
          <View style={styles.socialItem}>
            <Text style={styles.socialNum}>{data.counts.followers}</Text>
            <Text style={styles.socialLabel}>Kuzatuvchilar</Text>
          </View>
          <View style={styles.socialDivider} />
          <View style={styles.socialItem}>
            <Text style={styles.socialNum}>{data.counts.following}</Text>
            <Text style={styles.socialLabel}>Kuzatadi</Text>
          </View>
          <View style={styles.socialDivider} />
          <View style={styles.socialItem}>
            <Text style={styles.socialNum}>{data.counts.achievements}</Text>
            <Text style={styles.socialLabel}>Yutuqlar</Text>
          </View>
          <View style={styles.socialDivider} />
          <View style={styles.socialItem}>
            <Text style={styles.socialNum}>{data.counts.lessonResults}</Text>
            <Text style={styles.socialLabel}>Darslar</Text>
          </View>
        </View>

        {data.leagueEntry && (
          <View style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>{data.leagueEntry.league.icon}</Text>
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName}>{data.leagueEntry.league.name} Ligasi</Text>
              <Text style={styles.leagueXp}>Bu hafta: {data.leagueEntry.weeklyXP} XP</Text>
            </View>
          </View>
        )}

        <Text style={styles.joinedText}>
          📅 {joinYear}-yildan beri LingvaUZ foydalanuvchisi
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },

  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  displayName: { fontSize: 24, fontWeight: '800', color: Colors.text },
  username: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 12 },

  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  premiumBadge: { backgroundColor: '#FFF3CD' },
  followsBadge: { backgroundColor: Colors.primaryLight },
  badgeText: { fontSize: 12, fontWeight: '700', color: Colors.text },

  followBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  followingBtn: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  followBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  followingBtnText: { color: Colors.primary },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statPillValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statPillLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },

  socialRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 16,
    marginBottom: 16,
  },
  socialItem: { flex: 1, alignItems: 'center' },
  socialNum: { fontSize: 18, fontWeight: '800', color: Colors.text },
  socialLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  socialDivider: { width: 1, backgroundColor: Colors.border },

  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  leagueIcon: { fontSize: 36 },
  leagueInfo: { flex: 1 },
  leagueName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  leagueXp: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  joinedText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
  errorText: { fontSize: 16, color: Colors.error },
})
