import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput, FormTextarea } from '../../components/admin/FormField'

export default function AdminCourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  function refresh() {
    setLoading(true)
    adminApi.courses.get(id)
      .then((d) => setCourse(d.course))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(refresh, [id])

  function startCreate() {
    const nextOrder = (course?.units?.length ?? 0) + 1
    setEditing({ courseId: id, order: nextOrder, title: '', description: '', color: '#a03f2e', icon: '📚' })
  }

  async function save() {
    setBusy(true)
    setError('')
    try {
      if (editing.id) {
        const { id: unitId, courseId, ...data } = editing
        await adminApi.units.update(unitId, data)
      } else {
        await adminApi.units.create(editing)
      }
      setEditing(null)
      refresh()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  async function remove(unit) {
    if (!confirm(`"${unit.title}" unitini o'chirasizmi? Darslar ham yo'qoladi.`)) return
    try {
      await adminApi.units.remove(unit.id)
      refresh()
    } catch (e) { setError(e.message) }
  }

  if (loading) return <div className="text-on-surface-variant">Yuklanmoqda…</div>
  if (error) return <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error}</div>
  if (!course) return null

  return (
    <div className="space-y-6">
      <Link to="/admin/courses" className="text-sm text-on-surface-variant hover:text-secondary">← Kurslar</Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">
            {course.fromLanguage.flag} {course.fromLanguage.name} → {course.toLanguage.flag} {course.toLanguage.name}
          </h1>
          <p className="text-on-surface-variant mt-1">{course.units.length} unit, {course.totalLearners} o'rganuvchi</p>
        </div>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi unit
        </button>
      </div>

      <section>
        <div className="space-y-2">
          {course.units.map((u) => (
            <div key={u.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">{u.icon}</span>
              <div className="grow">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Unit {u.order}</p>
                <h3 className="font-bold text-on-surface">{u.title}</h3>
                {u.description && <p className="text-sm text-on-surface-variant">{u.description}</p>}
                <p className="text-xs text-on-surface-variant mt-1">{u._count.lessons} dars</p>
              </div>
              <Link to={`/admin/units/${u.id}`} className="bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-bold">Darslar</Link>
              <button onClick={() => setEditing({ ...u, courseId: id })} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
              <button onClick={() => remove(u)} className="text-sm text-error font-bold hover:underline">O'chir</button>
            </div>
          ))}
          {course.units.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">Hozircha unit yo'q. "+ Yangi unit" bilan qo'shing.</div>
          )}
        </div>
      </section>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Unitni tahrirlash' : 'Yangi unit'}>
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Tartib">
                <FormInput type="number" min={1} value={editing.order} onChange={(v) => setEditing({ ...editing, order: Number(v) })} />
              </FormField>
              <FormField label="Ikon">
                <FormInput value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} placeholder="📚" />
              </FormField>
              <FormField label="Rang">
                <FormInput type="color" value={editing.color} onChange={(v) => setEditing({ ...editing, color: v })} />
              </FormField>
            </div>
            <FormField label="Sarlavha">
              <FormInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Unit 1: Asoslar" />
            </FormField>
            <FormField label="Tavsif">
              <FormTextarea value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} placeholder="Common greetings and introductions" />
            </FormField>
            <ModalActions>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
              <button onClick={save} disabled={busy || !editing.title} className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                {busy ? '...' : 'Saqlash'}
              </button>
            </ModalActions>
          </div>
        )}
      </Modal>
    </div>
  )
}
