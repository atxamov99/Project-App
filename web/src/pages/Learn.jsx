import { useNavigate } from 'react-router-dom'
import { useGetCoursesQuery, useGetCourseQuery, useGetStreakQuery } from '../store/apiSlice'
import { useAppSelector } from '../store/hooks'
import Icon from '../components/shared/Icon'

const LESSON_ICONS = ['chat_bubble', 'face', 'looks_one', 'family_restroom', 'palette', 'restaurant', 'directions_walk', 'translate']
const OFFSETS = [16, -24, 32, -8, 24, -16]

export default function Learn() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery()
  const firstCourseId = coursesData?.courses?.[0]?.id
  const { data: courseData, isLoading: courseLoading } = useGetCourseQuery(firstCourseId, { skip: !firstCourseId })
  const { data: streakData } = useGetStreakQuery()

  const dailyXP = streakData?.dailyXP ?? 0
  const dailyGoal = streakData?.dailyGoal ?? 50
  const streak = streakData?.streak ?? user?.streak ?? 0

  const loading = coursesLoading || (!!firstCourseId && courseLoading)
  const course = courseData?.course ?? null
  const completed = courseData?.completed ?? []
  const currentLessonId = courseData?.currentLessonId ?? null

  if (loading) {
    return <div className="p-12 text-center text-on-surface-variant">Yuklanmoqda…</div>
  }

  if (coursesError || coursesData?.courses?.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-md mx-auto">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center">
          {coursesError?.data?.error || "Hozircha kurs yo'q. Admin panelidan kurs yaratish kerak."}
        </div>
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
          <div className="mb-10 md:mb-12 pl-4 border-l-4 border-secondary">
            <p className="text-xs font-medium text-on-surface-variant mb-1">
              {course.fromLanguage.flag} → {course.toLanguage.flag} {course.toLanguage.name}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">{unit?.title ?? 'No unit'}</h2>
            {unit?.description && <p className="text-sm text-on-surface-variant mt-1">{unit.description}</p>}
            <div className="mt-4 flex items-center gap-3">
              <div className="grow bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant tabular-nums">{progressPct}%</span>
            </div>
          </div>

          {/* Lesson path */}
          <div className="relative flex flex-col items-center gap-10 pb-12">
            <div className="absolute top-0 bottom-0 w-px path-line left-1/2 -translate-x-1/2 z-0 opacity-30" />


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

            <div className="relative z-10 mt-4 flex flex-col items-center opacity-40">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
                <Icon name="inventory_2" className="text-outline" style={{ fontSize: 28 }} />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2">Unit tugagandan so'ng ochiladi</p>
            </div>
          </div>
        </div>

        {/* Side panels (desktop) */}
        <div className="hidden md:block space-y-3 md:sticky md:top-6 md:self-start">
          <section className="bg-surface-container-low rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Kunlik vazifa</h3>
              <span className="text-xs font-bold text-secondary tabular-nums">{Math.min(dailyGoal, dailyXP)}/{dailyGoal} XP</span>
            </div>
            <div className="bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${Math.min(100, (dailyXP / dailyGoal) * 100)}%` }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              {dailyXP >= dailyGoal ? "Kunlik maqsadga yetdingiz!" : "Har dars +10 XP"}
            </p>
          </section>

          <section className="bg-surface-container-low rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Liga</h3>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full text-secondary text-xs font-semibold py-1.5 hover:text-secondary/70 transition-colors text-left"
            >
              Liga jadvalini ko'rish →
            </button>
          </section>

          <section className="bg-surface-container-low rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="text-lg font-bold text-on-surface tabular-nums">{streak}</span>
              <span className="text-xs text-on-surface-variant">kun streak</span>
            </div>
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
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Icon name="check" filled className="text-white" style={{ fontSize: 26 }} />
        </button>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[10px] font-medium text-on-surface-variant">{title}</span>
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
            className="w-20 h-20 rounded-full border-4 border-secondary bg-surface-container-lowest flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Icon name={icon} className="text-secondary" style={{ fontSize: 30 }} />
          </button>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest animate-bounce">
            Boshlash
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-secondary rotate-45" />
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
            <span className="text-[10px] font-semibold text-secondary block">{title}</span>
            {exerciseCount > 0 && <span className="text-[9px] text-on-surface-variant">{exerciseCount} mashq</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 opacity-40" style={{ transform: `translateX(${offset}px)` }}>
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
        <Icon name={icon} className="text-outline" style={{ fontSize: 24 }} />
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-medium text-on-surface-variant">{title}</span>
      </div>
    </div>
  )
}
