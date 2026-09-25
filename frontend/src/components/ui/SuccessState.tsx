import type { ReactNode } from 'react'

interface SuccessStateProps {
  title: string
  description?: ReactNode
  action?: ReactNode
}

export function SuccessState({ title, description, action }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-nexcred-green text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="h-7 w-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      <h3 className="text-lg font-bold text-green-800">{title}</h3>
      {description && <div className="max-w-sm text-sm text-green-700">{description}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
