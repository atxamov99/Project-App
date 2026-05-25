import { useState, useMemo, useRef, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay,
} from 'react-native-reanimated'
import { Stack } from 'expo-router'
import { useColors } from '@/hooks/useColors'
import type { ThemeColors } from '@/constants/themes'
import { useAuthStore } from '@/store/authStore'
import { aiApi, type Lang, type ChatMessage } from '@/lib/ai'
import { PickerButton, type PickerOption } from '@/components/shared/Picker'

type Mode = 'tutor' | 'translator'

const LANG_OPTS: PickerOption<Lang>[] = [
  { value: 'en', label: 'English', icon: '🇬🇧', hint: 'EN' },
  { value: 'ru', label: 'Русский', icon: '🇷🇺', hint: 'RU' },
  { value: 'uz', label: "O'zbek",  icon: '🇺🇿', hint: 'UZ' },
]

const LEVEL_OPTS: PickerOption<'beginner' | 'intermediate' | 'advanced'>[] = [
  { value: 'beginner',     label: "Boshlang'ich", icon: '🌱', hint: 'A1' },
  { value: 'intermediate', label: "O'rta",         icon: '🌿', hint: 'B1' },
  { value: 'advanced',     label: 'Yuqori',         icon: '🌳', hint: 'C1' },
]

export default function AIScreen() {
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])
  const [mode, setMode] = useState<Mode>('tutor')

  const learningLang = (useAuthStore((s) => s.targetLanguage) ?? 'en') as Lang
  const interfaceLang = (useAuthStore((s) => s.interfaceLanguage) ?? 'uz') as Lang

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'AI yordamchi', headerBackTitle: 'Orqaga' }} />

      <View style={styles.tabBar}>
        <ModeTab label="Tutor" emoji="💬" active={mode === 'tutor'} onPress={() => setMode('tutor')} c={c} />
        <ModeTab label="Tarjimon" emoji="🌐" active={mode === 'translator'} onPress={() => setMode('translator')} c={c} />
      </View>

      {mode === 'tutor' ? (
        <TutorView learningLang={learningLang} interfaceLang={interfaceLang} c={c} />
      ) : (
        <TranslatorView c={c} />
      )}
    </View>
  )
}

function ModeTab({ label, emoji, active, onPress, c }: { label: string; emoji: string; active: boolean; onPress: () => void; c: ThemeColors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1, paddingVertical: 14,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderBottomWidth: 3, borderBottomColor: active ? c.primary : 'transparent',
      }}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={{ fontWeight: '800', fontSize: 15, color: active ? c.primary : c.textSecondary }}>{label}</Text>
    </TouchableOpacity>
  )
}

