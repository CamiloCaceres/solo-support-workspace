# Gumloop Support Catalog — Raw Scrape

**Date:** 2026-04-22
**Source:** https://www.gumloop.com/templates/solutions/support (+ master `/templates`)
**Method:** WebFetch (no Chrome). Page is JS-lazy-rendered — first fetch
returned the 9 server-rendered templates. Second and third prompts did
not surface more. Page badge reads "15+ Examples"; we accept the gap
and note it here.
**Count:** 9 support-tagged templates catalogued.
**Scope:** Source catalog for the Solo Support Workspace vertical.
Each agent's research MD cherry-picks from here and leans heavily on
coverage gaps — Gumloop's support library is an order of magnitude
thinner than its marketing one, so "invented from role knowledge"
is the dominant signal for this vertical.

---

## Category bins

**Inbox / email triage / draft (4)**
- Automated email triage
- Automated email draft responses with AI
- AI Customer Support Agent | Slack + Jira Ticket Creation
- AI Slack Support Agent | Automated Linear Ticket Creation

**Knowledge base / FAQ (1)**
- Convert Technical Documentation to FAQs

**Patterns / voice-of-customer (1)**
- Community Feedback Analysis

**Workflow primitives / utility (3)**
- Automated AI approval flow using Agents
- Meeting Transcript Enrichment with Circleback and Airtable
- Lana Linear

---

## Full list

| # | Title | Creator | Views | Tools named |
|---|-------|---------|-------|-------------|
| 1 | Automated email triage | Aron Korenblit | 784 | Gmail |
| 2 | Automated email draft responses with AI | Aron Korenblit | 916 | Gmail |
| 3 | AI Customer Support Agent — Slack + Jira Ticket Creation | Katherine Duh | 428 | Slack, Jira, Firecrawl, Confluence |
| 4 | AI Slack Support Agent — Automated Linear Ticket Creation | Katherine Duh | 169 | Slack, Linear, Firecrawl |
| 5 | Community Feedback Analysis | Arslan Ali | 153 | (web scrape + Google Docs) |
| 6 | Convert Technical Documentation to FAQs | Arslan Ali | 153 | Google Docs |
| 7 | Automated AI approval flow using Agents | Aron Korenblit | 662 | Airtable, Gumloop |
| 8 | Meeting Transcript Enrichment with Circleback and Airtable | Zachary Boland | 479 | Circleback, Airtable |
| 9 | Lana Linear | Zachary Boland | 295 | Linear |

---

## Signal from the catalog

1. **Inbox triage + drafting is the core loop.** Four of nine templates
   are variations on "message in → classify → draft reply / open a
   ticket." This confirms Inbox as the workspace's busiest agent.
2. **Ticket-tracker integration is universal.** Linear, Jira, Confluence,
   Airtable all show up. The support agents need to create/update
   tickets through Composio, not via hardcoded integrations.
3. **KB / FAQ generation appears only once** (Convert Technical Docs →
   FAQs) and it runs from a docs source, not from resolved tickets.
   The higher-signal Houston pattern — "turn resolved tickets into KB
   articles" — is a coverage gap.
4. **No templates for:** SLA watchdog, churn detection from sentiment,
   customer dossier assembly, morning-brief / ranked "start here,"
   weekly digest, shipped-feature broadcasts, feature-request roll-up
   with attribution, known-issues status page, onboarding outreach,
   health scoring, renewal/churn-save campaigns, QBR prep, expansion
   nudges. These are ALL coverage gaps — a signal that Gumloop's
   support library is slanted toward tier-1 deflection and
   ticket-plumbing, not the founder-facing judgment work a
   solo-founder support team actually needs.
5. **"Automated AI approval flow" is workflow glue, not a skill.** We
   absorb it into every non-sending draft path as baseline behavior
   ("draft → human approves in chat → send").
6. **"Meeting Transcript Enrichment" is CRM-shaped, not support.**
   Lives better in `sdr-agent` (already has `capture-call-notes`).
   Skip for support — a support success call would still land there.

---

## Coverage gaps (what a real support team needs that isn't on Gumloop)

Every item below is invented from role knowledge. These become the
bulk of the Houston skill surface:

- **Coordinator-layer** — the "Head of Support" role itself. Someone
  owns the shared product/tone/SLA context doc, runs the weekly
  review, maintains escalation rules, and writes playbooks. No
  Gumloop template exists for this.
- **Customer dossier** — pull profile + history + open bugs + churn
  flags before drafting. Implicit in all "AI support agent" templates
  but never a primitive.
- **Promise tracker** — "I'll check with engineering by Friday" → a
  commitment with a due date. Zero Gumloop coverage.
- **SLA watchdog** — breach-before-the-customer-chases alerts.
- **Morning brief** — ranked "start here" digest.
- **Stale-thread rescue** — conversations that went quiet on the
  founder's side.
- **Bug-candidate signal** — detect "this is a bug" in incoming
  messages, log with repro info.
- **Churn risk scan** — sentiment + usage + billing signal fusion,
  flag accounts that smell like they're leaving.
- **KB from resolved tickets** — draft article from a reusable answer
  the founder actually gave in chat.
- **Repeat-question surfacing** — semantic clustering of recent
  inbox, rank for "write docs here."
- **Stale-article refresh** — when the product ships or deprecates,
  flag affected articles.
- **Feature-request capture with attribution** — who asked for what,
  merge duplicates, sync to Linear/GitHub via Composio.
- **Shipped broadcast** — "you asked, we shipped it" drafts per
  requester.
- **Weekly support digest** — volume, top themes, unresolved items,
  churn flags, ships, in one markdown file.
- **Known-issues page** — promote repeat bugs to a tracker and a
  public status article.
