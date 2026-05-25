import { View, Text, StyleSheet } from 'react-native'
import type { Unit } from '@/types'

interface Props {
  unit: Unit
}

export function UnitHeader({ unit }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: unit.color }]}>
      <Text style={styles.icon}>{unit.icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.order}>BIRLIK {unit.order}</Text>
        <Text style={styles.title}>{unit.title}</Text>
        {unit.description && <Text style={styles.desc}>{unit.description}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  icon: { fontSize: 36 },
  textWrap: { flex: 1 },
  order: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 2 },
  desc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
})
