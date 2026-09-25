import { useState, type FormEvent, type ReactNode } from 'react'
import type { Contact, Message, WhatsAppAccount } from '../../types/domain'

type ComposerTab = 'message' | 'template' | 'media'

interface ChatWindowProps {
  account: WhatsAppAccount
  contact: Contact
  messages: Message[]
  onSendMessage: (text: string) => void
  onBack?: () => void
  onOpenDetails?: () => void
}

export function ChatWindow({ account, contact, messages, onSendMessage, onBack, onOpenDetails }: ChatWindowProps) {
  const [composerTab, setComposerTab] = useState<ComposerTab>('message')
  const [draft, setDraft] = useState('')

  function handleSend(event: FormEvent) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onSendMessage(trimmed)
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to conversations"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {contact.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{contact.name}</p>
            <p className="truncate text-xs text-slate-500">{contact.phone}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <HeaderIconButton label="Star conversation">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </HeaderIconButton>
          <HeaderIconButton label="Manage tags">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
          </HeaderIconButton>
          <HeaderIconButton label="Assign conversation">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </HeaderIconButton>
          {onOpenDetails && (
            <button
              onClick={onOpenDetails}
              aria-label="View customer details"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-4.5 w-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-400 shadow-sm">Today</span>
        </div>

        {messages.length === 0 ? (
          <p className="pt-8 text-center text-sm text-slate-400">
            No messages yet in {account.name} · {account.phoneNumber}
          </p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-1 border-b border-slate-100 px-4 pt-2 text-sm">
          <ComposerTabButton label="Message" icon="message" active={composerTab === 'message'} onClick={() => setComposerTab('message')} />
          <ComposerTabButton label="Template" icon="template" active={composerTab === 'template'} onClick={() => setComposerTab('template')} />
          <ComposerTabButton label="Media" icon="media" active={composerTab === 'media'} onClick={() => setComposerTab('media')} />
        </div>

        {composerTab === 'message' && (
          <form onSubmit={handleSend} className="flex items-end gap-2 p-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSend(event)
                }
              }}
              rows={1}
              placeholder="Type a message..."
              className="max-h-32 flex-1 resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-nexcred-blue focus:outline-none focus:ring-2 focus:ring-nexcred-blue/20"
            />
            <ComposerActionButton label="Emoji">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </ComposerActionButton>
            <ComposerActionButton label="Attach media">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </ComposerActionButton>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nexcred-blue text-white transition-colors hover:bg-nexcred-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        )}

        {composerTab === 'template' && (
          <div className="p-4 text-sm text-slate-500">
            Approved WhatsApp templates for {account.name} will appear here once the Templates module is built (UI-04).
          </div>
        )}

        {composerTab === 'media' && (
          <div className="p-4 text-sm text-slate-500">
            Media upload for this conversation will be implemented alongside inbox media handling.
          </div>
        )}
      </div>
    </div>
  )
}

function HeaderIconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4.5 w-4.5">
        {children}
      </svg>
    </button>
  )
}

function ComposerActionButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
        {children}
      </svg>
    </button>
  )
}

function ComposerTabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: 'message' | 'template' | 'media'
  active: boolean
  onClick: () => void
}) {
  const paths: Record<typeof icon, string> = {
    message: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
    template: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    media: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 22.5H6a2.25 2.25 0 01-2.25-2.25V3.75A2.25 2.25 0 016 1.5h9.75L21.75 7.5v12.75A2.25 2.25 0 0119.5 22.5H18zM15 6.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
        active ? 'border-nexcred-blue text-nexcred-blue' : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} />
      </svg>
      {label}
    </button>
  )
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function MessageBubble({ message }: { message: Message }) {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm shadow-sm sm:max-w-[65%] ${
          isOutgoing ? 'bg-green-100 text-slate-800' : 'bg-white text-slate-800'
        }`}
      >
        {message.kind === 'text' && <p className="whitespace-pre-line">{message.text}</p>}
        {message.kind === 'image' && (
          <div className="flex items-center gap-2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 shrink-0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 22.5H6a2.25 2.25 0 01-2.25-2.25V3.75A2.25 2.25 0 016 1.5h9.75L21.75 7.5v12.75A2.25 2.25 0 0119.5 22.5H18zM15 6.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <span>Image</span>
          </div>
        )}
        {message.kind === 'document' && <p className="text-slate-500">📄 {message.mediaLabel ?? 'Document'}</p>}

        <div className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${isOutgoing ? 'text-slate-500' : 'text-slate-400'}`}>
          {formatTime(message.timestamp)}
          {isOutgoing && message.status && <ReadReceipt status={message.status} />}
        </div>
      </div>
    </div>
  )
}

function ReadReceipt({ status }: { status: NonNullable<Message['status']> }) {
  const color = status === 'read' ? 'text-nexcred-blue' : 'text-slate-400'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={`h-3.5 w-3.5 ${color}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l4 4L18.5 6.75" />
      {status !== 'sent' && <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.75l4 4L22.5 6.75" />}
    </svg>
  )
}
