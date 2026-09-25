import { useMemo, useState } from 'react'
import { mockProjects, mockWhatsAppAccounts } from '../../data/mockData'
import { mockContacts, mockConversations, mockMessages, mockTransactionsByContact } from '../../data/mockInbox'
import type { Contact, Conversation, Message, TransactionSummary } from '../../types/domain'
import { ChatWindow } from './ChatWindow'
import { ConversationList, type ConversationListItem, type ConversationTab } from './ConversationList'
import { CustomerDetailsPanel } from './CustomerDetailsPanel'
import { NumberRail } from './NumberRail'
import { NumberSwitcherModal } from './NumberSwitcherModal'

type MobilePanel = 'list' | 'chat'

function latestMessage(messages: Message[], conversationId: string): Message | undefined {
  const forConversation = messages.filter((m) => m.conversationId === conversationId)
  if (forConversation.length === 0) return undefined
  return [...forConversation].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )[0]
}

interface InboxPageProps {
  initialAccountId?: string
}

/**
 * The Inbox is always scoped to exactly one WhatsApp number
 * (`selectedAccountId`). Changing the number changes which conversations,
 * contacts, and messages are visible — there is no merged "All
 * Conversations" view across numbers.
 */
export function InboxPage({ initialAccountId }: InboxPageProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    initialAccountId ?? mockWhatsAppAccounts[0].id,
  )

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [transactionsByContact, setTransactionsByContact] =
    useState<Record<string, TransactionSummary[]>>(mockTransactionsByContact)

  const accountConversations = conversations.filter((c) => c.whatsAppAccountId === selectedAccountId)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    accountConversations.find((c) => !c.archived)?.id ?? null,
  )

  const [activeTab, setActiveTab] = useState<ConversationTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [numberSwitcherOpen, setNumberSwitcherOpen] = useState(false)

  const selectedAccount = mockWhatsAppAccounts.find((a) => a.id === selectedAccountId) ?? mockWhatsAppAccounts[0]
  const currentProject = mockProjects.find((p) => p.id === selectedAccount.projectId) ?? mockProjects[0]

  function handleSelectAccount(accountId: string) {
    if (accountId === selectedAccountId) return
    setSelectedAccountId(accountId)
    const firstOpen = conversations.find((c) => c.whatsAppAccountId === accountId && !c.archived)
    setSelectedConversationId(firstOpen?.id ?? null)
    setActiveTab('all')
    setSearchQuery('')
    setMobilePanel('list')
    setDetailsOpen(false)
  }

  const listItems: ConversationListItem[] = useMemo(() => {
    const scoped = conversations.filter((c) => c.whatsAppAccountId === selectedAccountId)

    const byTab = scoped.filter((c) => {
      if (activeTab === 'archived') return c.archived
      if (c.archived) return false
      if (activeTab === 'unread') return c.unreadCount > 0
      if (activeTab === 'assigned') return Boolean(c.assignedToUserId)
      return true
    })

    const query = searchQuery.trim().toLowerCase()
    const filtered = byTab.filter((conversation) => {
      if (!query) return true
      const contact = contacts.find((c) => c.id === conversation.contactId)
      const last = latestMessage(messages, conversation.id)
      return (
        contact?.name.toLowerCase().includes(query) ||
        contact?.phone.toLowerCase().includes(query) ||
        last?.text?.toLowerCase().includes(query)
      )
    })

    return filtered
      .map((conversation) => ({
        conversation,
        contact: contacts.find((c) => c.id === conversation.contactId)!,
        lastMessage: latestMessage(messages, conversation.id),
      }))
      .filter((item) => Boolean(item.contact))
      .sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0
        const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0
        return bTime - aTime
      })
  }, [conversations, contacts, messages, selectedAccountId, activeTab, searchQuery])

  const scopedNonArchived = conversations.filter((c) => c.whatsAppAccountId === selectedAccountId && !c.archived)
  const scopedArchived = conversations.filter((c) => c.whatsAppAccountId === selectedAccountId && c.archived)
  const totalCount = scopedNonArchived.length
  const unreadCount = scopedNonArchived.filter((c) => c.unreadCount > 0).length
  const assignedCount = scopedNonArchived.filter((c) => Boolean(c.assignedToUserId)).length
  const archivedCount = scopedArchived.length

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null
  const selectedContact = selectedConversation
    ? contacts.find((c) => c.id === selectedConversation.contactId) ?? null
    : null
  const selectedMessages = selectedConversation
    ? messages
        .filter((m) => m.conversationId === selectedConversation.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : []

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId)
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    )
    setMobilePanel('chat')
  }

  function handleSendMessage(text: string) {
    if (!selectedConversation) return
    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      direction: 'outgoing',
      kind: 'text',
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    }
    setMessages((prev) => [...prev, message])
  }

  function handleUpdateContact(updates: Partial<Pick<Contact, 'notes' | 'tags'>>) {
    if (!selectedContact) return
    setContacts((prev) =>
      prev.map((c) => (c.id === selectedContact.id ? { ...c, ...updates } : c)),
    )
  }

  function handleAddTransaction(transaction: TransactionSummary) {
    if (!selectedContact) return
    setTransactionsByContact((prev) => ({
      ...prev,
      [selectedContact.id]: [transaction, ...(prev[selectedContact.id] ?? [])],
    }))
  }

  function handleAssign() {
    if (!selectedConversation) return
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedConversation.id ? { ...c, assignedToUserId: 'user_tazeen' } : c)),
    )
  }

  function handleArchive() {
    if (!selectedConversation) return
    const conversationId = selectedConversation.id
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, archived: true } : c)),
    )
    setSelectedConversationId(null)
    setMobilePanel('list')
    setDetailsOpen(false)
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {/* Workspace context bar — mirrors the reference's "<Number>  Online"
          header. The mobile/tablet number-switcher pill below already
          carries this context at <lg, so this bar is desktop-only. */}
      <div className="hidden shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nexcred-green text-white">
            <WhatsAppGlyph />
          </span>
          <span className="font-semibold text-slate-900">{selectedAccount.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">{selectedAccount.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-nexcred-green">
          <span className="h-2 w-2 rounded-full bg-nexcred-green" />
          Online
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1">
        {/* Project & Number Selection — desktop only */}
        <div className="hidden h-full w-52 shrink-0 border-r border-slate-200 bg-white p-3 lg:flex lg:flex-col">
          <NumberRail selectedAccountId={selectedAccountId} onSelectAccount={handleSelectAccount} />
        </div>

        {/* Conversation List */}
        <div
          className={`h-full min-h-0 w-full shrink-0 border-r border-slate-200 bg-white md:w-72 lg:w-80 ${
            mobilePanel === 'list' ? 'flex flex-col' : 'hidden md:flex md:flex-col'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 lg:hidden">
            <button
              onClick={() => setNumberSwitcherOpen(true)}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-nexcred-green" />
              <span className="truncate">
                {currentProject.name} · {selectedAccount.phoneNumber}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </button>
          </div>
          <ConversationList
            items={listItems}
            totalCount={totalCount}
            unreadCount={unreadCount}
            assignedCount={assignedCount}
            archivedCount={archivedCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Window */}
        <div className={`h-full min-h-0 min-w-0 flex-1 ${mobilePanel === 'chat' ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
          {selectedConversation && selectedContact ? (
            <ChatWindow
              account={selectedAccount}
              contact={selectedContact}
              messages={selectedMessages}
              onSendMessage={handleSendMessage}
              onBack={() => setMobilePanel('list')}
              onOpenDetails={() => setDetailsOpen(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-slate-50 px-6 text-center">
              <p className="text-sm font-medium text-slate-500">No conversation selected</p>
              <p className="text-xs text-slate-400">
                Choose a conversation from {currentProject.name} · {selectedAccount.phoneNumber} to view messages.
              </p>
            </div>
          )}
        </div>

        {/* Customer Details — inline on desktop, overlay drawer below lg */}
        <div className="hidden h-full w-72 shrink-0 border-l border-slate-200 lg:block">
          {selectedContact && (
            <CustomerDetailsPanel
              contact={selectedContact}
              transactions={transactionsByContact[selectedContact.id] ?? []}
              onUpdateContact={handleUpdateContact}
              onAddTransaction={handleAddTransaction}
              onAssign={handleAssign}
              onArchive={handleArchive}
            />
          )}
        </div>
      </div>

      {detailsOpen && selectedContact && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close details overlay"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setDetailsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm shadow-xl">
            <CustomerDetailsPanel
              contact={selectedContact}
              transactions={transactionsByContact[selectedContact.id] ?? []}
              onUpdateContact={handleUpdateContact}
              onAddTransaction={handleAddTransaction}
              onAssign={handleAssign}
              onArchive={handleArchive}
              onClose={() => setDetailsOpen(false)}
            />
          </div>
        </div>
      )}

      <NumberSwitcherModal
        open={numberSwitcherOpen}
        selectedAccountId={selectedAccountId}
        onSelectAccount={handleSelectAccount}
        onClose={() => setNumberSwitcherOpen(false)}
      />
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.93L2 22l5.24-1.37A9.96 9.96 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.87 14.19c-.25.7-1.44 1.34-1.99 1.4-.51.06-1.16.09-1.87-.12-.43-.13-.99-.31-1.7-.6-3-1.29-4.96-4.34-5.11-4.54-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.05-2.49c.27-.3.6-.37.8-.37h.57c.19 0 .43-.05.66.51.25.62.85 2.14.92 2.29.07.15.12.33.02.53-.1.2-.15.32-.29.5-.15.18-.31.41-.44.55-.15.15-.3.32-.13.62.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.3.15.47.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
    </svg>
  )
}
