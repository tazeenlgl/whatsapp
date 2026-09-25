/**
 * MOCK DATA — Inbox & Conversation UI development only.
 *
 * Everything below is scoped by `whatsAppAccountId`, mirroring the
 * number-wise isolation rule: a contact/conversation/message here belongs
 * to exactly one WhatsApp number and must never be shown under another.
 *
 * None of this is fetched from a backend. Replace with real API-backed
 * data when the inbox backend is implemented.
 */

import type { Contact, Conversation, Message, TransactionSummary } from '../types/domain'

export const mockContacts: Contact[] = [
  // --- wa_yazin_pos_1 (+91 98368 19895) ---
  {
    id: 'contact_rahul',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    customerSince: 'Aug 2024',
    tags: ['Enquiry', 'POS'],
    notes: 'Interested in POS system. Follow up next week.',
  },
  {
    id: 'contact_priya',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Priya Nair',
    phone: '+91 98456 12378',
    customerSince: 'Jun 2024',
    tags: ['Customer', 'Repeat'],
    notes: 'Paid for annual POS subscription.',
  },
  {
    id: 'contact_ahmed',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Ahmed Khan',
    phone: '+91 99001 22334',
    customerSince: 'Sep 2024',
    tags: ['Enquiry'],
    notes: '',
  },
  {
    id: 'contact_sneha',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Sneha Patel',
    phone: '+91 90210 44556',
    customerSince: 'Jul 2024',
    tags: ['Support'],
    notes: '',
  },
  {
    id: 'contact_arjun',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Arjun Mehta',
    phone: '+91 98111 22556',
    customerSince: 'May 2024',
    tags: ['Customer'],
    notes: '',
  },
  {
    id: 'contact_mohammed',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Mohammed Rafi',
    phone: '+91 93445 12009',
    customerSince: 'Aug 2024',
    tags: ['Enquiry'],
    notes: '',
  },
  {
    id: 'contact_kavya',
    whatsAppAccountId: 'wa_yazin_pos_1',
    name: 'Kavya S',
    phone: '+91 90876 54321',
    customerSince: 'Aug 2024',
    tags: ['Support'],
    notes: '',
  },

  // --- wa_yazin_pos_2 (+91 98765 43210) ---
  {
    id: 'contact_deepak',
    whatsAppAccountId: 'wa_yazin_pos_2',
    name: 'Deepak Rao',
    phone: '+91 90001 11223',
    customerSince: 'Oct 2024',
    tags: ['Enquiry'],
    notes: '',
  },
  {
    id: 'contact_farah',
    whatsAppAccountId: 'wa_yazin_pos_2',
    name: 'Farah Sheikh',
    phone: '+91 90002 22334',
    customerSince: 'Sep 2024',
    tags: ['Support'],
    notes: '',
  },

  // --- wa_website_b_1 ---
  {
    id: 'contact_neha',
    whatsAppAccountId: 'wa_website_b_1',
    name: 'Neha Verma',
    phone: '+91 90003 33445',
    customerSince: 'Sep 2024',
    tags: ['Lead'],
    notes: '',
  },
  {
    id: 'contact_vikram',
    whatsAppAccountId: 'wa_website_b_1',
    name: 'Vikram Joshi',
    phone: '+91 90004 44556',
    customerSince: 'Aug 2024',
    tags: ['Customer'],
    notes: '',
  },

  // --- wa_website_c_1 ---
  {
    id: 'contact_isha',
    whatsAppAccountId: 'wa_website_c_1',
    name: 'Isha Kapoor',
    phone: '+91 90005 55667',
    customerSince: 'Jul 2024',
    tags: ['Enquiry'],
    notes: '',
  },

  // --- wa_website_c_2 ---
  {
    id: 'contact_ravi',
    whatsAppAccountId: 'wa_website_c_2',
    name: 'Ravi Kumar',
    phone: '+91 90006 66778',
    customerSince: 'Jun 2024',
    tags: ['Support'],
    notes: '',
  },

  // --- wa_internal_1 ---
  {
    id: 'contact_ops',
    whatsAppAccountId: 'wa_internal_1',
    name: 'Ops Team',
    phone: '+91 90909 12345',
    customerSince: 'Jan 2024',
    tags: ['Internal'],
    notes: '',
  },
]

