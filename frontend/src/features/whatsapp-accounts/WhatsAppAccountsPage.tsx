import { useState } from 'react'
import { Badge, Button, Card, EmptyState } from '../../components/ui'
import { mockWhatsAppAccounts } from '../../data/mockData'
import type { Project, WhatsAppAccount, WhatsAppAccountStatus } from '../../types/domain'
import { ConnectWhatsAppFlow } from './ConnectWhatsAppFlow'

function statusTone(status: WhatsAppAccountStatus) {
  if (status === 'active') return 'success' as const
  if (status === 'pending') return 'pending' as const
  return 'danger' as const
}

interface WhatsAppAccountsPageProps {
  currentProject: Project
  onOpenInbox?: (accountId: string) => void
}

/**
 * Steps 2 & 3 — WhatsApp Accounts list + "Add New WhatsApp Account" entry
 * point. Accounts shown here are scoped to the current project only —
 * this list must never mix accounts from other projects.
 */
export function WhatsAppAccountsPage({ currentProject, onOpenInbox }: WhatsAppAccountsPageProps) {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>(
    mockWhatsAppAccounts.filter((account) => account.projectId === currentProject.id),
  )
  const [flowOpen, setFlowOpen] = useState(false)

  function handleConnected(newAccount: WhatsAppAccount) {
    // Add the account, but leave the modal open — the flow shows its own
    // "Account Connected" success step, and closes itself when the user
    // clicks "Go to Inbox".
    setAccounts((prev) => [...prev, newAccount])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">WhatsApp Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Numbers connected to <span className="font-medium text-slate-700">{currentProject.name}</span>.
            Each number has its own isolated inbox, contacts, and templates.
          </p>
        </div>
        <Button variant="whatsapp" onClick={() => setFlowOpen(true)} className="w-full sm:w-auto">
          <PlusIcon />
          Add WhatsApp Account
        </Button>
      </div>

      <Card className="p-0">
        {accounts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No WhatsApp accounts yet"
              description="Connect your first WhatsApp Business number to start receiving messages in this project."
              action={
                <Button variant="whatsapp" onClick={() => setFlowOpen(true)}>
                  Add WhatsApp Account
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => onOpenInbox?.(account.id)}
                  className={`border-b border-slate-100 last:border-0 ${
                    onOpenInbox ? 'cursor-pointer hover:bg-slate-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{account.name}</td>
                  <td className="px-6 py-4 text-slate-600">{account.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <Badge tone={statusTone(account.status)}>
                      {account.status === 'active' ? 'Active' : account.status === 'pending' ? 'Pending' : 'Disconnected'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </Card>

      <ConnectWhatsAppFlow
        open={flowOpen}
        currentProject={currentProject}
        onClose={() => setFlowOpen(false)}
        onConnected={handleConnected}
        onGoToInbox={onOpenInbox}
      />
    </div>
  )
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
