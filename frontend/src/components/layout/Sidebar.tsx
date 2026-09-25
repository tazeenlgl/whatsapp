import { useState } from 'react'

interface NavItemProps {
  label: string
  icon: ReturnType<typeof IconPlaceholder>
  active?: boolean
  onClick?: () => void
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function IconPlaceholder(path: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="h-4.5 w-4.5 shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const icons = {
  dashboard: 'M3.75 6.75A2.25 2.25 0 016 4.5h2.25a2.25 2.25 0 012.25 2.25V9A2.25 2.25 0 018.25 11.25H6A2.25 2.25 0 013.75 9V6.75zM3.75 15A2.25 2.25 0 016 12.75h2.25A2.25 2.25 0 0110.5 15v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V15zM13.5 6.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V9A2.25 2.25 0 0118 11.25h-2.25A2.25 2.25 0 0113.5 9V6.75zM13.5 15a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 19.5h-2.25a2.25 2.25 0 01-2.25-2.25V15z',
  projects: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0v6a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-6m-19.5 0h19.5M2.25 12.75l1.181-6.514a1.5 1.5 0 011.476-1.236h14.186a1.5 1.5 0 011.476 1.236l1.181 6.514',
  contacts: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  transactions: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  automation: 'M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.795l-.75-1.3M7.5 4.205L16.5 19.795',
  communication: 'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  settings: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28z',
  inbox: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  whatsapp: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
  telegram: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
  chevron: 'M8.25 4.5l7.5 7.5-7.5 7.5',
}

export type WhatsAppNavKey = 'inbox' | 'accounts' | 'telegram'

interface SidebarProps {
  activeWhatsAppNav?: WhatsAppNavKey
  onNavigateWhatsApp?: (key: WhatsAppNavKey) => void
}

export function Sidebar({ activeWhatsAppNav = 'inbox', onNavigateWhatsApp }: SidebarProps) {
  const [communicationOpen, setCommunicationOpen] = useState(true)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-nexcred-navy text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-nexcred-navy">
          N
        </span>
        <span className="text-lg font-bold tracking-tight">Nexcred</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        <NavItem label="Dashboard" icon={IconPlaceholder(icons.dashboard)} />
        <NavItem label="Projects" icon={IconPlaceholder(icons.projects)} />
        <NavItem label="Contacts" icon={IconPlaceholder(icons.contacts)} />
        <NavItem label="Transactions" icon={IconPlaceholder(icons.transactions)} />
        <NavItem label="Automation" icon={IconPlaceholder(icons.automation)} />

        <button
          onClick={() => setCommunicationOpen((open) => !open)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          {IconPlaceholder(icons.communication)}
          <span className="flex-1">Communication</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${communicationOpen ? 'rotate-90' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icons.chevron} />
          </svg>
        </button>

        {communicationOpen && (
          <div className="ml-4 flex flex-col gap-1 border-l border-white/10 pl-3">
            <NavItem
              label="Inbox"
              icon={IconPlaceholder(icons.inbox)}
              active={activeWhatsAppNav === 'inbox'}
              onClick={() => onNavigateWhatsApp?.('inbox')}
            />
            <NavItem
              label="WhatsApp Accounts"
              icon={IconPlaceholder(icons.whatsapp)}
              active={activeWhatsAppNav === 'accounts'}
              onClick={() => onNavigateWhatsApp?.('accounts')}
            />
            <NavItem
              label="Telegram Accounts"
              icon={IconPlaceholder(icons.telegram)}
              active={activeWhatsAppNav === 'telegram'}
              onClick={() => onNavigateWhatsApp?.('telegram')}
            />
          </div>
        )}

        <div className="mt-auto pt-2">
          <NavItem label="Settings" icon={IconPlaceholder(icons.settings)} />
        </div>
      </nav>
    </aside>
  )
}
