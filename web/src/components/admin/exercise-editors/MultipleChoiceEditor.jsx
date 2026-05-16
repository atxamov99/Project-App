import FormField, { FormInput, FormTextarea } from '../FormField'

export default function MultipleChoiceEditor({ value, onChange }) {
  function setField(field, v) {
    onChange({ ...value, [field]: v })
  }

  function setWrong(idx, v) {
    const arr = [...(value.wrongAnswers || [])]
    arr[idx] = v
    onChange({ ...value, wrongAnswers: arr })
  }

  return (
    <div className="space-y-3">
      <FormField label="Savol">
        <FormInput value={value.question} onChange={(v) => setField('question', v)} placeholder='"Singil" inglizchada?' />
      </FormField>
      <FormField label="To'g'ri javob">
        <FormInput value={value.correctAnswer} onChange={(v) => setField('correctAnswer', v)} placeholder="sister" />
      </FormField>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Noto'g'ri variantlar</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <FormInput
              key={i}
              value={value.wrongAnswers?.[i] ?? ''}
              onChange={(v) => setWrong(i, v)}
              placeholder={`Variant ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <FormField label="Tushuntirish (ixtiyoriy)">
        <FormTextarea value={value.explanation} onChange={(v) => setField('explanation', v)} />
      </FormField>
    </div>
  )
}
