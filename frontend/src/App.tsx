import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import type { WhatsAppNavKey } from './components/layout/Sidebar'
import { mockProjects, mockWhatsAppAccounts } from './data/mockData'
import { LoginPage } from './features/auth/LoginPage'
import { InboxPage } from './features/inbox/InboxPage'
import { WhatsAppAccountsPage } from './features/whatsapp-accounts/WhatsAppAccountsPage'

type Screen = 'inbox' | 'accounts'

/**
 * UI-01 — WhatsApp Signup / Connection.
 * UI-02 — Inbox & Conversation.
 *
 * "Signed in" and the active screen are local UI state only; there is no
 * authentication backend or router yet.
 */
function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [screen, setScreen] = useState<Screen>('inbox')
  const [inboxAccountId, setInboxAccountId] = useState(mockWhatsAppAccounts[0].id)

  if (!signedIn) {
    return <LoginPage onSignIn={() => setSignedIn(true)} />
  }

  function handleNavigateWhatsApp(key: WhatsAppNavKey) {
    if (key === 'inbox') setScreen('inbox')
    if (key === 'accounts') setScreen('accounts')
    // 'telegram' has no screen yet — Telegram is a future channel (CLAUDE.md Section 18).
  }

  function handleOpenInbox(accountId: string) {
    setInboxAccountId(accountId)
    setScreen('inbox')
  }

  // WhatsAppAccountsPage is scoped to a single project — the accounts
  // screen shows the project the currently selected inbox number belongs to.
  const selectedAccount =
    mockWhatsAppAccounts.find((a) => a.id === inboxAccountId) ?? mockWhatsAppAccounts[0]
  const currentProject =
    mockProjects.find((p) => p.id === selectedAccount.projectId) ?? mockProjects[0]

  return (
    <AppShell
      currentProject={currentProject}
      activeWhatsAppNav={screen}
      onNavigateWhatsApp={handleNavigateWhatsApp}
      userLabel="Admin User"
      fullBleed={screen === 'inbox'}
    >
      {screen === 'inbox' ? (
        <InboxPage initialAccountId={inboxAccountId} />
      ) : (
        <WhatsAppAccountsPage currentProject={currentProject} onOpenInbox={handleOpenInbox} />
      )}
    </AppShell>
  )
}

export default App
