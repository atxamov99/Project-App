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
import { api } from '../../lib/api'

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
  const [aiOpen, setAiOpen] = useState(false)
  const [aiState, setAiState] = useState({ type: 'TRANSLATE_TEXT', topic: '', word: '', level: 'beginner', loading: false, error: '' })

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

  async function generateWithAI() {
    const learningLang = lesson?.unit?.course?.toLanguage?.code ?? 'en'
    const interfaceLang = lesson?.unit?.course?.fromLanguage?.code ?? 'ru'
    const aiTypeMap = { TRANSLATE_TEXT: 'TranslateText', BUILD_SENTENCE: 'BuildSentence', MULTIPLE_CHOICE: 'MultipleChoice' }
    setAiState((s) => ({ ...s, loading: true, error: '' }))
    try {
      const resp = await api.ai.generateExercise({
        type: aiTypeMap[aiState.type],
        word: aiState.word || undefined,
        topic: aiState.topic || undefined,
        learningLang,
        interfaceLang,
        level: aiState.level,
      })
      const order = exercises.length + 1
      let draft = { ...emptyExercise(learningLang), type: aiState.type, lessonId, order, _isNew: true, difficulty: aiState.level === 'beginner' ? 1 : aiState.level === 'intermediate' ? 3 : 5 }
      if (aiState.type === 'MULTIPLE_CHOICE') {
        const correct = String(resp.correctAnswer)
        const wrong = (resp.options || []).filter((o) => o !== correct).slice(0, 3)
        draft = { ...draft, question: resp.prompt, correctAnswer: correct, wrongAnswers: [...wrong, '', '', ''].slice(0, 3) }
      } else if (aiState.type === 'BUILD_SENTENCE') {
        const correctArr = Array.isArray(resp.correctAnswer) ? resp.correctAnswer : String(resp.correctAnswer).split(/\s+/)
        const correct = correctArr.join(' ')
        const extras = (resp.options || []).filter((o) => !correctArr.includes(o)).slice(0, 3)
        draft = { ...draft, question: resp.prompt, correctAnswer: correct, wrongAnswers: [...extras, '', '', ''].slice(0, 3) }
      } else {
        draft = { ...draft, question: resp.prompt, correctAnswer: String(resp.correctAnswer) }
      }
      setEditing(draft)
      setAiOpen(false)
    } catch (e) {
      setAiState((s) => ({ ...s, error: e.message || 'AI xatolik' }))
    } finally {
      setAiState((s) => ({ ...s, loading: false }))
    }
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
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold">
            ✨ AI bilan yaratish
          </button>
          <button onClick={startCreate} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold">
            + Mashq qo'shish
          </button>
        </div>
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

      <Modal isOpen={aiOpen} onClose={() => setAiOpen(false)} title="✨ AI bilan mashq yaratish" size="md">
        <div className="space-y-4">
          <FormField label="Mashq turi">
            <FormSelect
              value={aiState.type}
              onChange={(v) => setAiState({ ...aiState, type: v })}
              options={SUPPORTED_TYPES}
            />
          </FormField>
          <FormField label="Mavzu (ixtiyoriy)">
            <FormInput
              value={aiState.topic}
              onChange={(v) => setAiState({ ...aiState, topic: v })}
              placeholder="masalan: oziq-ovqat, oila, sayohat"
            />
          </FormField>
          <FormField label="Maqsadli so'z (ixtiyoriy)">
            <FormInput
              value={aiState.word}
              onChange={(v) => setAiState({ ...aiState, word: v })}
              placeholder="masalan: apple, run, big"
            />
          </FormField>
          <FormField label="Daraja">
            <FormSelect
              value={aiState.level}
              onChange={(v) => setAiState({ ...aiState, level: v })}
              options={[
                { value: 'beginner', label: 'Boshlang\'ich' },
                { value: 'intermediate', label: "O'rtacha" },
                { value: 'advanced', label: 'Yuqori' },
              ]}
            />
          </FormField>
          {aiState.error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">{aiState.error}</div>}
          <ModalActions>
            <button onClick={() => setAiOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
            <button
              onClick={generateWithAI}
              disabled={aiState.loading}
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {aiState.loading ? 'AI yaratmoqda...' : 'Yaratish'}
            </button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}
