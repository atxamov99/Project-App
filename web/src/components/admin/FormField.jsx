export default function FormField({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</span>
      {children}
      {error && <small className="text-error text-xs mt-1 block">{error}</small>}
      {!error && hint && <small className="text-on-surface-variant text-xs mt-1 block">{hint}</small>}
    </label>
  )
}

export function FormInput({ value, onChange, type = 'text', placeholder, ...rest }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-container-low border-2 border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-secondary"
      {...rest}
    />
  )
}

export function FormTextarea({ value, onChange, placeholder, rows = 3, ...rest }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-surface-container-low border-2 border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-secondary resize-none"
      {...rest}
    />
  )
}

import Dropdown from '../shared/Dropdown'

export function FormSelect({ value, onChange, options, placeholder = 'Tanlang…', disabled }) {
  return (
    <Dropdown
      value={value ?? ''}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      size="md"
    />
  )
}