- **Customer onboarding outreach** — welcome DMs, kickoff agenda,
  "have you hit {milestone} yet" nudges.
- **Health scoring** — traffic light per account from usage +
  support + sentiment + billing.
- **Renewal readout / churn save** — proactive drafts before renewal
  dates, save emails when downgrade risk fires.
- **QBR prep** — deck/doc outline per account for scheduled check-ins.
- **Expansion nudge** — "this account is hitting the ceiling of plan
  X — here's the upgrade conversation draft."

---

## Roll-up

### Gumloop templates → Houston mapping

| Template | Agent | Skill | Verdict |
|----------|-------|-------|---------|
| Automated email triage | inbox | `triage-incoming` | NEW-SKILL (seeded by template, extended by coverage-gap dossier read) |
| Automated email draft responses with AI | inbox | `draft-reply` | NEW-SKILL |
| AI Customer Support Agent — Slack+Jira | inbox + help-center | splits across `triage-incoming` (inbox) and `detect-bug-report` / `capture-feature-request` (help-center ticket creation through Composio) | SPLIT |
| AI Slack Support Agent — Linear | inbox + help-center | same split as above, Linear-target variant | ROLL-INTO (duplicates previous — same shape, swapped tracker) |
| Community Feedback Analysis | help-center | `detect-repeat-question` + `gap-surface` (pattern mining across message sources) | NEW-SKILL |
| Convert Technical Documentation to FAQs | help-center | covered adjacent to `draft-article-from-ticket` — docs-to-FAQ is a supplementary source; primary path is resolved-ticket → article | SKIP (wrong source direction for our model; noted as optional extension) |
| Automated AI approval flow using Agents | baseline | "draft → human approval in chat → send" is built into every sending skill; not its own skill | SKIP (baseline behavior) |
| Meeting Transcript Enrichment (Circleback + Airtable) | sdr-agent | already covered by `sdr-agent/capture-call-notes` | SKIP (wrong vertical) |
| Lana Linear | help-center | tracker-sync absorbed into `capture-feature-request` + `known-issue-track` via Composio Linear slugs | SKIP (tool-specific, absorbed into Composio baseline) |

### Proposed NEW skills (cross-cut)

Full skill list lives in `TEAM-GUIDE.md`. Short form:

- **head-of-support (coordinator, NEW AGENT):** `define-support-context`,
  `profile-icp`, `weekly-support-review`, `draft-escalation-playbook`,
  `tune-routing-rules`, `voice-calibration`, `onboard-me`.
- **inbox (existing, keep shape):** `triage-incoming`, `draft-reply`,
  `thread-summary`, `customer-dossier`, `promise-tracker`,
  `sla-watchdog`, `morning-briefing`, `detect-bug-report`,
  `churn-risk-scan`, `stale-thread-rescue`, `onboard-me`.
- **help-center (existing, keep shape):** `draft-article-from-ticket`,
  `detect-repeat-question`, `gap-surface`, `refresh-stale`,
  `capture-feature-request`, `broadcast-shipped`, `weekly-digest`,
  `known-issue-track`, `onboard-me`.
- **success (NEW AGENT):** `draft-onboarding-sequence`,
  `score-account-health`, `draft-renewal-outreach`,
  `draft-churn-save`, `prep-qbr`, `nudge-expansion`,
  `customer-timeline`, `onboard-me`.

### Proposed NEW use cases (feed READMEs / CLAUDE.md)

| Role | Use case | Skill |
|------|----------|-------|
| head-of-support | "Set our support context — product, tone, SLAs, VIPs" | `define-support-context` |
| head-of-support | "Give me the weekly support review" | `weekly-support-review` |
| head-of-support | "Draft the escalation playbook for P1 / outage" | `draft-escalation-playbook` |
| head-of-support | "Calibrate my support voice from 10 past replies" | `voice-calibration` |
| inbox | "Pull unread and triage" | `triage-incoming` |
| inbox | "Morning brief" | `morning-briefing` |
| inbox | "Draft a reply for conversation {id}" | `draft-reply` |
| inbox | "Who is {customer}?" | `customer-dossier` |
| inbox | "What did I promise and when is it due?" | `promise-tracker` |
| help-center | "What should I write docs for?" | `gap-surface` |
| help-center | "Draft an article from conversation {id}" | `draft-article-from-ticket` |
| help-center | "What happened this week?" | `weekly-digest` |
| help-center | "We shipped {feature} — tell the customers who asked" | `broadcast-shipped` |
| success | "Score account health for {customer}" | `score-account-health` |
| success | "Draft a renewal outreach for {account}" | `draft-renewal-outreach` |
| success | "Draft a churn-save for {account}" | `draft-churn-save` |
| success | "Prep a QBR for {account}" | `prep-qbr` |

### Skips

| Template | Reason |
|----------|--------|
| Convert Technical Documentation to FAQs | Wrong source direction. Our primary KB path is resolved-ticket → article; docs-to-FAQ is a secondary extension. Noted for future `refresh-stale` enhancement. |
| Automated AI approval flow using Agents | Baseline behavior across every sending skill, not a standalone primitive. |
| Meeting Transcript Enrichment | Sales/CRM workflow; already lives in `sdr-agent/capture-call-notes`. |
| Lana Linear | Tool-specific; absorbed into Composio baseline on ticket-syncing skills. |

---

## Hand-off

This catalog is the shared source for:

1. **`TEAM-GUIDE.md`** — argues the roster, locks the coordinator
   pattern, maps templates + coverage gaps onto per-agent skill lists.
2. **`research/{agent-id}.md`** (one per agent) — consumes the relevant
   subset of this catalog + coverage gaps, produces final skill lists
   and use-case tables the build phase eats.

The build phase does not re-scrape. It reads `TEAM-GUIDE.md` and the
per-agent research MDs and builds.
