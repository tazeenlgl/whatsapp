import { useState } from 'react'
import { mockProjects, mockWhatsAppAccounts } from '../../data/mockData'
import type { WhatsAppAccount } from '../../types/domain'

interface NumberRailProps {
  selectedAccountId: string
  onSelectAccount: (accountId: string) => void
  className?: string
}

/**
 * Step 1 — Project & Number Selection.
 *
 * Every WhatsApp number is its own isolated inbox. This rail is the only
 * way to change which number's conversations are being viewed — there is
 * no "All Conversations" view that mixes numbers together.
 */
export function NumberRail({ selectedAccountId, onSelectAccount, className = '' }: NumberRailProps) {
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(new Set())

  function toggleProject(projectId: string) {
    setCollapsedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  return (
    <div className={`flex flex-col gap-1 overflow-x-hidden overflow-y-auto ${className}`}>
      {mockProjects.map((project) => {
        const accounts = mockWhatsAppAccounts.filter((account) => account.projectId === project.id)
        if (accounts.length === 0) return null
        const isCollapsed = collapsedProjects.has(project.id)

        return (
          <div key={project.id} className="flex flex-col">
            <button
              onClick={() => toggleProject(project.id)}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {project.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {!isCollapsed && (
              <div className="flex flex-col gap-0.5 pb-1">
                {accounts.map((account) => (
                  <NumberRow
                    key={account.id}
                    account={account}
                    selected={account.id === selectedAccountId}
                    onSelect={() => onSelectAccount(account.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function NumberRow({
  account,
  selected,
  onSelect,
}: {
  account: WhatsAppAccount
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      title={`${account.name} · ${account.phoneNumber}`}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 pl-4 text-left text-sm transition-colors ${
        selected
          ? 'bg-green-50 font-semibold text-green-800 ring-1 ring-inset ring-green-200'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          selected ? 'bg-nexcred-green' : account.status === 'active' ? 'bg-slate-300' : 'bg-slate-200'
        }`}
      />
      <span className="truncate">{account.phoneNumber}</span>
    </button>
  )
}
