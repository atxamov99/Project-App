import FormField, { FormInput, FormTextarea } from '../FormField'

export default function BuildSentenceEditor({ value, onChange }) {
  function setField(field, v) {
    onChange({ ...value, [field]: v })
  }

  // wrongAnswers shu yerda "qo'shimcha so'zlar" sifatida ishlatiladi
  // (foydalanuvchining word bank'iga aralashtiriladi)
  return (
    <div className="space-y-3">
      <FormField label="Savol (manba til)">
        <FormInput value={value.question} onChange={(v) => setField('question', v)} placeholder="Mening ismim Aziz" />
      </FormField>
      <FormField label="To'g'ri jumla (so'zlarga bo'linadi)" hint="Bo'shliq bilan ajratilgan so'zlar foydalanuvchi tugmalarda ko'radi">
        <FormInput value={value.correctAnswer} onChange={(v) => setField('correctAnswer', v)} placeholder="My name is Aziz" />
      </FormField>
      <FormField label="Qo'shimcha (chalg'ituvchi) so'zlar" hint="Vergul bilan ajrating: emas, this, that">
        <FormInput
          value={(value.wrongAnswers || []).join(', ')}
          onChange={(v) => setField('wrongAnswers', v.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="this, that, hello"
        />
      </FormField>
      <FormField label="Tushuntirish (ixtiyoriy)">
        <FormTextarea value={value.explanation} onChange={(v) => setField('explanation', v)} />
      </FormField>
    </div>
  )
}
