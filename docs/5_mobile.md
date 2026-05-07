# 📱 LingvaUZ — Mobile App (React Native + Expo)

## Tech Stack

| Texnologiya | Maqsad |
|------------|--------|
| **React Native** | iOS + Android |
| **Expo SDK 51** | Build + native APIs |
| **Expo Router v3** | Navigation |
| **TypeScript** | Type safety |
| **React Query** | Server state |
| **Zustand** | Local state |
| **Reanimated 3** | Smooth animatsiyalar |
| **Expo Notifications** | Push (streak eslatma!) |
| **Expo Audio** | Talaffuz audio |
| **Expo Speech** | STT (gapir va tekshir) |

---

## 📁 Struktura

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar (O'rgan, Mashq, Liga, Profil)
│   │   ├── index.tsx           # Kurs haritasi
│   │   ├── practice.tsx        # So'z takrorlash
│   │   ├── leaderboard.tsx     # Liga
│   │   └── profile.tsx
│   │
│   ├── lesson/
│   │   └── [id].tsx            # Dars oynasi
│   │
│   └── _layout.tsx
│
├── components/
│   ├── lesson/
│   │   ├── ProgressBar.tsx
│   │   ├── LivesBar.tsx
│   │   ├── exercises/
│   │   │   ├── TranslateText.tsx
│   │   │   ├── BuildSentence.tsx
│   │   │   ├── ListenType.tsx
│   │   │   ├── SpeakCheck.tsx
│   │   │   ├── MatchPairs.tsx
│   │   │   └── SelectImage.tsx
│   │   ├── AnswerFooter.tsx
│   │   └── CompleteScreen.tsx
│   │
│   ├── home/
│   │   ├── UnitHeader.tsx
│   │   └── LessonBubble.tsx
│   │
│   └── shared/
│       ├── StreakFlame.tsx
│       ├── GemsCounter.tsx
│       └── Mascot.tsx
│
├── hooks/
│   ├── useLesson.ts
│   └── useNotifications.ts
│
├── store/
│   ├── authStore.ts
│   └── lessonStore.ts
│
└── utils/
    └── audio.ts
```

---

## 💻 Asosiy Kod Namunalar

### `app/(tabs)/_layout.tsx` — Tab Bar
```tsx
import { Tabs } from 'expo-router'
import { Home, Dumbbell, Trophy, User } from 'lucide-react-native'
import { StreakFlame } from '@/components/shared/StreakFlame'
import { LivesBar } from '@/components/lesson/LivesBar'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#58CC02',
        tabBarInactiveTintColor: '#AFAFAF',
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: '#E5E5E5',
          height: 60,
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 12, marginRight: 16 }}>
            <StreakFlame />
            <LivesBar />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "O'rgan",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Mashq',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liga',
          tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}
```

### `app/lesson/[id].tsx` — Dars oynasi
```tsx
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useLesson } from '@/hooks/useLesson'
import { ProgressBar } from '@/components/lesson/ProgressBar'
import { ExerciseRenderer } from '@/components/lesson/ExerciseRenderer'
import { AnswerFooter } from '@/components/lesson/AnswerFooter'
import { CompleteScreen } from '@/components/lesson/CompleteScreen'

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const {
    currentExercise,
    progress,
    lives,
    answer, setAnswer,
    result,
    checkAnswer,
    nextExercise,
    isComplete,
    xpEarned,
  } = useLesson(id)

  if (isComplete) return <CompleteScreen xpEarned={xpEarned} />

  return (
    <View style={styles.container}>
      <ProgressBar value={progress} lives={lives} />

      <Animated.View
        key={currentExercise?.id}
        entering={FadeIn.duration(200)}
        style={styles.exerciseArea}
      >
        <ExerciseRenderer
          exercise={currentExercise}
          answer={answer}
          onAnswerChange={setAnswer}
          result={result}
        />
      </Animated.View>

      <AnswerFooter
        answer={answer}
        result={result}
        correctAnswer={currentExercise?.correctAnswer}
        onCheck={checkAnswer}
        onNext={nextExercise}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  exerciseArea: { flex: 1, padding: 20 },
})
```

### `components/lesson/exercises/BuildSentence.tsx`
```tsx
import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'

