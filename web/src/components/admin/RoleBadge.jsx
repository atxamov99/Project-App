const STYLES = {
  STUDENT:        'bg-surface-container-high text-on-surface-variant',
  CONTENT_EDITOR: 'bg-primary-fixed text-on-primary-fixed-variant',
  ADMIN:          'bg-secondary text-on-secondary',
}

const LABELS = {
  STUDENT:        'STUDENT',
  CONTENT_EDITOR: 'EDITOR',
  ADMIN:          'ADMIN',
}

export default function RoleBadge({ role }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${STYLES[role] ?? STYLES.STUDENT}`}>
      {LABELS[role] ?? role}
    </span>
  )
}
