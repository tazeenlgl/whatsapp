# Nexcred — Technical Architecture

This document is the detailed technical architecture reference for Nexcred.
It expands on `CLAUDE.md` (the authoritative project context) and must
remain consistent with it. Where this document and `CLAUDE.md` ever appear
to conflict, `CLAUDE.md` wins — see its Section 27 (Source of Truth).

This is a **documentation-only** artifact. No source code, database
schema, or infrastructure exists yet as a result of this document.

---

## 1. Product Architecture

```text
NEXCRED HUB
│
├── USERS
│
└── PROJECTS
      │
      └── COMMUNICATION ACCOUNTS
            │
            ├── WhatsApp
            │     │
            │     └── NUMBER-SPECIFIC INBOX
            │           ├── Contacts
            │           ├── Conversations
            │           ├── Messages
            │           ├── Media
            │           ├── Templates
            │           ├── Logs
            │           └── Transactions
            │
            └── Telegram (future)
                  │
                  └── NUMBER/ACCOUNT-SPECIFIC INBOX
```

### Entity distinctions

- **User** — an internal Nexcred operator (admin/manager/staff) who logs in
  and works within one or more projects.
- **Project** — a business or initiative (e.g. "Yazin POS", "Website B").
  The top-level logical boundary below the Nexcred Hub itself.
- **Communication Account** — a channel-agnostic abstraction representing
  one connected account on one channel within a project (e.g. "the WhatsApp
  Business account for Yazin POS").
- **WhatsApp Account** — the Meta-side WhatsApp Business Account (WABA)
  backing a WhatsApp communication account.
- **WhatsApp Phone Number** — a specific verified phone number under a
  WhatsApp Business Account, identified by Meta's `phone_number_id`. In
  Nexcred, a communication account is generally anchored to one phone
  number.
- **Inbox** — the number/account-specific collection of conversations,
  contacts, and related data. One inbox per communication account/number.
- **Contact** — a customer/counterparty known within a specific inbox's
  scope (phone number + name + metadata).
- **Conversation** — a thread of messages between a contact and a
  communication account, scoped to one inbox.
- **Message** — a single inbound or outbound message within a conversation.
- **Media** — a file (image, video, document, audio) attached to a message.
- **Template** — a pre-approved (via Meta) reusable message format, scoped
  to a WhatsApp account.
- **Transaction** — an internal business-operation record (e.g. an
  enquiry, order, or support case), optionally linked to a conversation.
- **Automation** — a future event → condition → action rule operating
  within the scope of a project/communication account.

---

## 2. Core Isolation Model

This is the single most important architectural constraint in Nexcred.

```text
User
 ↓
Project
 ↓
Communication Account
 ↓
Number-specific Inbox
 ↓
Contacts / Conversations / Messages / Media / Templates / Transactions
```

Every piece of communication data is scoped down this chain. Isolation
must be enforced independently at every layer:

```text
Frontend
API
Authorization
Database queries
Webhook routing
Storage
Logs
```

**Never rely only on frontend filtering.** A user must not be able to gain
access to another project's (or another number's) data simply by changing
an ID in a request — every layer listed above must independently reject
out-of-scope access, not merely decline to render it.

---

## 3. Multi-Project Architecture

```text
Nexcred
├── Yazin POS
│   ├── WhatsApp #1
│   └── Telegram #1
│
├── Website B
│   └── WhatsApp #2
│
└── Website C
    ├── WhatsApp #3
    └── Telegram #2
```

Projects are isolated logical boundaries. A project's users, communication
accounts, and all downstream data (inboxes, contacts, conversations,
messages, templates, transactions) belong exclusively to that project
unless an explicit cross-project authorization mechanism is introduced in
a future block.

---

## 4. Communication-Account Abstraction

The architecture must not hard-code "WhatsApp" into every table or module.
Doing so would force a redesign the moment a second channel (Telegram) is
added.

```text
Project
  ↓
Communication Account
  ↓
Channel
  ↓
Provider identity
  ↓
Inbox
```

- **Channel** (current: `whatsapp`; future: `telegram`) identifies which
  provider integration governs the account.
- **Provider identity** is the channel-specific identifier (for WhatsApp,
  Meta's `phone_number_id`; for a future Telegram integration, a bot/account
  identifier).
- Everything downstream of "Communication Account" (inbox, contacts,
  conversations, messages) should be modeled generically enough to apply
  to any channel, with channel-specific detail attached at the message/
  account level rather than duplicated as parallel tables/modules per
  channel.

Current channel: **WhatsApp**. Future channel: **Telegram**. The goal is
that adding Telegram extends the communication-account layer rather than
requiring a redesign of contacts, conversations, or the inbox concept.

---

## 5. WhatsApp Architecture

