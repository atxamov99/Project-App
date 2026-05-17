import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { ZoomIn, FadeInUp } from 'react-native-reanimated'
import { Colors } from '@/constants/colors'

interface Props {
  xpEarned: number
  streak: number
  onContinue: () => void
}

export function CompleteScreen({ xpEarned, streak, onContinue }: Props) {
  return (
    <View style={styles.container}>
      <Animated.Text entering={ZoomIn.springify()} style={styles.mascot}>
        🍉
      </Animated.Text>

      <Animated.Text entering={FadeInUp.delay(300).duration(400)} style={styles.title}>
        Zo'r! Dars tugadi!
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{xpEarned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        {streak > 0 && (
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>🔥 Streak</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.btnWrap}>
        <TouchableOpacity style={styles.btn} onPress={onContinue} activeOpacity={0.8}>
          <Text style={styles.btnText}>DAVOM ETISH</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  mascot: { fontSize: 96, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 24, marginBottom: 48 },
  statBox: {
    alignItems: 'center', paddingHorizontal: 32, paddingVertical: 20,
    backgroundColor: Colors.surface, borderRadius: 20,
    borderWidth: 2, borderColor: Colors.border,
  },
  statValue: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  btnWrap: { width: '100%' },
  btn: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 14, alignItems: 'center',
    shadowColor: Colors.primaryDark, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
})
