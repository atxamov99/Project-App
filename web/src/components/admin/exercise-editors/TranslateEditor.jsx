import FormField, { FormInput, FormTextarea } from '../FormField'

export default function TranslateEditor({ value, onChange }) {
  function setField(field, v) {
    onChange({ ...value, [field]: v })
  }

  function setWrong(idx, v) {
    const arr = [...(value.wrongAnswers || [])]
    arr[idx] = v
    onChange({ ...value, wrongAnswers: arr })
  }

  function ensureWrongs() {
    return [0, 1, 2].map((i) => value.wrongAnswers?.[i] ?? '')
  }

  return (
    <div className="space-y-3">
      <FormField label="Savol (manba til)">
        <FormInput value={value.question} onChange={(v) => setField('question', v)} placeholder="Salom, qandaysiz?" />
      </FormField>
      <FormField label="To'g'ri javob (maqsad til)">
        <FormInput value={value.correctAnswer} onChange={(v) => setField('correctAnswer', v)} placeholder="Hello, how are you" />
      </FormField>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Noto'g'ri variantlar (3)</p>
        <div className="space-y-2">
          {ensureWrongs().map((w, i) => (
            <FormInput key={i} value={w} onChange={(v) => setWrong(i, v)} placeholder={`Variant ${i + 1}`} />
          ))}
        </div>
      </div>
      <FormField label="Tushuntirish (ixtiyoriy)">
        <FormTextarea value={value.explanation} onChange={(v) => setField('explanation', v)} placeholder="Nega bu javob to'g'ri..." />
      </FormField>
    </div>
  )
}
