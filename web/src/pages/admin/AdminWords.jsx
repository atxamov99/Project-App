import { useEffect, useState } from 'react'
import { adminApi } from '../../lib/api'
import DataTable from '../../components/admin/DataTable'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput, FormSelect } from '../../components/admin/FormField'

export default function AdminWords() {
  const [data, setData] = useState({ words: [], total: 0, limit: 50 })
  const [languages, setLanguages] = useState([])
  const [filters, setFilters] = useState({ languageId: '', search: '', level: '' })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    adminApi.languages.list().then((d) => setLanguages(d.languages)).catch(() => {})
  }, [])

  function refresh() {
    setLoading(true)
    const params = { page, limit: 50 }
    if (filters.languageId) params.languageId = filters.languageId
    if (filters.search) params.search = filters.search
    if (filters.level) params.level = filters.level
    adminApi.words.list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(refresh, [page, filters])

  function startCreate() {
    setEditing({ languageId: filters.languageId || '', text: '', translation: '', category: 'General', level: 'A1' })
  }

  async function save() {
    setBusy(true)
    setError('')
    try {
      if (editing.id) {
        const { id, ...d } = editing
        await adminApi.words.update(id, d)
      } else {
        await adminApi.words.create(editing)
      }
      setEditing(null)
      refresh()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  async function remove(w) {
    if (!confirm(`"${w.text}" ni o'chirasizmi?`)) return
    try { await adminApi.words.remove(w.id); refresh() }
    catch (e) { setError(e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface">So'zlar</h1>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi so'z
        </button>
      </div>

      {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormInput
          placeholder="Qidiruv..."
          value={filters.search}
          onChange={(v) => { setFilters((f) => ({ ...f, search: v })); setPage(1) }}
        />
        <FormSelect
          placeholder="Barcha tillar"
          value={filters.languageId}
          onChange={(v) => { setFilters((f) => ({ ...f, languageId: v })); setPage(1) }}
          options={languages.map((l) => ({ value: l.id, label: `${l.flag} ${l.name}` }))}
        />
        <FormSelect
          placeholder="Barcha darajalar"
          value={filters.level}
          onChange={(v) => { setFilters((f) => ({ ...f, level: v })); setPage(1) }}
          options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => ({ value: l, label: l }))}
        />
      </div>

      <DataTable
        columns={[
          { key: 'language', label: 'Til', render: (r) => <span className="text-xl">{r.language?.flag}</span>, width: 60 },
          { key: 'text', label: 'So\'z', render: (r) => <strong>{r.text}</strong> },
          { key: 'translation', label: 'Tarjima' },
          { key: 'category', label: 'Toifa' },
          { key: 'level', label: 'Daraja', width: 80 },
          { key: 'actions', label: '', render: (r) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(r)} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
              <button onClick={() => remove(r)} className="text-sm text-error font-bold hover:underline">O'chir</button>
            </div>
          ), width: 140 },
        ]}
        data={data.words}
        loading={loading}
        pagination={{ page, total: data.total, limit: data.limit }}
        onPageChange={setPage}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "So'zni tahrirlash" : "Yangi so'z"}>
        {editing && (
          <div className="space-y-3">
            <FormField label="Til">
              <FormSelect
                value={editing.languageId}
                onChange={(v) => setEditing({ ...editing, languageId: v })}
                options={languages.map((l) => ({ value: l.id, label: `${l.flag} ${l.name}` }))}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="So'z">
                <FormInput value={editing.text} onChange={(v) => setEditing({ ...editing, text: v })} />
              </FormField>
              <FormField label="Tarjima">
                <FormInput value={editing.translation} onChange={(v) => setEditing({ ...editing, translation: v })} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Toifa">
                <FormInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} placeholder="Salomlashish, Ovqat..." />
              </FormField>
              <FormField label="Daraja">
                <FormSelect
                  value={editing.level}
                  onChange={(v) => setEditing({ ...editing, level: v })}
                  options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => ({ value: l, label: l }))}
                />
              </FormField>
            </div>
            <ModalActions>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
              <button onClick={save} disabled={busy || !editing.text || !editing.translation || !editing.languageId} className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                {busy ? '...' : 'Saqlash'}
              </button>
            </ModalActions>
          </div>
        )}
      </Modal>
    </div>
  )
}