function TutorView({ learningLang: defaultLearning, interfaceLang: defaultInterface, c }: { learningLang: Lang; interfaceLang: Lang; c: ThemeColors }) {
  const styles = useMemo(() => createStyles(c), [c])
  const [learningLang, setLearningLang] = useState<Lang>(defaultLearning)
  const [interfaceLang, setInterfaceLang] = useState<Lang>(defaultInterface)
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [messages, setMessages] = useState<(ChatMessage & { correction?: string })[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
    return () => clearTimeout(t)
  }, [messages, loading])

  async function send(text?: string) {
    const userMsg = (text ?? input).trim()
    if (!userMsg || loading) return
    setInput('')
    setError('')
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const resp = await aiApi.chat({
        userMessage: userMsg,
        history: history.slice(-10),
        learningLang,
        interfaceLang,
        level,
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: resp.reply, correction: resp.correction }])
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'AI xatolik')
    } finally {
      setLoading(false)
    }
  }

  const learningLabel = LANG_OPTS.find((l) => l.value === learningLang)?.label ?? ''
  const suggestions = ['Hello! How are you?', 'Tell me a short story', 'Teach me a useful phrase']

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.settingsRow}>
        <PickerButton label="O'rganaman" value={learningLang} onChange={setLearningLang} options={LANG_OPTS} size="sm" />
        <PickerButton label="Tushuntirish" value={interfaceLang} onChange={setInterfaceLang} options={LANG_OPTS} size="sm" />
        <PickerButton label="Daraja" value={level} onChange={setLevel} options={LEVEL_OPTS} size="sm" />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatScroll}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 && (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatEmoji}>💬</Text>
            <Text style={styles.emptyChatTitle}>Suhbatni boshlang</Text>
            <Text style={styles.emptyChatSub}>{learningLabel} tilida yozing — AI xatolaringizni qayd qiladi</Text>
            <View style={styles.suggestions}>
              {suggestions.map((s) => (
                <TouchableOpacity key={s} onPress={() => send(s)} style={styles.suggChip}>
                  <Text style={styles.suggText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} c={c} />
        ))}
        {loading && (
          <View style={styles.aiBubble}>
            <View style={styles.dotsRow}>
              <Dot c={c} delay={0} />
              <Dot c={c} delay={120} />
              <Dot c={c} delay={240} />
            </View>
          </View>
        )}
        {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={`${learningLabel} tilida yozing...`}
          placeholderTextColor={c.textLight}
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          onPress={() => send()}
          disabled={!input.trim() || loading}
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnText}>{loading ? '...' : '➤'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

function MessageBubble({ message, c }: { message: ChatMessage & { correction?: string }; c: ThemeColors }) {
  const styles = useMemo(() => createStyles(c), [c])
  if (message.role === 'user') {
    return (
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{message.content}</Text>
      </View>
    )
  }
  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: '85%', gap: 6 }}>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{message.content}</Text>
      </View>
      {message.correction ? (
        <View style={styles.correction}>
          <Text style={styles.correctionEmoji}>💡</Text>
          <Text style={styles.correctionText}>{message.correction}</Text>
        </View>
      ) : null}
    </View>
  )
}

function Dot({ c, delay }: { c: ThemeColors; delay: number }) {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
        false,
      ),
    )
  }, [delay])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: c.primary, marginRight: 4 },
        animStyle,
      ]}
    />
  )
}

