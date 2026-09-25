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
