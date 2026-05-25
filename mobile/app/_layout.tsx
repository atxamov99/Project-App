import React, { useEffect, useState, type ReactNode } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack, useRouter, useSegments, useGlobalSearchParams } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'
import { useStreakNotifications } from '@/hooks/useNotifications'

SplashScreen.preventAutoHideAsync().catch(() => {})

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error('[RootErrorBoundary]', error)
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🍉</Text>
          <Text style={styles.errorTitle}>Nimadir noto'g'ri ketdi</Text>
          <Text style={styles.errorMsg}>{this.state.error.message}</Text>
          <Text style={styles.errorHint}>Ilovani qayta ishga tushiring</Text>
        </View>
      )
    }
    return this.props.children
  }
}

function AuthGuard() {
  const token = useAuthStore((s) => s.token)
  const interfaceLanguage = useAuthStore((s) => s.interfaceLanguage)
  const targetLanguage = useAuthStore((s) => s.targetLanguage)
  const router = useRouter()
  const segments = useSegments()
  const params = useGlobalSearchParams<{ mode?: string }>()
  const mode = params.mode

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'
    const onLangSelect =
      segments[1] === 'select-interface-language' ||
      segments[1] === 'select-learning-language'
    const isChangeMode = mode === 'change'
    const languagesSet = !!interfaceLanguage && !!targetLanguage

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (token && !languagesSet && !onLangSelect) {
      router.replace('/(auth)/select-interface-language')
    } else if (token && languagesSet && inAuthGroup && !isChangeMode) {
      router.replace('/(tabs)')
    }
  }, [token, interfaceLanguage, targetLanguage, segments, mode])

  return null
}

function RootHooks() {
  useStreakNotifications()
  return null
}

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Wait one tick so zustand-persist finishes rehydrating from storage,
    // then hide the splash screen.
    const t = setTimeout(() => {
      setHydrated(true)
      SplashScreen.hideAsync().catch(() => {})
    }, 0)
    return () => clearTimeout(t)
  }, [])

  if (!hydrated) return null

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AuthGuard />
            <RootHooks />
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="lesson/[id]"
                options={{ headerShown: false, animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="user/[username]"
                options={{ headerShown: false, animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="ai"
                options={{ animation: 'slide_from_right' }}
              />
            </Stack>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, gap: 8, backgroundColor: '#FBF2E2',
  },
  errorEmoji: { fontSize: 64, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: '800', color: '#E63946' },
  errorMsg: { fontSize: 14, color: '#5C5C5C', textAlign: 'center' },
  errorHint: { fontSize: 12, color: '#9A9A9A', marginTop: 8 },
})
