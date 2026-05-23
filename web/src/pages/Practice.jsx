import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetPracticeSessionQuery,
  useCheckExerciseMutation,
  useAiTranslateMutation,
  useGetFlashcardsQuery,
  useReviewWordMutation,
  useBrowseWordsQuery,
} from '../store/apiSlice'
import Icon from '../components/shared/Icon'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MODES = [
  { id: 'menu', label: '' },
  { id: 'exercises', label: 'Mashqlar', icon: 'fitness_center', desc: 'Yakunlangan darslardan mashqlar', color: 'bg-primary-fixed' },
  { id: 'flashcards', label: "So'z kartochkalar", icon: 'style', desc: "Flashcard bilan so'z yodlash", color: 'bg-secondary-container' },
  { id: 'dictionary', label: "Lug'at", icon: 'menu_book', desc: "So'zlar ro'yxati va tarjima", color: 'bg-primary-container' },
]

export default function Practice() {
  const [mode, setMode] = useState('menu')

  if (mode === 'menu') return <ModeMenu onSelect={setMode} />
  if (mode === 'exercises') return <ExerciseSession onExit={() => setMode('menu')} />
  if (mode === 'flashcards') return <FlashcardSession onExit={() => setMode('menu')} />
  if (mode === 'dictionary') return <DictionaryPage onExit={() => setMode('menu')} />
  return null
}

