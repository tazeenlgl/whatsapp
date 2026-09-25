import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'pending' | 'neutral' | 'danger'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20',
  danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {tone === 'success' && <span className="h-1.5 w-1.5 rounded-full bg-green-600" />}
      {tone === 'pending' && <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />}
      {children}
    </span>
  )
}
