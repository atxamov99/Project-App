# 🌐 LingvaUZ — Web Frontend

## Tech Stack

| Texnologiya | Maqsad |
|------------|--------|
| **Vite 8** | Build tool + dev server |
| **React 19** | UI framework |
| **React Router 7** | Client-side routing |
| **TypeScript** *(keyinroq)* | Type safety |
| **Tailwind CSS** *(keyinroq)* | Styling |
| **Framer Motion** | Animatsiyalar (Duolingo kabi) |
| **TanStack Query** | Server state |
| **Zustand** | Local state (streak, lives) |
| **Howler.js** | Audio (talaffuz) |
| **Axios** | HTTP klient |

> **Eslatma:** boshlang'ich versiya **Vite + React (JSX)** ustida quriladi. TypeScript va Tailwind keyinroq qo'shiladi. Hujjatlardagi misollar JSX da yozilgan.

---

## 📁 Struktura

```
web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Router + layout
│   ├── index.css               # Global styles
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Landing
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Learn.jsx           # Kurs haritasi
│   │   ├── Lesson.jsx          # Dars oynasi (asosiy!)
│   │   ├── Practice.jsx        # So'z takrorlash
│   │   ├── Leaderboard.jsx     # Liga
│   │   ├── Profile.jsx
│   │   └── Shop.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx      # 🔥 streak | ❤️ lives | 💎 gems | XP
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── lesson/
│   │   │   ├── LessonHeader.jsx
│   │   │   ├── ExerciseWrapper.jsx
│   │   │   ├── exercises/
│   │   │   │   ├── TranslateText.jsx
│   │   │   │   ├── BuildSentence.jsx
│   │   │   │   ├── ListenAndType.jsx
│   │   │   │   ├── MatchPairs.jsx
│   │   │   │   ├── SelectImage.jsx
│   │   │   │   └── FillInBlank.jsx
│   │   │   ├── AnswerBar.jsx
│   │   │   ├── ResultFeedback.jsx
│   │   │   └── LessonComplete.jsx
│   │   │
│   │   ├── course-map/
│   │   │   ├── UnitSection.jsx
│   │   │   ├── LessonNode.jsx
│   │   │   └── ProgressPath.jsx
│   │   │
│   │   ├── shared/
│   │   │   ├── StreakBadge.jsx
│   │   │   ├── LivesDisplay.jsx
│   │   │   ├── XPBar.jsx
│   │   │   └── MascotReaction.jsx
│   │   │
│   │   └── league/
│   │       ├── LeagueTable.jsx
│   │       └── LeaguePromotion.jsx
│   │
│   ├── hooks/
│   │   ├── useLesson.js
│   │   ├── useStreak.js
│   │   └── useLives.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   └── lessonStore.js
│   │
│   ├── lib/
│   │   └── api.js              # Axios instance
│   │
│   └── styles/
│       └── *.css
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 🧭 Routing — `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Learn from './pages/Learn'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Header from './components/layout/Header'
import ProtectedRoute from './components/layout/ProtectedRoute'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Header />}>
              <Route path="/learn" element={<Learn />} />
              <Route path="/lesson/:lessonId" element={<Lesson />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

---

## 💻 Asosiy Komponentlar

### `src/pages/Lesson.jsx`
```jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLesson } from '../hooks/useLesson'
import LessonHeader from '../components/lesson/LessonHeader'
import ExerciseWrapper from '../components/lesson/ExerciseWrapper'
import AnswerBar from '../components/lesson/AnswerBar'
import LessonComplete from '../components/lesson/LessonComplete'

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const {
    currentExercise, progress, lives,
    checkAnswer, nextExercise,
    isComplete, xpEarned,
  } = useLesson(lessonId)

  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)

  const handleCheck = async () => {
    const res = await checkAnswer(currentExercise.id, answer)
    setResult(res.isCorrect ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setResult(null)
    setAnswer('')
    nextExercise()
  }

  if (isComplete) return <LessonComplete xpEarned={xpEarned} />

  return (
    <div className="lesson-page">
      <LessonHeader
        progress={progress}
        lives={lives}
        onClose={() => navigate('/learn')}
      />

      <div className="lesson-area">
        <ExerciseWrapper
          exercise={currentExercise}
          answer={answer}
          onAnswerChange={setAnswer}
          result={result}
        />
      </div>

      <AnswerBar
        answer={answer}
        result={result}
        correctAnswer={currentExercise.correctAnswer}
        onCheck={handleCheck}
        onNext={handleNext}
      />
    </div>
  )
}
```

### `src/components/lesson/exercises/BuildSentence.jsx`
```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BuildSentence({ question, wordBank, onAnswerChange, result }) {
  const [selected, setSelected] = useState([])
  const [remaining, setRemaining] = useState(wordBank)

  const addWord = (word, index) => {
    const next = [...selected, word]
    setSelected(next)
    setRemaining(remaining.filter((_, i) => i !== index))
    onAnswerChange(next.join(' '))
  }

  const removeWord = (word, index) => {
    const next = selected.filter((_, i) => i !== index)
    setSelected(next)
    setRemaining([...remaining, word])
    onAnswerChange(next.join(' '))
  }

  const stateClass =
    result === 'correct' ? 'is-correct' :
    result === 'wrong'   ? 'is-wrong'   : ''

  return (
    <div className="build-sentence">
      <h2>Jumlani tuzing</h2>
      <p className="prompt">{question}</p>

      <div className={`selected-area ${stateClass}`}>
        <AnimatePresence>
          {selected.map((word, i) => (
            <motion.button
              key={`${word}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => removeWord(word, i)}
              className="chip selected"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="word-bank">
        {remaining.map((word, i) => (
          <motion.button
            key={`${word}-${i}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWord(word, i)}
            className="chip"
          >
            {word}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

### `src/components/lesson/AnswerBar.jsx`
```jsx
import { motion } from 'framer-motion'

export default function AnswerBar({ answer, result, correctAnswer, onCheck, onNext }) {
  if (result === 'correct') {
    return (
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="answer-bar correct"
      >
        <div className="msg">
          <p className="title">Ajoyib! 🎉</p>
          <p className="sub">To'g'ri javob!</p>
        </div>
        <button onClick={onNext} className="btn-next">DAVOM</button>
      </motion.div>
    )
  }

  if (result === 'wrong') {
    return (
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="answer-bar wrong"
      >
        <div className="msg">
          <p className="title">Noto'g'ri 😢</p>
          <p className="sub">To'g'ri javob: <b>{correctAnswer}</b></p>
        </div>
        <button onClick={onNext} className="btn-next">DAVOM</button>
      </motion.div>
    )
  }

  return (
    <div className="answer-bar idle">
      <button disabled={!answer} onClick={onCheck} className="btn-check">
        TEKSHIR
      </button>
    </div>
  )
}
```

### `src/components/course-map/LessonNode.jsx`
```jsx
import { Link } from 'react-router-dom'
import { Lock, Star, CheckCircle } from 'lucide-react'

const STATUS_CLASS = {
  locked:    'node locked',
  available: 'node available',
  completed: 'node completed',
  current:   'node current',
}

export default function LessonNode({ lessonId, status, type }) {
  const isClickable = status !== 'locked'

  const Icon = {
    locked:    <Lock size={24} />,
    available: <Star size={24} />,
    completed: <CheckCircle size={24} />,
    current:   <Star size={24} />,
  }[status]

  const content = type === 'CHECKPOINT' ? <span className="trophy">🏆</span> : Icon

  return isClickable ? (
    <Link to={`/lesson/${lessonId}`} className={STATUS_CLASS[status]}>
      {content}
    </Link>
  ) : (
    <div className={STATUS_CLASS[status]} aria-disabled>{content}</div>
  )
}
```

### `src/components/lesson/LessonComplete.jsx`
```jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LessonComplete({ xpEarned, streak }) {
  const navigate = useNavigate()

  return (
    <div className="lesson-complete">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mascot"
      >
        🍉
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        Zo'r! Dars tugadi!
      </motion.h1>

      <div className="stats">
        <div className="stat xp">
          <p className="value">+{xpEarned}</p>
          <p className="label">XP</p>
        </div>
        <div className="stat streak">
          <p className="value">{streak}🔥</p>
          <p className="label">Streak</p>
        </div>
      </div>

      <button onClick={() => navigate('/learn')} className="btn-continue">
        DAVOM ETISH
      </button>
    </div>
  )
}
```

### `src/lib/api.js`
```js
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### `src/hooks/useLesson.js`
```js
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export function useLesson(lessonId) {
  const [exercises, setExercises] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [lives, setLives] = useState(5)

  useEffect(() => {
    api.get(`/lessons/${lessonId}`).then(r => setExercises(r.data.exercises))
  }, [lessonId])

  const currentExercise = exercises[currentIndex]
  const progress = exercises.length ? (currentIndex / exercises.length) * 100 : 0

  async function checkAnswer(exerciseId, answer) {
    const r = await api.post(`/exercises/${exerciseId}/check`, { answer })
    if (!r.data.isCorrect) setMistakes(m => m + 1)
    return r.data
  }

  async function nextExercise() {
    if (currentIndex + 1 >= exercises.length) {
      const r = await api.post(`/lessons/${lessonId}/complete`, { mistakes, timeTaken: 0 })
      setXpEarned(r.data.xpEarned)
      setIsComplete(true)
      return
    }
    setCurrentIndex(i => i + 1)
  }

  return {
    exercises, currentIndex, currentExercise, progress, lives,
    checkAnswer, nextExercise, isComplete, xpEarned,
  }
}
```

---

## 🚀 Ishga Tushirish

```bash
cd web
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # build natijasini ko'rish
```

```env
# web/.env
VITE_API_URL=http://localhost:3001/api
```

---

## 📦 Qo'shilishi kerak paketlar

```bash
npm install react-router-dom @tanstack/react-query axios zustand framer-motion lucide-react
```

> Tailwind keyin qo'shilsa: `npm install -D tailwindcss @tailwindcss/vite` va `vite.config.js` ga plugin qo'shiladi.
