/**
 * Domain types for Nexcred's core hierarchy:
 * USER -> PROJECT -> COMMUNICATION ACCOUNT -> WHATSAPP NUMBER -> INBOX
 *
 * These are UI-facing shapes only. No backend/API contract exists yet —
 * see docs/ARCHITECTURE.md for the conceptual data model this mirrors.
 */

export type WhatsAppAccountStatus = 'active' | 'pending' | 'disconnected'

export interface Project {
  id: string
  name: string
}

/** A single, number-isolated WhatsApp communication account within a project. */
export interface WhatsAppAccount {
  id: string
  projectId: string
  name: string
  phoneNumber: string
  status: WhatsAppAccountStatus
}

export interface WabaOption {
  id: string
  label: string
}

export interface PhoneNumberOption {
  id: string
  label: string
}

/**
 * Inbox / Conversation domain — scoped one level below WhatsAppAccount:
 *
 * WhatsAppAccount (number) -> Contact -> Conversation -> Message
 *
 * A Contact, Conversation, or Message always carries the owning
 * `whatsAppAccountId`. Nothing here is ever looked up without that scope —
 * mirrors the number-wise isolation rule in CLAUDE.md Section 4.
 */

/** A contact known within a single WhatsApp number's isolated inbox. */
export interface Contact {
  id: string
  whatsAppAccountId: string
  name: string
  phone: string
  customerSince: string
  tags: string[]
  notes: string
}

export type MessageDirection = 'incoming' | 'outgoing'
export type MessageKind = 'text' | 'image' | 'document'
export type MessageStatus = 'sent' | 'delivered' | 'read'

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  kind: MessageKind
  text?: string
  mediaLabel?: string
  timestamp: string
  status?: MessageStatus
}

export interface Conversation {
  id: string
  whatsAppAccountId: string
  contactId: string
  unreadCount: number
  assignedToUserId?: string
  archived: boolean
}

export type TransactionStatus = 'enquiry' | 'paid' | 'pending'

export interface TransactionSummary {
  id: string
  code: string
  title: string
  amount: number
  status: TransactionStatus
  date: string
}
