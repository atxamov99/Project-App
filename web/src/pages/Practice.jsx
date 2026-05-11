import Icon from '../components/shared/Icon'

export default function Practice() {
  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-2xl bg-primary-fixed flex items-center justify-center mb-5">
        <Icon name="fitness_center" filled className="text-secondary" style={{ fontSize: 48 }} />
      </div>
      <h1 className="text-3xl font-extrabold text-on-surface mb-2">Mashq</h1>
      <p className="text-on-surface-variant max-w-sm">
        So'zlarni takrorlash, talaffuzni mashq qilish va kuchsiz mavzularni mustahkamlash. Tez kunda.
      </p>
    </div>
  )
}
