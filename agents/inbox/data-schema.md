# Inbox Agent — Data Schema

Every file documented here lives at the **agent root** (or under a subfolder at the agent root). Nothing lives under `.houston/<agent>/` — the file watcher skips those paths and the dashboard would not react.

All records share three common fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

Writes to JSON files are atomic: write `<path>.tmp`, then rename.

---

## `conversations.json` (index)

A flat array used by the dashboard for fast rendering. One entry per conversation. Detailed message content lives in `conversations/{id}/thread.json`.

```ts
interface ConversationIndex extends BaseRecord {
  id: string;                 // conversation id (also the folder name)
  customerSlug: string;       // foreign key into customers.json
  subject: string;            // short subject line
  channel: "email" | "intercom" | "front" | "helpscout" | "zendesk" | "slack" | "other";
  status: "open" | "waiting_customer" | "waiting_founder" | "resolved" | "snoozed";
  priority: "P1" | "P2" | "P3" | "P4";
  category: "bug" | "how-to" | "feature" | "billing" | "account" | "security" | "other";
  vip: boolean;
  lastTouchedAt: string;      // ISO-8601 UTC
  sla: {
    firstReplyDueAt?: string; // ISO-8601 UTC, set at triage
    nextUpdateDueAt?: string; // ISO-8601 UTC, rolled forward after each reply
    breached: boolean;
  };
  tags: string[];
}
```

**Written by:** `triage-incoming` (create/update), `draft-reply` (updates status/lastTouchedAt), `sla-watchdog` (flips `sla.breached`), `stale-thread-rescue` (status updates).

---

## `conversations/{id}/thread.json`

The full ordered message thread for one conversation.

```ts
interface ThreadFile {
  conversationId: string;
  messages: ThreadMessage[];
}

interface ThreadMessage {
  id: string;                  // UUID v4
  from: "customer" | "founder" | "agent_draft";
  author: string;              // display name or email
  sentAt: string;              // ISO-8601 UTC
  bodyText: string;            // plain text
  bodyHtml?: string;           // optional HTML
  externalId?: string;         // message id from the source tool (Composio returns these)
}
```

**Written by:** `triage-incoming` (creates or appends), Composio-driven fetchers pulling new messages.

---

## `conversations/{id}/draft.md`

Plain markdown. The current reply draft awaiting founder approval. Overwritten each time a new draft is generated. If the founder edits in chat, the next save replaces the file.

**Written by:** `draft-reply`, `stale-thread-rescue` (nudge drafts).

---

## `conversations/{id}/notes.md`

Plain markdown. Internal context, commitments, dossier snippets, whatever the founder or the agent wants to remember per-thread.

**Written by:** `draft-reply` (dossier snippet), `promise-tracker` (appends commitments), `thread-summary` (summary block).

---

## `customers.json` (index)

Flat array. One entry per customer. Detailed extended data lives in `customers/{slug}/profile.json`.

```ts
interface CustomerIndex extends BaseRecord {
  slug: string;           // kebab-case slug (also the folder name)
  email: string;          // primary email
  name: string;
  company?: string;
  plan?: string;          // e.g. "Pro", "Team", "Enterprise"
  mrr?: number;           // in USD cents
  tags: string[];         // e.g. ["vip", "design-partner", "trial"]
}
```

**Written by:** `triage-incoming` (on first contact from a new customer), `customer-dossier` (refresh).

---

## `customers/{slug}/profile.json`

Extended profile. Written independently of the index — the index is the fast lookup; the profile is the source of truth for detail.

```ts
interface CustomerProfile extends BaseRecord {
  slug: string;
  email: string;
  name: string;
  company?: string;
  plan?: string;
  mrr?: number;
  signupAt?: string;         // ISO-8601 UTC
  lifetimeValue?: number;    // in USD cents
  notes: string;             // freeform markdown notes from founder
  linkedAccounts: {
    stripeCustomerId?: string;
    intercomUserId?: string;
    linearCustomerId?: string;
    [key: string]: string | undefined;
  };
  tags: string[];
}
```

**Written by:** `customer-dossier`.

---

## `customers/{slug}/history.json`

Timeline of significant events for the customer.

```ts
interface CustomerHistory {
  slug: string;
  events: CustomerHistoryEvent[];
}

interface CustomerHistoryEvent {
  id: string;
  at: string;                  // ISO-8601 UTC
  kind: "conversation" | "plan_change" | "payment" | "bug_reported" | "churn_flag" | "note";
  summary: string;
  conversationId?: string;
  refId?: string;              // id into bug-candidates.json, churn-flags.json, etc.
}
```

**Written by:** `customer-dossier`, `triage-incoming` (conversation events), `detect-bug-report`, `churn-risk-scan`.

---

## `followups.json`

Open promises the founder has made. Cleared when marked done or when the referenced conversation is resolved.

```ts
interface Followup extends BaseRecord {
  id: string;
  conversationId: string;
  customerSlug: string;
  promise: string;              // "I'll check with engineering by Friday"
  dueAt: string;                // ISO-8601 UTC
  status: "open" | "done" | "cancelled";
  completedAt?: string;
}
```

**Written by:** `promise-tracker`.

---

## `bug-candidates.json`

Possible defects extracted from conversations. The `help-center` sister agent reads this and can promote entries to Linear/GitHub via Composio.

```ts
interface BugCandidate extends BaseRecord {
  id: string;
  conversationId: string;
  customerSlug: string;
  summary: string;              // one-sentence description
  repro: string[];              // ordered steps
  severity: "critical" | "high" | "medium" | "low";
  affectedCustomerSlugs: string[];  // may include several slugs if pattern-detected
  status: "new" | "investigating" | "promoted" | "dismissed";
  externalTrackerId?: string;   // set by help-center after Linear/GitHub promotion
}
```

**Written by:** `detect-bug-report`. **Read by:** `help-center` agent.

---

## `churn-flags.json`

Customers whose recent activity suggests churn risk.

```ts
interface ChurnFlag extends BaseRecord {
  id: string;
  customerSlug: string;
  reason: string;                // one-line summary
  confidence: number;            // 0–100
  flaggedAt: string;             // ISO-8601 UTC
  signals: string[];             // e.g. ["3 tickets in 14d", "mentioned competitor", "cancelled trial"]
  suggestedPlay?: string;        // e.g. "personal check-in from founder"
  status: "open" | "addressed" | "churned" | "recovered";
}
```

**Written by:** `churn-risk-scan`.

---

## `morning-brief.md`

Plain markdown. Overwritten each morning. Ranked "start here" list for the founder. Not a log — only the freshest brief is retained.

**Written by:** `morning-briefing`.
