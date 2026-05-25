import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * Krasiv dropdown — native `<select>` o'rniga.
 *
 * Props:
 *  - value: string
 *  - onChange: (value) => void
 *  - options: [{ value, label, icon?, hint? }]
 *  - label?: string  (kichik header yuqorida)
 *  - size?: 'sm' | 'md'
 *  - placeholder?: string
 *  - className?: string
 *  - disabled?: boolean
 */
export default function Dropdown({
  value,
  onChange,
  options,
  label,
  size = 'md',
  placeholder = 'Tanlang',
  className = '',
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const wrapRef = useRef(null)
  const listRef = useRef(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => (h + 1) % options.length) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => (h - 1 + options.length) % options.length) }
      if (e.key === 'Enter' && highlight >= 0) {
        e.preventDefault()
        onChange(options[highlight].value)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, highlight, options, onChange])

  useEffect(() => {
    if (open) setHighlight(options.findIndex((o) => o.value === value))
  }, [open, value, options])

  const sizes = {
    sm: { btn: 'h-9 px-3 text-sm', item: 'px-3 py-2 text-sm' },
    md: { btn: 'h-11 px-4 text-sm', item: 'px-4 py-2.5 text-sm' },
  }
  const sz = sizes[size]

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 bg-white border-2 border-outline-variant rounded-xl font-semibold text-tertiary
          hover:border-on-surface-variant/40 focus:outline-none focus:border-secondary
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${sz.btn} ${open ? 'border-secondary ring-2 ring-secondary/15' : ''}`}
      >
        <span className="flex items-center gap-2 min-w-0 grow">
          {selected?.icon && <span className="text-lg leading-none">{selected.icon}</span>}
          <span className={`truncate text-left ${!selected ? 'text-on-surface-variant font-medium' : ''}`}>
            {selected?.label ?? placeholder}
          </span>
        </span>
        <Icon
          name="expand_more"
          className={`text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ fontSize: 20 }}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1.5 left-0 right-0 bg-white border-2 border-outline-variant rounded-xl shadow-xl loft-shadow overflow-hidden animate-[dropdownIn_120ms_ease-out]"
          style={{ animation: 'none' }}
          role="listbox"
        >
          <div className="max-h-72 overflow-y-auto py-1">
            {options.map((opt, i) => {
              const isActive = opt.value === value
              const isHi = i === highlight
              return (
                <button
                  type="button"
                  key={opt.value}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  role="option"
                  aria-selected={isActive}
                  className={`w-full flex items-center gap-3 text-left transition-colors
                    ${sz.item}
                    ${isHi ? 'bg-primary-fixed/60' : 'bg-white'}
                    ${isActive ? 'text-secondary font-bold' : 'text-tertiary font-medium'}
                  `}
                >
                  {opt.icon && <span className="text-lg leading-none shrink-0">{opt.icon}</span>}
                  <span className="grow truncate">{opt.label}</span>
                  {opt.hint && <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold shrink-0">{opt.hint}</span>}
                  {isActive && <Icon name="check" className="text-secondary shrink-0" style={{ fontSize: 18 }} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
