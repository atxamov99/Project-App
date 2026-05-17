import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import type { User } from '@/types'

function StatCard({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { user: cachedUser, logout } = useAuthStore()

  const { data: user } = useQuery<User>({
    queryKey: ['profile'],
    queryFn: () => api.get('/auth/me').then((r) => r.data),
    initialData: cachedUser ?? undefined,
  })

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Hisobdan chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Ha, chiqish', style: 'destructive', onPress: logout },
    ])
  }

  if (!user) return null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.displayName[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.isPremium && <Text style={styles.premiumBadge}>💎 Premium</Text>}
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Streak" value={`${user.streak} 🔥`} emoji="" />
        <StatCard label="Eng uzun" value={`${user.longestStreak} kun`} emoji="📅" />
        <StatCard label="Umumiy XP" value={user.totalXP} emoji="⭐" />
        <StatCard label="Gemlar" value={user.gems} emoji="💎" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Akkaunt</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Streak freeze</Text>
          <Text style={styles.infoValue}>{user.streakFreezes} ta</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primaryDark, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  displayName: { fontSize: 22, fontWeight: '800', color: Colors.text },
  username: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  premiumBadge: {
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: '#FFF3CD', borderRadius: 20, fontSize: 13, fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginHorizontal: 16, gap: 12, marginBottom: 24,
  },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: Colors.surface,
    borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  statEmoji: { fontSize: 28, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  logoutBtn: {
    marginHorizontal: 16, paddingVertical: 14, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.error, alignItems: 'center',
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
})
