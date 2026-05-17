import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '@/constants/colors'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useAuthStore()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Xatolik', 'Email va parolni kiriting')
      return
    }
    try {
      setLoading(true)
      const { data } = await api.post('/auth/login', { email: email.trim(), password })
      setToken(data.accessToken)
      setUser(data.user)
    } catch (err: any) {
      Alert.alert('Kirish muvaffaqiyatsiz', err.response?.data?.message ?? 'Xatolik yuz berdi')
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
          placeholderTextColor={Colors.textLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Parol"
          placeholderTextColor={Colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24,
  },
  mascot: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 32 },
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
  registerLink: { marginTop: 24, padding: 8 },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerBold: { color: Colors.primary, fontWeight: '700' },
})
