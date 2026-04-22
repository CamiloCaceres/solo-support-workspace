# Head of Customer Support — Data Schema

All records share base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

All writes are atomic: write to `{path}.tmp`, then rename onto the
target path. Never edit in place. Never write anywhere under
`.houston/<agent>/` at runtime — the Houston file watcher skips those
paths and reactivity breaks. Exception: the seeded
`.houston/activity.json` onboarding card at install time.

---

## Config — what the agent learns about the user

Nothing in `config/` is shipped in the repo. Every file appears at
runtime.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  role?: string;
  onboardedAt: string;
  status: "onboarded" | "partial";
}
```

### `config/product.json` — written by `onboard-me`

```ts
interface Product {
  name: string;
  oneLine: string;
  url?: string;
  surface: string[];           // feature areas / top flows
  pricing?: { model: string; tiers?: string[] };
  selfServe?: boolean;
  source: "paste" | "url" | "file";
  capturedAt: string;
}
```

### `config/segments.json` — written by `onboard-me`

```ts
interface Segments {
  segments: Array<{ name: string; size?: string; plan?: string }>;
  vips?: string[];             // named accounts
  source: "paste" | "url" | "file" | "connected-crm";
  capturedAt: string;
}
```

### `config/support-stance.json` — written by `onboard-me`

```ts
interface SupportStance {
  sla: {
    p1?: string;               // e.g. "first response within 1 hour"
    p2?: string;
    p3?: string;
    p4?: string;
  };
  tone: string;                // one-paragraph default tone (refined by voice-calibration)
  escalationContacts?: string[];
  source: "paste" | "url" | "file";
  capturedAt: string;
}
```

---

## The shared context doc

### `support-context.md` — written by `define-support-context` (and edited by other HoS skills)

**Special file.** Lives at the agent root. Single source of truth for
product / tone / SLA / routing / VIPs / gotchas across the workspace.

- Only this agent writes it.
- Every non-HoS agent reads it via
  `../head-of-support/support-context.md` before any substantive
  output. If missing, they stop and tell the founder to run me first.
- Live document — not recorded in `outputs.json`. Each substantive
  edit IS logged in `outputs.json` so the dashboard shows the change.

Structure (markdown):

1. **Product overview** — what we make, who it's for, key surface.
2. **Customer segments + VIP list** — named accounts that get P1.
3. **Tone + voice** — direct / warm / human; verbatim samples; forbidden
   phrases. Refreshed by `voice-calibration`.
4. **SLA tiers** — P1 / P2 / P3 / P4 response-time expectations.
5. **Routing rules** — bug vs feature vs outage vs billing, with
   target per type (tracker slug, playbook, dossier path).
6. **Known gotchas** — the short whisper-list of product quirks
   answered 10+ times.

---

## Domain data — what the agent produces

### `outputs.json` — dashboard index

Single array at the agent root. Every substantive artifact (and each
material edit to `support-context.md`) appends an entry.
Read-merge-write atomically.

```ts
interface Output extends BaseRecord {
  type:
    | "context-edit"        // define-support-context / tune-routing-rules / voice-calibration
    | "playbook"            // draft-escalation-playbook
    | "review"              // weekly-support-review
    | "voc-report";         // synthesize-voice-of-customer
  title: string;
  summary: string;          // 2–3 sentences
  path: string;             // relative to agent root
  status: "draft" | "ready";
}
```

### Topic subfolders

| Subfolder | Written by | Filename pattern | Content |
|-----------|------------|------------------|---------|
| `voice-samples/` | `voice-calibration` | `{YYYY-MM-DD}-batch.md` or `{id}.md` | Raw verbatim outbound replies from connected inbox + tone summary |
| `playbooks/` | `draft-escalation-playbook` | `{slug}.md` (e.g. `p1-outage.md`, `security-incident.md`) | Step-by-step runbook with detection, comms, RCA, post-mortem |
| `reviews/` | `weekly-support-review` | `{YYYY-MM-DD}.md` | Cross-agent weekly rollup + 3 recommended next moves |
| `voc-reports/` | `synthesize-voice-of-customer` | `{YYYY-MM-DD}.md` or `{topic-slug}.md` | Verbatim pains, asks, friction quotes, positioning wedges |

---

## Cross-agent reads

I read (never write) these files for the Monday review + VoC mining:

- `../inbox/outputs.json` — what Inbox shipped / drafted
- `../inbox/conversations.json`, `../inbox/conversations/{id}/thread.json` — raw ticket traffic for VoC
- `../inbox/bug-candidates.json`, `../inbox/churn-flags.json`, `../inbox/followups.json`
- `../help-center/outputs.json` — what HC shipped
- `../help-center/requests.json`, `../help-center/patterns.json`, `../help-center/gaps.json`
- `../success/outputs.json`, `../success/health-scores.json`

Degrade gracefully — if a sister agent isn't installed or has no
outputs yet, note it as "no activity" and continue.

---

## Write discipline

- **Atomic writes.** `{file}.tmp` → rename.
- **IDs** UUID v4.
- **Timestamps** ISO-8601 UTC.
- **Never write under `.houston/<agent>/` at runtime.**
- **`support-context.md` is live.** Not in `outputs.json` itself;
  each material edit gets its own `outputs.json` entry with
  `type: "context-edit"`.
