import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  widthClassName?: string
}

export function Modal({ open, onClose, children, widthClassName = 'max-w-lg' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />
      <div
        className={`relative w-full ${widthClassName} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl`}
      >
        {children}
      </div>
    </div>
  )
}
