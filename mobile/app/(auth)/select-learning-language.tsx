import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import type { LanguageCode } from '@/types'

const LANGUAGES: { code: LanguageCode; flag: string; name: string; sub: string }[] = [
  { code: 'uz', flag: '🇺🇿', name: "O'zbekcha", sub: "O'zbek tili" },
  { code: 'en', flag: '🇬🇧', name: 'English', sub: 'Ingliz tili' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', sub: 'Rus tili' },
]

function LanguageCard({
  lang,
  selected,
  disabled,
  onPress,
}: {
  lang: (typeof LANGUAGES)[number]
  selected: boolean
  disabled: boolean
  onPress: () => void
}) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = () => {
    if (disabled) return
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start()
    onPress()
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.cardSelected,
          disabled && styles.cardDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text style={[styles.cardFlag, disabled && styles.cardFlagDisabled]}>
          {lang.flag}
        </Text>
        <View style={styles.cardText}>
          <Text style={[styles.cardName, selected && styles.cardNameSelected, disabled && styles.cardNameDisabled]}>
            {lang.name}
          </Text>
          <Text style={[styles.cardSub, disabled && styles.cardSubDisabled]}>
            {disabled ? 'Interfeys tili sifatida tanlangan' : lang.sub}
          </Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected, disabled && styles.radioDisabled]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function SelectLearningLanguageScreen() {
  const { interfaceLang } = useLocalSearchParams<{ interfaceLang: LanguageCode }>()
  const [selected, setSelected] = useState<LanguageCode | null>(null)
  const [loading, setLoading] = useState(false)
  const { setLanguages } = useAuthStore()
  const router = useRouter()

  const handleStart = async () => {
    if (!selected || !interfaceLang) return
    setLoading(true)
    try {
      await api.patch('/users/me/languages', {
        interfaceLanguage: interfaceLang,
        targetLanguage: selected,
      }).catch(() => null)
    } finally {
      setLanguages(interfaceLang, selected)
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progressRow}>
          <View style={styles.progressDot} />
          <View style={styles.progressLine} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.globe}>📚</Text>
          <Text style={styles.title}>Qaysi tilni o'rganmoqchisiz?</Text>
          <Text style={styles.subtitle}>
            Darslar va mashqlar orqali shu tilni o'rgatasiz
          </Text>
        </View>

        <View style={styles.cards}>
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.code}
              lang={lang}
              selected={selected === lang.code}
              disabled={lang.code === interfaceLang}
              onPress={() => setSelected(lang.code)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, (!selected || loading) && styles.btnDisabled]}
          onPress={handleStart}
          disabled={!selected || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>O'RGANISHNI BOSHLASH 🚀</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 36,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 28,
    borderRadius: 6,
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.primaryLight,
    borderRadius: 2,
    maxWidth: 60,
  },

  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  globe: { fontSize: 52, marginBottom: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  cards: { gap: 12, flex: 1 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 14,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  cardDisabled: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
    opacity: 0.55,
  },
  cardFlag: { fontSize: 36 },
  cardFlagDisabled: { opacity: 0.5 },
  cardText: { flex: 1 },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  cardNameSelected: { color: Colors.primaryDark },
  cardNameDisabled: { color: Colors.textSecondary },
  cardSub: { fontSize: 13, color: Colors.textSecondary },
  cardSubDisabled: { fontSize: 12, color: Colors.textLight, fontStyle: 'italic' },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  radioDisabled: { borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },

  btn: {
    width: '100%',
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  btnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
})
