import { useEffect } from 'react'
import { Platform } from 'react-native'
import Constants from 'expo-constants'

// In Expo Go (SDK 53+) push notifications and scheduled notifications are
// unsupported on Android, and importing `expo-notifications` at module scope
// throws because of its side-effect auto-registration code. Keep this hook
// totally inert in Expo Go and lazy-require the module only in dev builds.
const IS_EXPO_GO = Constants.appOwnership === 'expo'

export function useStreakNotifications() {
  useEffect(() => {
    if (IS_EXPO_GO) return
    setupDailyReminder().catch(() => {
      // best-effort scheduling — ignore failures
    })
  }, [])
}

async function setupDailyReminder() {
  // Lazy require so expo-notifications' module side-effects never run in Expo Go.
  const Notifications =
    require('expo-notifications') as typeof import('expo-notifications')

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })

  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('streak', {
      name: 'Streak reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  await Notifications.cancelAllScheduledNotificationsAsync()

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-streak-reminder',
    content: {
      title: '🔥 Streakingiz uzilmoqchi!',
      body: "Bugun hali o'rganmadingiz. 5 daqiqa etarli!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
      channelId: Platform.OS === 'android' ? 'streak' : undefined,
    },
  })
}
