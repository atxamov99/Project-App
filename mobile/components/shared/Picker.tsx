import { useMemo, useState } from 'react'
import {
  View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView,
} from 'react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'

export interface PickerOption<T extends string = string> {
  value: T
  label: string
  icon?: string
  hint?: string
}

interface Props<T extends string> {
  label?: string
  value: T
  options: PickerOption<T>[]
  onChange: (v: T) => void
  visible: boolean
  onClose: () => void
  title?: string
}

export function PickerModal<T extends string>({
  value, options, onChange, visible, onClose, title,
}: Props<T>) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <ScrollView style={{ maxHeight: 360 }}>
            {options.map((opt) => {
              const active = opt.value === value
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => { onChange(opt.value); onClose() }}
                  style={[styles.item, active && styles.itemActive]}
                  activeOpacity={0.7}
                >
                  {opt.icon ? <Text style={styles.itemIcon}>{opt.icon}</Text> : null}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{opt.label}</Text>
                  </View>
                  {opt.hint ? <Text style={styles.itemHint}>{opt.hint}</Text> : null}
                  {active ? <Text style={styles.check}>✓</Text> : null}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

interface ButtonProps<T extends string> {
  label?: string
  value: T
  options: PickerOption<T>[]
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}

export function PickerButton<T extends string>({
  label, value, options, onChange, size = 'md',
}: ButtonProps<T>) {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const selected = options.find((o) => o.value === value)
  const [open, setOpen] = useState(false)
  const padding = size === 'sm' ? { paddingHorizontal: 12, paddingVertical: 8 } : { paddingHorizontal: 14, paddingVertical: 12 }

  return (
    <View style={{ flex: 1 }}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[styles.field, padding]}
        activeOpacity={0.7}
      >
        {selected?.icon ? <Text style={styles.fieldIcon}>{selected.icon}</Text> : null}
        <Text style={styles.fieldValue} numberOfLines={1}>{selected?.label ?? '—'}</Text>
        <Text style={styles.fieldChevron}>▾</Text>
      </TouchableOpacity>
      <PickerModal
        title={label}
        value={value}
        options={options}
        onChange={onChange}
        visible={open}
        onClose={() => setOpen(false)}
      />
    </View>
  )
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: c.border, alignSelf: 'center', marginBottom: 12,
  },
  title: {
    fontSize: 14, fontWeight: '800', color: c.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: 8, paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemActive: { backgroundColor: c.correctBg },
  itemIcon: { fontSize: 22 },
  itemLabel: { fontSize: 16, fontWeight: '600', color: c.text },
  itemLabelActive: { color: c.primary, fontWeight: '800' },
  itemHint: {
    fontSize: 11, fontWeight: '800', color: c.textSecondary,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  check: { fontSize: 18, color: c.primary, fontWeight: '800' },
  fieldLabel: {
    fontSize: 10, fontWeight: '800', color: c.textSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6,
  },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: c.background, borderRadius: 12,
    borderWidth: 2, borderColor: c.border,
  },
  fieldIcon: { fontSize: 18 },
  fieldValue: { flex: 1, fontSize: 14, fontWeight: '700', color: c.text },
  fieldChevron: { fontSize: 12, color: c.textSecondary, fontWeight: '800' },
})
