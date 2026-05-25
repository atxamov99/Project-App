import { useMemo } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Search, X } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

interface Props {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  onSubmit?: () => void
  autoFocus?: boolean
}

export function SearchBar({ value, onChangeText, placeholder = 'Search', onSubmit, autoFocus }: Props) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  return (
    <View style={styles.wrap}>
      <Search size={18} color={c.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textLight}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
          <X size={16} color={c.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
    borderRadius: 999, paddingHorizontal: 16, height: 44,
  },
  input: {
    flex: 1, fontSize: 15, color: c.text, paddingVertical: 0,
  },
})
