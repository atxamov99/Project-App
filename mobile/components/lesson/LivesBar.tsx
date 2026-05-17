import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

interface Props {
  lives?: number
  compact?: boolean
}

export function LivesBar({ lives = 5, compact = false }: Props) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.heart}>❤️</Text>
        <Text style={styles.compactCount}>{lives}</Text>
      </View>
    )
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={[styles.heart, i >= lives && styles.heartEmpty]}>
          {i < lives ? '❤️' : '🖤'}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  heart: { fontSize: 18 },
  heartEmpty: { opacity: 0.3 },
  compact: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  compactCount: { fontSize: 14, fontWeight: '700', color: Colors.heart },
})
