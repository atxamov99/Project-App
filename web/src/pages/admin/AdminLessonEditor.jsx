import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  useAdminLessonDetailQuery,
  useAdminExercisesByLessonQuery,
  useAdminCreateExerciseMutation,
  useAdminUpdateExerciseMutation,
  useAdminRemoveExerciseMutation,
  useAdminDetachExerciseMutation,
} from '../../store/apiSlice'
import Modal, { ModalActions } from '../../components/admin/Modal'
import FormField, { FormInput, FormSelect } from '../../components/admin/FormField'
import TranslateEditor from '../../components/admin/exercise-editors/TranslateEditor'
import BuildSentenceEditor from '../../components/admin/exercise-editors/BuildSentenceEditor'
import MultipleChoiceEditor from '../../components/admin/exercise-editors/MultipleChoiceEditor'

const SUPPORTED_TYPES = [
  { value: 'TRANSLATE_TEXT',  label: 'Tarjima' },
  { value: 'BUILD_SENTENCE',  label: 'Jumla qurish' },
  { value: 'MULTIPLE_CHOICE', label: 'Variantli' },
]

const EDITORS = {
  TRANSLATE_TEXT: TranslateEditor,
  BUILD_SENTENCE: BuildSentenceEditor,
  MULTIPLE_CHOICE: MultipleChoiceEditor,
}

function emptyExercise(targetLangCode) {
  return {
    type: 'TRANSLATE_TEXT',
    question: '',
    correctAnswer: '',
    wrongAnswers: ['', '', ''],
    explanation: '',
    difficulty: 1,
    targetLangCode,
  }
}

export default function AdminLessonEditor() {
  const { id: lessonId } = useParams()
  const { data: lessonData, isLoading: lessonLoading, error } = useAdminLessonDetailQuery(lessonId)
  const { data: exercisesData, isLoading: exLoading } = useAdminExercisesByLessonQuery(lessonId)
  const [createExercise] = useAdminCreateExerciseMutation()
  const [updateExercise] = useAdminUpdateExerciseMutation()
  const [removeExercise] = useAdminRemoveExerciseMutation()
  const [detachExercise] = useAdminDetachExerciseMutation()

  const lesson = lessonData?.lesson ?? null
  const exercises = exercisesData?.exercises ?? []
  const loading = lessonLoading || exLoading

  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [mutError, setMutError] = useState('')

  function startCreate() {
    const targetLang = lesson?.unit?.course?.toLanguage?.code ?? 'en'
    const order = exercises.length + 1
    setEditing({ ...emptyExercise(targetLang), lessonId, order, _isNew: true })
  }

  function startEdit(ex) {
    setEditing({
      ...ex,
      wrongAnswers: ex.wrongAnswers?.length ? ex.wrongAnswers : ['', '', ''],
      _isNew: false,
    })
  }

  async function save() {
    setBusy(true)
    setMutError('')
    try {
      if (editing._isNew) {
        const { _isNew, ...d } = editing
        d.wrongAnswers = (d.wrongAnswers || []).filter((w) => w?.trim())
        await createExercise(d).unwrap()
      } else {
        const { _isNew, lessonExerciseId, order, id, ...rest } = editing
        rest.wrongAnswers = (rest.wrongAnswers || []).filter((w) => w?.trim())
        await updateExercise({ id, data: rest }).unwrap()
      }
      setEditing(null)
    } catch (e) { setMutError(e.data?.error || e.message) }
    finally { setBusy(false) }
  }

  async function detach(ex) {
    if (!confirm("Mashqni darsdan ajratmoqchimisiz? (Mashq DB'da qoladi)")) return
    try { await detachExercise(ex.lessonExerciseId).unwrap() }
    catch (e) { setMutError(e.data?.error || e.message) }
  }

  async function remove(ex) {
    if (!confirm("Mashqni butunlay o'chirasizmi?")) return
    try { await removeExercise(ex.id).unwrap() }
    catch (e) { setMutError(e.data?.error || e.message) }
  }

  if (loading) return <div className="text-on-surface-variant">Yuklanmoqda…</div>
  if (error) return <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{error.data?.error || 'Xatolik'}</div>
  if (!lesson) return null

  const Editor = editing ? EDITORS[editing.type] : null

  return (
    <div className="space-y-6">
      <Link to={`/admin/units/${lesson.unitId}`} className="text-sm text-on-surface-variant hover:text-secondary">
        ← Unitga qaytish
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {lesson.unit.title} · Dars #{lesson.order}
          </p>
          <h1 className="text-2xl font-extrabold text-on-surface">Mashqlar tahriri</h1>
        </div>
        <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
          + Mashq qo'shish
        </button>
      </div>

      {mutError && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{mutError}</div>}

      <div className="space-y-2">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-start gap-3">
            <span className="text-xs font-bold text-on-surface-variant w-8">#{ex.order}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded shrink-0">{ex.type}</span>
            <div className="grow min-w-0">
              <p className="text-sm text-on-surface font-semibold truncate">{ex.question}</p>
              <p className="text-sm text-secondary truncate">→ {ex.correctAnswer}</p>
            </div>
            <button onClick={() => startEdit(ex)} className="text-sm text-secondary font-bold hover:underline">Tahrir</button>
            <button onClick={() => detach(ex)} className="text-sm text-on-surface-variant font-bold hover:underline">Ajrat</button>
            <button onClick={() => remove(ex)} className="text-sm text-error font-bold hover:underline">O'chir</button>
          </div>
        ))}
        {exercises.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">Mashq yo'q. "+ Mashq qo'shish" bilan boshlang.</div>
        )}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?._isNew ? 'Yangi mashq' : 'Mashqni tahrirlash'} size="lg">
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tur">
                <FormSelect
                  value={editing.type}
                  onChange={(v) => setEditing({ ...editing, type: v })}
                  options={SUPPORTED_TYPES}
                />
              </FormField>
              <FormField label="Daraja (1-5)">
                <FormInput type="number" min={1} max={5} value={editing.difficulty} onChange={(v) => setEditing({ ...editing, difficulty: Number(v) })} />
              </FormField>
            </div>
            {Editor && <Editor value={editing} onChange={setEditing} />}
            <ModalActions>
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
              <button
                onClick={save}
                disabled={busy || !editing.question || !editing.correctAnswer}
                className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
              >
                {busy ? '...' : 'Saqlash'}
              </button>
            </ModalActions>
          </div>
        )}
      </Modal>
    </div>
  )
}
