import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { api } from '../lib/api'
import Icon from '../components/shared/Icon'

const LESSON_ICONS = ['chat_bubble', 'face', 'looks_one', 'family_restroom', 'palette', 'restaurant', 'directions_walk', 'translate']
const OFFSETS = [16, -24, 32, -8, 24, -16]

export default function Learn() {
  const navigate = useNavigate()
  const { user } = useOutletContext() ?? {}

  const [courses, setCourses] = useState([])
  const [course, setCourse] = useState(null)
  const [completed, setCompleted] = useState([])
  const [currentLessonId, setCurrentLessonId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.courses.list()
      .then((d) => {
        setCourses(d.courses)
        if (d.courses.length === 0) {
          setError("Hozircha kurs yo'q. Admin panelidan kurs yaratish kerak.")
          setLoading(false)
          return
        }
        // Default: birinchi kursni ochamiz
        return api.courses.get(d.courses[0].id).then((data) => {
          setCourse(data.course)
          setCompleted(data.completed || [])
          setCurrentLessonId(data.currentLessonId)
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-on-surface-variant">Yuklanmoqda…</div>
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-md mx-auto">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center">{error}</div>
      </div>
    )
  }

  if (!course) return null

  const unit = course.units?.[0]  // hozircha birinchi unitni ko'rsatamiz
  const lessons = unit?.lessons ?? []
  const totalCount = lessons.length
  const completedCount = lessons.filter((l) => completed.includes(l.id)).length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="px-4 sm:px-6 py-8 md:py-10 lg:py-12 mx-auto max-w-md md:max-w-5xl lg:max-w-6xl">
      <div className="md:hidden mb-6">
        <p className="text-sm text-on-surface-variant">Salom,</p>
        <h1 className="text-2xl font-extrabold text-on-surface">{user?.displayName ?? "O'rganuvchi"} 👋</h1>
      </div>

      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 lg:gap-10">
        <div className="max-w-[600px] mx-auto md:mx-0 w-full">
          {/* Unit header */}
          <div className="bg-primary-container text-on-primary-container rounded-3xl p-6 md:p-7 loft-shadow mb-10 md:mb-14 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 select-none rotate-12">{unit?.icon ?? '📚'}</div>
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                  {course.fromLanguage.flag} → {course.toLanguage.flag} {course.toLanguage.name}
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold">{unit?.title ?? 'No unit'}</h2>
                {unit?.description && <p className="text-base opacity-90 mt-2">{unit.description}</p>}
              </div>
              <button className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-xl shrink-0" aria-label="Guide">
                <Icon name="menu_book" />
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4 relative">
              <div className="grow bg-white/20 h-3 rounded-full overflow-hidden">
                <div className="bg-secondary-container h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest tabular-nums">{progressPct}%</span>
            </div>
          </div>

          {/* Lesson path */}
          <div className="relative flex flex-col items-center gap-12 pb-12">
            <div className="absolute top-0 bottom-0 w-1.5 path-line left-1/2 -translate-x-1/2 z-0 opacity-40" />

            <div className="absolute -left-24 top-40 hidden xl:block select-none">
              <div className="text-7xl drop-shadow-[0_8px_12px_rgba(160,63,46,0.25)]">🍉</div>
              <div className="bg-white border-2 border-outline-variant rounded-2xl rounded-bl-none px-3 py-2 mt-2 max-w-[160px]">
                <p className="text-xs text-tertiary italic">
                  {currentLessonId ? "Keyingi darsni boshlang!" : "Hammasi tugagan!"}
                </p>
              </div>
            </div>

            {lessons.length === 0 && (
              <p className="text-on-surface-variant text-center py-8">Bu unitda hali dars yo'q.</p>
            )}

            {lessons.map((lesson, i) => {
              const isCompleted = completed.includes(lesson.id)
              const isCurrent = lesson.id === currentLessonId
              const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'
              const icon = isCompleted ? 'check' : LESSON_ICONS[i % LESSON_ICONS.length]
              const offset = OFFSETS[i % OFFSETS.length]
              const exerciseCount = lesson._count?.exercises ?? 0

              return (
                <LessonNode
                  key={lesson.id}
                  status={status}
                  icon={icon}
                  offset={offset}
                  title={`Dars ${lesson.order}`}
                  exerciseCount={exerciseCount}
                  onClick={() => isCompleted || isCurrent ? navigate(`/lesson/${lesson.id}`) : null}
                />
              )
            })}

            <div className="relative z-10 mt-8 flex flex-col items-center">
              <div className="w-32 h-32 bg-surface-container-high rounded-3xl border-2 border-dashed border-outline-variant flex items-center justify-center loft-shadow group hover:border-secondary transition-colors cursor-help">
                <Icon name="inventory_2" className="text-outline group-hover:text-secondary transition-colors" style={{ fontSize: 48 }} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Locked Chest</p>
                <p className="text-xs text-on-surface-variant opacity-70">Finish unit to open</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side panels (desktop) */}
        <div className="hidden md:block space-y-4 md:sticky md:top-6 md:self-start">
          <section className="bg-surface-container-lowest border-2 border-outline-variant/60 rounded-2xl p-5 loft-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Kunlik vazifa</h3>
              <Icon name="emoji_events" filled className="text-orange-500" />
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-extrabold text-on-surface tabular-nums">{Math.min(50, user?.totalXP ?? 0)}</span>
              <span className="text-sm font-bold text-on-surface-variant mb-1">/ 50 XP</span>
            </div>
            <div className="bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${Math.min(100, ((user?.totalXP ?? 0) / 50) * 100)}%` }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-3">Bugun o'qib XP yig'ing — har dars +10 XP</p>
          </section>

          <section className="bg-surface-container-lowest border-2 border-outline-variant/60 rounded-2xl p-5 loft-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Liga</h3>
              <Icon name="leaderboard" className="text-secondary" />
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full bg-surface-container hover:bg-surface-container-high transition-colors text-tertiary text-sm font-bold py-2 rounded-xl"
            >
              Liga jadvalini ko'rish →
            </button>
          </section>

          <section className="bg-primary-fixed border-2 border-primary-fixed-dim/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="local_fire_department" filled className="text-orange-500" style={{ fontSize: 28 }} />
              <span className="text-2xl font-extrabold text-on-primary-fixed tabular-nums">{user?.streak ?? 0}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant">kun streak</span>
            </div>
            <p className="text-xs text-on-primary-fixed-variant">Streak'ni uzmaslik uchun bugun 1 ta dars yetarli.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

function LessonNode({ status, icon, offset, title, exerciseCount, onClick }) {
  if (status === 'completed') {
    return (
      <div className="relative z-10" style={{ transform: `translateX(${offset}px)` }}>
        <button
          onClick={onClick}
          className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border-4 border-surface-container-highest loft-shadow hover:scale-105 active:scale-95 transition-transform"
        >
          <Icon name="check" filled className="text-white" style={{ fontSize: 32 }} />
        </button>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-semibold text-on-surface-variant">{title}</span>
        </div>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className="relative z-10" style={{ transform: `translateX(${offset}px)` }}>
        <div className="relative">
          <button
            onClick={onClick}
            className="w-24 h-24 rounded-full border-8 border-secondary-container bg-white flex items-center justify-center loft-shadow ring-8 ring-primary-container/5 hover:scale-105 active:scale-95 transition-transform"
          >
            <Icon name={icon} className="text-primary" style={{ fontSize: 36 }} />
          </button>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg animate-bounce">
            Boshlash
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rotate-45" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
            <span className="text-xs font-bold text-primary block">{title}</span>
            {exerciseCount > 0 && <span className="text-[10px] text-on-surface-variant">{exerciseCount} mashq</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 opacity-60 grayscale-[0.5]" style={{ transform: `translateX(${offset}px)` }}>
      <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center border-4 border-outline-variant loft-shadow">
        <Icon name={icon} className="text-outline" style={{ fontSize: 32 }} />
      </div>
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-semibold text-on-surface-variant">{title}</span>
      </div>
    </div>
  )
}