export const mockConversations: Conversation[] = [
  { id: 'conv_rahul', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_rahul', unreadCount: 2, archived: false },
  { id: 'conv_priya', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_priya', unreadCount: 1, archived: false },
  { id: 'conv_ahmed', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_ahmed', unreadCount: 0, archived: false },
  { id: 'conv_sneha', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_sneha', unreadCount: 0, archived: false },
  {
    id: 'conv_arjun',
    whatsAppAccountId: 'wa_yazin_pos_1',
    contactId: 'contact_arjun',
    unreadCount: 0,
    assignedToUserId: 'user_tazeen',
    archived: false,
  },
  { id: 'conv_mohammed', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_mohammed', unreadCount: 0, archived: false },
  { id: 'conv_kavya', whatsAppAccountId: 'wa_yazin_pos_1', contactId: 'contact_kavya', unreadCount: 0, archived: true },

  { id: 'conv_deepak', whatsAppAccountId: 'wa_yazin_pos_2', contactId: 'contact_deepak', unreadCount: 1, archived: false },
  { id: 'conv_farah', whatsAppAccountId: 'wa_yazin_pos_2', contactId: 'contact_farah', unreadCount: 0, archived: false },

  { id: 'conv_neha', whatsAppAccountId: 'wa_website_b_1', contactId: 'contact_neha', unreadCount: 3, archived: false },
  { id: 'conv_vikram', whatsAppAccountId: 'wa_website_b_1', contactId: 'contact_vikram', unreadCount: 0, archived: false },

  { id: 'conv_isha', whatsAppAccountId: 'wa_website_c_1', contactId: 'contact_isha', unreadCount: 0, archived: false },

  { id: 'conv_ravi', whatsAppAccountId: 'wa_website_c_2', contactId: 'contact_ravi', unreadCount: 0, archived: false },

  { id: 'conv_ops', whatsAppAccountId: 'wa_internal_1', contactId: 'contact_ops', unreadCount: 0, archived: false },
]

export const mockMessages: Message[] = [
  // conv_rahul — matches the reference conversation
  {
    id: 'msg_r1',
    conversationId: 'conv_rahul',
    direction: 'incoming',
    kind: 'text',
    text: 'Hi, I need price details for your POS system.',
    timestamp: '2026-09-25T11:20:00',
  },
  {
    id: 'msg_r2',
    conversationId: 'conv_rahul',
    direction: 'incoming',
    kind: 'text',
    text: 'Also, do you provide installation support?',
    timestamp: '2026-09-25T11:21:00',
  },
  {
    id: 'msg_r3',
    conversationId: 'conv_rahul',
    direction: 'outgoing',
    kind: 'text',
    text: 'Hello Rahul,\n\nOur POS system starts from ₹24,999. It includes installation and 1 year support.\n\nWould you like a demo?',
    timestamp: '2026-09-25T11:23:00',
    status: 'read',
  },
  {
    id: 'msg_r4',
    conversationId: 'conv_rahul',
    direction: 'incoming',
    kind: 'text',
    text: 'Yes, please share the demo link.',
    timestamp: '2026-09-25T11:24:00',
  },

  // conv_priya
  {
    id: 'msg_p1',
    conversationId: 'conv_priya',
    direction: 'incoming',
    kind: 'text',
    text: 'Payment done ✅',
    timestamp: '2026-09-25T10:45:00',
  },

  // conv_ahmed
  {
    id: 'msg_a1',
    conversationId: 'conv_ahmed',
    direction: 'incoming',
    kind: 'text',
    text: 'Can you share the catalogue?',
    timestamp: '2026-09-25T09:20:00',
  },

  // conv_sneha
  {
    id: 'msg_s1',
    conversationId: 'conv_sneha',
    direction: 'incoming',
    kind: 'image',
    mediaLabel: 'Image',
    timestamp: '2026-09-24T16:00:00',
  },

  // conv_arjun
  {
    id: 'msg_ar1',
    conversationId: 'conv_arjun',
    direction: 'incoming',
    kind: 'text',
    text: 'Thank you!',
    timestamp: '2026-09-24T14:00:00',
  },

  // conv_mohammed
  {
    id: 'msg_m1',
    conversationId: 'conv_mohammed',
    direction: 'incoming',
    kind: 'text',
    text: 'Do you have this in stock?',
    timestamp: '2026-08-30T10:00:00',
  },

  // conv_kavya
  {
    id: 'msg_k1',
    conversationId: 'conv_kavya',
    direction: 'incoming',
    kind: 'text',
    text: 'Okay, noted.',
    timestamp: '2026-08-30T09:00:00',
  },

  // wa_yazin_pos_2 conversations
  {
    id: 'msg_d1',
    conversationId: 'conv_deepak',
    direction: 'incoming',
    kind: 'text',
    text: 'What are your business hours?',
    timestamp: '2026-09-25T08:15:00',
  },
  {
    id: 'msg_f1',
    conversationId: 'conv_farah',
    direction: 'incoming',
    kind: 'text',
    text: 'I need a refund for last order.',
    timestamp: '2026-09-24T18:30:00',
  },

  // wa_website_b_1 conversations
  {
    id: 'msg_n1',
    conversationId: 'conv_neha',
    direction: 'incoming',
    kind: 'text',
    text: 'Is same-day delivery available?',
    timestamp: '2026-09-25T12:05:00',
  },
  {
    id: 'msg_v1',
    conversationId: 'conv_vikram',
    direction: 'incoming',
    kind: 'text',
    text: 'Great service, thanks!',
    timestamp: '2026-09-23T11:00:00',
  },

  // wa_website_c_1 conversations
  {
    id: 'msg_i1',
    conversationId: 'conv_isha',
    direction: 'incoming',
    kind: 'text',
    text: 'Do you ship internationally?',
    timestamp: '2026-09-22T09:00:00',
  },

  // wa_website_c_2 conversations
  {
    id: 'msg_ra1',
    conversationId: 'conv_ravi',
    direction: 'incoming',
    kind: 'text',
    text: 'My order is delayed.',
    timestamp: '2026-09-21T15:00:00',
  },

  // wa_internal_1 conversations
  {
    id: 'msg_o1',
    conversationId: 'conv_ops',
    direction: 'incoming',
    kind: 'text',
    text: 'Server maintenance scheduled tonight.',
    timestamp: '2026-09-20T20:00:00',
  },
]

export const mockTransactions: TransactionSummary[] = [
  {
    id: 'txn_00124',
    code: '#TXN-00124',
    title: 'POS System Enquiry',
    amount: 0,
    status: 'enquiry',
    date: 'Aug 30, 2024',
  },
]

/** Maps a contactId to its recent transactions — scoped, not global. */
export const mockTransactionsByContact: Record<string, TransactionSummary[]> = {
  contact_rahul: mockTransactions,
}
