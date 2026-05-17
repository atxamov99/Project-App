import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export function useStreakNotifications() {
  useEffect(() => {
    setupDailyReminder()
  }, [])
}

async function setupDailyReminder() {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return

  await Notifications.cancelAllScheduledNotificationsAsync()

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Streakingiz uzilmoqchi!',
      body: "Bugun hali o'rganmadingiz. 5 daqiqa etarli!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  })
}
