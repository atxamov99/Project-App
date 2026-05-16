import { useState } from 'react'
import {
  useAdminAchievementsQuery,
  useAdminCreateAchievementMutation,
  useAdminUpdateAchievementMutation,
  useAdminRemoveAchievementMutation,
} from '../../store/apiSlice'
import DataTable from '../../components/admin/DataTable'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput, FormTextarea } from '../../components/admin/FormField'

export default function AdminAchievements() {
  const { data, isLoading: loading, error } = useAdminAchievementsQuery()
  const [createAchievement] = useAdminCreateAchievementMutation()
  const [updateAchievement] = useAdminUpdateAchievementMutation()
  const [removeAchievement] = useAdminRemoveAchievementMutation()

  const items = data?.achievements ?? []

  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [mutError, setMutError] = useState('')

  function startCreate() {
    setEditing({ key: '', title: '', description: '', icon: '🏆', gemReward: 0, xpReward: 0 })
  }

  async function save() {
    setBusy(true)
    setMutError('')
    try {
      if (editing.id) {
        const { id, key, ...d } = editing
        await updateAchievement({ id, data: d }).unwrap()
      } else {
        await createAchievement(editing).unwrap()
      }
      setEditing(null)
    } catch (e) { setMutError(e.data?.error || e.message) }
    finally { setBusy(false) }
  }

  async function remove(a) {
    if (!confirm(`"${a.title}" yutug'ini o'chirasizmi?`)) return
    try { await removeAchievement(a.id).unwrap() }
    catch (e) { setMutError(e.data?.error || e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface">Yutuqlar</h1>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi yutuq
        </button>
      </div>

      {(error || mutError) && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">
          {mutError || error?.data?.error || 'Xatolik'}
        </div>
      )}

      <DataTable
        columns={[
          { key: 'icon', label: '', render: (r) => <span className="text-2xl">{r.icon}</span>, width: 60 },
          { key: 'key', label: 'Kalit', render: (r) => <code className="font-mono text-xs">{r.key}</code>, width: 160 },
          { key: 'title', label: 'Sarlavha' },
          { key: 'description', label: 'Tavsif' },
          { key: 'gemReward', label: '💎', render: (r) => r.gemReward, width: 60 },
          { key: 'xpReward',  label: '⭐', render: (r) => r.xpReward,  width: 60 },
          { key: 'actions', label: '', render: (r) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(r)} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
              <button onClick={() => remove(r)} className="text-sm text-error font-bold hover:underline">O'chir</button>
            </div>
          ), width: 140 },
        ]}
        data={items}
        loading={loading}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Yutuqni tahrirlash' : 'Yangi yutuq'}>
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Kalit (UPPER_CASE)">
                <FormInput value={editing.key} onChange={(v) => setEditing({ ...editing, key: v.toUpperCase().replace(/[^A-Z0-9_]/g, '') })} disabled={!!editing.id} placeholder="STREAK_7" />
              </FormField>
              <FormField label="Ikon">
                <FormInput value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} placeholder="🏆" />
              </FormField>
              <FormField label="Sarlavha">
                <FormInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              </FormField>
            </div>
            <FormField label="Tavsif">
              <FormTextarea value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Gem mukofoti">
                <FormInput type="number" min={0} value={editing.gemReward} onChange={(v) => setEditing({ ...editing, gemReward: Number(v) })} />
              </FormField>
              <FormField label="XP mukofoti">
                <FormInput type="number" min={0} value={editing.xpReward} onChange={(v) => setEditing({ ...editing, xpReward: Number(v) })} />
              </FormField>
            </div>
            <ModalActions>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
              <button onClick={save} disabled={busy || !editing.key || !editing.title} className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                {busy ? '...' : 'Saqlash'}
              </button>
            </ModalActions>
          </div>
        )}
      </Modal>
    </div>
  )
}
