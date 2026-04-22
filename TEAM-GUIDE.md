# Solo Support Team — Build Guide

**Workspace:** `solo-support-workspace/`
**Framing:** A solo founder (or 2–5 person founding team) downloads
Houston and "hires" a customer support department. No human team. The
four agents below are everything they need to run support ops
end-to-end — from "a ticket came in" through "draft the renewal call"
— without a dedicated support hire.

This document is the **team-level spec**. It sits above the per-agent
Gumloop research MDs (in `research/`). Build order, agent roster,
skill lists, and use cases are decided here. Each agent then gets its
own research MD per `../gumloop-research-playbook.md`, then its own
build per `../role-agents-workspace/role-agent-guide.md`.

---

## Who we're building for

**The solo founder / founding-team operator, week 0.** They:

- Run `support@`. They also write code, close deals, and ship the
  roadmap. Support is a tab that's open all day.
- Have a product, a handful of paying customers, and a Stripe account.
- Have a connected inbox (Gmail, Front, Intercom, Help Scout, Zendesk
  — whichever). They may have Linear / GitHub Issues. They probably
  have a Notion or empty docs site for KB. They definitely have Slack.
- Have a vague sense that they should write more docs, track churn
  signals, and stay ahead of renewals — but they're always in
  firefight mode.
- Do not want a help-desk product. They want agents they can **chat
  with** that do the invisible work so they stay in the loop without
  drowning.

**Hard nos** (baked into every agent):

- **Never send without approval.** Every reply, every outreach, every
  broadcast — drafted, then approved in chat.
- **Never publish without sign-off.** KB articles start as `draft`;
  only the founder flips them to `published`.
- **Never promise on the founder's behalf.** If we haven't seen the
  founder commit to a date or scope, we don't.
- **Never invent facts.** Thin dossier = say so and stop.

**The "done" line:** the founder can triage inbound, keep promises,
write docs, broadcast ships, spot churn, and run renewals on a
weekly rhythm **without a human support/success hire**.

---

## The four agents

Four hireable roles, each self-contained but coordinated through a
shared **support context doc** owned by the Head of Customer
Support. Err toward fewer, sharper agents: two overlapping agents is
worse than one clear one.

| # | Agent | Hired to… | Primary owner of |
|---|-------|-----------|------------------|
| 1 | **Head of Customer Support** (`head-of-support`) | Own the context, run the weekly review, write the playbooks | `support-context.md`, escalation playbooks, routing rules, weekly reviews, voice calibration |
| 2 | **Inbox** (`inbox`) | Triage every inbound, draft replies, surface what actually needs the founder | conversations, drafts, dossiers, promises, SLA, morning brief, bug + churn signals |
| 3 | **Help Center** (`help-center`) | Turn resolved tickets into durable knowledge + spot patterns | KB articles, gap/repeat detection, feature requests, shipped broadcasts, weekly digest, known issues |
| 4 | **Success & Retention** (`success`) | Run the proactive, outbound, trust-building motions that keep customers paying | onboarding outreach, health scores, renewal drafts, churn-save drafts, QBR prep, expansion nudges |

### Why this split (and why not the other splits)

- **Head of Customer Support, not "Strategist."** The coordinator is
  the job Inbox + Help Center + Success all read from. Naming it
  operationally ("Head of") forces it to own the weekly review and
  the escalation book, not just think about them.
- **Inbox and Help Center stay separate.** Inbox is reactive, live,
  draft-heavy. Help Center is curatorial, pattern-y, async. Different
  cadence, different mental mode, different data. If they were one
  agent, KB work would always lose to inbox fires.
- **Success is its own agent, not an Inbox skill.** The frontier
  between "respond to what came in" and "reach out before they churn"
  is exactly where solo founders lose money. Making Success a named
  hire forces the founder to ask the question. If you'd hire two
  humans (Support Lead + CSM), it's two agents.
- **No Ops / Reporting agent.** Reporting lives inside Head of
  Support's `weekly-support-review`. A dedicated Ops agent would be
  one skill pretending to be a role.
- **No RevOps / Billing agent.** Billing questions route through
  Inbox (via dossier + Stripe-via-Composio). Refund approvals stay
  with the founder.