Nexcred's WhatsApp integration is the **official Meta WhatsApp Cloud API**.
The legacy QR-code/Baileys-style unofficial architecture used by other,
unrelated WhatsApp projects on the VPS is explicitly **not** used here.

```text
Meta
 ↓
WhatsApp Business Account
 ↓
Phone Number
 ↓
phone_number_id
 ↓
Nexcred Communication Account
 ↓
Project
 ↓
Number-specific Inbox
```

`phone_number_id` is the critical routing identity: it is how an inbound
Meta webhook event is matched to the correct Nexcred communication account,
and by extension the correct project and inbox.

---

## 6. Dynamic Webhook

```text
Meta
 ↓
Stable Nexcred webhook endpoint
 ↓
Verify webhook
 ↓
Receive event
 ↓
Extract phone_number_id
 ↓
Resolve WhatsApp communication account
 ↓
Resolve project
 ↓
Resolve inbox
 ↓
Resolve/create contact
 ↓
Resolve/create conversation
 ↓
Store message
 ↓
Notify UI
```

One stable webhook endpoint is intended to serve **all** connected
WhatsApp numbers — routing intelligence lives in Nexcred (via
`phone_number_id` lookup), not in the URL structure.

**Unknown `phone_number_id` handling:** an event referencing a
`phone_number_id` that does not resolve to a known communication account
must **never** be silently routed to another account as a fallback. It
must produce a controlled, logged error so the situation is visible and
investigable.

---

## 7. Outgoing Message Architecture

```text
User/UI
 ↓
Nexcred API
 ↓
Authorization
 ↓
Project validation
 ↓
Communication-account validation
 ↓
WhatsApp service
 ↓
Meta Cloud API
 ↓
Customer
```

Every outgoing (and inbound) message must be persisted with at least:

