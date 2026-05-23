import { useState, useRef, useMemo } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import type { LanguageCode } from '@/types'

const LANGUAGES: { code: LanguageCode; flag: string; name: string; sub: string }[] = [
  { code: 'uz', flag: '🇺🇿', name: "O'zbekcha", sub: "O'zbek tili" },
  { code: 'en', flag: '🇬🇧', name: 'English', sub: 'Ingliz tili' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', sub: 'Rus tili' },
]

const createStyles = (c: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: c.background,
  },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 32 },
  backBtn: { padding: 4, alignSelf: 'flex-start', marginTop: 8, marginBottom: 8 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 36, gap: 8,
  },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.border },
  progressDotActive: { backgroundColor: c.primary, width: 28, borderRadius: 6 },
  progressLine: {
    flex: 1, height: 3, backgroundColor: c.border,
    borderRadius: 2, maxWidth: 60,
  },
  header: { alignItems: 'center', marginBottom: 36 },
  globe: { fontSize: 52, marginBottom: 16 },
  title: {
    fontSize: 26, fontWeight: '800', color: c.text,
    textAlign: 'center', marginBottom: 10, lineHeight: 34,
  },
  subtitle: {
    fontSize: 14, color: c.textSecondary,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: 8,
  },
  cards: { gap: 12, flex: 1 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: c.surface, borderRadius: 16,
    borderWidth: 2, borderColor: c.border,
    paddingHorizontal: 20, paddingVertical: 18, gap: 14,
  },
  cardSelected: { borderColor: c.primary, backgroundColor: c.primaryLight },
  cardFlag: { fontSize: 36 },
  cardText: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: '700', color: c.text, marginBottom: 2 },
  cardNameSelected: { color: c.primaryDark },
  cardSub: { fontSize: 13, color: c.textSecondary },
  radio: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: c.borderMedium, alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: c.primary, backgroundColor: c.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.onPrimary },
  btn: {
    width: '100%', height: 54, backgroundColor: c.primary,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    marginTop: 24,
    shadowColor: c.primaryDark, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 5,
  },
  btnDisabled: { backgroundColor: c.border, shadowOpacity: 0, elevation: 0 },
  btnText: { color: c.onPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.8 },
})

function LanguageCard({
  lang, selected, onPress, styles, c,
}: {
  lang: (typeof LANGUAGES)[number]
  selected: boolean
  onPress: () => void
  styles: ReturnType<typeof createStyles>
  c: ThemeColors
}) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start()
    onPress()
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Text style={styles.cardFlag}>{lang.flag}</Text>
        <View style={styles.cardText}>
          <Text style={[styles.cardName, selected && styles.cardNameSelected]}>
            {lang.name}
          </Text>
          <Text style={styles.cardSub}>{lang.sub}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function SelectInterfaceLanguageScreen() {
  const [selected, setSelected] = useState<LanguageCode | null>(null)
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const router = useRouter()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const isChangeMode = mode === 'change'

  const handleContinue = () => {
    if (!selected) return
    router.push({
      pathname: '/(auth)/select-learning-language',
      params: { interfaceLang: selected, ...(isChangeMode ? { mode: 'change' } : {}) },
    })
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {isChangeMode && (
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={24} color={c.text} />
          </TouchableOpacity>
        )}

        <View style={styles.progressRow}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
        </View>

        <View style={styles.header}>
          <Text style={styles.globe}>🌍</Text>
          <Text style={styles.title}>Qaysi tilda gaplashasiz?</Text>
          <Text style={styles.subtitle}>
            Dastur interfeysi, tushuntirishlar va tarjimalar shu tilda bo'ladi
          </Text>
        </View>

        <View style={styles.cards}>
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.code}
              lang={lang}
              selected={selected === lang.code}
              onPress={() => setSelected(lang.code)}
              styles={styles}
              c={c}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, !selected && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>DAVOM ETISH</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
