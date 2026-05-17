import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'

function AuthGuard() {
  const { token, interfaceLanguage, targetLanguage } = useAuthStore()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'
    const onLangSelect =
      segments[1] === 'select-interface-language' ||
      segments[1] === 'select-learning-language'
    const languagesSet = !!interfaceLanguage && !!targetLanguage

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (token && !languagesSet && !onLangSelect) {
      router.replace('/(auth)/select-interface-language')
    } else if (token && languagesSet && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [token, interfaceLanguage, targetLanguage, segments])

  return null
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
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
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
