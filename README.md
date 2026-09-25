# Nexcred

Nexcred is a private, internal, multi-user, multi-project communications and
operations hub. It is **not** a public product — there is no signup,
subscription, billing, or public tenant registration. Access is limited to
authorized internal users only.

## Status

This repository is being developed **incrementally, in small blocks**. Each
block adds a well-scoped, reviewed piece of the system. See
[`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for the current phase, current
block, and what has actually been completed so far. Do not assume any
functionality exists beyond what that file lists as complete.

## Core concept

Nexcred organizes communications around a strict hierarchy:

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
TRANSACTION
```

- **User** — an internal team member with access to one or more projects.
- **Project** — a business, website, or initiative being run through Nexcred
  (e.g. "Yazin POS", "Website B", "Website C").
- **Communication account** — a channel account attached to a project (e.g. a
  WhatsApp Business number, a Telegram bot).
- **Number-specific inbox** — every WhatsApp number gets its own **isolated**
  inbox. There is intentionally **no default "All Conversations" global
  inbox** — conversations always belong to the inbox of the number/account
  they came through.
- **Contact / Conversation / Message / Transaction** — the day-to-day data
  captured within a number's inbox.

Example:

```text
NEXCRED
 ├── Yazin POS
 │    ├── WhatsApp #1 → Inbox #1
 │    └── Telegram #1 → Inbox later
 │
 ├── Website B
 │    └── WhatsApp #2 → Inbox #2
 │
 └── Website C
      ├── WhatsApp #3 → Inbox #3
      └── Telegram #2 → Inbox later
```

## Multi-user & multi-project architecture

Nexcred supports multiple internal users, each of whom may have access to
multiple projects. Each project can have multiple communication accounts
across multiple channels. Authentication, authorization, and role-based
access control will be introduced in a later block — they are intentionally
out of scope for the current stage of the repository.

## Communication channels

- **WhatsApp** — the first channel implemented. Every WhatsApp number is a
  distinct communication account with its own isolated inbox.
- **Telegram** — planned as a future channel, following the same
  communication-account/inbox model.
- **Android client** — a future native client for the platform.
- **API integrations** — future external API access into Nexcred data.
- **Automation / MCP** — future workflow automation and MCP-based tooling.

## Technology stack

**Backend**
- Node.js
- TypeScript
- Express
- PostgreSQL

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Infrastructure**
- Nginx
- Docker (where appropriate)
- Redis / background workers (added later, when required)

## Repository layout

```text
.
├── backend/          # Node.js + TypeScript + Express API (to be built)
├── frontend/          # React + TypeScript + Vite client (to be built)
├── database/          # PostgreSQL schema and migrations (to be built)
├── infrastructure/     # Nginx, Docker, deployment configuration (to be built)
├── docs/               # Project and architecture documentation
├── scripts/            # Operational / maintenance scripts
├── .gitignore
├── README.md
└── PROJECT_STATUS.md
```

## Dynamic deployment / domain configuration

Nexcred must be deployable to any domain and any environment without code
changes. No production domain, hostname, or environment-specific value is
ever hard-coded into application source. Instead, configuration is driven
entirely through environment variables, for example:

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

These are illustrative examples of the configuration shape planned for later
blocks — the environment-variable system itself has not been implemented
yet.

## Development approach

This project is intentionally built **incrementally**, in small, reviewed
blocks, rather than as one large upfront scaffold. Each block is scoped
narrowly, documented, and reviewed before the next one begins. Refer to
`PROJECT_STATUS.md` for what block is currently in progress and what has
been completed.
