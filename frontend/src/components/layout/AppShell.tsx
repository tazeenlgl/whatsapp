import { useState, type ReactNode } from 'react'
import type { Project } from '../../types/domain'
import { Sidebar, type WhatsAppNavKey } from './Sidebar'

interface AppShellProps {
  currentProject: Project
  activeWhatsAppNav?: WhatsAppNavKey
  userLabel: string
  children: ReactNode
}

export function AppShell({ currentProject, activeWhatsAppNav, userLabel, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeWhatsAppNav={activeWhatsAppNav} />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full w-64">
            <Sidebar activeWhatsAppNav={activeWhatsAppNav} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-slate-400 sm:inline">Project</span>
              <span className="inline-flex items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-800">
                {currentProject.name}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nexcred-navy text-xs font-bold text-white">
              {userLabel
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{userLabel}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
