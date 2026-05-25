import { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Flame, Calendar, Star, Gem, Sun, Moon, Globe, LogOut, ChevronRight } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import { useThemeStore } from '@/store/themeStore'
import { THEMES, THEME_IDS } from '@/constants/themes'
import type { ThemeColors, ThemeId } from '@/constants/themes'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types'

export default function ProfileScreen() {
  const { user: cachedUser, logout } = useAuthStore()
  const router = useRouter()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const themeId = useThemeStore((s) => s.themeId)
  const setTheme = useThemeStore((s) => s.setTheme)
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

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

      {/* Hero — avatar + name */}
      <View style={styles.hero}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.displayName[0].toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        {user.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>💎 Premium</Text>
          </View>
        )}
      </View>

      {/* Stats — 4 cards using primary/secondary/tertiary palette */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Streak"
          value={user.streak}
          unit="kun"
          icon={<Flame size={22} color={c.onPrimary} />}
          tone={c.primary}
        />
        <StatCard
          label="Eng uzun"
          value={user.longestStreak}
          unit="kun"
          icon={<Calendar size={22} color={c.onPrimary} />}
          tone={c.secondary}
        />
        <StatCard
          label="Umumiy XP"
          value={user.totalXP}
          unit=""
          icon={<Star size={22} color={c.onPrimary} />}
          tone={c.tertiary}
        />
        <StatCard
          label="Gemlar"
          value={user.gems}
          unit=""
          icon={<Gem size={22} color={c.onPrimary} />}
          tone={c.primaryDark}
        />
      </View>

      {/* Account */}
      <Section title="Akkaunt">
        <Row label="Email" value={user.email} />
        <Row label="Streak freeze" value={`${user.streakFreezes} ta`} last />
      </Section>

      {/* Appearance */}
      <Section title="Ko'rinish">
        <Text style={styles.fieldLabel}>RANG MAVZUSI</Text>
        <View style={styles.themeGrid}>
          {THEME_IDS.map((id) => (
            <ThemeSwatch
              key={id}
              themeId={id}
              mode={mode}
              active={themeId === id}
              onPress={() => setTheme(id)}
            />
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 24 }]}>REJIM</Text>
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'light' && styles.modeBtnActive]}
            onPress={() => setMode('light')}
            activeOpacity={0.8}
          >
            <Sun size={16} color={mode === 'light' ? c.text : c.textSecondary} />
            <Text style={[styles.modeBtnText, mode === 'light' && styles.modeBtnTextActive]}>Yorug'</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'dark' && styles.modeBtnActive]}
            onPress={() => setMode('dark')}
            activeOpacity={0.8}
          >
            <Moon size={16} color={mode === 'dark' ? c.text : c.textSecondary} />
            <Text style={[styles.modeBtnText, mode === 'dark' && styles.modeBtnTextActive]}>Qorong'i</Text>
          </TouchableOpacity>
        </View>
      </Section>

      {/* Settings */}
      <Section title="Sozlamalar">
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => router.push({ pathname: '/(auth)/select-interface-language', params: { mode: 'change' } } as any)}
          activeOpacity={0.7}
        >
          <Globe size={18} color={c.textSecondary} />
          <Text style={styles.settingsLabel}>Tilni o'zgartirish</Text>
          <ChevronRight size={20} color={c.textLight} />
        </TouchableOpacity>
      </Section>

      <View style={styles.logoutWrap}>
        <Button
          label="Chiqish"
          variant="outlined"
          fullWidth
          onPress={handleLogout}
          icon={<LogOut size={18} color={c.primary} />}
        />
      </View>
    </ScrollView>
  )
}

/* ─── sub-components ─────────────────────── */

function StatCard({ label, value, unit, icon, tone }: { label: string; value: string | number; unit: string; icon: React.ReactNode; tone: string }) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  return (
    <Card padding={14} radius={20} style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: tone }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>
        {value}
        {unit ? <Text style={styles.statUnit}>  {unit}</Text> : null}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Card padding="md" radius={20}>
        {children}
      </Card>
    </View>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0, paddingBottom: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

function ThemeSwatch({ themeId, mode, active, onPress }: { themeId: ThemeId; mode: 'light' | 'dark'; active: boolean; onPress: () => void }) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const theme = THEMES[themeId][mode]
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.swatchWrap, active && styles.swatchWrapActive]}>
      <View style={styles.swatchDots}>
        <View style={[styles.swatchDot, { backgroundColor: theme.primary }]} />
        <View style={[styles.swatchDot, { backgroundColor: theme.secondary }]} />
        <View style={[styles.swatchDot, { backgroundColor: theme.tertiary }]} />
      </View>
      <Text style={styles.swatchLabel}>{THEMES[themeId].emoji}  {THEMES[themeId].label}</Text>
    </TouchableOpacity>
  )
}

/* ─── styles ─────────────────────── */

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  content: { paddingBottom: 60 },

  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  avatarOuter: {
    padding: 4, borderRadius: 999,
    borderWidth: 3, borderColor: c.primary,
    marginBottom: 14,
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: c.onPrimary, fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  displayName: { fontSize: 24, fontWeight: '800', color: c.text, letterSpacing: -0.3 },
  username: { fontSize: 14, color: c.textSecondary, marginTop: 4 },
  premiumBadge: {
    marginTop: 12, paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: c.tertiary, borderRadius: 999,
  },
  premiumText: { color: c.background, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginHorizontal: 16, gap: 12, marginBottom: 28,
  },
  statCard: { flex: 1, minWidth: '46%', alignItems: 'flex-start' },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: c.text, letterSpacing: -0.5 },
  statUnit: { fontSize: 13, fontWeight: '600', color: c.textSecondary, letterSpacing: 0 },
  statLabel: { fontSize: 12, color: c.textSecondary, marginTop: 2, fontWeight: '600' },

  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: c.textSecondary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4,
  },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.border,
  },
  infoLabel: { fontSize: 14, color: c.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '700', color: c.text },

  fieldLabel: {
    fontSize: 10, fontWeight: '800', color: c.textSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
  },

  themeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  swatchWrap: {
    flexBasis: '48%', flexGrow: 1,
    backgroundColor: c.background, borderWidth: 2, borderColor: c.border,
    borderRadius: 14, padding: 10, gap: 8,
  },
  swatchWrapActive: { borderColor: c.primary, borderWidth: 2.5 },
  swatchDots: { flexDirection: 'row', gap: 4 },
  swatchDot: { width: 16, height: 16, borderRadius: 8 },
  swatchLabel: { fontSize: 12, fontWeight: '700', color: c.text },

  modeSwitch: {
    flexDirection: 'row', gap: 6,
    backgroundColor: c.background, borderWidth: 1, borderColor: c.border,
    borderRadius: 14, padding: 4,
  },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  modeBtnActive: {
    backgroundColor: c.surface,
  },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: c.textSecondary },
  modeBtnTextActive: { color: c.text },

  settingsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14,
  },
  settingsLabel: { flex: 1, fontSize: 15, color: c.text, fontWeight: '600' },

  logoutWrap: { paddingHorizontal: 16, marginTop: 8 },
})