- Project
- Communication account
- Conversation
- Direction (inbound/outbound)
- Provider message ID (Meta's message ID)
- Type (text, template, media, etc.)
- Status (sent/delivered/read/failed)
- Timestamps

---

## 8. Inbox Architecture

```text
Project selector
 ↓
Communication account / WhatsApp number selector
 ↓
Number-specific inbox
 ↓
Conversation list
 ↓
Conversation detail
```

There is **no default mixed "All Conversations" inbox** — a user always
navigates through a project and a specific communication account/number
before reaching conversation data (see Section 2 and `CLAUDE.md` Section 4).

The inbox concept eventually needs to support:

- Unread / read state
- Archive
- Assignment (to a staff user)
- Tags
- Notes
- Search
- Filters
- Customer information panel
- Transaction history
- Message composer
- Media
- Templates
- Delivery/read status indicators

---

## 9. Contacts

Contacts are scoped to a single communication account/number — never
shared globally across numbers or projects. Conceptually a contact carries:

- Phone number
- Name
- Tags
- Segments
- Notes
- Status
- Last interaction
- Assignment
- Conversation history
- Transactions

Import/export and bulk operations are **future modules**, not part of the
initial foundation.

---

## 10. Templates

```text
Project
 ↓
WhatsApp number
 ↓
Templates
 ↓
Draft
 ↓
Submit to Meta
 ↓
Review
 ↓
Approved / Rejected
 ↓
Send
```

Templates are associated with the WhatsApp account/business context they
were created under, and are not assumed portable across accounts.

---

## 11. Media Architecture

Inbound:

```text
Incoming media
 ↓
Meta media reference
 ↓
Download securely
 ↓
Media storage
 ↓
Metadata in database
 ↓
Conversation/message reference
```

Outbound:

```text
User upload
 ↓
Validation
 ↓
Secure storage / provider upload
 ↓
Meta
 ↓
Message record
```

Media handling must eventually account for:

- MIME type validation
- Size limits
- Safe, non-guessable filenames
- Access control (not a publicly browsable directory)
- Malware/security scanning where appropriate
- No unrestricted public upload directory

---

## 12. Transactions

Transactions are internal **business-operation** records — not Nexcred
subscription billing. They may link to:

```text
Project
Communication Account
Contact
Conversation
User
```

---

## 13. Internal Meta Cost Ledger

```text
Usage
 ↓
Cost record
 ↓
Project allocation
 ↓
Number allocation
 ↓
Internal ledger
 ↓
Budget
 ↓
Alerts
 ↓
Reports
```

**Clarification:** this internal ledger is not a replacement for Meta's
official billing/payment system. It is an internal cost-tracking/reporting
mechanism only.

---

## 14. Website / API Architecture

```text
External Project / POS / Website
 ↓
Nexcred API
 ↓
Project API credential
 ↓
Authorization
 ↓
Communication account
 ↓
WhatsApp / Telegram
```

Future API capabilities:

- Send text
- Send template
- Send media
- Contacts
- Conversations
- Transactions
- Message status
- Events/webhooks

Project API credentials must never cross project boundaries — a credential
issued for one project must never be usable to access another project's
resources.

---

## 15. Authentication and Authorization

```text
User
 ↓
Authentication
 ↓
Role
 ↓
Project permissions
 ↓
Communication-account permissions
 ↓
Resource authorization
```

Roles: `Admin`, `Manager`, `Staff` (see `CLAUDE.md` Section 5 for the
conceptual definition of each).

Server-side authorization is mandatory at every step — it must never be
inferred from what the frontend happens to display.

---

## 16. Database Conceptual Model

No SQL or exact schema is defined here — this is a conceptual entity list
only, for future schema design to be validated against. Exact columns are
not yet decided.

```text
users
roles
projects
project_users
communication_accounts
whatsapp_accounts
inboxes
contacts
conversations
messages
media
templates
message_logs
transactions
tags
contact_tags
segments
audit_logs
webhook_logs
system_logs
api_credentials
usage_records
cost_ledger
```

Conceptual relationships:

- `users` relate to `projects` through `project_users` (membership +
  role/permissions within that project).
- `projects` own `communication_accounts`; a `whatsapp_accounts` entity
  holds WhatsApp-specific detail (phone number, `phone_number_id`, WABA
  ID) tied 1:1 (or similar) to a `communication_accounts` row.
- Each `communication_accounts` row owns exactly one `inboxes` scope.
- `contacts`, `conversations`, `messages`, `media`, `templates`,
  `message_logs`, and `transactions` are all scoped, directly or
  transitively, to a single `communication_accounts` / `inboxes` row —
  never shared across accounts.
- `tags` and `segments` are scoped the same way, with `contact_tags` as
  the join between contacts and tags.
- `audit_logs`, `webhook_logs`, and `system_logs` capture operational and
  security-relevant events, scoped to project/account where applicable.
- `api_credentials` are scoped to a single project and must not authorize
  access outside it.
- `usage_records` and `cost_ledger` support the internal cost ledger
  (Section 13), scoped by project/communication account.

---

## 17. Queue / Reliability Architecture

```text
API/Event
 ↓
Queue
 ↓
Worker
 ↓
Provider
 ↓
Retry
 ↓
Success / Dead Letter
```

Future reliability concerns to design for:

- Idempotency (safe retries without duplicate side effects)
- Retries with backoff
- Rate limiting (respecting Meta's limits)
- Provider failure handling
- Dead-letter handling for permanently failed jobs
- Duplicate webhook delivery protection (Meta may redeliver events)

---

## 18. Telegram (Future Architecture)

Telegram is a future channel, implemented through the same
communication-account abstraction described in Section 4. It is **not**
implemented as part of this or any current block unless explicitly
instructed.

---

## 19. Automation Architecture (Future)

```text
EVENT
 ↓
CONDITION
 ↓
ACTION
```

Example events: incoming message, contact created, transaction created,
message status changed.

Example actions: assign, send message, create transaction, webhook,
notification.

Not implemented now.

---

## 20. Android Architecture (Future)

```text
Web
Android
MCP
External APIs
   ↓
Nexcred API
   ↓
Core services
   ↓
Database / integrations
```

Android is planned as another **client** of the existing Nexcred API — it
must never become a second, independent backend.

---

## 21. MCP Architecture (Future)

MCP, when introduced, must use the same authorization system as the
regular API. It must not bypass:

- Authentication
- Project isolation
- Communication-account isolation
- Audit logging

---

## 22. Security Architecture

The following must be addressed as the system is built out (see also
`CLAUDE.md` Section 22):

- Password hashing
- Sessions/tokens
- RBAC
- Resource authorization
- Webhook verification
- Meta signature verification
- API authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection where applicable
- Secure file uploads
- Secret management
- HTTPS
- Audit logging
- Idempotency
- Replay protection
- Database constraints
- Backups
- Monitoring

---

## 23. Dynamic Configuration

```text
APP_URL
API_URL
WEBHOOK_URL
DATABASE_URL
SESSION_SECRET
META_APP_ID
META_APP_SECRET
MEDIA_STORAGE_PATH
REDIS_URL
```

No production domain may ever be hard-coded into application source (see
`CLAUDE.md` Section 23).

---

## 24. UI Architecture

```text
App Shell
 ↓
Sidebar
 ↓
Project Selector
 ↓
Communication Account Selector
 ↓
Module
 ↓
Reusable Components
```

Anticipated reusable UI components:

- Cards
- Tables
- Forms
- Dialogs
- Drawers
- Tabs
- Badges
- Filters
- Pagination
- Search
- Loading states
- Empty states
- Error states
- Confirmations

The UI will be implemented **one reference screen at a time**, per the
methodology in `CLAUDE.md` Section 24 and `DEVELOPMENT_RULES.md`.
