import { useState, useMemo } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useColors } from '@/hooks/useColors'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { ThemeColors } from '@/constants/themes'

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  inner: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24,
  },
  mascot: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: c.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: c.textSecondary, marginBottom: 32 },
  input: {
    width: '100%', height: 52, borderWidth: 2,
    borderColor: c.border, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: c.text,
    backgroundColor: c.surface, marginBottom: 12,
  },
  passwordWrap: {
    width: '100%', height: 52, borderWidth: 2,
    borderColor: c.border, borderRadius: 12,
    backgroundColor: c.surface, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  passwordInput: {
    flex: 1, height: '100%', paddingHorizontal: 16,
    fontSize: 16, color: c.text,
  },
  eyeBtn: { paddingHorizontal: 14, height: '100%', justifyContent: 'center' },
  btn: {
    width: '100%', height: 52, backgroundColor: c.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
    shadowColor: c.primaryDark, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 4, elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: c.onPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  registerLink: { marginTop: 24, padding: 8 },
  registerText: { fontSize: 14, color: c.textSecondary },
  registerBold: { color: c.primary, fontWeight: '700' },
})

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useAuthStore()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Xatolik', 'Email va parolni kiriting')
      return
    }
    try {
      setLoading(true)
      const { data } = await api.post('/auth/login', { email: email.trim(), password })
      setToken(data.token)
      setUser(data.user)
    } catch (err: any) {
      Alert.alert('Kirish muvaffaqiyatsiz', err.response?.data?.error ?? err.response?.data?.message ?? 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.mascot}>🍉</Text>
        <Text style={styles.title}>LingvaUZ ga xush kelibsiz!</Text>
        <Text style={styles.subtitle}>Til o'rganishni davom eting</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={c.textLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Parol"
            placeholderTextColor={c.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            {showPassword
              ? <EyeOff size={20} color={c.textSecondary} />
              : <Eye size={20} color={c.textSecondary} />
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color={c.onPrimary} />
            : <Text style={styles.btnText}>KIRISH</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.registerLink}>
            <Text style={styles.registerText}>
              Hisobingiz yo'qmi? <Text style={styles.registerBold}>Ro'yxatdan o'ting</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  )
}
