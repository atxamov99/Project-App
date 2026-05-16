import { useState } from 'react'
import {
  useAdminLanguagesQuery,
  useAdminCreateLanguageMutation,
  useAdminUpdateLanguageMutation,
  useAdminRemoveLanguageMutation,
} from '../../store/apiSlice'
import DataTable from '../../components/admin/DataTable'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput } from '../../components/admin/FormField'

export default function AdminLanguages() {
  const { data, isLoading: loading } = useAdminLanguagesQuery()
  const [createLanguage] = useAdminCreateLanguageMutation()
  const [updateLanguage] = useAdminUpdateLanguageMutation()
  const [removeLanguage] = useAdminRemoveLanguageMutation()

  const items = data?.languages ?? []

  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function startCreate() {
    setEditing({ code: '', name: '', nativeName: '', flag: '', isActive: true })
  }

  async function save() {
    setBusy(true)
    setError('')
    try {
      if (editing.id) {
        const { id, ...d } = editing
        await updateLanguage({ id, data: d }).unwrap()
      } else {
        await createLanguage(editing).unwrap()
      }
      setEditing(null)
    } catch (e) { setError(e.data?.error || e.message) }
    finally { setBusy(false) }
  }

  async function remove(row) {
    if (!confirm(`"${row.name}" tilini o'chirasizmi?`)) return
    try {
      await removeLanguage(row.id).unwrap()
    } catch (e) { setError(e.data?.error || e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface">Tillar</h1>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi til
        </button>
      </div>

      {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>}

      <DataTable
        columns={[
          { key: 'flag',       label: 'Bayroq', render: (r) => <span className="text-2xl">{r.flag}</span>, width: 80 },
          { key: 'code',       label: 'Kod',    render: (r) => <code className="font-mono text-sm">{r.code}</code>, width: 80 },
          { key: 'name',       label: 'Nomi' },
          { key: 'nativeName', label: 'Mahalliy nomi' },
          { key: 'isActive',   label: 'Aktiv',  render: (r) => r.isActive ? '✓' : '—', width: 80 },
          { key: 'actions',    label: '', render: (r) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing({ ...r })} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
              <button onClick={() => remove(r)} className="text-sm text-error font-bold hover:underline">O'chir</button>
            </div>
          ), width: 140 },
        ]}
        data={items}
        loading={loading}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Tilni tahrirlash' : 'Yangi til'}>
        {editing && (
          <div className="space-y-3">
            <FormField label="Kod (ISO-2)">
              <FormInput value={editing.code} onChange={(v) => setEditing({ ...editing, code: v })} placeholder="en, ru, uz, tr..." disabled={!!editing.id} />
            </FormField>
            <FormField label="Nomi (uzbekcha)">
              <FormInput value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Ingliz tili" />
            </FormField>
            <FormField label="Mahalliy nomi">
              <FormInput value={editing.nativeName} onChange={(v) => setEditing({ ...editing, nativeName: v })} placeholder="English" />
            </FormField>
            <FormField label="Bayroq emoji">
              <FormInput value={editing.flag} onChange={(v) => setEditing({ ...editing, flag: v })} placeholder="🇬🇧" />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />
              <span>Aktiv</span>
            </label>
            <ModalActions>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
              <button onClick={save} disabled={busy} className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                {busy ? '...' : 'Saqlash'}
              </button>
            </ModalActions>
          </div>
        )}
      </Modal>
    </div>
  )
}
