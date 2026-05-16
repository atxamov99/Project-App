import Icon from '../shared/Icon'

export default function StatCard({ icon, label, value, hint, accent = false }) {
  return (
    <div className={`bg-surface-container-lowest border rounded-xl p-4 ${accent ? 'border-secondary' : 'border-outline-variant'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        {icon && <Icon name={icon} className="text-secondary" style={{ fontSize: 18 }} />}
      </div>
      <p className="text-3xl font-extrabold text-on-surface">{value}</p>
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  )
}