/* ─── Menu ────────────────────────── */
function ModeMenu({ onSelect }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary-fixed inline-flex items-center justify-center mb-4">
          <Icon name="fitness_center" filled className="text-secondary" style={{ fontSize: 40 }} />
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-2">Mashq qiling</h1>
        <p className="text-on-surface-variant">Bilimingizni mustahkamlash uchun rejim tanlang</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {MODES.slice(1).map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="bg-surface-container-lowest border-2 border-outline-variant hover:border-secondary rounded-2xl p-6 text-left loft-shadow transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-xl ${m.color} inline-flex items-center justify-center mb-3`}>
              <Icon name={m.icon} filled className="text-secondary" style={{ fontSize: 28 }} />
            </div>
            <h3 className="text-lg font-extrabold text-on-surface mb-1">{m.label}</h3>
            <p className="text-sm text-on-surface-variant">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Header (shared) ────────────────────── */
function ModeHeader({ title, onExit }) {
  return (
    <header className="sticky top-0 z-40 bg-surface-container-low border-b border-outline-variant px-4 sm:px-6 py-3 flex items-center gap-3">
      <button onClick={onExit} className="p-2 rounded-full hover:bg-surface-container-high cursor-pointer" aria-label="Yopish">
        <Icon name="close" className="text-on-surface-variant" />
      </button>
      <h2 className="font-bold text-on-surface">{title}</h2>
    </header>
  )
}

/* ─── Exercise mode ────────────────── */
function ExerciseSession({ onExit }) {
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
    if (index + 1 < total) setIndex(index + 1)
    else setFinished(true)
  }

  if (isLoading) return <Center>Mashq tayyorlanmoqda…</Center>

  if (error) {
    return (
      <Center>
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center max-w-md">
          {error.data?.error || 'Mashqlarni yuklashda xatolik'}
          <button onClick={() => navigate('/learn')} className="block mt-3 mx-auto bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold cursor-pointer">
            Darslarga qaytish
          </button>
        </div>
      </Center>
    )
  }

  if (finished) return <ResultsScreen correct={correct} wrong={wrong} total={total} onContinue={onExit} />
  if (!exercise) return null

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-surface-container-low px-4 sm:px-6 py-4 flex items-center gap-4 border-b border-outline-variant">
        <button onClick={onExit} className="p-2 rounded-full hover:bg-surface-container-high cursor-pointer" aria-label="Yopish">
          <Icon name="close" className="text-on-surface-variant" />
        </button>
        <div className="grow bg-surface-container-highest h-3 rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="text-xs font-bold tabular-nums text-on-surface-variant">{index + 1}/{total}</div>
      </header>

      <main className="grow pb-32 w-full mx-auto px-4 sm:px-6 max-w-3xl pt-8">
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
              className={`px-5 py-3 rounded-xl text-base font-medium border-2 paper-lift text-left cursor-pointer ${
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
          result.isCorrect ? 'bg-secondary-fixed border-secondary text-on-secondary-fixed' : 'bg-error-container border-error/30 text-on-error-container'
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
      <div className="max-w-3xl mx-auto flex justify-end items-center gap-4">
        {!result && (
          <button
            disabled={!canCheck}
            onClick={onCheck}
            className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-base terracotta-lift active:scale-95 disabled:opacity-50 disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:shadow-none cursor-pointer"
          >
            {busy ? '…' : 'Tekshir'}
          </button>
        )}
        {result && (
          <button
            onClick={onNext}
            className={`px-10 py-4 rounded-2xl font-bold text-base text-white cursor-pointer ${result.isCorrect ? 'bg-secondary terracotta-lift' : 'bg-error'}`}
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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
      <div className="text-8xl mb-4 animate-bounce">🍉</div>
      <h1 className="text-3xl font-extrabold text-on-surface mb-2">Mashq tugadi</h1>
      <p className="text-on-surface-variant mb-8">Yaxshi ish! Yana mashq qilishni xohlaysizmi?</p>

      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        <Stat label="To'g'ri" value={correct} color="text-secondary" />
        <Stat label="Xato" value={wrong} color="text-error" />
        <Stat label="Aniqlik" value={`${accuracy}%`} color="text-secondary" />
      </div>

      <button onClick={onContinue} className="w-full bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-widest terracotta-lift cursor-pointer">
        Menyuga qaytish
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

/* ─── Flashcard mode ──────────────── */
function FlashcardSession({ onExit }) {
  const { data, isLoading, error, refetch } = useGetFlashcardsQuery({ limit: 10 })
  const [reviewWord] = useReviewWordMutation()

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)
  const [finished, setFinished] = useState(false)

  const cards = data?.cards ?? []
  const card = cards[index]
  const total = cards.length

  useEffect(() => { setFlipped(false) }, [card?.id])

  async function mark(correct) {
    if (!card) return
    try { await reviewWord({ id: card.id, correct }).unwrap() } catch { /* noop */ }
    if (correct) setKnown((k) => k + 1)
    else setUnknown((u) => u + 1)

    if (index + 1 < total) setIndex(index + 1)
    else setFinished(true)
  }

  if (isLoading) return <PageWith header={<ModeHeader title="So'z kartochkalar" onExit={onExit} />}><Center>Yuklanmoqda…</Center></PageWith>

  if (error || total === 0) {
    return (
      <PageWith header={<ModeHeader title="So'z kartochkalar" onExit={onExit} />}>
        <div className="px-4 py-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-on-surface-variant">
            {error?.data?.error || "Hozircha so'zlar yo'q. Admin paneldan qo'shilsin."}
          </p>
        </div>
      </PageWith>
    )
  }

  if (finished) {
    return (
      <PageWith header={<ModeHeader title="So'z kartochkalar" onExit={onExit} />}>
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold mb-6">Tugadi!</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Stat label="Bildim" value={known} color="text-secondary" />
            <Stat label="Bilmadim" value={unknown} color="text-error" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setIndex(0); setKnown(0); setUnknown(0); setFinished(false); refetch() }}
              className="grow bg-secondary text-white px-6 py-3 rounded-xl font-bold cursor-pointer"
            >
              Yana
            </button>
            <button onClick={onExit} className="grow bg-white border-2 border-outline-variant text-tertiary px-6 py-3 rounded-xl font-bold cursor-pointer">
              Menyu
            </button>
          </div>
        </div>
      </PageWith>
    )
  }

  if (!card) return null

  return (
    <PageWith header={<ModeHeader title={`So'z kartochkalar  ${index + 1}/${total}`} onExit={onExit} />}>
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="bg-surface-container-highest h-2 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        {/* Card */}
        <button
          onClick={() => setFlipped(!flipped)}
          className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-3xl px-6 py-16 mb-6 loft-shadow hover:border-secondary transition-colors cursor-pointer"
          style={{ minHeight: 280 }}
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
              {card.isNew ? '✨ Yangi so\'z' : `Bog'liq: ${card.category}`}
            </p>
            <p className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 break-words">
              {flipped ? card.translation : card.text}
            </p>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-6">
              {flipped ? '↑ Tarjima' : "Tap qiling — tarjimani ko'rish"}
            </p>
          </div>
        </button>

        {flipped ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => mark(false)}
              className="bg-error text-white px-6 py-4 rounded-2xl font-bold text-base cursor-pointer"
              style={{ boxShadow: '0 4px 0 0 #93000a' }}
            >
              😔 Bilmadim
            </button>
            <button
              onClick={() => mark(true)}
              className="bg-secondary text-white px-6 py-4 rounded-2xl font-bold text-base terracotta-lift cursor-pointer"
            >
              😊 Bildim
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-on-surface-variant">
            Avval kartani aylantirib ko'ring
          </p>
        )}

        {data?.stats && (
          <div className="mt-8 grid grid-cols-2 gap-3 text-center">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
              <p className="text-2xl font-extrabold text-secondary tabular-nums">{data.stats.totalLearned}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Yodlangan</p>
            </div>
            <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
              <p className="text-2xl font-extrabold text-orange-500 tabular-nums">{data.stats.totalDue}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Takror kerak</p>
            </div>
          </div>
        )}
      </div>
    </PageWith>
  )
}

