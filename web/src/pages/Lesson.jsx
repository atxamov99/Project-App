import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetLessonQuery, useGetLivesQuery, useCheckExerciseMutation, useCompleteLessonMutation } from '../store/apiSlice'
import Icon from '../components/shared/Icon'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Lesson() {
  const navigate = useNavigate()
  const { lessonId } = useParams()

  const { data: lessonData, isLoading: loading, error: lessonError } = useGetLessonQuery(lessonId)
  const { data: livesData } = useGetLivesQuery()
  const [checkExercise] = useCheckExerciseMutation()
  const [completeLesson] = useCompleteLessonMutation()

  const lesson = lessonData?.lesson ?? null

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [hearts, setHearts] = useState(5)
  const [mistakes, setMistakes] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [completed, setCompleted] = useState(false)
  const [completionData, setCompletionData] = useState(null)

  useEffect(() => {
    if (livesData?.current !== undefined) setHearts(livesData.current)
  }, [livesData?.current])

  useEffect(() => {
    if (lessonError?.status === 401) navigate('/login')
    else if (lessonError) setError(lessonError.data?.error || 'Darsni yuklashda xatolik')
  }, [lessonError, navigate])

  const exercise = lesson?.exercises?.[index]
  const total = lesson?.exercises?.length ?? 0
  const progress = total ? (index + (result ? 1 : 0)) / total : 0

  useEffect(() => { setAnswer(''); setResult(null) }, [exercise?.id])

  async function check() {
    if (!answer.trim() || busy || result) return
    setBusy(true)
    try {
      const res = await checkExercise({ id: exercise.id, answer: answer.trim() }).unwrap()
      setResult(res)
      if (!res.isCorrect) {
        setMistakes((m) => m + 1)
        if (res.livesAfter !== null && res.livesAfter !== undefined) {
          setHearts(res.livesAfter)
        }
      }
    } catch (e) {
      setError(e.data?.error || e.message)
    } finally {
      setBusy(false)
    }
  }

  async function next() {
    if (index + 1 < total) {
      setIndex(index + 1)
      return
    }
    setBusy(true)
    try {
      const timeTaken = Math.floor((Date.now() - startedAt) / 1000)
      const data = await completeLesson({ id: lessonId, body: { mistakes, timeTaken } }).unwrap()
      setCompletionData(data)
      setCompleted(true)
    } catch (e) {
      setError(e.data?.error || e.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="min-h-dvh grid place-items-center text-on-surface-variant">Dars yuklanmoqda…</div>

  if (error) {
    return (
      <div className="min-h-dvh grid place-items-center px-4">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center max-w-md">
          {error}
          <button onClick={() => navigate('/learn')} className="block mt-3 mx-auto bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
            Kurslarga qaytish
          </button>
        </div>
      </div>
    )
  }

  if (completed) return <CompletionScreen data={completionData} onContinue={() => navigate('/learn')} />

  if (!exercise) return <div className="min-h-dvh grid place-items-center text-on-surface-variant">Mashq yo'q</div>

  if (hearts <= 0 && !result) {
    return (
      <div className="min-h-dvh grid place-items-center px-4">
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-8 max-w-md text-center loft-shadow">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-extrabold text-on-surface mb-2">Hayot tugadi</h2>
          <p className="text-on-surface-variant mb-5">Har 30 daqiqada 1 hayot qaytariladi yoki gem bilan to'liq tiklang.</p>
          <button onClick={() => navigate('/learn')} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest">
            Kurslarga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-low px-4 sm:px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors"
          aria-label="Yopish"
        >
          <Icon name="close" className="text-on-surface-variant" />
        </button>
        <div className="grow bg-surface-container-highest h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full relative transition-all"
            style={{ width: `${progress * 100}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full">
          <Icon name="favorite" filled className={hearts > 0 ? 'text-secondary' : 'text-error'} style={{ fontSize: 18 }} />
          <span className="text-xs font-bold text-secondary tabular-nums">{hearts}</span>
        </div>
      </header>

      <main className="grow pt-24 pb-32 w-full mx-auto px-4 sm:px-6 max-w-[800px] lg:max-w-[1100px] flex flex-col">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
          <div className="flex flex-col">
            <ExerciseRenderer
              exercise={exercise}
              answer={answer}
              setAnswer={setAnswer}
              result={result}
            />
          </div>

          <aside className="hidden lg:block space-y-4 self-start sticky top-28">
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-5 loft-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="lightbulb" filled className="text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tarvuz maslahati</span>
              </div>
              <p className="text-sm text-tertiary leading-relaxed">
                {result?.explanation
                  ? <span className="italic">{result.explanation}</span>
                  : "Mashqni diqqat bilan tahlil qiling — har xato yangi imkoniyat 🍉"}
              </p>
            </div>

            <div className="bg-primary-fixed border-2 border-primary-fixed-dim/60 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant mb-2">Progress</p>
              <p className="text-2xl font-extrabold text-on-primary-fixed tabular-nums">
                {index + 1} <span className="text-on-primary-fixed-variant">/ {total}</span>
              </p>
              <p className="text-xs text-on-primary-fixed-variant mt-1">
                {mistakes > 0 ? `${mistakes} ta xato` : "Hech qanday xato yo'q!"}
              </p>
            </div>
          </aside>
        </div>
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

/* ─── Exercise Renderer ──────────────────── */

function ExerciseRenderer({ exercise, answer, setAnswer, result }) {
  const type = exercise.type

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold text-on-surface-variant mb-6 md:mb-8">
        {type === 'TRANSLATE_TEXT' && 'Tarjima qiling'}
        {type === 'BUILD_SENTENCE' && 'Jumlani tuzing'}
        {type === 'MULTIPLE_CHOICE' && "To'g'ri javobni tanlang"}
        {type === 'FILL_IN_BLANK' && "Bo'shliqni to'ldiring"}
        {type === 'LISTEN_AND_TYPE' && 'Tinglang va yozing'}
        {type === 'SELECT_IMAGE' && "To'g'ri rasmni tanlang"}
        {type === 'MATCH_PAIRS' && 'Juftlashtirib chiqing'}
      </h1>

      <div className="flex items-start gap-4 mb-10 md:mb-12">
        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center text-3xl md:text-4xl">
          🍉
        </div>
        <div className="relative bg-white p-5 md:p-6 rounded-2xl rounded-tl-none border border-outline-variant loft-shadow flex items-center gap-3 grow">
          {(exercise.questionAudio || type === 'LISTEN_AND_TYPE') && (
            <button
              className="text-secondary hover:scale-110 transition-transform shrink-0"
              aria-label="Audio"
              onClick={() => exercise.questionAudio && new Audio(exercise.questionAudio).play().catch(() => {})}
            >
              <Icon name="volume_up" style={{ fontSize: 24 }} />
            </button>
          )}
          <p className="text-xl md:text-2xl font-semibold text-tertiary">{exercise.question}</p>
        </div>
      </div>

      {(type === 'TRANSLATE_TEXT' || type === 'LISTEN_AND_TYPE' || type === 'FILL_IN_BLANK') && (
        <TextInput value={answer} onChange={setAnswer} disabled={!!result} />
      )}
      {type === 'BUILD_SENTENCE' && (
        <BuildSentence exercise={exercise} answer={answer} setAnswer={setAnswer} disabled={!!result} />
      )}
      {type === 'MULTIPLE_CHOICE' && (
        <MultipleChoice exercise={exercise} selected={answer} setSelected={setAnswer} disabled={!!result} />
      )}
      {(type === 'SELECT_IMAGE' || type === 'MATCH_PAIRS') && (
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant text-sm">
          Bu mashq turi hali qo'llab-quvvatlanmaydi.
        </div>
      )}

      {result && (
        <div className={`mt-8 p-5 rounded-2xl flex items-start gap-3 border-2 ${
          result.isCorrect
            ? 'bg-secondary-fixed border-secondary text-on-secondary-fixed'
            : 'bg-error-container border-error/30 text-on-error-container'
        }`}>
          <Icon
            name={result.isCorrect ? 'check_circle' : 'cancel'}
            filled
            className={result.isCorrect ? 'text-secondary' : 'text-error'}
            style={{ fontSize: 28 }}
          />
          <div className="grow">
            <p className="font-bold">{result.isCorrect ? 'Ajoyib!' : "Noto'g'ri"}</p>
            {!result.isCorrect && result.correctAnswer && (
              <p className="text-sm mt-1">To'g'ri javob: <b>{result.correctAnswer}</b></p>
            )}
            {result.explanation && (
              <p className="text-xs italic mt-1 opacity-90 lg:hidden">{result.explanation}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function TextInput({ value, onChange, disabled }) {
  return (
    <input
      type="text"
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Javobingizni shu yerga yozing..."
      className="w-full bg-white border-2 border-outline-variant rounded-2xl px-5 py-4 text-lg text-tertiary outline-none focus:border-secondary disabled:opacity-60"
    />
  )
}

function BuildSentence({ exercise, answer, setAnswer, disabled }) {
  const initialBank = useMemo(() => shuffle(exercise.wrongAnswers ?? []), [exercise.id])
  const [chosen, setChosen] = useState([])
  const [available, setAvailable] = useState(initialBank)

  useEffect(() => {
    setChosen([])
    setAvailable(initialBank)
    setAnswer('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function pick(word, idx) {
    if (disabled) return
    const next = [...chosen, word]
    setChosen(next)
    setAvailable(available.filter((_, i) => i !== idx))
    setAnswer(next.join(' '))
  }

  function unpick(idx) {
    if (disabled) return
    const word = chosen[idx]
    const nextChosen = chosen.filter((_, i) => i !== idx)
    setChosen(nextChosen)
    setAvailable([...available, word])
    setAnswer(nextChosen.join(' '))
  }

  return (
    <>
      <div className="min-h-[140px] md:min-h-[160px] w-full border-b-2 border-dashed border-outline-variant flex flex-wrap content-start gap-3 py-4 mb-6">
        {chosen.map((word, i) => (
          <button
            key={`${word}-c-${i}`}
            onClick={() => unpick(i)}
            disabled={disabled}
            className="bg-white border-2 border-outline-variant px-5 py-3 rounded-xl text-base font-medium text-tertiary paper-lift disabled:opacity-60"
          >
            {word}
          </button>
        ))}
        {chosen.length === 0 && (
          <p className="text-sm text-on-surface-variant self-center w-full text-center">
            Pastdan so'zlarni tanlang yoki javobni qo'lda yozing
          </p>
        )}
      </div>

      {available.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {available.map((word, i) => (
            <button
              key={`${word}-b-${i}`}
              onClick={() => pick(word, i)}
              disabled={disabled}
              className="bg-white border-2 border-outline-variant px-5 py-3 rounded-xl text-base font-medium text-tertiary paper-lift disabled:opacity-60"
            >
              {word}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder="Javobingizni yozing..."
          className="w-full bg-white border-2 border-outline-variant rounded-2xl px-5 py-4 text-lg text-tertiary outline-none focus:border-secondary disabled:opacity-60"
        />
      )}
    </>
  )
}

function MultipleChoice({ exercise, selected, setSelected, disabled }) {
  const options = useMemo(() => shuffle(exercise.wrongAnswers ?? []), [exercise.id])

  return (
    <div className="space-y-3">
      <input
        type="text"
        autoFocus
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        disabled={disabled}
        placeholder="Javobingiz..."
        className="w-full bg-white border-2 border-outline-variant rounded-2xl px-5 py-4 text-lg text-tertiary outline-none focus:border-secondary disabled:opacity-60"
      />
      {options.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center mt-4">
            yoki variantdan tanlang
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                disabled={disabled}
                className={`px-5 py-3 rounded-xl text-base font-medium border-2 paper-lift transition-colors text-left ${
                  selected === opt
                    ? 'bg-secondary-container border-secondary text-on-secondary-container'
                    : 'bg-white border-outline-variant text-tertiary'
                } disabled:opacity-60`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ActionBar({ result, canCheck, busy, onCheck, onNext, isLast }) {
  return (
    <footer className={`fixed bottom-0 left-0 w-full z-50 border-t px-4 sm:px-6 py-5 ${
      result?.isCorrect ? 'bg-secondary-fixed border-secondary/30'
      : result && !result.isCorrect ? 'bg-error-container border-error/30'
      : 'bg-surface-bright border-outline-variant/30'
    }`}>
      <div className="max-w-[800px] lg:max-w-[1100px] mx-auto flex justify-between items-center gap-4">
        {!result && (
          <>
            <button
              onClick={() => onNext()}
              disabled={busy}
              className="px-6 py-3 text-outline hover:text-tertiary transition-colors uppercase tracking-widest font-bold text-sm disabled:opacity-50"
            >
              O'tkazib yuborish
            </button>
            <button
              disabled={!canCheck}
              onClick={onCheck}
              className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-base terracotta-lift transition-all active:scale-95 disabled:opacity-50 disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:shadow-none"
            >
              {busy ? '…' : 'Tekshir'}
            </button>
          </>
        )}

        {result?.isCorrect && (
          <>
            <div className="hidden sm:flex items-center gap-3 text-on-secondary-fixed">
              <Icon name="check_circle" filled className="text-secondary" style={{ fontSize: 32 }} />
              <div>
                <p className="font-bold text-lg">Ajoyib!</p>
                <p className="text-sm opacity-80">To'g'ri javob</p>
              </div>
            </div>
            <button
              onClick={onNext}
              disabled={busy}
              className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-base terracotta-lift sm:ml-auto"
            >
              {isLast ? 'Yakunlash' : 'Davom'}
            </button>
          </>
        )}

        {result && !result.isCorrect && (
          <>
            <div className="hidden sm:flex items-center gap-3 text-on-error-container">
              <Icon name="cancel" filled className="text-error" style={{ fontSize: 32 }} />
              <div>
                <p className="font-bold text-lg">Noto'g'ri</p>
                <p className="text-sm opacity-80">Davom etamiz</p>
              </div>
            </div>
            <button
              onClick={onNext}
              disabled={busy}
              className="bg-error text-white px-10 py-4 rounded-2xl font-bold text-base sm:ml-auto"
              style={{ boxShadow: '0 4px 0 0 #93000a' }}
            >
              {isLast ? 'Yakunlash' : 'Davom'}
            </button>
          </>
        )}
      </div>
    </footer>
  )
}

/* ─── Completion screen ─────────────────────── */

function CompletionScreen({ data, onContinue }) {
  if (!data) return null
  return (
    <div className="min-h-dvh grid place-items-center px-4 bg-gradient-to-b from-surface to-primary-fixed/40">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4 animate-bounce">🍉</div>
        <h1 className="text-4xl font-extrabold text-on-surface mb-2">Zo'r! Dars tugadi</h1>
        <p className="text-on-surface-variant mb-8">Yangi yutuqlar tomon yana bir qadam.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Stat icon="bolt" label="XP" value={`+${data.xpEarned}`} accent="text-secondary" />
          <Stat icon="local_fire_department" label="Streak" value={`${data.streak}🔥`} accent="text-orange-500" />
        </div>

        {data.achievements?.length > 0 && (
          <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-5 mb-6 text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-2">🏆 Yangi yutuq!</p>
            {data.achievements.map((a) => (
              <div key={a.key} className="flex items-center gap-3">
                <span className="font-bold">{a.title}</span>
                <span className="text-xs ml-auto">+{a.gemReward} 💎 +{a.xpReward} ⭐</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-widest terracotta-lift"
        >
          Davom etish
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, accent }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-5 loft-shadow">
      <Icon name={icon} filled className={accent} style={{ fontSize: 32 }} />
      <p className="text-3xl font-extrabold text-on-surface mt-1 tabular-nums">{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
    </div>
  )
}