- **We do NOT build** a dedicated Community / Forum agent (overlaps
  social in `../founder-marketing-workspace/social-community/`), a
  Product-analytics agent (too far from support's remit), or a
  Documentation-ingest agent (Help Center absorbs that via `refresh-stale`).

### Granularity test (from `BUILDING-A-VERTICAL.md`)

> If you'd hire two different humans for it, it's two agents.

- Support Lead + CSM = two hires → two agents (**Inbox + Success**).
- Support Lead + KB Curator = two hires → two agents (**Inbox + Help Center**).
- Head of Support = the coordinator that both a Support Lead and a
  CSM would report to → one more agent (**Head of Support**).
- Inbox + Success is not one role. A Success hire doing Inbox triage
  would drown; an Inbox hire doing QBR prep would be bored and bad
  at it.

---

## Shared state: the support context doc

All four agents read **one** shared markdown file owned by the Head
of Customer Support:

- Path (inside the workspace): `agents/head-of-support/support-context.md`
- Cross-agent read: `../head-of-support/support-context.md`

It contains:

- **Product surface area** — features, pricing tiers, self-serve vs
  gated, key in-app flows, integrations the customer is likely on.
- **ICP + customer segments** — paid tiers, VIPs, free/trial, typical
  roles ("founders," "ops leads," etc.).
- **Tone + voice** — direct / warm / human / no corporate hedging;
  seeded from Head of Support's `voice-calibration` skill reading 10
  past founder replies.
- **SLA rules** — P1 / P2 / P3 / P4 definitions, response-time
  expectations per tier. Defaults are overridable per workspace.
- **Routing rules** — what's a bug (→ Linear/GitHub), what's a feature
  request (→ `help-center/requests.json`), what's an outage
  (→ Head of Support escalation book), what's a billing question
  (→ Stripe dossier).
- **Known gotchas** — product quirks the founder has answered 10+
  times ("if you're on Safari, do X first"). Not the KB — that's
  Help Center's territory. This is the short whisper-list.
- **VIP list** — named accounts that get P1 treatment regardless of
  content.

**Rule baked into every non-HoS agent's `CLAUDE.md`:** "Before any
substantive output, read `../head-of-support/support-context.md`. If
it's empty or missing, tell the founder to run Head of Support's
`define-support-context` first and stop." This is the highest-leverage
pattern in the Houston codebase — we adopt it verbatim.

---

## Per-agent skill lists

Each list is a first-pass. The per-agent research MD will tighten
(split / merge / add coverage gaps) before build. Every agent also
gets `onboard-me` (standard).

### 1. Head of Customer Support — `head-of-support`

**Skills (6 + onboard-me):**

| Skill | Use case (README "First prompt") | Source |
|-------|----------------------------------|--------|
| `define-support-context` | "Set up our support context — product map, tone, SLA rules, VIPs" | Coverage gap (foundation) |
| `voice-calibration` | "Calibrate my support voice from 10 past replies" | Coverage gap |
| `tune-routing-rules` | "Update our routing — what's a bug, what's a feature request, what's an outage" | Coverage gap |
| `draft-escalation-playbook` | "Draft the P1 / outage playbook" | Coverage gap |
| `weekly-support-review` | "Give me the weekly support review" | Coverage gap + Community Feedback Analysis (shape only) |
| `synthesize-voice-of-customer` | "Mine the last month of tickets for positioning + product signals" | Community Feedback Analysis + coverage gap |

**Owns:** `support-context.md`, `playbooks/{slug}.md`,
`routing-rules.md`, `voice-samples/`, `reviews/{YYYY-MM-DD}.md`,
`voc-reports/{slug}.md`.

### 2. Inbox — `inbox`

**Skills (10 + onboard-me):** (existing shape, unchanged except for
coordinator read)

| Skill | Use case | Source |
|-------|----------|--------|
| `triage-incoming` | "Pull unread and triage" | Automated email triage + AI Customer Support Agent shape |
| `draft-reply` | "Draft a reply for conversation {id}" | Automated email draft responses with AI + coverage gap (dossier + voice read) |
| `thread-summary` | "Summarize conversation {id}" | Coverage gap |
| `customer-dossier` | "Who is {customer}?" | Coverage gap |
| `promise-tracker` | "What did I promise and when is it due?" | Coverage gap |
| `sla-watchdog` | "What's breaching SLA?" | Coverage gap |
| `morning-briefing` | "Morning brief" | Coverage gap |
| `detect-bug-report` | "Is this a bug? Log it." (implicit / triggered by triage) | AI Customer Support Agent shape (bug side) |
| `churn-risk-scan` | "Scan for churn risk across the inbox" | Coverage gap |
| `stale-thread-rescue` | "Surface stale threads waiting on me" | Coverage gap |

**Owns:** `conversations.json`, `customers.json`, `followups.json`,
`bug-candidates.json`, `churn-flags.json`, `conversations/{id}/*`,
`customers/{slug}/*`, `morning-brief.md`.

### 3. Help Center — `help-center`

**Skills (8 + onboard-me):** (existing shape, unchanged except for
coordinator read)

| Skill | Use case | Source |
|-------|----------|--------|
| `draft-article-from-ticket` | "Draft an article from conversation {id}" | Coverage gap (ticket → article is not on Gumloop) |
| `detect-repeat-question` | "What am I answering over and over?" | Community Feedback Analysis shape + coverage gap |
| `gap-surface` | "What should I write docs for?" | Coverage gap |
| `refresh-stale` | "Flag articles affected by {ship/deprecation}" | Coverage gap + (Convert Technical Docs to FAQs as secondary source mode) |
| `capture-feature-request` | "Log this as a feature request" (implicit / triggered) | AI Customer Support Agent shape (feature side) |
| `broadcast-shipped` | "We shipped {feature} — tell the customers who asked" | Coverage gap |
| `weekly-digest` | "What happened this week?" | Coverage gap |
| `known-issue-track` | "Promote recurring bug {x} to known-issue" | Coverage gap + Lana Linear shape (tracker sync) |

**Owns:** `articles.json`, `gaps.json`, `patterns.json`,
`requests.json`, `shipped-log.json`, `known-issues.json`,
`articles/{slug}/*`, `digests/{iso-week}.md`.

### 4. Success & Retention — `success`

**Skills (7 + onboard-me):** (new agent)

| Skill | Use case | Source |
|-------|----------|--------|
| `draft-onboarding-sequence` | "Draft the onboarding sequence for {customer/segment}" | Coverage gap |
| `customer-timeline` | "Show me the full timeline for {account}" | Coverage gap (reads inbox + help-center) |
| `score-account-health` | "Score account health for {customer}" | Coverage gap |
| `draft-renewal-outreach` | "Draft renewal outreach for {account}" | Coverage gap |
| `draft-churn-save` | "Draft a churn-save for {account}" | Coverage gap |
| `prep-qbr` | "Prep a QBR for {account}" | Coverage gap |
| `nudge-expansion` | "Draft an expansion nudge for {account}" | Coverage gap |

**Owns:** `accounts.json`, `health-scores.json`, `timelines.json`,
`accounts/{slug}/profile.json`, `accounts/{slug}/timeline.md`,
`onboarding/{slug}.md`, `renewals/{slug}.md`, `saves/{slug}.md`,
`qbrs/{slug}.md`, `expansion/{slug}.md`.

**Cross-agent reads (success is the heaviest reader):**

- `../head-of-support/support-context.md` — mandatory before drafting.
- `../inbox/conversations.json`, `../inbox/customers.json`,
  `../inbox/churn-flags.json`, `../inbox/bug-candidates.json` —
  customer history + signals.
- `../help-center/requests.json`, `../help-center/shipped-log.json`
  — which customers asked for what, and what shipped since.

---

## Gumloop → Houston mapping (consolidated)

| Gumloop template | Agent | Skill | Verdict |
|------------------|-------|-------|---------|
| Automated email triage | `inbox` | `triage-incoming` | SEED (shape only — extended by dossier + context reads) |
| Automated email draft responses with AI | `inbox` | `draft-reply` | SEED (shape only — extended by voice + dossier + approval-gate) |
| AI Customer Support Agent (Slack+Jira) | `inbox` + `help-center` | `triage-incoming` + `detect-bug-report` + `capture-feature-request` | SPLIT across agents |
| AI Slack Support Agent (Linear) | same as above | same skills — Linear-target variant absorbed into Composio baseline | ROLL-INTO |
| Community Feedback Analysis | `head-of-support` + `help-center` | `synthesize-voice-of-customer` (HoS) + `detect-repeat-question` / `gap-surface` (HC) | SPLIT |
| Convert Technical Documentation to FAQs | `help-center` | optional secondary source mode for `refresh-stale` | SKIP-PRIMARY (wrong direction for v1) |
| Automated AI approval flow using Agents | — | baseline behavior on every sending skill | SKIP (baseline) |
| Meeting Transcript Enrichment (Circleback+Airtable) | — | lives in `sdr-agent/capture-call-notes` | SKIP (wrong vertical) |
| Lana Linear | `help-center` | absorbed into `known-issue-track` via Composio Linear slugs | SKIP (tool-specific) |

**Bottom line:** 3 templates give us shape for Inbox skills, 1 gives
shape for a Help Center pattern skill and a HoS VoC skill, 5 are
skipped (baseline / wrong vertical / tool-specific). Everything else
is coverage gap. This is expected — Gumloop's support library is thin.

---

## Build order (recommended)

Don't build all four in parallel — the Head of Customer Support ships
first because the other three read its `support-context.md`.

1. **Head of Customer Support** first. Without the context doc, the
   others produce bland, voiceless output. Ship HoS, have the founder
   run `define-support-context` and `voice-calibration`, lock the doc.
2. **Inbox** second. The workspace's busiest agent. Evolves the
   existing `inbox/` — mostly identity + CLAUDE.md updates to read
   the coordinator's doc; skill shape stays.
3. **Help Center** third. Reads Inbox's `conversations/` and
   `bug-candidates.json` (already does). Evolves the existing
   `help-center/` similarly — identity + CLAUDE.md delta.
4. **Success & Retention** fourth. Net-new agent. Reads HoS context
   doc + Inbox data + Help Center `requests.json` / `shipped-log.json`.

Each agent build follows the playbook:

1. Run `../gumloop-research-playbook.md` (already done at catalog
   level — per-agent research MDs in `research/` are thin slices of
   this team guide's mapping tables).
2. USER CHECKPOINT on the research MD.
3. Build the agent per `../role-agents-workspace/role-agent-guide.md`
   and the conventions below.

---

## Workspace conventions

- **Directory:** `solo-support-workspace/` (this dir).
- **Each agent is self-contained** — would work as a standalone
  install. Cross-agent reads degrade gracefully (Help Center works
  without Inbox; Success works without either, etc.).
- **Outputs are markdown + flat JSON indexes.** Each agent has a
  top-level `outputs.json` for the dashboard's recent-activity feed;
  domain indexes (`conversations.json`, `articles.json`, etc.) live
  at agent root.
- **Dashboard:** hand-crafted IIFE per agent, read-only, generated
  from `scripts/bundle_template.js` + `scripts/generate_bundles.py`
  mirroring `../founder-marketing-workspace/`.
- **Data paths never go under `.houston/<agent>/`** — the Houston
  file watcher skips that prefix.

Build rules detail lives in **`BUILD-CONVENTIONS.md`** (copied &
adapted from `../founder-marketing-workspace/BUILD-CONVENTIONS.md`).

---

## What lives where (output tree after all four are built)

```
solo-support-workspace/
├── workspace.json
├── README.md
├── TEAM-GUIDE.md                  # this file
├── BUILD-CONVENTIONS.md           # workspace-scoped build rules
├── research/
│   ├── gumloop-support-catalog-2026-04-22.md
│   ├── head-of-support.md
│   ├── inbox.md                   # thin — existing agent delta
│   ├── help-center.md             # thin — existing agent delta
│   └── success.md
├── scripts/
│   ├── bundle_template.js
│   └── generate_bundles.py
└── agents/
    ├── head-of-support/
    ├── inbox/                     # evolved from existing
    ├── help-center/               # evolved from existing
    └── success/
```

---

## Deltas vs. the existing workspace state

Before this guide, `solo-support-workspace/` had two agents (Inbox +
Help Center) and no coordinator. The deltas:

- **Add** `head-of-support` (new agent).
- **Add** `success` (new agent).
- **Evolve** `inbox/CLAUDE.md` to read `../head-of-support/support-context.md`
  before substantive drafting (add the cross-agent read rule).
- **Evolve** `help-center/CLAUDE.md` similarly (context for tone on
  broadcasts + digests).
- **Add** workspace-scoped `BUILD-CONVENTIONS.md` + `scripts/` for the
  dashboard generator (existing `inbox/bundle.js` + `help-center/bundle.js`
  are hand-rolled; regenerating them against the template keeps the
  workspace consistent).
- **Add** workspace `README.md` install one-liner + first-prompts list.

The existing Inbox and Help Center skill shapes survive unchanged —
they were well-specified. The missing piece was the coordinator +
proactive-outreach surface. This guide names that gap and closes it.

---

## Done criteria for this guide

- [x] Audience locked (solo founder / 2–5 person founding team, hard
      nos listed).
- [x] Team roster locked (4 agents named, coordinator pattern
      explicit).
- [x] Per-agent skill list drafted with use-case phrasings.
- [x] Gumloop catalog mapped (3 seeds, 1 split, 5 skips).
- [x] Coverage gaps named — they dominate (expected).
- [x] Build order decided.
- [ ] User reviews and approves this file.
- [ ] Per-agent research MDs exist in `research/` (4 agents).
- [ ] Agents built under `agents/` (2 new + 2 evolved).
- [ ] `scripts/bundle_template.js` + `generate_bundles.py` ship.
- [ ] Workspace `README.md` updated with 4 agents.
