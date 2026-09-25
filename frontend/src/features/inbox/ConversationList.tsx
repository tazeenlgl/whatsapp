import type { Contact, Conversation, Message } from '../../types/domain'

export type ConversationTab = 'all' | 'unread' | 'assigned' | 'archived'

export interface ConversationListItem {
  conversation: Conversation
  contact: Contact
  lastMessage?: Message
}

interface ConversationListProps {
  items: ConversationListItem[]
  totalCount: number
  unreadCount: number
  assignedCount: number
  archivedCount: number
  activeTab: ConversationTab
  onTabChange: (tab: ConversationTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedConversationId: string | null
  onSelectConversation: (conversationId: string) => void
}

export function ConversationList({
  items,
  totalCount,
  unreadCount,
  assignedCount,
  archivedCount,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-200 px-3 pt-3">
        <h2 className="px-1 pb-2 text-base font-bold text-slate-900">Conversations</h2>
        <div className="mb-2 flex items-center gap-1 overflow-x-auto pb-2 text-sm">
          <TabButton label="All" count={totalCount} active={activeTab === 'all'} onClick={() => onTabChange('all')} />
          <TabButton
            label="Unread"
            count={unreadCount}
            active={activeTab === 'unread'}
            onClick={() => onTabChange('unread')}
          />
          <TabButton
            label="Assigned"
            count={assignedCount}
            active={activeTab === 'assigned'}
            onClick={() => onTabChange('assigned')}
          />
          <TabButton
            label="Archived"
            count={archivedCount}
            active={activeTab === 'archived'}
            onClick={() => onTabChange('archived')}
          />
        </div>
      </div>

      <div className="shrink-0 border-b border-slate-200 p-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-nexcred-blue focus:outline-none focus:ring-2 focus:ring-nexcred-blue/20"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">No conversations match.</p>
        ) : (
          items.map(({ conversation, contact, lastMessage }) => (
            <ConversationRow
              key={conversation.id}
              contact={contact}
              conversation={conversation}
              lastMessage={lastMessage}
              selected={conversation.id === selectedConversationId}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
        active ? 'bg-nexcred-blue text-white' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`rounded-full px-1.5 text-xs font-semibold ${
            active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const avatarPalette = [
  'bg-blue-100 text-blue-700',
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
]

function avatarTone(seed: string) {
  const index = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % avatarPalette.length
  return avatarPalette[index]
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function ConversationRow({
  contact,
  conversation,
  lastMessage,
  selected,
  onClick,
}: {
  contact: Contact
  conversation: Conversation
  lastMessage?: Message
  selected: boolean
  onClick: () => void
}) {
  const preview =
    lastMessage?.kind === 'text'
      ? lastMessage.text?.split('\n')[0]
      : lastMessage
        ? `📎 ${lastMessage.mediaLabel ?? 'Attachment'}`
        : 'No messages yet'

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b border-slate-100 px-3 py-3 text-left transition-colors ${
        selected ? 'bg-blue-50' : 'hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarTone(contact.id)}`}
      >
        {initials(contact.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">{contact.name}</span>
          {lastMessage && (
            <span className="shrink-0 text-xs text-slate-400">{formatTime(lastMessage.timestamp)}</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-sm text-slate-500">{preview}</span>
          {conversation.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-nexcred-blue px-1.5 text-xs font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
