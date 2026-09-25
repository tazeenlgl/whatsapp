interface StepIndicatorProps {
  step: number
  status: 'complete' | 'current' | 'upcoming'
}

export function StepIndicator({ step, status }: StepIndicatorProps) {
  const classes =
    status === 'complete'
      ? 'bg-nexcred-green text-white'
      : status === 'current'
        ? 'bg-nexcred-blue text-white'
        : 'bg-slate-200 text-slate-500'

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${classes}`}
    >
      {step}
    </span>
  )
}
