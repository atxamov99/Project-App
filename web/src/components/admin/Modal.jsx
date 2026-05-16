import { useEffect } from 'react'
import Icon from '../shared/Icon'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] ?? 'max-w-md'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full ${sizeClass} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container" aria-label="Yopish">
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export function ModalActions({ children }) {
  return <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-outline-variant">{children}</div>
}