interface Props {
  question: string
  wordBank: string[]
  onAnswerChange: (a: string) => void
  result: 'correct' | 'wrong' | null
}

export function BuildSentence({ question, wordBank, onAnswerChange, result }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [remaining, setRemaining] = useState(wordBank)

  const addWord = (word: string, index: number) => {
    const next = [...selected, word]
    setSelected(next)
    setRemaining(r => r.filter((_, i) => i !== index))
    onAnswerChange(next.join(' '))
  }

  const removeWord = (word: string, index: number) => {
    const next = selected.filter((_, i) => i !== index)
    setSelected(next)
    setRemaining(r => [...r, word])
    onAnswerChange(next.join(' '))
  }

  const areaStyle = result === 'correct'
    ? styles.areaCorrect
    : result === 'wrong'
    ? styles.areaWrong
    : styles.areaNormal

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jumlani tuzing</Text>
      <Text style={styles.question}>{question}</Text>

      {/* Tanlangan so'zlar */}
      <View style={[styles.selectedArea, areaStyle]}>
        {selected.map((word, i) => (
          <Animated.View key={`${word}-${i}`} entering={ZoomIn} exiting={ZoomOut}>
            <TouchableOpacity
              onPress={() => removeWord(word, i)}
              style={styles.selectedWord}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* So'z banki */}
      <View style={styles.wordBank}>
        {remaining.map((word, i) => (
          <TouchableOpacity
            key={`${word}-${i}`}
            onPress={() => addWord(word, i)}
            style={styles.bankWord}
            activeOpacity={0.7}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 16, color: '#777', fontWeight: '600' },
  question: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  selectedArea: {
    minHeight: 64, borderWidth: 2, borderRadius: 12,
    padding: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  areaNormal: { borderColor: '#DDD', backgroundColor: '#F9F9F9' },
  areaCorrect: { borderColor: '#58CC02', backgroundColor: '#F0FFF0' },
  areaWrong: { borderColor: '#FF4B4B', backgroundColor: '#FFF0F0' },
  selectedWord: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#fff', borderWidth: 2,
    borderColor: '#84D8FF', borderRadius: 8,
  },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  bankWord: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderWidth: 2,
    borderColor: '#DDD', borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2,
    elevation: 2,
  },
  wordText: { fontSize: 15, fontWeight: '600', color: '#4B4B4B' },
})
```

### `hooks/useNotifications.ts` — Streak eslatmasi
```typescript
import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'

export function useStreakNotifications() {
  useEffect(() => {
    setupNotifications()
  }, [])

  async function setupNotifications() {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return

    // Har kuni 20:00 da eslatma
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Streakingiz uzilmoqchi!",
        body: "Bugun hali o'rganmadingiz. 5 daqiqa etarli!",
        sound: true,
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    })
  }
}
```

### `components/shared/StreakFlame.tsx`
```tsx
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function StreakFlame() {
  const { data } = useQuery({
    queryKey: ['streak'],
    queryFn: () => api.get('/streak').then(r => r.data.streak),
    staleTime: 60_000,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{data ?? 0}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  flame: { fontSize: 20 },
  count: { fontSize: 16, fontWeight: 'bold', color: '#FF9600' },
})
```

---

## 🚀 Ishga Tushirish

```bash
npm install
npx expo start

# iOS simulator
npx expo run:ios

# Android emulator
npx expo run:android

# EAS Build (production)
eas build --platform all
```

```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📦 Muhim Paketlar

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-notifications": "~0.28.0",
    "expo-audio": "~0.2.0",
    "expo-speech": "~12.0.0",
    "react-native-reanimated": "~3.10.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "lucide-react-native": "^0.400.0"
  }
}
```