/* ─── Dictionary mode ─────────────── */
function DictionaryPage({ onExit }) {
  const [tab, setTab] = useState('search') // 'search' | 'browse'
  return (
    <PageWith header={<ModeHeader title="Lug'at" onExit={onExit} />}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <TabBtn active={tab === 'search'} onClick={() => setTab('search')}>Qidiruv</TabBtn>
          <TabBtn active={tab === 'browse'} onClick={() => setTab('browse')}>So'zlar ro'yxati</TabBtn>
        </div>
        {tab === 'search' && <DictSearch />}
        {tab === 'browse' && <DictBrowse />}
      </div>
    </PageWith>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
        active ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      {children}
    </button>
  )
}

const LANG_OPTS = [
  { code: 'auto', label: 'Aniqlash', flag: '🌐' },
  { code: 'uz',   label: "O'zbek",   flag: '🇺🇿' },
  { code: 'en',   label: 'English',  flag: '🇬🇧' },
  { code: 'ru',   label: 'Русский',  flag: '🇷🇺' },
]

const TARGET_OPTS = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

function DictSearch() {
  const [q, setQ] = useState('')
  const [from, setFrom] = useState('auto')
  const [to, setTo] = useState('uz')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [aiTranslate] = useAiTranslateMutation()
  const debounceRef = useState(null)

  useEffect(() => {
    if (debounceRef[0]) clearTimeout(debounceRef[0])
    const text = q.trim()
    if (!text) { setResult(null); setError(''); return }
    debounceRef[0] = setTimeout(async () => {
      setLoading(true); setError('')
      try {
        const data = await aiTranslate({ text, from, to }).unwrap()
        setResult(data)
      } catch (e) {
        setError(e?.data?.error || 'Tarjima xatoligi')
        setResult(null)
      } finally {
        setLoading(false)
      }
    }, 700)
    return () => clearTimeout(debounceRef[0])
  }, [q, from, to])

  function swap() {
    const newFrom = to === 'uz' ? 'uz' : to === 'en' ? 'en' : 'ru'
    const newTo = from === 'auto' ? 'en' : from
    setFrom(newFrom)
    setTo(newTo)
    if (result?.translation) setQ(result.translation)
    setResult(null)
  }

  function copy() {
    if (!result?.translation) return
    navigator.clipboard.writeText(result.translation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const detectedLabel = result?.detectedLang
    ? (LANG_OPTS.find((l) => l.code === result.detectedLang) ?? { flag: '🌐', label: result.detectedLang.toUpperCase() })
    : null
  const fromDisplay = from === 'auto' && detectedLabel
    ? { flag: detectedLabel.flag, label: `${detectedLabel.label} (aniqlandi)` }
    : (LANG_OPTS.find((l) => l.code === from) ?? LANG_OPTS[0])
  const toDisplay = TARGET_OPTS.find((l) => l.code === to) ?? TARGET_OPTS[0]

  return (
    <div className="space-y-3">
      {/* Language bar */}
      <div className="flex items-center bg-surface-container-lowest border-2 border-outline-variant rounded-2xl overflow-hidden">
        <div className="flex flex-1">
          {LANG_OPTS.map((l) => (
            <button
              key={l.code}
              onClick={() => setFrom(l.code)}
              className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors cursor-pointer text-center whitespace-nowrap ${
                from === l.code
                  ? 'text-secondary border-b-2 border-secondary bg-surface-container/40'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {l.flag} <span className="hidden sm:inline">{l.label}</span><span className="sm:hidden">{l.code === 'auto' ? 'Auto' : l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <button
          onClick={swap}
          className="mx-2 p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer shrink-0"
          aria-label="Almashtirish"
          title="Tillarni almashtirish"
        >
          <Icon name="swap_horiz" className="text-secondary" />
        </button>

        <div className="flex flex-1 justify-end">
          {TARGET_OPTS.map((l) => (
            <button
              key={l.code}
              onClick={() => setTo(l.code)}
              className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors cursor-pointer text-center whitespace-nowrap ${
                to === l.code
                  ? 'text-secondary border-b-2 border-secondary bg-surface-container/40'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {l.flag} <span className="hidden sm:inline">{l.label}</span><span className="sm:hidden">{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid md:grid-cols-2 border-2 border-outline-variant rounded-2xl overflow-hidden bg-surface-container-lowest">
        {/* Source panel */}
        <div className="relative border-b md:border-b-0 md:border-r border-outline-variant">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {fromDisplay.flag} {fromDisplay.label}
            </span>
            {q && (
              <button onClick={() => { setQ(''); setResult(null) }} className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer rounded-full hover:bg-surface-container" aria-label="Tozalash">
                <Icon name="close" style={{ fontSize: 16 }} />
              </button>
            )}
          </div>
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 2000))}
            placeholder="Matn kiriting..."
            autoFocus
            rows={5}
            className="w-full px-4 py-2 text-lg text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-variant/40"
          />
          <div className="px-4 pb-3 flex justify-end">
            <span className="text-xs text-on-surface-variant/50">{q.length}/2000</span>
          </div>
        </div>

        {/* Target panel */}
        <div className="relative bg-surface-container/20 min-h-[180px]">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              {toDisplay.flag} {toDisplay.label}
            </span>
            {result?.translation && (
              <button onClick={copy} className="text-on-surface-variant hover:text-secondary p-1 cursor-pointer transition-colors rounded-full hover:bg-surface-container" aria-label="Nusxalash">
                <Icon name={copied ? 'check' : 'content_copy'} style={{ fontSize: 16 }} className={copied ? 'text-secondary' : ''} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="px-4 py-5 flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-on-surface-variant ml-2">AI tarjima qilmoqda...</span>
            </div>
          ) : result?.translation ? (
            <div className="px-4 py-2">
              <p className="text-xl font-bold text-secondary leading-relaxed break-words select-text">{result.translation}</p>
            </div>
          ) : q && !error ? (
            <div className="px-4 py-6 text-on-surface-variant/40 text-sm italic">Tarjima bu yerda paydo bo'ladi...</div>
          ) : !q ? (
            <div className="px-4 py-6 text-on-surface-variant/40 text-sm">Chap tomonga matn kiriting</div>
          ) : null}

          {error && (
            <div className="px-4 py-3 text-sm text-error flex items-center gap-2">
              <Icon name="error_outline" style={{ fontSize: 16 }} />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Alternatives */}
      {result?.alternatives?.length > 0 && (
        <div className="mt-4 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Boshqa variantlar</p>
          <div className="flex flex-wrap gap-2">
            {result.alternatives.map((alt, i) => (
              <button
                key={i}
                onClick={() => setQ(alt)}
                className="text-sm text-on-surface bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-full px-3 py-1.5 transition-colors cursor-pointer"
              >
                {alt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


function DictBrowse() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [page, setPage] = useState(1)
  const params = { page, limit: 30 }
  if (search) params.search = search
  if (level) params.level = level

  const { data, isFetching } = useBrowseWordsQuery(params)
  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Qidirish..."
          className="bg-white border-2 border-outline-variant rounded-xl px-4 py-2 outline-none focus:border-secondary"
        />
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1) }}
          className="bg-white border-2 border-outline-variant rounded-xl px-3 py-2 cursor-pointer"
        >
          <option value="">Barchasi</option>
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {isFetching && <p className="text-center text-sm text-on-surface-variant py-4">Yuklanmoqda…</p>}

      {!isFetching && items.length === 0 && (
        <p className="text-center text-on-surface-variant py-12">Hech narsa topilmadi</p>
      )}

      <div className="space-y-2">
        {items.map((w) => (
          <div key={w.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-3 hover:border-secondary/40 transition-colors">
            <span className="text-2xl shrink-0">{w.language?.flag}</span>
            <div className="grow min-w-0">
              <p className="font-bold text-on-surface truncate">{w.text}</p>
              <p className="text-sm text-on-surface-variant truncate">{w.translation}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-2 py-1 rounded shrink-0">{w.level}</span>
          </div>
        ))}
      </div>

      {total > 30 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border-2 border-outline-variant rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            ← Oldingi
          </button>
          <span className="text-sm text-on-surface-variant">{page} / {Math.ceil(total / 30)}</span>
          <button
            disabled={page * 30 >= total}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border-2 border-outline-variant rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            Keyingi →
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Layout helpers ──────────────── */
function Center({ children }) {
  return <div className="min-h-[60vh] grid place-items-center text-on-surface-variant px-4">{children}</div>
}

function PageWith({ header, children }) {
  return (
    <div className="min-h-dvh">
      {header}
      {children}
    </div>
  )
}
