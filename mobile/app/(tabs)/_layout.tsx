import { View, StyleSheet, Text } from 'react-native'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Dumbbell, Trophy, User } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import { StreakFlame } from '@/components/shared/StreakFlame'
import { GemsCounter } from '@/components/shared/GemsCounter'
import { LivesBar } from '@/components/lesson/LivesBar'

export default function TabLayout() {
  const c = useColors()
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.text,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: c.border,
          backgroundColor: c.background,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: c.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: c.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
        headerRight: () => (
          <View style={styles.headerRight}>
            <StreakFlame />
            <LivesBar compact />
            <GemsCounter />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "O'rgan",
          headerTitle: 'LingvaUZ',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Home} label="O'rgan" />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Mashq',
          headerTitle: 'Mashq',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Dumbbell} label="Mashq" />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liga',
          headerTitle: 'Liga',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Trophy} label="Liga" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} label="Profil" />,
        }}
      />
    </Tabs>
  )
}

function TabIcon({ focused, icon: Icon, label }: { focused: boolean; icon: React.ComponentType<{ size: number; color: string }>; label: string }) {
  const c = useColors()
  return (
    <View style={tabIconStyles.wrap}>
      <View style={[tabIconStyles.iconCircle, focused && { backgroundColor: c.primary }]}>
        <Icon size={20} color={focused ? c.onPrimary : c.textSecondary} />
      </View>
      <Text style={[tabIconStyles.label, { color: focused ? c.text : c.textSecondary }]}>
        {label}
      </Text>
    </View>
  )
}

const tabIconStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2, paddingTop: 4, minWidth: 60 },
  iconCircle: {
    width: 44, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 10, fontWeight: '700' },
})

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 14 },
})
