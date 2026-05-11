export default function Icon({ name, filled = false, className = '', style = {}, ...rest }) {
  const cls = `material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`.trim()
  return (
    <span className={cls} style={style} aria-hidden="true" {...rest}>
      {name}
    </span>
  )
}