function TranslatorView({ c }: { c: ThemeColors }) {
  const styles = useMemo(() => createStyles(c), [c])
  const [text, setText] = useState('')
  const [from, setFrom] = useState<Lang>('en')
  const [to, setTo] = useState<Lang>('uz')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function translate() {
    if (!text.trim() || loading) return
    setLoading(true); setError(''); setTranslation('')
    try {
      const resp = await aiApi.translate({ text: text.trim(), from, to })
      setTranslation(resp.translation)
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'AI xatolik')
    } finally {
      setLoading(false)
    }
  }

  function swap() {
    setFrom(to); setTo(from)
    setText(translation); setTranslation(text)
  }

  const toLabel = LANG_OPTS.find((l) => l.value === to)?.label ?? ''

  return (
    <ScrollView contentContainerStyle={styles.translatorContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.langPickerRow}>
        <View style={{ flex: 1 }}>
          <PickerButton value={from} onChange={setFrom} options={LANG_OPTS} />
        </View>
        <TouchableOpacity onPress={swap} style={styles.swapBtn} activeOpacity={0.7}>
          <Text style={styles.swapBtnText}>⇄</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PickerButton value={to} onChange={setTo} options={LANG_OPTS} />
        </View>
      </View>

      <View style={styles.translatorInputWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Tarjima qilinadigan matnni yozing..."
          placeholderTextColor={c.textLight}
          style={styles.translatorInput}
          multiline
        />
        {text.length > 0 ? (
          <TouchableOpacity onPress={() => setText('')} style={styles.clearBtn}>
            <Text style={{ color: c.textSecondary, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={translate}
        disabled={!text.trim() || loading}
        style={[styles.translateBtn, (!text.trim() || loading) && styles.sendBtnDisabled]}
        activeOpacity={0.8}
      >
        <Text style={styles.translateBtnText}>{loading ? 'AI tarjima qilmoqda...' : 'TARJIMA QILISH'}</Text>
      </TouchableOpacity>

      {translation ? (
        <View style={styles.translationBox}>
          <View style={styles.translationHeader}>
            <Text style={styles.translationLabel}>{toLabel}</Text>
          </View>
          <Text style={styles.translationText}>{translation}</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
    </ScrollView>
  )
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  tabBar: { flexDirection: 'row', backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border },
  settingsRow: {
    flexDirection: 'row', gap: 8, padding: 12,
    backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border,
  },
  chatScroll: { padding: 16, gap: 12 },
  emptyChat: { alignItems: 'center', paddingVertical: 48 },
  emptyChatEmoji: { fontSize: 56, marginBottom: 12 },
  emptyChatTitle: { fontSize: 20, fontWeight: '800', color: c.text, marginBottom: 6 },
  emptyChatSub: { fontSize: 13, color: c.textSecondary, textAlign: 'center', paddingHorizontal: 24, marginBottom: 16 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', paddingHorizontal: 20 },
  suggChip: {
    backgroundColor: c.surface, borderColor: c.border, borderWidth: 2,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  suggText: { fontSize: 12, color: c.text, fontWeight: '600' },
  userBubble: {
    alignSelf: 'flex-end', backgroundColor: c.primary, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, borderTopRightRadius: 4, maxWidth: '85%',
    shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  userText: { color: c.onPrimary, fontSize: 15, lineHeight: 21 },
  aiBubble: {
    alignSelf: 'flex-start', backgroundColor: c.surface, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, borderTopLeftRadius: 4, maxWidth: '85%',
    borderWidth: 1, borderColor: c.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 1,
  },
  aiText: { color: c.text, fontSize: 15, lineHeight: 21 },
  dotsRow: { flexDirection: 'row', alignItems: 'center' },
  correction: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: c.correctBg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: c.correct + '33',
    marginLeft: 6,
  },
  correctionEmoji: { fontSize: 14 },
  correctionText: { flex: 1, fontSize: 12, color: c.text, fontStyle: 'italic', lineHeight: 17 },
  errorText: { color: c.error, fontSize: 13, padding: 16, textAlign: 'center' },
  inputRow: {
    flexDirection: 'row', padding: 12, gap: 8, alignItems: 'flex-end',
    backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.border,
  },
  input: {
    flex: 1, backgroundColor: c.background, borderRadius: 22, paddingHorizontal: 16,
    paddingVertical: 12, fontSize: 15, color: c.text, maxHeight: 100,
    borderWidth: 2, borderColor: c.border,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: c.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: c.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3,
  },
  sendBtnDisabled: { opacity: 0.4, shadowOpacity: 0 },
  sendBtnText: { color: c.onPrimary, fontSize: 18, fontWeight: '800' },
  translatorContainer: { padding: 20, gap: 14 },
  langPickerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  swapBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: c.surface, borderWidth: 2, borderColor: c.border,
    alignItems: 'center', justifyContent: 'center',
  },
  swapBtnText: { fontSize: 18, color: c.primary, fontWeight: '800' },
  translatorInputWrap: { position: 'relative' },
  translatorInput: {
    backgroundColor: c.surface, borderRadius: 16, padding: 16,
    fontSize: 16, color: c.text, minHeight: 120, borderWidth: 2, borderColor: c.border,
    textAlignVertical: 'top',
  },
  clearBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: c.border, alignItems: 'center', justifyContent: 'center',
  },
  translateBtn: {
    backgroundColor: c.primary, paddingVertical: 16, borderRadius: 16,
    alignItems: 'center',
    shadowColor: c.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  translateBtnText: { color: c.onPrimary, fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  translationBox: {
    backgroundColor: c.correctBg, borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: c.correct + '55',
  },
  translationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  translationLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: c.textSecondary, textTransform: 'uppercase' },
  translationText: { fontSize: 17, color: c.text, lineHeight: 26 },
})
