import { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1, backgroundColor: c.background,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  icon: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: c.error, marginBottom: 8 },
  sub: { fontSize: 15, color: c.textSecondary, textAlign: 'center', marginBottom: 40 },
  btn: {
    width: '100%', paddingVertical: 16, borderRadius: 14,
    backgroundColor: c.primary, alignItems: 'center',
  },
  btnText: { color: c.onPrimary, fontSize: 16, fontWeight: '800' },
})

interface Props {
  onClose: () => void
}

export function NoLivesScreen({ onClose }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  return (
    <View style={styles.container}>
      <Animated.Text entering={ZoomIn.springify()} style={styles.icon}>💔</Animated.Text>
      <Text style={styles.title}>Hayotlar tugadi!</Text>
      <Text style={styles.sub}>Hayotlar tiklanishini kuting yoki Premium oling.</Text>

      <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.8}>
        <Text style={styles.btnText}>ORQAGA</Text>
      </TouchableOpacity>
    </View>
  )
}
