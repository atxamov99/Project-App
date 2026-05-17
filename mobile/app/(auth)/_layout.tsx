import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="select-interface-language"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="select-learning-language"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  )
}
