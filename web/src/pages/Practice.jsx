import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetPracticeSessionQuery, useCheckExerciseMutation } from '../store/apiSlice'
import Icon from '../components/shared/Icon'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Practice() {
  const [started, setStarted] = useState(false)

  if (!started) return <PracticeIntro onStart={() => setStarted(true)} />
  return <PracticeSession onExit={() => setStarted(false)} />
}

function PracticeIntro({ onStart }) {
  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-2xl bg-primary-fixed flex items-center justify-center mb-5">
        <Icon name="fitness_center" filled className="text-secondary" style={{ fontSize: 48 }} />
      </div>
      <h1 className="text-3xl font-extrabold text-on-surface mb-2">Mashq qilish</h1>
      <p className="text-on-surface-variant max-w-sm mb-8">
        Avval o'rganganlaringizni takrorlang. 10 ta tasodifiy mashq, hayot sarflanmaydi.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8">
        <FeatureCard icon="psychology" title="Eslab qolish" desc="Eski darslardan mashqlar" />
        <FeatureCard icon="favorite_border" title="Xavfsiz" desc="Hayot kamaymaydi" />
        <FeatureCard icon="bolt" title="+XP yo'q" desc="Bu sof takrorlash" />
        <FeatureCard icon="schedule" title="Tez" desc="~5 daqiqa" />
      </div>

      <button
        onClick={onStart}
        className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-widest terracotta-lift"
      >
        Boshlash
      </button>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 text-left">
      <Icon name={icon} filled className="text-secondary mb-2" style={{ fontSize: 24 }} />
      <p className="font-bold text-on-surface text-sm">{title}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
    </div>
  )
}

function PracticeSession({ onExit }) {
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetPracticeSessionQuery(10)
  const [checkExercise] = useCheckExerciseMutation()

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [busy, setBusy] = useState(false)
  const [finished, setFinished] = useState(false)

  const exercises = data?.exercises ?? []
  const exercise = exercises[index]
  const total = exercises.length
  const progress = total ? (index + (result ? 1 : 0)) / total : 0

  useEffect(() => { setAnswer(''); setResult(null) }, [exercise?.id])

  async function check() {
    if (!answer.trim() || busy || result) return
    setBusy(true)
    try {
      const res = await checkExercise({ id: exercise.id, answer: answer.trim() }).unwrap()
      setResult(res)
      if (res.isCorrect) setCorrect((c) => c + 1)
      else setWrong((w) => w + 1)
    } finally {
      setBusy(false)
    }
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1)
    } else {
      setFinished(true)
    }
  }

  if (isLoading) return <div className="min-h-[60vh] grid place-items-center text-on-surface-variant">Mashq tayyorlanmoqda…</div>

  if (error) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center max-w-md">
          {error.data?.error || 'Mashqlarni yuklashda xatolik'}
          <button onClick={() => navigate('/learn')} className="block mt-3 mx-auto bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
            Darslarga qaytish
          </button>
        </div>
      </div>
    )
  }

  if (finished) return <ResultsScreen correct={correct} wrong={wrong} total={total} onContinue={onExit} />

  if (!exercise) return null

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-surface-container-low px-4 sm:px-6 py-4 flex items-center gap-4 border-b border-outline-variant">
        <button onClick={onExit} className="p-2 rounded-full hover:bg-surface-container-high" aria-label="Yopish">
          <Icon name="close" className="text-on-surface-variant" />
        </button>
        <div className="grow bg-surface-container-highest h-3 rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="text-xs font-bold tabular-nums text-on-surface-variant">
          {index + 1}/{total}
        </div>
      </header>

      <main className="grow pb-32 w-full mx-auto px-4 sm:px-6 max-w-[800px] pt-8">
        <ExerciseView exercise={exercise} answer={answer} setAnswer={setAnswer} result={result} />
      </main>

      <ActionBar
        result={result}
        canCheck={!!answer.trim() && !busy}
        busy={busy}
        onCheck={check}
        onNext={next}
        isLast={index + 1 === total}
      />
    </div>
  )
}

