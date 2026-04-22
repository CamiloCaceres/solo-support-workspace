# Success & Retention — Data Schema

All records share base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

Atomic writes (`{path}.tmp` → rename). Never write under
`.houston/<agent>/` at runtime.

---

## Config

### `config/profile.json`
```ts
interface Profile {
  userName: string;
  onboardedAt: string;
  status: "onboarded" | "partial";
}
```

### `config/accounts-seed.json` (optional)

Tracked accounts seeded from onboarding. The `accounts.json` index
at agent root is the live version; this is just initial capture.

### `config/renewal-cadence.json`
```ts
interface RenewalCadence {
  defaultCycleDays: number;    // 365 typical
  touchSchedule: { daysOut: number; name: string }[]; // e.g. [{90,"ROI"},{60,"friction"},{30,"ask"}]
  source: "paste" | "file";
  capturedAt: string;
}
```

### `config/health-definitions.json`
```ts
interface HealthDefinitions {
  greenSignals: string[];      // e.g. ["logged in last 7d", "NPS 9+"]
  yellowSignals: string[];
  redSignals: string[];
  source: "paste" | "file";
  capturedAt: string;
}
```

---

## Top-level indexes (at agent root)

### `accounts.json`
```ts
interface AccountIndex extends BaseRecord {
  slug: string;                // kebab-case, unique
  name: string;
  segment?: string;
  plan?: string;
  mrr?: number;
  renewalDate?: string;        // ISO
  primaryContact?: string;     // email or name
  source: "paste" | "connected-crm" | "inferred-from-inbox";
}
```

### `health-scores.json`
```ts
interface HealthScore extends BaseRecord {
  accountSlug: string;
  score: "GREEN" | "YELLOW" | "RED";
  signals: string[];            // the 3 driving signals
  reasoning: string;            // one paragraph
  recommendedAction: string;    // one sentence
  path: string;                 // accounts/{slug}/health-{YYYY-MM-DD}.md
}
```

### `outputs.json`
```ts
interface Output extends BaseRecord {
  type:
    | "timeline"            // customer-timeline
    | "health-score"        // score-account-health
    | "onboarding"          // draft-onboarding-sequence
    | "renewal"             // draft-renewal-outreach
    | "save"                // draft-churn-save
    | "qbr"                 // prep-qbr
    | "expansion";          // nudge-expansion
  title: string;
  summary: string;
  path: string;
  status: "draft" | "ready";
}
```

Mark `draft` until the founder approves / sends. Flip to `ready`
after. On update, refresh `updatedAt` only.

---

## Per-account content

### `accounts/{slug}/profile.json`
```ts
interface AccountProfile extends BaseRecord {
  slug: string;
  name: string;
  website?: string;
  segment?: string;
  plan?: string;
  mrr?: number;
  renewalDate?: string;
  contacts: Array<{ name: string; email?: string; role?: string }>;
  notes?: string;               // founder free-text
}
```

### `accounts/{slug}/timeline.md`

Living markdown. Written by `customer-timeline`, re-run on demand.
Structure: chronological bullets tagged `[ticket] / [bug] / [ask] /
[ship] / [churn-flag] / [health]`. Ends with "What the account looks
like today — 3 sentences."

### `accounts/{slug}/health-history.json`
```ts
interface HealthHistory {
  accountSlug: string;
  entries: Array<{
    scoredAt: string;
    score: "GREEN" | "YELLOW" | "RED";
    reasoningPath: string;      // pointer to the full health-{date}.md
  }>;
}
```

### `accounts/{slug}/health-{YYYY-MM-DD}.md`

Full scoring write-up from `score-account-health`.

---

## Topic subfolders

| Subfolder | Skill | Filename pattern | Content |
|-----------|-------|------------------|---------|
| `onboarding/` | `draft-onboarding-sequence` | `{slug}.md` | Day 0/1/3/7/14 drip with CTA + success metric per touch |
| `renewals/` | `draft-renewal-outreach` | `{account-slug}-{YYYY-MM-DD}.md` | Day-90 / Day-60 / Day-30 touches grounded in timeline |
| `saves/` | `draft-churn-save` | `{account-slug}-{YYYY-MM-DD}.md` | Single save message grounded in specific risk signal |
| `qbrs/` | `prep-qbr` | `{account-slug}-{YYYY-MM-DD}.md` | Wins / asks-shipped / friction / proposed next moves |
| `expansion/` | `nudge-expansion` | `{account-slug}-{YYYY-MM-DD}.md` | Single expansion message grounded in ceiling signal |

---

## Cross-agent reads

Read-only. Degrade gracefully if missing.

- `../head-of-support/support-context.md` — **mandatory before any
  draft.** Voice, segments, SLA tiers, gotchas.
- `../inbox/conversations.json`, `../inbox/customers.json`,
  `../inbox/conversations/{id}/thread.json`,
  `../inbox/bug-candidates.json`, `../inbox/churn-flags.json`,
  `../inbox/followups.json` — history + signals.
- `../help-center/requests.json`, `../help-center/shipped-log.json`,
  `../help-center/patterns.json` — asks + ships.

---

## Write discipline

- Atomic writes (`.tmp` → rename).
- UUID v4 IDs, ISO-8601 UTC timestamps.
- Read-merge-write for every JSON index — never overwrite.
- Never write under `.houston/<agent>/` at runtime.
