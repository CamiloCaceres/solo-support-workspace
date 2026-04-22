# Research — `success`

**Scrape date:** 2026-04-22
**Scraped by:** Claude Code session
**Pages scraped:** `gumloop.com/templates/solutions/support`, `gumloop.com/templates`
**Role:** Success & Retention (Solo Support Workspace)
**Scope:** The proactive, outbound, trust-building agent. Owns
onboarding outreach, account health scoring, renewal drafts, churn-save
drafts, QBR prep, and expansion nudges. Reads heavily from Inbox
(conversations, churn flags, customers) and Help Center (requests,
ships), writes its own account-centric data at agent root.

---

## Catalog input

Full scrape lives at `gumloop-support-catalog-2026-04-22.md`. Zero
templates on Gumloop's `/support` page cover customer-success /
retention work. Adjacent templates found:

- `LinkedIn Contact Enrichment with HubSpot and Slack` — shape only
  for "pull context on an account before writing to them." Already
  covered by `sdr-agent/enrich-contact`; we do NOT duplicate it here.
- `AI Research Agent with Automated Report Generation` — shape only
  for `prep-qbr` (build an account report). Lives in HoM agent,
  not here. We take the output shape, not the implementation.

Every skill for this role is **coverage gap**. This is consistent
with Gumloop's catalog being deflection-heavy and success-light.

---

## Templates

No direct templates. Shape references noted above.

---

## Coverage gaps (100% of skill surface)

- **`draft-onboarding-sequence`** — draft a welcome + activation drip
  for new signups or new paid accounts. Tailored to product surface
  from the shared context doc.
- **`customer-timeline`** — aggregate every touchpoint for an
  account: sign-up → support interactions → bugs filed → features
  requested → renewals → health-score history. Output is a markdown
  timeline per account. Prerequisite for everything else in this agent.
- **`score-account-health`** — traffic-light score per account from
  signals: support volume (inbox), bug count (inbox `bug-candidates`),
  churn flags (inbox `churn-flags`), feature requests unmet (help-center),
  last seen (usage if connected via Composio), billing state (Stripe
  via Composio). Output: GREEN / YELLOW / RED + reasoning + one
  recommended action.
- **`draft-renewal-outreach`** — 30/60/90-day pre-renewal draft
  sequence per account, grounded in the customer's timeline + open
  items. Draft-only, never send.
- **`draft-churn-save`** — when a churn flag fires or a downgrade
  signal lands, draft a save email tailored to what the customer's
  pain looks like in history. Surfaces open bugs that might be the
  actual reason.
- **`prep-qbr`** — outline a quarterly business review for a specific
  account: what they've gotten, what they asked for, what shipped for
  them, where they're stuck, what we're proposing next.
- **`nudge-expansion`** — detect "this account is hitting the ceiling
  of plan X" from usage + support signals and draft the expansion
  conversation.

---

## Roll-up

### Proposed skills

| Skill | Derived from | Description opener |
|-------|--------------|--------------------|
| `onboard-me` | standard | Use when the founder says "onboard me" or no `config/` exists yet |
| `customer-timeline` | coverage gap | Use when the founder asks about "{account}'s full story" / "what's the history on {customer}" / before any other success skill for that account |
| `score-account-health` | coverage gap | Use when the founder asks to score {account}'s health, or during `weekly-support-review` aggregation |
| `draft-onboarding-sequence` | coverage gap | Use when the founder asks to "write onboarding for {segment/customer}" / "welcome series" / new-signup flows |
| `draft-renewal-outreach` | coverage gap | Use when the founder says "renewal is coming up for {account}" / "draft 30/60/90 for {account}" |
| `draft-churn-save` | coverage gap | Use when the founder asks to save {account}, or when Inbox's `churn-risk-scan` surfaces a RED signal worth acting on |
| `prep-qbr` | coverage gap | Use when the founder says "prep a QBR for {account}" / "outline for my check-in with {customer}" |
| `nudge-expansion` | coverage gap | Use when the founder says "they're ready for plan {x}" / "draft the expansion for {account}" / or when health-score surfaces ceiling signals |

### Proposed use cases (feed README + CLAUDE.md first-prompts)

| Use case (end-user prompt) | Skill |
|----------------------------|-------|
| "Show me the full timeline for {customer}" | `customer-timeline` |
| "Score account health for {customer}" | `score-account-health` |
| "Draft the onboarding sequence for new {segment} signups" | `draft-onboarding-sequence` |
| "Draft renewal outreach for {account}" | `draft-renewal-outreach` |
| "Draft a churn-save for {account}" | `draft-churn-save` |
| "Prep a QBR for {account}" | `prep-qbr` |
| "Draft an expansion nudge for {account}" | `nudge-expansion` |

### Data owned

- `accounts.json` — index of tracked accounts.
- `health-scores.json` — latest score per account with history pointer.
- `accounts/{slug}/profile.json` — enriched account profile (segment,
  plan, MRR, key contacts).
- `accounts/{slug}/timeline.md` — the living timeline markdown.
- `accounts/{slug}/health-history.json` — score history.
- `onboarding/{slug}.md`, `renewals/{slug}.md`, `saves/{slug}.md`,
  `qbrs/{slug}.md`, `expansion/{slug}.md` — the draft artifacts.
- `outputs.json` — index feeding the Overview dashboard.
- `config/profile.json`, `config/accounts-seed.json` (optional) —
  learned context.

### Cross-agent reads

- `../head-of-support/support-context.md` — **mandatory** before any
  draft. If missing, stop and direct founder to run
  `define-support-context`.
- `../inbox/conversations.json`, `../inbox/customers.json`,
  `../inbox/churn-flags.json`, `../inbox/bug-candidates.json`,
  `../inbox/followups.json` — customer history + signals.
- `../help-center/requests.json`, `../help-center/shipped-log.json`
  — which customers asked for what, and what shipped since.

All cross-agent reads degrade gracefully — if Inbox isn't installed,
Success asks the founder for a paste or points them to install Inbox.

### Coverage gaps for this role's v1 build

- Live usage data (product analytics) is not Composio-native for
  most products. v1 accepts this: health score runs on the
  support-side signals above and can optionally take a paste of
  last-active timestamps.

---

## Hand-off

This MD is the spec. Build phase:

1. Reads this file + `../TEAM-GUIDE.md` + `../BUILD-CONVENTIONS.md`.
2. Uses the "Proposed skills" table as the skill list.
3. Uses the "Proposed use cases" table as `houston.json` → `useCases`.
4. Applies `../role-agents-workspace/role-agent-guide.md` for the
   build phase.
5. Non-coordinator — opens every substantive skill with "read the
   support context doc; if missing, stop and ask the founder to run
   Head of Support's `define-support-context` first."
