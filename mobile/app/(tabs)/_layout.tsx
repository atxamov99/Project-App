import { View, StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { Home, Dumbbell, Trophy, User } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { StreakFlame } from '@/components/shared/StreakFlame'
import { GemsCounter } from '@/components/shared/GemsCounter'
import { LivesBar } from '@/components/lesson/LivesBar'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: Colors.tabBorder,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
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
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'LingvaUZ',
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Mashq',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          headerTitle: 'Mashq',
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liga',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
          headerTitle: 'Liga',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profil',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 },
})
