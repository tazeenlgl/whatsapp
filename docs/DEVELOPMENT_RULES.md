# Nexcred — Development Rules

These rules govern how Nexcred is built, in every future session and every
future block. They apply alongside, and do not override, `CLAUDE.md` (the
authoritative project context) and `docs/ARCHITECTURE.md` (the technical
architecture reference). See `CLAUDE.md` Section 27 for the overall source-
of-truth priority order.

---

### Rule 1 — Small blocks

Never build the entire system in one request. Every task must have:

- Block number
- Goal
- Allowed files
- Acceptance criteria
- Validation
- Git commit

### Rule 2 — Inspect before changing

Always inspect existing implementation before modifying it. Never assume a
file, route, table, endpoint, container, or service exists.

### Rule 3 — One block at a time

Claude must stop after the requested block. Do not automatically continue
to the next block.

### Rule 4 — Production isolation

Never touch existing production/reference WhatsApp systems unless
explicitly instructed. Never modify unrelated:

- Projects
- Databases
- Docker containers
- Nginx
- DNS
- SSL
- Webhooks

### Rule 5 — No secrets

Never commit:

- Passwords
- Access tokens
- Meta secrets
- Database credentials
- Private keys
- Session secrets

### Rule 6 — Server-side authorization

Frontend hiding is not security. Every protected API request must validate
resource ownership/access on the server.

### Rule 7 — Scope every query

Communication data must always be scoped to the correct:

```text
project_id
communication_account_id
```

and, where applicable:

```text
inbox_id
conversation_id
contact_id
```

Never trust user-supplied IDs without an authorization check.

### Rule 8 — No hard-coded domains

Never hard-code deployment domains. Use environment configuration.

### Rule 9 — UI accuracy

When implementing a reference screen:

1. Inspect the reference.
2. Identify layout.
3. Identify components.
4. Implement only that screen.
5. Make responsive.
6. Validate.
7. Stop.

Do not redesign unrelated screens.

### Rule 10 — No fake functionality

Do not create buttons that appear functional but do nothing. If backend
functionality is not ready:

- Use an explicit placeholder, or
- Leave the action unavailable, or
- Document it as pending.

Never pretend a feature works.

### Rule 11 — No unnecessary dependencies

Install only what the current block requires.

### Rule 12 — Database safety

Use migrations. Never manually modify production schema without an
explicit migration plan. Never perform destructive database operations
casually.

### Rule 13 — API safety

Validate:

- Input
- Authentication
- Authorization
- Project scope
- Communication-account scope
- Expected data types
- Provider responses

### Rule 14 — WhatsApp webhook safety

Webhook processing must be:

- Verified
- Authenticated where applicable
- Idempotent
- Account-routed
- Logged
- Resilient to duplicate events

Never silently route an unknown `phone_number_id`.

### Rule 15 — Git discipline

Before changes:

```text
git status
```

After changes:

```text
git diff
git diff --stat
git status
```

Use focused commits. Never force-push unless explicitly instructed.

### Rule 16 — Validation

Never claim:

```text
PASS
FIXED
COMPLETE
DEPLOYED
VERIFIED
```

without evidence. Report actual command/test output.

### Rule 17 — Build before deployment

Always build/test before deployment. Verify the live result after
deployment.

### Rule 18 — Unknown state

Use:

```text
UNKNOWN — VERIFY
```

instead of guessing.

### Rule 19 — Documentation

Update `PROJECT_STATUS.md` after meaningful milestones. Update
architecture documentation when a confirmed architectural decision
changes. Never silently overwrite historical decisions.

### Rule 20 — Existing reference code

Old WhatsApp systems may be used only as historical/reference material. Do
not blindly copy old architecture. The new repository is a clean rebuild.

### Rule 21 — Future features

Do not prematurely implement:

- Telegram
- Automation
- Android
- MCP
- Wallet
- Advanced queues
- Large-scale API integrations

unless the current development block explicitly calls for them.

### Rule 22 — Review before expansion

After each meaningful block:

```text
Implement
 ↓
Validate
 ↓
Review
 ↓
Commit
 ↓
Next block
```

### Rule 23 — Architecture hierarchy

Maintain:

```text
Nexcred Hub
 ↓
Project
 ↓
Communication Account
 ↓
Number-specific Inbox
 ↓
Contact
 ↓
Conversation
 ↓
Message
 ↓
Media / Transaction / Automation
```

Do not introduce a conflicting hierarchy without an explicit architecture
decision.

### Rule 24 — Current UI development strategy

The UI will be developed from the supplied reference images:

```text
Reference Image 1
 ↓
Review
 ↓
Reference Image 2
 ↓
Review
 ↓
Reference Image 3
...
```

Do not build every module simultaneously.
