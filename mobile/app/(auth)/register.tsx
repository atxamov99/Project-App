import { useState, useMemo } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
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
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  mascot: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: c.text, marginBottom: 24 },
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
  loginLink: { marginTop: 24, padding: 8 },
  loginText: { fontSize: 14, color: c.textSecondary },
  loginBold: { color: c.primary, fontWeight: '700' },
})

export default function RegisterScreen() {
  const [form, setForm] = useState({
    email: '', username: '', displayName: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useAuthStore()
  const c = useColors()
  const styles = useMemo(() => createStyles(c), [c])

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleRegister = async () => {
    if (!form.email || !form.username || !form.displayName || !form.password) {
      Alert.alert('Xatolik', "Barcha maydonlarni to'ldiring")
      return
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Xatolik', 'Parollar mos kelmadi')
      return
    }
    try {
      setLoading(true)
      const { data } = await api.post('/auth/register', {
        email: form.email.trim(),
        username: form.username.trim(),
        displayName: form.displayName.trim(),
        password: form.password,
      })
      setToken(data.token)
      setUser(data.user)
    } catch (err: any) {
      Alert.alert("Ro'yxatdan o'tish xatosi", err.response?.data?.error ?? err.response?.data?.message ?? 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.mascot}>🍉</Text>
        <Text style={styles.title}>Hisob yarating</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={c.textLight}
          value={form.email}
          onChangeText={update('email')}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Foydalanuvchi nomi"
          placeholderTextColor={c.textLight}
          value={form.username}
          onChangeText={update('username')}
          autoCapitalize="none"
          autoComplete="username"
        />

        <TextInput
          style={styles.input}
          placeholder="Ism (ko'rinadigan)"
          placeholderTextColor={c.textLight}
          value={form.displayName}
          onChangeText={update('displayName')}
          autoComplete="name"
        />

        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Parol"
            placeholderTextColor={c.textLight}
            value={form.password}
            onChangeText={update('password')}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
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

        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Parolni takrorlang"
            placeholderTextColor={c.textLight}
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            secureTextEntry={!showConfirm}
            autoComplete="password-new"
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowConfirm((v) => !v)}
            activeOpacity={0.7}
          >
            {showConfirm
              ? <EyeOff size={20} color={c.textSecondary} />
              : <Eye size={20} color={c.textSecondary} />
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color={c.onPrimary} />
            : <Text style={styles.btnText}>RO'YXATDAN O'TISH</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.loginLink}>
            <Text style={styles.loginText}>
              Hisobingiz bormi? <Text style={styles.loginBold}>Kiring</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
