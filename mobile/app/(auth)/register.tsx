import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '@/constants/colors'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function RegisterScreen() {
  const [form, setForm] = useState({
    email: '', username: '', displayName: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useAuthStore()

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleRegister = async () => {
    if (!form.email || !form.username || !form.displayName || !form.password) {
      Alert.alert('Xatolik', 'Barcha maydonlarni to\'ldiring')
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
      setToken(data.accessToken)
      setUser(data.user)
    } catch (err: any) {
      Alert.alert('Ro\'yxatdan o\'tish xatosi', err.response?.data?.message ?? 'Xatolik yuz berdi')
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

        {([
          ['Email', 'email', 'email-address', false],
          ['Foydalanuvchi nomi', 'username', 'default', false],
          ['Ism (ko\'rinadigan)', 'displayName', 'default', false],
          ['Parol', 'password', 'default', true],
          ['Parolni takrorlang', 'confirmPassword', 'default', true],
        ] as const).map(([placeholder, key, kbType, secure]) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.textLight}
            value={form[key]}
            onChangeText={update(key)}
            autoCapitalize="none"
            keyboardType={kbType as any}
            secureTextEntry={secure}
          />
        ))}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  mascot: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 24 },
  input: {
    width: '100%', height: 52, borderWidth: 2,
    borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: Colors.text,
    backgroundColor: Colors.surface, marginBottom: 12,
  },
  btn: {
    width: '100%', height: 52, backgroundColor: Colors.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primaryDark, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 4, elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  loginLink: { marginTop: 24, padding: 8 },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginBold: { color: Colors.primary, fontWeight: '700' },
})