function ExerciseView({ exercise, answer, setAnswer, result }) {
  const type = exercise.type
  const options = useMemo(() => shuffle(exercise.wrongAnswers ?? []), [exercise.id])

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold text-on-surface-variant mb-6">
        {type === 'TRANSLATE_TEXT' && 'Tarjima qiling'}
        {type === 'BUILD_SENTENCE' && 'Jumlani tuzing'}
        {type === 'MULTIPLE_CHOICE' && "To'g'ri javobni tanlang"}
        {type === 'FILL_IN_BLANK' && "Bo'shliqni to'ldiring"}
        {type === 'LISTEN_AND_TYPE' && 'Tinglang va yozing'}
      </h1>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-3xl">
          🍉
        </div>
        <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-outline-variant grow">
          <p className="text-lg md:text-xl font-semibold text-tertiary">{exercise.question}</p>
        </div>
      </div>

      <input
        type="text"
        autoFocus
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={!!result}
        placeholder="Javobingizni yozing..."
        className="w-full bg-white border-2 border-outline-variant rounded-2xl px-5 py-4 text-lg text-tertiary outline-none focus:border-secondary disabled:opacity-60"
      />

      {options.length > 0 && type === 'MULTIPLE_CHOICE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              disabled={!!result}
              className={`px-5 py-3 rounded-xl text-base font-medium border-2 paper-lift text-left ${
                answer === opt ? 'bg-secondary-container border-secondary text-on-secondary-container' : 'bg-white border-outline-variant text-tertiary'
              } disabled:opacity-60`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className={`mt-6 p-5 rounded-2xl flex items-start gap-3 border-2 ${
          result.isCorrect
            ? 'bg-secondary-fixed border-secondary text-on-secondary-fixed'
            : 'bg-error-container border-error/30 text-on-error-container'
        }`}>
          <Icon name={result.isCorrect ? 'check_circle' : 'cancel'} filled className={result.isCorrect ? 'text-secondary' : 'text-error'} style={{ fontSize: 28 }} />
          <div>
            <p className="font-bold">{result.isCorrect ? 'Ajoyib!' : "Noto'g'ri"}</p>
            {!result.isCorrect && result.correctAnswer && (
              <p className="text-sm mt-1">To'g'ri javob: <b>{result.correctAnswer}</b></p>
            )}
            {result.explanation && <p className="text-xs italic mt-1 opacity-90">{result.explanation}</p>}
          </div>
        </div>
      )}
    </>
  )
}

function ActionBar({ result, canCheck, busy, onCheck, onNext, isLast }) {
  return (
    <footer className={`fixed bottom-0 left-0 w-full z-50 border-t px-4 sm:px-6 py-5 ${
      result?.isCorrect ? 'bg-secondary-fixed border-secondary/30'
      : result && !result.isCorrect ? 'bg-error-container border-error/30'
      : 'bg-surface-bright border-outline-variant/30'
    } md:ml-64 lg:ml-72`}>
      <div className="max-w-[800px] mx-auto flex justify-end items-center gap-4">
        {!result && (
          <button
            disabled={!canCheck}
            onClick={onCheck}
            className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-base terracotta-lift active:scale-95 disabled:opacity-50 disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:shadow-none"
          >
            {busy ? '…' : 'Tekshir'}
          </button>
        )}
        {result && (
          <button
            onClick={onNext}
            className={`px-10 py-4 rounded-2xl font-bold text-base text-white ${result.isCorrect ? 'bg-secondary terracotta-lift' : 'bg-error'}`}
            style={result.isCorrect ? undefined : { boxShadow: '0 4px 0 0 #93000a' }}
          >
            {isLast ? 'Yakunlash' : 'Davom'}
          </button>
        )}
      </div>
    </footer>
  )
}

function ResultsScreen({ correct, wrong, total, onContinue }) {
  const accuracy = total ? Math.round((correct / total) * 100) : 0
  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
      <div className="text-8xl mb-4 animate-bounce">🍉</div>
      <h1 className="text-3xl font-extrabold text-on-surface mb-2">Mashq tugadi</h1>
      <p className="text-on-surface-variant mb-8">Yaxshi ish! Yana mashq qilishni xohlaysizmi?</p>

      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <Stat label="To'g'ri" value={correct} color="text-secondary" />
        <Stat label="Xato"    value={wrong}   color="text-error" />
        <Stat label="Aniqlik" value={`${accuracy}%`} color="text-secondary" />
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-xs bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-widest terracotta-lift"
      >
        Yana boshlash
      </button>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 loft-shadow">
      <p className={`text-3xl font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
    </div>
  )
}
