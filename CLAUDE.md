# CLAUDE.md — Nexcred Development Context

This file is the **permanent, authoritative development instruction/context
file** for the Nexcred repository. It must explain the project well enough
that a future Claude session — with no access to prior conversations — can
understand what Nexcred is, how it is architected, and how to work on it
correctly.

If anything in a future task conflicts with this file, resolve it using the
priority order in **Section 27 (Source of Truth)**.

---

## 1. What Nexcred Is

Nexcred is a **private, internal, multi-user, multi-project communications
and operations hub**. It centralizes business communication (starting with
WhatsApp) and related operational data (contacts, conversations, templates,
transactions) across multiple projects/businesses, each of which may have
multiple communication accounts (e.g. multiple WhatsApp numbers).

Nexcred is **not** a public SaaS product. It is operated and controlled by
an administrator for a fixed, known set of internal users and projects.

## 2. Who It Is For

- Internal team members (admins, managers, staff) who manage communication
  and operations for one or more projects/businesses.
- Projects/businesses that need isolated, number-specific WhatsApp (and
  later Telegram) inboxes.
- Future external consumers (a project's own website, POS, or app) that
  integrate with Nexcred via a project-scoped API.

It is explicitly **not** for the general public, and it is **not** a
customer-facing product.

### Explicitly forbidden product shape

Do NOT introduce, at any point, unless a future task explicitly instructs
otherwise:

- Public signup / self-service tenant registration
- Subscription plans, pricing tiers, or trials
- SaaS billing or customer payment collection
- A marketplace
- Any customer-facing SaaS onboarding flow

Nexcred users and projects are provisioned/managed by an administrator, not
by self-service signup.

---

## 3. Core Architecture — Hierarchy

The fundamental hierarchy governing all data and access in Nexcred is:

```text
USER
  ↓
PROJECT
  ↓
COMMUNICATION ACCOUNT
  ↓
NUMBER-SPECIFIC INBOX
  ↓
CONTACT
  ↓
CONVERSATION
  ↓
MESSAGE
  ↓
MEDIA
  ↓
TRANSACTION
  ↓
AUTOMATION
```

Multi-project example:

```text
NEXCRED HUB
│
├── PROJECT A
│   ├── WhatsApp
│   │   └── INBOX
│   └── Telegram
│       └── INBOX
│
├── PROJECT B
│   └── WhatsApp
│       └── INBOX
│
└── PROJECT C
    ├── WhatsApp
    │   └── INBOX
    └── Telegram
        └── INBOX
```

- **WhatsApp is the first communication channel** to be implemented.
- **Telegram is a future channel**, following the same conceptual model.
- The architecture must eventually support additional communication
  channels **without a full redesign** — channels are a pluggable concept
  hanging off "Communication Account," not something baked into the core
  data model as a special case.

---

## 4. Critical Rule: Number-Wise Isolation

This is **one of the most important requirements in the entire system** and
must never be violated, at any layer.

Every WhatsApp number has its own **fully isolated**:

- Inbox
- Contacts
- Conversations
- Messages
- Media
- Templates
- Message logs
- Transactions
- Tags
- Segments
- Usage/cost information
- Relevant settings

Example:

```text
Yazin POS
│
├── WhatsApp #1
│   ├── Inbox
│   ├── Contacts
│   ├── Conversations
│   ├── Templates
│   └── Logs
│
└── WhatsApp #2
    ├── Inbox
    ├── Contacts
    ├── Conversations
    ├── Templates
    └── Logs
```

Data from WhatsApp #1 must **never** appear in WhatsApp #2. Likewise:

```text
Project A → WhatsApp #1
Project B → WhatsApp #2
```

Project B users must not access Project A's communication data unless an
explicit authorization grant exists.

### No global "All Conversations" view

There must **not** be a default global "All Conversations" screen that
mixes data across numbers. The normal navigation flow is:

```text
Project
   ↓
WhatsApp Number
   ↓
Number-specific module
```

A user selects a project, then a WhatsApp number, before seeing any
number-specific communication data.

### Isolation must be enforced everywhere

This isolation is not a UI convenience — it is a security requirement that
must hold at every layer:

- UI level (what is rendered/navigable)
- API level (what endpoints accept/return)
- Authorization level (who is allowed to ask)
- Database query level (every query is scoped by account/project, never
  relying on the caller to filter correctly)
- Webhook routing level (inbound Meta events are routed to the correct
  account by `phone_number_id`, never broadcast or guessed)

**Never rely only on frontend filtering for security.** Every layer must
independently enforce scope.

---

## 5. User / Access Model

Nexcred supports multiple internal users. Conceptual roles:

```text
ADMIN
MANAGER
STAFF
```

- **Admin** — full system access.
- **Manager** — access to assigned projects/accounts and operational
  modules within them.
- **Staff** — access only to assigned projects/accounts/conversations,
  according to granted permissions.

The exact permission implementation (tables, middleware, policy engine)
will be designed and built in a later block. This section only fixes the
**conceptual model** that later work must be compatible with.

### Authorization principle

Authorization must always be enforced **server-side**. Never assume that
because a user cannot see a button or menu item in the UI, they are
unauthorized to perform the underlying action — the API must check
independently.

Every protected API operation must eventually validate the full chain:

```text
User
  ↓
Project access
  ↓
Communication account access
  ↓
Resource access
```

---

## 6. WhatsApp Architecture

WhatsApp Cloud API is the first integration to be built. The platform must
support **multiple WhatsApp Business numbers**, and ideally **one stable
webhook endpoint** that serves all of them.

Conceptual inbound flow:

```text
Meta
  ↓
Stable Nexcred Webhook
  ↓
phone_number_id
  ↓
Find WhatsApp communication account
  ↓
Find Project
  ↓
Find Number-specific Inbox
  ↓
Find/Create Contact
  ↓
Find/Create Conversation
  ↓
Store Message
  ↓
Display in correct Inbox
```

The webhook must dynamically resolve the destination account using Meta's
`phone_number_id`. Do **not** create a separate webhook URL per number
unless Meta technically requires it — the routing intelligence belongs in
Nexcred, not in the URL structure.

---

## 7. WhatsApp Signup / Connection Workflow

Conceptual one-time setup flow per WhatsApp number:

```text
Login to Nexcred
        ↓
WhatsApp Accounts
        ↓
Add WhatsApp Account
        ↓
Connect with Meta
        ↓
Login to Meta
        ↓
Select/Create WhatsApp Business Account
        ↓
Select/Add Phone Number
        ↓
Verify Phone Number
        ↓
Complete Business Profile
        ↓
Account Connected
        ↓
Go to Inbox
```

The actual Meta OAuth / Embedded Signup implementation will be built in a
later block. **Do not hard-code Meta credentials** anywhere in source.

---

## 8. Inbox / Conversation Workflow

Reference workflow for an inbound message:

```text
Customer sends WhatsApp message
        ↓
Meta
        ↓
Nexcred webhook
        ↓
Identify phone_number_id
        ↓
Route to correct project + number
        ↓
Conversation appears in that number's inbox
        ↓
Unread indicator
        ↓
User opens conversation
        ↓
View message history
        ↓
View customer information
        ↓
Reply / send media / template
        ↓
Add note
        ↓
Assign conversation
        ↓
Create transaction if required
        ↓
Message status updates
```

The inbox UI should eventually support:

- Conversation list
- Unread count
- Search
- Assigned conversations
- Archived conversations
- Conversation status
- Customer details panel
- Notes
- Tags
- Assignment
- Transactions
- Message composer
- Media
- Templates
- Delivery/read status

---

## 9. Contacts

Contacts are **number-wise**, following the isolation rule in Section 4.

Example:

```text
Project: Yazin POS
WhatsApp: +91 XXXXX XXXXX

Contacts:
- Rahul
- Priya
- Ahmed
...
```

Another number has its own, entirely separate contact list. Do **not**
create an uncontrolled shared/global contact list.

The contacts module should eventually support:

- Add contact
- Edit contact
- Phone number
- Name
- Tags
- Segments
- Notes
- Status
- Last interaction
- Search
- Filters
- Import
- Export
- Bulk operations

---

## 10. Tags and Segments

Tags and segments organize contacts **within the appropriate communication
scope** (i.e., within a single WhatsApp number's contact set).

Example tags:

```text
Customer
Enquiry
Support
High Value
Repeat
POS
```

Example segments:

```text
Retail Customers
Potential Buyers
Support
Loyal Customers
New Leads
Inactive
```

Do not assume a tag/segment from one isolated WhatsApp account
automatically becomes visible in, or applicable to, another. The data model
must respect account/project scope for tags and segments just as it does
for contacts.

---

## 11. Templates

WhatsApp templates are **number-wise**.

```text
Select Project
      ↓
Select WhatsApp Number
      ↓
View that number's templates
```

Template lifecycle:

```text
Create Template
      ↓
Set name
      ↓
Category
      ↓
Language
      ↓
Message content
      ↓
Variables
      ↓
Save draft
      ↓
Submit to Meta
      ↓
Under review
      ↓
Approved / Rejected
      ↓
Use approved template
      ↓
Message log
```

Templates must not be assumed to be universally interchangeable between
numbers. The actual Meta template rules and API contract will be
implemented per the official WhatsApp Business API documentation in a later
block.

---

## 12. Message Logs

Message logs are also number-aware. They should eventually record:

- Timestamp
- Direction
- Recipient/sender
- Message type
- Template (if applicable)
- Status
- Delivery
- Read
- Failure
- Error details
- Project
- Communication account
- Conversation
- Message ID

Possible statuses:

```text
Sent
Delivered
Read
Failed
```

Logs should support search, filtering, date range, status, message type,
template, and export.

---

## 13. Dashboard

```text
Login
  ↓
Select Project
  ↓
Select WhatsApp Number
  ↓
Dashboard
```

The dashboard may show:

- Total conversations
- Contacts
- Messages sent
- Active transactions
- Conversation activity
- Message status
- Recent conversations
- Recent transactions
- Recent system activity
- Quick actions
- Alerts
- Notifications

The dashboard must always respect the selected project/account scope. A
user must never see another project's private information merely because
they are authenticated and viewing a dashboard.

---

## 14. Transactions

Transactions are **internal business-operation records** — not Nexcred
subscription billing.

They may be linked to:

```text
Project
Communication Account
Contact
Conversation
User
```

Examples:

```text
POS enquiry
Software support
Payment follow-up
Order
Customer transaction
```

Transactions can later be created directly from a conversation.

---

## 15. Meta Cost Wallet / Internal Ledger

Nexcred may eventually have an **internal cost wallet/ledger**.

**Important distinction:** this is **not** a replacement for Meta's
official billing/payment system. Nexcred must never pretend that an
internal wallet directly pays Meta unless Meta officially provides such a
mechanism.

Conceptual flow:

```text
Meta usage/cost data
        ↓
Nexcred cost records
        ↓
Project/number allocation
        ↓
Internal wallet/ledger
        ↓
Budgets
        ↓
Alerts
        ↓
Reports
```

The wallet can track:

- Internal balance
- Project budgets
- Number-wise usage
- Estimated/recorded cost
- Deductions
- Top-ups for internal accounting
- Alerts
- Reports

This is an **internal financial/cost-management ledger**. It is explicitly
**not**:

- A SaaS wallet
- A Meta payment replacement
- A customer billing system
- A subscription wallet

**Do not implement this in the initial UI/backend foundation** unless a
future task explicitly requests it.

---

## 16. Meta App / API Architecture

Conceptual setup chain:

```text
Meta Business Portfolio
        ↓
Meta App
        ↓
WhatsApp Product
        ↓
API Credentials
        ↓
Phone Numbers
        ↓
Webhook
        ↓
Nexcred
```

Nexcred should eventually support configuring/managing:

- Meta App configuration
- WhatsApp Business accounts
- Phone number IDs
- Access tokens
- Webhook verification
- Webhook events
- Outgoing messages
- Templates
- Media
- Message statuses

### Credential handling

Credentials must always be protected. Never place any of the following in
frontend source code, client bundles, or version control:

- Meta App Secret
- Meta Access Tokens
- Database passwords
- Session secrets
- Any other API key or credential

---

## 17. Website / Project API

Future projects/websites should be able to use Nexcred as their
communication backend.

```text
Website / POS / Application
        ↓
Nexcred API
        ↓
Project authorization
        ↓
WhatsApp communication account
        ↓
Meta WhatsApp API
```

Potential future API capabilities:

```text
Send message
Send template
Send media
Create/update contact
Find conversation
Create transaction
Receive events
Check message status
```

Each project should eventually have its own secure, scoped API
credentials. A project's API key must **never** be usable to access another
project's resources — this is the same isolation principle from Section 4,
applied to the external API surface.

---

## 18. Telegram (Future Architecture)

Telegram is a **future** communication channel. The architecture should
eventually allow:

```text
Communication Account
 ├── WhatsApp
 └── Telegram
```

Both should feed a common conceptual model:

```text
Project
 ↓
Communication Account
 ↓
Inbox
 ↓
Contact
 ↓
Conversation
 ↓
Message
```

However, channel-specific differences (API shape, message types,
capabilities) must **not** be hidden or papered over when the underlying
platforms genuinely behave differently. A shared conceptual model is not
license to force every channel through identical mechanics.

**Do not implement Telegram now.**

---

## 19. Automation (Future)

Future automation concept:

```text
EVENT
  ↓
CONDITION
  ↓
ACTION
```

Example:

```text
New WhatsApp message
      ↓
If tag = customer
      ↓
Create task / send response / assign user
```

**Do not build automation now.**

---

## 20. Android Client (Future)

An Android application may later be built as another client of the same
Nexcred backend.

```text
Web App ──────┐
              │
Android App ──┼──→ Nexcred API ──→ PostgreSQL / Services
              │
Future MCP ───┘
```

The Android app must **not** create a second, independent backend — it
consumes the same Nexcred API as the web client.

---

## 21. MCP (Future)

MCP may later provide another controlled interface to Nexcred. It must obey
the same rules as the normal API:

- Authentication
- Authorization
- Project isolation
- Communication-account isolation
- Audit logging

**MCP must never become a bypass around security controls.**

---

## 22. Security Principles

Security is a core architectural requirement, not an afterthought. As the
system is built out, the following must eventually be addressed:

- Authentication
- Secure sessions/tokens
- Password hashing
- RBAC (role-based access control)
- Project-level authorization
- Communication-account authorization
- Server-side resource ownership checks
- Webhook verification
- Meta signature validation
- API authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection where applicable
- Secure media uploads
- File type validation
- File size limits
- Secure file storage
- Secret management
- HTTPS
- Audit logs
- Error handling
- Idempotency
- Replay protection
- Queue reliability
- Database constraints
- Backups
- Logging and monitoring

**Never rely only on frontend controls for security.**

---

## 23. Dynamic Domain Requirement

The application must **not** be written around a permanent, hard-coded
domain. Never hard-code values such as:

```text
https://whatsapp.nexcred.in
```

anywhere in application source code.

Application configuration must use environment variables, for example:

```text
APP_URL=
API_URL=
WEBHOOK_URL=
DATABASE_URL=
SESSION_SECRET=
META_APP_ID=
META_APP_SECRET=
MEDIA_STORAGE_PATH=
REDIS_URL=
```

The domain may change later. Changing the domain should primarily require:

- Environment configuration
- DNS
- HTTPS/reverse proxy
- External provider (Meta, etc.) webhook configuration

and must **not** require rewriting application source code.

---

## 24. UI Design Direction

Reference images supplied during UI development sessions are the intended
conceptual UI direction. They establish:

- Professional admin dashboard feel
- Clean, modern interface
- Strong visual hierarchy
- Project/number selector
- Dark sidebar
- Light content areas
- Cards
- Tables
- Filters
- Status indicators
- Contextual actions
- Number-wise isolation reflected in navigation
- Responsive layout
- Desktop-first operational workflow
- Clear empty/loading/error states
- Consistent components

The UI should feel like a **serious business operations platform**, not a
generic CRUD scaffold.

Reference images/screenshots are **design references, not permission to
blindly copy every visual detail**. Use judgment to build a coherent,
consistent design system rather than a literal per-pixel clone.

### UI is built incrementally, one reference image at a time

For every UI implementation task:

1. Identify the exact reference screen.
2. Build that screen.
3. Match layout and information hierarchy.
4. Build reusable components where appropriate.
5. Make it responsive.
6. Verify the result.
7. Only then move on to the next reference screen.

**Do not redesign the whole application while implementing one screen.**

---

## 25. Reference Screen Order

The current conceptual reference sequence for UI work is:

1. **Reference 1** — WhatsApp Signup / Connection workflow
2. **Reference 2** — Inbox & Conversation workflow
3. **Reference 3** — Contacts Management workflow
4. **Reference 4** — WhatsApp Templates & Message Logs
5. **Reference 5** — Dashboard
6. **Reference 6** — Meta Cost Wallet / Internal Ledger
7. **Reference 7** — Meta App & API Setup workflow

High-level architecture diagram these references support:

```text
NEXCRED HUB
   ↓
Projects
   ↓
WhatsApp / Telegram
   ↓
Separate Inboxes
   ↓
Contacts
   ↓
Messages
   ↓
Media
   ↓
Transactions
   ↓
Automation
```

These references describe the intended product direction; they are not yet
implemented.

---

## 26. Development Methodology

Development happens in **small, controlled blocks**. Never attempt to build
the entire platform in one task.

Each block should have:

- A clear scope
- Allowed files
- Acceptance criteria
- Validation steps
- A Git commit
- A status update

**Claude must stop after completing the requested block.** Do not silently
continue into future features, screens, or backend work that wasn't part of
the current block's explicit scope.

---

## 27. Source of Truth

When instructions could conflict, resolve using this priority order:

```text
1. Explicit current project instructions (the active task/prompt)
2. CLAUDE.md (this file)
3. Architecture documentation (docs/)
4. Approved reference UI/designs
5. Existing source code
```

**Existing old WhatsApp projects on the VPS are NOT the source of truth**
for this new implementation. They may exist as historical/reference
systems, but Nexcred is a clean rebuild. Do not copy architecture blindly
from them — evaluate against this document and current instructions first.

---

## 28. Production Safety

There are existing WhatsApp systems running on the VPS. They are
production/reference systems, **unrelated to this repository**, and this
new project must remain fully isolated from them.

Never, unless explicitly instructed in a separate task:

- Modify existing production code
- Restart existing production services
- Change existing production databases
- Change existing Nginx configuration
- Change DNS
- Change SSL
- Modify production WhatsApp webhook configuration
- Overwrite existing directories

---

## 29. Current Development State

```text
Phase 0 — Foundation
```

Completed so far:

```text
00.1 — Repository Foundation      (COMPLETE)
00.2 — CLAUDE.md / Project Context (this document)
```

After this document is committed:

- Do not start UI development.
- Do not start backend development.
- Do not create database migrations.

See `PROJECT_STATUS.md` for the authoritative, up-to-date phase/block
status — this section is a snapshot as of the creation of this file and
will drift over time, while `PROJECT_STATUS.md` is kept current.

---

## 30. What Must NEVER Be Changed or Violated

This is a summary checklist of the non-negotiable rules established above:

- Nexcred is private/internal — never add public SaaS signup, billing,
  pricing, trials, or a marketplace.
- Every WhatsApp number's inbox, contacts, conversations, messages, media,
  templates, logs, tags, segments, and usage data must remain fully
  isolated from every other number's.
- There is no global "All Conversations" view across numbers.
- Isolation and authorization must be enforced server-side (API, database
  query, webhook routing) — never only in the frontend.
- No project's API credentials may ever access another project's
  resources.
- No production domain may be hard-coded in application source; all
  environment-specific values come from environment variables.
- No secrets (Meta App Secret, access tokens, database passwords, session
  secrets) may ever be placed in frontend code or committed to the
  repository.
- Existing production WhatsApp systems on the VPS must never be modified,
  restarted, or otherwise touched by this project's work.
- Work proceeds in small, explicitly scoped blocks; Claude stops after
  completing the requested block rather than continuing into unscoped
  work.
- UI is built one reference screen at a time, not as a full redesign per
  task.
