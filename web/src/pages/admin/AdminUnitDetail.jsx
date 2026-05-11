import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput, FormSelect } from '../../components/admin/FormField'

export default function AdminUnitDetail() {
  const { unitId } = useParams()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  function refresh() {
    setLoading(true)
    adminApi.lessons.listByUnit(unitId)
      .then((d) => setLessons(d.lessons))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(refresh, [unitId])

  function startCreate() {
    const nextOrder = lessons.length + 1
    setEditing({ unitId, order: nextOrder, type: 'REGULAR', xpReward: 10 })
  }

  async function save() {
    setBusy(true)
    setError('')
    try {
      if (editing.id) {
        const { id, unitId: _u, ...data } = editing
        await adminApi.lessons.update(id, data)
      } else {
        await adminApi.lessons.create(editing)
      }
      setEditing(null)
      refresh()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  async function remove(lesson) {
    if (!confirm(`Dars #${lesson.order}'ni o'chirasizmi?`)) return
    try { await adminApi.lessons.remove(lesson.id); refresh() }
    catch (e) { setError(e.message) }
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/courses" className="text-sm text-on-surface-variant hover:text-secondary">← Kurslar</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface">Darslar</h1>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi dars
        </button>
      </div>

      {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <div className="text-on-surface-variant">Yuklanmoqda…</div>
      ) : (
        <div className="space-y-2">
          {lessons.map((l) => (
            <div key={l.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant w-12">#{l.order}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded">{l.type}</span>
              <span className="text-sm text-on-surface">{l._count.exercises} mashq</span>
              <span className="text-xs text-on-surface-variant ml-auto">+{l.xpReward} XP</span>
              <Link to={`/admin/lessons/${l.id}`} className="bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-bold">Mashqlar</Link>
              <button onClick={() => setEditing({ ...l, unitId })} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
              <button onClick={() => remove(l)} className="text-sm text-error font-bold hover:underline">O'chir</button>
            </div>
          ))}
          {lessons.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">Dars yo'q. "+ Yangi dars" bilan qo'shing.</div>
          )}
        </div>
      )}

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Darsni tahrirlash' : 'Yangi dars'}>
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Tartib">
                <FormInput type="number" min={1} value={editing.order} onChange={(v) => setEditing({ ...editing, order: Number(v) })} />
              </FormField>
              <FormField label="Turi">
                <FormSelect
                  value={editing.type}
                  onChange={(v) => setEditing({ ...editing, type: v })}
                  options={[
                    { value: 'REGULAR', label: 'REGULAR' },
                    { value: 'CHECKPOINT', label: 'CHECKPOINT' },
                    { value: 'PRACTICE', label: 'PRACTICE' },
                    { value: 'STORY', label: 'STORY' },
                  ]}
                />
              </FormField>
              <FormField label="XP">
                <FormInput type="number" min={1} max={100} value={editing.xpReward} onChange={(v) => setEditing({ ...editing, xpReward: Number(v) })} />
              </FormField>
            </div>
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
