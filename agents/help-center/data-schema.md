# Help Center — Data Schema

All files live at the agent root (this directory). Never under `.houston/<agent>/` — the file watcher skips those paths.

Every record has:

```ts
type BaseRecord = {
  id: string;           // uuid v4
  createdAt: string;    // ISO-8601 UTC
  updatedAt: string;    // ISO-8601 UTC
};
```

All JSON writes use the atomic write pattern: write to `<file>.tmp`, then rename over `<file>`.

---

## Cross-agent reads (from `../inbox/`)

The Help Center reads — **never writes** — these files produced by the sister `inbox` agent:

- `../inbox/conversations.json` — index of all incoming conversations
- `../inbox/conversations/{id}/thread.json` — full message threads used by `draft-article-from-ticket` and `detect-repeat-question`
- `../inbox/bug-candidates.json` — bug signals used by `known-issue-track` to decide promotion to Linear/GitHub
- `../inbox/customers.json` — customer records used by `capture-feature-request` and `broadcast-shipped` for attribution

If `../inbox/` is missing, skills degrade gracefully rather than error.

---

## `articles.json`

Flat index of every article (draft or published). Content lives in `articles/{slug}/article.md`.

```ts
interface ArticleIndexEntry extends BaseRecord {
  slug: string;                 // kebab-case, unique, used as folder name
  title: string;
  status: "draft" | "published" | "archived";
  category: "how-to" | "troubleshooting" | "faq" | "known-issue" | "reference";
  tags: string[];
  lastVerifiedAt: string | null;   // ISO — last time founder confirmed still accurate
  sourceTicketIds: string[];        // inbox conversation ids that seeded this article
}
```

**Written by:** `draft-article-from-ticket`, `refresh-stale`, `known-issue-track`.

---

## `gaps.json`

Recurring questions from inbox that have no matching article yet.

```ts
interface Gap extends BaseRecord {
  question: string;             // canonical phrasing
  occurrenceCount: number;      // how many distinct conversations asked this
  sourceTicketIds: string[];    // inbox conversation ids
  status: "open" | "drafting" | "article-created" | "dismissed";
  relatedArticleSlug?: string;  // set when promoted to an article
}
```

**Written by:** `detect-repeat-question` (append / merge), `gap-surface` (status updates).

---

## `patterns.json`

Broader themes across tickets — e.g. "confusion during onboarding step 3", "billing churn in month 2". Higher-level than gaps.

```ts
interface Pattern extends BaseRecord {
  theme: string;                // short descriptor
  frequency: number;            // distinct conversations matching the theme
  exampleTicketIds: string[];   // representative samples, up to ~10
  severity: "low" | "medium" | "high";
  firstSeenAt: string;          // ISO
}
```

**Written by:** `detect-repeat-question`, `weekly-digest` (updates severity/frequency).

---

## `requests.json`

Feature requests, attributed to customers.

```ts
interface FeatureRequest extends BaseRecord {
  title: string;
  summary: string;
  requestingCustomers: string[];     // customer slugs from ../inbox/customers.json
  roadmapStatus: "requested" | "under-consideration" | "planned" | "in-progress" | "shipped" | "declined";
  linearId: string | null;           // Linear issue id if synced via Composio
  githubIssueUrl?: string | null;    // GitHub issue url if synced via Composio
}
```

**Written by:** `capture-feature-request` (append / merge), `broadcast-shipped` (flips status to `shipped`).

---

## `shipped-log.json`

What has shipped, which requests it closed, and what broadcasts went out.

```ts
interface ShippedEntry extends BaseRecord {
  releasedAt: string;                  // ISO
  summary: string;                     // one-sentence what-shipped
  closedRequestIds: string[];          // FeatureRequest ids now marked shipped
  broadcasts: {
    customerSlug: string;
    status: "drafted" | "approved" | "sent";
    draftPath: string;                 // e.g. digests/broadcast-{id}/{slug}.md
    sentAt?: string;
  }[];
}
```

**Written by:** `broadcast-shipped`.

---

## `known-issues.json`

Active and historical known issues / defects.

```ts
interface KnownIssue extends BaseRecord {
  title: string;
  symptoms: string;
  workaround: string | null;
  status: "investigating" | "workaround-available" | "fix-in-progress" | "resolved";
  affectedCustomerSlugs: string[];
  trackerId: string | null;            // Linear / GitHub id, set via Composio
  statusArticleSlug: string | null;    // articles/known-issue-{id}/
}
```

**Written by:** `known-issue-track`.

---

## `articles/{slug}/article.md`

The article body. Front-matter optional; content is markdown.

Suggested structure:

```markdown
# Title

**Status:** draft | published
**Last verified:** 2026-04-17

## TL;DR
One-sentence answer.

## Details
...

## Related
- [Other article](../other-slug/article.md)
```

Written by `draft-article-from-ticket` and updated by `refresh-stale`, `known-issue-track`.

---

## `articles/{slug}/meta.json`

Per-article metadata that would bloat `articles.json`.

```ts
interface ArticleMeta {
  slug: string;
  status: "draft" | "published" | "archived";
  version: number;                  // increments on each edit after publish
  sourceTicketIds: string[];
  needsReview: boolean;
  reviewNotes: string | null;       // why refresh-stale flagged it
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

Written alongside `article.md`.

---

## `digests/{iso-week}.md`

One markdown file per ISO week (e.g. `2026-W16.md`). Structure:

```markdown
# Week of Apr 13–19, 2026

## Volume
- N conversations, M resolved
- Median time-to-first-response: ...

## Top themes
1. ...

## Unresolved high-priority
- ...

## Churn signals
- ...

## Shipped this week
- ...

## Gaps ready to doc
- ...
```

Written by `weekly-digest`.

---

## `digests/broadcast-{id}/`

Per-customer drafts created by `broadcast-shipped`. One `.md` file per requesting customer, held until founder approves in chat.

```
digests/broadcast-{shipped-entry-id}/
  {customer-slug}.md
  ...
```
