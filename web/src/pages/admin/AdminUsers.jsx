import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import DataTable from '../../components/admin/DataTable'
import RoleBadge from '../../components/admin/RoleBadge'
import { FormInput, FormSelect } from '../../components/admin/FormField'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ role: '', suspended: '', premium: '', search: '' })
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ users: [], total: 0, limit: 20 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = { page, limit: 20 }
    if (filters.role) params.role = filters.role
    if (filters.suspended) params.suspended = filters.suspended
    if (filters.premium) params.premium = filters.premium
    if (filters.search) params.search = filters.search

    adminApi.users.list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [page, filters])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-on-surface">Foydalanuvchilar</h1>

      {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <FormInput
          placeholder="Email yoki username..."
          value={filters.search}
          onChange={(v) => { setFilters((f) => ({ ...f, search: v })); setPage(1) }}
        />
        <FormSelect
          placeholder="Barcha rollar"
          value={filters.role}
          onChange={(v) => { setFilters((f) => ({ ...f, role: v })); setPage(1) }}
          options={[
            { value: 'STUDENT', label: 'Student' },
            { value: 'CONTENT_EDITOR', label: 'Content Editor' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
        <FormSelect
          placeholder="Premium / Free"
          value={filters.premium}
          onChange={(v) => { setFilters((f) => ({ ...f, premium: v })); setPage(1) }}
          options={[
            { value: 'true', label: 'Premium' },
            { value: 'false', label: 'Free' },
          ]}
        />
        <FormSelect
          placeholder="Status"
          value={filters.suspended}
          onChange={(v) => { setFilters((f) => ({ ...f, suspended: v })); setPage(1) }}
          options={[
            { value: 'false', label: 'Aktiv' },
            { value: 'true', label: 'Suspend' },
          ]}
        />
      </div>

      <DataTable
        columns={[
          { key: 'email',       label: 'Email' },
          { key: 'username',    label: 'Username' },
          { key: 'displayName', label: 'Ism' },
          { key: 'role',        label: 'Rol', render: (r) => <RoleBadge role={r.role} /> },
          { key: 'totalXP',     label: 'XP' },
          { key: 'streak',      label: 'Streak', render: (r) => `${r.streak}🔥` },
          { key: 'status',      label: 'Status', render: (r) => r.suspendedAt
            ? <span className="text-error font-bold">Suspended</span>
            : r.isPremium
            ? <span className="text-secondary font-bold">Premium</span>
            : <span className="text-on-surface-variant">Aktiv</span>
          },
        ]}
        data={data.users}
        loading={loading}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        pagination={{ page, total: data.total, limit: data.limit }}
        onPageChange={setPage}
      />
    </div>
  )
}
