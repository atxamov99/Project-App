import { Link } from 'react-router-dom'
import { useAdminStatsDashboardQuery, useAdminTroubledExercisesQuery } from '../../store/apiSlice'
import StatCard from '../../components/admin/StatCard'
import DataTable from '../../components/admin/DataTable'

export default function AdminDashboard() {
  const { data, isLoading: loading, error } = useAdminStatsDashboardQuery()
  const { data: troubledData } = useAdminTroubledExercisesQuery(5)
  const troubled = troubledData?.items ?? []

  if (loading) return <div className="text-on-surface-variant">Yuklanmoqda…</div>
  if (error) return <div className="text-error bg-error-container px-4 py-3 rounded-xl">{error.data?.error || 'Xatolik'}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-on-surface">Dashboard</h1>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Foydalanuvchilar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="group"             label="Total Users" value={data.users.total} />
          <StatCard icon="trending_up"       label="DAU"         value={data.users.dau} hint="Bugun aktiv" />
          <StatCard icon="workspace_premium" label="Premium"     value={data.users.premium} accent />
          <StatCard icon="person_add"        label="Yangi (kun)" value={data.users.newToday} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Engagement</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard icon="task_alt" label="Lessons today" value={data.engagement.lessonsCompletedToday} />
          <StatCard icon="schedule" label="Avg session"   value={`${data.engagement.averageSessionMinutes} min`} />
          <StatCard icon="verified" label="Completion"    value={`${Math.round(data.engagement.completionRate * 100)}%`} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Kontent</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="menu_book" label="Courses"   value={data.content.totalCourses} />
          <StatCard icon="school"    label="Lessons"   value={data.content.totalLessons} />
          <StatCard icon="quiz"      label="Exercises" value={data.content.totalExercises} />
          <StatCard icon="translate" label="Words"     value={data.content.totalWords} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Eng ko'p xato qilingan darslar
          </h2>
          <Link to="/admin/stats" className="text-sm text-secondary font-bold hover:underline">
            Hammasi →
          </Link>
        </div>
        <DataTable
          columns={[
            { key: 'order', label: '#', render: (r) => r.lesson?.order ?? '—', width: 50 },
            { key: 'unit', label: 'Unit', render: (r) => r.lesson?.unit?.title ?? '—' },
            { key: 'avgMistakes', label: "O'rtacha xato", render: (r) => r.avgMistakes },
            { key: 'attempts', label: 'Urinishlar', render: (r) => r.attempts },
          ]}
          data={troubled}
          emptyMessage="Hozircha ma'lumot yo'q (darslar tugatilmagan)"
        />
      </section>
    </div>
  )
}
