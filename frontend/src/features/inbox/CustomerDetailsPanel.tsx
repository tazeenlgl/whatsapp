import { useState, type ReactNode } from 'react'
import { Badge, Button } from '../../components/ui'
import type { Contact, TransactionSummary } from '../../types/domain'
import { NewTransactionDialog } from './NewTransactionDialog'

interface CustomerDetailsPanelProps {
  contact: Contact
  transactions: TransactionSummary[]
  onUpdateContact: (updates: Partial<Pick<Contact, 'notes' | 'tags'>>) => void
  onAddTransaction: (transaction: TransactionSummary) => void
  onAssign: () => void
  onArchive: () => void
  onClose?: () => void
}

export function CustomerDetailsPanel({
  contact,
  transactions,
  onUpdateContact,
  onAddTransaction,
  onAssign,
  onArchive,
  onClose,
}: CustomerDetailsPanelProps) {
  const [editing, setEditing] = useState(false)
  const [notesDraft, setNotesDraft] = useState(contact.notes)
  const [newTransactionOpen, setNewTransactionOpen] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  function handleSaveNotes() {
    onUpdateContact({ notes: notesDraft })
    setEditing(false)
  }

  function flashFeedback(message: string) {
    setActionFeedback(message)
    window.setTimeout(() => setActionFeedback((current) => (current === message ? null : current)), 2000)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-bold text-slate-900">Contact Information</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNotesDraft(contact.notes)
              setEditing((prev) => !prev)
            }}
            className="text-xs font-semibold text-nexcred-blue hover:underline"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close details"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
            {contact.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{contact.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
              {contact.phone}
              <WhatsAppGlyph />
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Customer since {contact.customerSince}</p>
          </div>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <DetailRow label="Name" value={contact.name} />
          <DetailRow label="Phone" value={contact.phone} />
          <div className="flex items-start justify-between gap-3">
            <dt className="shrink-0 text-slate-500">Tags</dt>
            <dd className="flex flex-wrap justify-end gap-1.5">
              {contact.tags.length === 0 && <span className="text-slate-400">—</span>}
              {contact.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>

        <div>
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</h3>
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={notesDraft}
                onChange={(event) => setNotesDraft(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-nexcred-blue focus:outline-none focus:ring-2 focus:ring-nexcred-blue/20"
                placeholder="Add a note about this customer..."
              />
              <Button className="self-end" onClick={handleSaveNotes}>
                Save
              </Button>
            </div>
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {contact.notes || 'No notes yet.'}
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Conversation Actions</h3>
          <div className="flex flex-col gap-1.5">
            <ActionButton
              label="Assign to User"
              icon="assign"
              onClick={() => {
                onAssign()
                flashFeedback('Conversation assigned (mock).')
              }}
            />
            <ActionButton label="Add Note" icon="note" onClick={() => setEditing(true)} />
            <ActionButton
              label="Create Transaction"
              icon="transaction"
              onClick={() => setNewTransactionOpen(true)}
            />
            <ActionButton
              label="Archive Conversation"
              icon="archive"
              onClick={() => {
                onArchive()
                flashFeedback('Conversation archived (mock).')
              }}
            />
          </div>
          {actionFeedback && <p className="mt-2 text-xs font-medium text-nexcred-green">{actionFeedback}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recent Transactions</h3>
            <button
              onClick={() => setNewTransactionOpen(true)}
              className="text-xs font-semibold text-nexcred-blue hover:underline"
            >
              + New
            </button>
          </div>
          {transactions.length === 0 ? (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-400">No transactions yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {transactions.map((txn) => (
                <div key={txn.id} className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{txn.code}</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {txn.amount > 0 ? `₹${txn.amount.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-slate-500">{txn.title}</span>
                    <Badge tone={txn.status === 'paid' ? 'success' : txn.status === 'pending' ? 'pending' : 'neutral'}>
                      {txn.status === 'enquiry' ? 'Enquiry' : txn.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{txn.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewTransactionDialog
        open={newTransactionOpen}
        contactName={contact.name}
        onClose={() => setNewTransactionOpen(false)}
        onCreate={(transaction) => {
          onAddTransaction(transaction)
          setNewTransactionOpen(false)
          flashFeedback('Transaction created (mock).')
        }}
      />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate font-medium text-slate-800">{value}</dd>
    </div>
  )
}

const actionIcons: Record<string, string> = {
  assign: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  note: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z',
  transaction: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  archive: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125z',
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: keyof typeof actionIcons
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d={actionIcons[icon]} />
      </svg>
      {label}
    </button>
  )
}

function WhatsAppGlyph(): ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-nexcred-green">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.93L2 22l5.24-1.37A9.96 9.96 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.87 14.19c-.25.7-1.44 1.34-1.99 1.4-.51.06-1.16.09-1.87-.12-.43-.13-.99-.31-1.7-.6-3-1.29-4.96-4.34-5.11-4.54-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.05-2.49c.27-.3.6-.37.8-.37h.57c.19 0 .43-.05.66.51.25.62.85 2.14.92 2.29.07.15.12.33.02.53-.1.2-.15.32-.29.5-.15.18-.31.41-.44.55-.15.15-.3.32-.13.62.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.3.15.47.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
    </svg>
  )
}
