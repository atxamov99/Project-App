import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import StatCard from '../../components/admin/StatCard'
import DataTable from '../../components/admin/DataTable'

export default function AdminStats() {
  const [data, setData] = useState(null)
  const [troubled, setTroubled] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      adminApi.stats.dashboard(),
      adminApi.stats.troubled(50),
    ])
      .then(([d, t]) => { setData(d); setTroubled(t.items) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-on-surface-variant">Yuklanmoqda…</div>
  if (error) return <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-on-surface">Statistika</h1>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Foydalanuvchi metrikalari</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="group"             label="Total"        value={data.users.total} />
          <StatCard icon="trending_up"       label="DAU"          value={data.users.dau} />
          <StatCard icon="calendar_view_week" label="WAU"          value={data.users.wau} />
          <StatCard icon="calendar_month"    label="MAU"          value={data.users.mau} />
          <StatCard icon="person_add"        label="Yangi (kun)"  value={data.users.newToday} />
          <StatCard icon="event"             label="Yangi (hafta)" value={data.users.newThisWeek} />
          <StatCard icon="workspace_premium" label="Premium"      value={data.users.premium} accent />
          <StatCard icon="percent"           label="Premium %"    value={data.users.total ? `${Math.round((data.users.premium / data.users.total) * 100)}%` : '0%'} />
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
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Eng ko'p xato qilingan darslar (top 50)
        </h2>
        <DataTable
          columns={[
            { key: 'order',       label: '#',            render: (r) => r.lesson?.order ?? '—', width: 50 },
            { key: 'unit',        label: 'Unit',         render: (r) => r.lesson?.unit?.title ?? '—' },
            { key: 'course',      label: 'Kurs',         render: (r) => {
              const c = r.lesson?.unit?.course
              return c ? <code className="text-xs">{c.fromLanguageId.slice(0, 6)}…→{c.toLanguageId.slice(0, 6)}…</code> : '—'
            } },
            { key: 'avgMistakes', label: "O'rtacha xato", render: (r) => <strong className="text-error">{r.avgMistakes}</strong> },
            { key: 'attempts',    label: 'Urinishlar',   render: (r) => r.attempts },
            { key: 'edit',        label: '', render: (r) => r.lesson ? (
              <Link to={`/admin/lessons/${r.lessonId}`} className="text-sm text-secondary font-bold hover:underline">Tahrir →</Link>
            ) : null },
          ]}
          data={troubled}
          emptyMessage="Hozircha ma'lumot yo'q"
        />
      </section>
    </div>
  )
}
