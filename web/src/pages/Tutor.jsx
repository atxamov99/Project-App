import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/shared/Icon'
import Dropdown from '../components/shared/Dropdown'
import { api } from '../lib/api'

const LANG_OPTIONS = [
  { value: 'en', label: 'English',  icon: '🇬🇧', hint: 'EN' },
  { value: 'ru', label: 'Русский',  icon: '🇷🇺', hint: 'RU' },
  { value: 'uz', label: "O'zbek",   icon: '🇺🇿', hint: 'UZ' },
]

const LEVEL_OPTIONS = [
  { value: 'beginner',     label: "Boshlang'ich", icon: '🌱', hint: 'A1' },
  { value: 'intermediate', label: "O'rta",         icon: '🌿', hint: 'B1' },
  { value: 'advanced',     label: 'Yuqori',         icon: '🌳', hint: 'C1' },
]

export default function Tutor() {
  const navigate = useNavigate()
  const [learningLang, setLearningLang] = useState('en')
  const [interfaceLang, setInterfaceLang] = useState('uz')
  const [level, setLevel] = useState('beginner')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const userMsg = input.trim()
    if (!userMsg || loading) return
    setInput('')
    setError('')
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const resp = await api.ai.chat({
        userMessage: userMsg,
        history: history.slice(-10),
        learningLang,
        interfaceLang,
        level,
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: resp.reply, correction: resp.correction }])
      inputRef.current?.focus()
    } catch (e) {
      setError(e.message || 'AI xatolik')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([])
    setError('')
  }

  const learningLabel = LANG_OPTIONS.find((l) => l.value === learningLang)?.label

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-primary-fixed/20">
      <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 h-[calc(100dvh-1rem)]">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-2xl shrink-0 loft-shadow">
              ✨
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-on-surface truncate">AI Tutor</h1>
              <p className="text-xs text-on-surface-variant truncate">
                Suhbatlashing — AI siz bilan {learningLabel} tilida gaplashadi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={reset}
                className="p-2.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
                title="Suhbatni tozalash"
              >
                <Icon name="restart_alt" />
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              title="Yopish"
            >
              <Icon name="close" />
            </button>
          </div>
        </header>

        {/* Sozlamalar paneli */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 loft-shadow">
          <Dropdown
            label="O'rganaman"
            value={learningLang}
            onChange={setLearningLang}
            options={LANG_OPTIONS}
          />
          <Dropdown
            label="Tushuntirish tili"
            value={interfaceLang}
            onChange={setInterfaceLang}
            options={LANG_OPTIONS}
          />
          <Dropdown
            label="Darajam"
            value={level}
            onChange={setLevel}
            options={LEVEL_OPTIONS}
          />
        </div>

        {/* Chat */}
        <div className="grow overflow-y-auto bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 flex flex-col gap-3">
          {messages.length === 0 && <EmptyState lang={learningLabel} onPick={(s) => setInput(s)} />}
          {messages.map((m, i) => (
            <Message key={i} message={m} />
          ))}
          {loading && (
            <div className="self-start flex items-center gap-2 bg-surface-container-high text-on-surface-variant px-4 py-3 rounded-2xl rounded-tl-md max-w-[80%]">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">AI o'ylamoqda</span>
            </div>
          )}
          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm border-2 border-error/20">
              ⚠️ {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-2 flex items-center gap-2 loft-shadow">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`${learningLabel} tilida yozing...`}
            disabled={loading}
            className="grow bg-transparent px-3 py-2.5 text-base text-tertiary outline-none disabled:opacity-60"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-secondary text-on-secondary flex items-center justify-center terracotta-lift disabled:opacity-40 disabled:shadow-none transition-transform active:scale-95"
            aria-label="Yuborish"
          >
            <Icon name="send" filled style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ lang, onPick }) {
  const suggestions = [
    "Hello! How are you today?",
    "Tell me a short story.",
    "What's the weather like?",
    "Can you teach me a useful phrase?",
  ]
  return (
    <div className="grow flex flex-col items-center justify-center text-center py-8">
      <div className="text-6xl mb-4">💬</div>
      <h2 className="text-xl font-extrabold text-on-surface mb-1">Suhbatni boshlang</h2>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">
        Quyidagi maydonga {lang} tilida yozing. AI sizning xatolaringizni qayd qiladi va tushuntiradi.
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="bg-surface-container-low border-2 border-outline-variant rounded-full px-4 py-2 text-xs font-semibold text-tertiary hover:border-secondary hover:bg-secondary-container/40 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function Message({ message }) {
  if (message.role === 'user') {
    return (
      <div className="self-end bg-secondary text-on-secondary px-4 py-3 rounded-2xl rounded-tr-md max-w-[80%] loft-shadow">
        <p className="text-[15px] leading-relaxed">{message.content}</p>
      </div>
    )
  }
  return (
    <div className="self-start max-w-[85%] space-y-2">
      <div className="bg-white text-tertiary px-4 py-3 rounded-2xl rounded-tl-md border-2 border-outline-variant loft-shadow">
        <p className="text-[15px] leading-relaxed">{message.content}</p>
      </div>
      {message.correction && (
        <div className="ml-3 bg-tertiary-container/70 text-on-tertiary-container px-3 py-2 rounded-xl rounded-tl-sm text-xs flex items-start gap-2 border border-tertiary/20">
          <span className="text-base leading-none">💡</span>
          <span className="leading-relaxed">{message.correction}</span>
        </div>
      )}
    </div>
  )
}
