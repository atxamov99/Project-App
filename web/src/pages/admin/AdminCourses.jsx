import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminCoursesQuery,
  useAdminLanguagesQuery,
  useAdminCreateCourseMutation,
  useAdminUpdateCourseMutation,
  useAdminRemoveCourseMutation,
} from '../../store/apiSlice'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormSelect } from '../../components/admin/FormField'

export default function AdminCourses() {
  const { data: coursesData, isLoading: loading, error } = useAdminCoursesQuery()
  const { data: langsData } = useAdminLanguagesQuery()
  const [createCourse] = useAdminCreateCourseMutation()
  const [updateCourse] = useAdminUpdateCourseMutation()
  const [removeCourse] = useAdminRemoveCourseMutation()

  const courses = coursesData?.courses ?? []
  const languages = langsData?.languages ?? []

  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ fromLanguageId: '', toLanguageId: '' })
  const [busy, setBusy] = useState(false)
  const [mutError, setMutError] = useState('')

  async function create() {
    setBusy(true)
    setMutError('')
    try {
      await createCourse(form).unwrap()
      setCreating(false)
      setForm({ fromLanguageId: '', toLanguageId: '' })
    } catch (e) { setMutError(e.data?.error || e.message) }
    finally { setBusy(false) }
  }

  async function toggle(course) {
    try {
      await updateCourse({ id: course.id, data: { isActive: !course.isActive } }).unwrap()
    } catch (e) { setMutError(e.data?.error || e.message) }
  }

  async function remove(course) {
    if (!confirm(`Kursni o'chirasizmi? Barcha unitlari va darslari ham yo'qoladi.`)) return
    try {
      await removeCourse(course.id).unwrap()
    } catch (e) { setMutError(e.data?.error || e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface">Kurslar</h1>
        <button onClick={() => setCreating(true)} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Yangi kurs
        </button>
      </div>

      {(error || mutError) && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">
          {mutError || error?.data?.error || 'Xatolik'}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant">Yuklanmoqda…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
              <div className="flex items-center gap-2 text-2xl mb-2">
                <span>{c.fromLanguage.flag}</span>
                <span className="text-on-surface-variant text-base">→</span>
                <span>{c.toLanguage.flag}</span>
              </div>
              <h3 className="font-bold text-on-surface">{c.fromLanguage.name} → {c.toLanguage.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1">{c._count.units} unit · {c.totalLearners} o'rganuvchi</p>

              <div className="flex items-center gap-2 mt-4">
                <Link
                  to={`/admin/courses/${c.id}`}
                  className="bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-bold"
                >
                  Ochish
                </Link>
                <button
                  onClick={() => toggle(c)}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${c.isActive ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}
                >
                  {c.isActive ? 'Aktiv' : 'Yashirin'}
                </button>
                <button onClick={() => remove(c)} className="ml-auto text-xs text-error font-bold hover:underline">
                  O'chir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={creating} onClose={() => setCreating(false)} title="Yangi kurs">
        <div className="space-y-3">
          <FormField label="Manba til (foydalanuvchi tili)">
            <FormSelect
              value={form.fromLanguageId}
              onChange={(v) => setForm({ ...form, fromLanguageId: v })}
              options={languages.map((l) => ({ value: l.id, label: `${l.flag} ${l.name}` }))}
              placeholder="Tanlang..."
            />
          </FormField>
          <FormField label="Maqsad til (o'rganiladigan)">
            <FormSelect
              value={form.toLanguageId}
              onChange={(v) => setForm({ ...form, toLanguageId: v })}
              options={languages.filter((l) => l.id !== form.fromLanguageId).map((l) => ({ value: l.id, label: `${l.flag} ${l.name}` }))}
              placeholder="Tanlang..."
            />
          </FormField>
          <ModalActions>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
            <button
              onClick={create}
              disabled={busy || !form.fromLanguageId || !form.toLanguageId}
              className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {busy ? '...' : 'Yaratish'}
            </button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}
