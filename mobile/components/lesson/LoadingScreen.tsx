import { useMemo } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
})

export function LoadingScreen() {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={c.primary} />
    </View>
  )
}
