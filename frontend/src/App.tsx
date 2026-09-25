import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { mockCurrentProject } from './data/mockData'
import { LoginPage } from './features/auth/LoginPage'
import { WhatsAppAccountsPage } from './features/whatsapp-accounts/WhatsAppAccountsPage'

/**
 * UI-01 — WhatsApp Signup / Connection.
 *
 * This app currently renders only the login screen and the WhatsApp
 * Accounts / connection workflow (reference screen 1 of 7). "Signed in"
 * state is local UI state only; there is no authentication backend yet.
 */
function App() {
  const [signedIn, setSignedIn] = useState(false)

  if (!signedIn) {
    return <LoginPage onSignIn={() => setSignedIn(true)} />
  }

  return (
    <AppShell currentProject={mockCurrentProject} activeWhatsAppNav="accounts" userLabel="Admin User">
      <WhatsAppAccountsPage currentProject={mockCurrentProject} />
    </AppShell>
  )
}

export default App
