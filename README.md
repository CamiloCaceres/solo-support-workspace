# Solo Support Workspace

A four-agent Houston workspace for **solo founders and small teams
(2–5 people)** who manage their own customer support and want to
automate the parts that burn time without losing the voice and
judgment that makes support from a founder feel different.

## Who this is for

You're the CEO, CTO, or founding engineer. You also handle
`support@`. Your inbox fills up Monday morning, you context-switch
into support 8–15 times a day, you've been meaning to write docs for
the same five questions you keep answering, and you're quietly
terrified of a renewal you forgot to prepare for. You don't want a
help-desk product — you want agents that do the invisible work so
you stay in the loop without drowning.

## The four agents

### 🎧 Head of Customer Support — the coordinator
Owns the shared **`support-context.md`** — product surface, tone,
SLA tiers, VIPs, routing rules, known gotchas. Calibrates your voice
from real sent replies, writes escalation playbooks, runs the weekly
support review across every agent, and mines tickets for product +
positioning signal. Everyone else reads its context doc before they
do anything.

Skills: `onboard-me`, `define-support-context`, `voice-calibration`,
`tune-routing-rules`, `draft-escalation-playbook`,
`weekly-support-review`, `synthesize-voice-of-customer`.

### 📥 Inbox — frontline desk
Owns every inbound conversation. Triages, drafts replies in your
voice, tracks promises you make, watches SLAs, detects bugs worth
filing, flags churn risk from sentiment, gives you a morning brief.
**Never sends — always drafts.** You approve in chat.

Skills: `onboard-me`, `triage-incoming`, `draft-reply`,
`thread-summary`, `customer-dossier`, `promise-tracker`,
`sla-watchdog`, `morning-briefing`, `detect-bug-report`,
`churn-risk-scan`, `stale-thread-rescue`.

### 📚 Help Center — knowledge + patterns
Turns every resolved ticket into knowledge. Drafts KB articles,
spots recurring questions, logs feature requests with customer
attribution, broadcasts when those features ship ("you asked, we
built it"), posts the weekly support digest, tracks known issues.

Skills: `onboard-me`, `draft-article-from-ticket`,
`detect-repeat-question`, `gap-surface`, `refresh-stale`,
`capture-feature-request`, `broadcast-shipped`, `weekly-digest`,
`known-issue-track`.

### 📈 Success & Retention — proactive outreach
Runs the outbound, trust-building motions that keep customers
paying — onboarding sequences, account health scores, renewal
outreach drafts, churn-save drafts, QBR prep, expansion nudges.
Reads Inbox + Help Center so signals surface automatically.

Skills: `onboard-me`, `customer-timeline`, `score-account-health`,
`draft-onboarding-sequence`, `draft-renewal-outreach`,
`draft-churn-save`, `prep-qbr`, `nudge-expansion`.

## How they coordinate

One file, one owner:

- Head of Customer Support **writes**
  `agents/head-of-support/support-context.md`.
- Inbox, Help Center, and Success **read**
  `../head-of-support/support-context.md` before any substantive
  work. If the doc is missing or empty, they stop and point you at
  Head of Customer Support first.

No magic orchestration. Just a shared markdown file and three
read-only pointers. Additionally, Help Center reads `../inbox/`
for source tickets + bug candidates, and Success reads both
`../inbox/` and `../help-center/` for customer history + shipped
features.

## Integrations

Every external tool (Gmail, Intercom, Front, Help Scout, Zendesk,
Linear, GitHub, Notion, Stripe, Slack, your usage analytics) is
accessed through **[Composio](https://composio.dev)**. There are no
per-tool documents or configs in this workspace — the agents
discover and call tools via `composio search <keyword>` at runtime.
Connect whatever you use in Houston's Integrations tab; the agents
adapt.

## Install

In Houston: **Add from GitHub** → paste this repo's URL. Houston
will install all four agents and drop them into a workspace under
`~/Documents/Houston/Solo Support Workspace/`.

## Try these first — start with Head of Customer Support

The other three agents read Head of Customer Support's context doc,
so run those two foundation skills before anything else:

```
Head of Customer Support:
  Set up our support context — product, tone, SLAs, VIPs
  Calibrate my voice from 10 past replies
```

Then each agent has its own onboarding card in the Activity tab.
After context + voice are locked, the highest-leverage first prompts:

**Inbox:**
- `Pull unread from my connected inbox and triage`
- `Give me my morning brief`
- `Draft a reply for conversation <id>`

**Help Center:**
- `What should I write docs for?`
- `What happened this week?`
- `We shipped <feature> — tell the customers who asked`

**Success & Retention:**
- `Show me the full timeline for <customer>`
- `Score account health for <customer>`
- `Draft renewal outreach for <account>`

**Head of Customer Support (weekly ritual):**
- `Give me the Monday support review`
- `Mine the last month of tickets for product + positioning signals`

## Structure

```
solo-support-workspace/
├── workspace.json
├── README.md
├── TEAM-GUIDE.md                     # roster, coordinator pattern, skill lists
├── BUILD-CONVENTIONS.md              # workspace-scoped build rules
├── research/
│   ├── gumloop-support-catalog-*.md
│   ├── head-of-support.md
│   ├── inbox.md                      # delta — evolved existing
│   ├── help-center.md                # delta — evolved existing
│   └── success.md
├── scripts/
│   ├── bundle_template.js
│   └── generate_bundles.py
└── agents/
    ├── head-of-support/
    ├── inbox/
    ├── help-center/
    └── success/
```

Each agent ships: `houston.json`, `CLAUDE.md`, `README.md`,
`data-schema.md`, `bundle.js` (generated), `icon.png`, `.gitignore`,
and one `SKILL.md` per skill under `.agents/skills/`.

## Data layout

Each agent stores data at its root (never under `.houston/<agent>/`,
which the file watcher skips). See each agent's `data-schema.md` for
the full contract.

Everything is JSON (index files) + markdown (drafts, articles,
timelines, digests, reviews, playbooks), written with
temp-file-rename atomicity. Easy to read, easy to export, easy to
move.

## Regenerating bundles

The Overview dashboard for each agent is generated from
`scripts/bundle_template.js` + that agent's `houston.json`
`useCases`. After editing `useCases` or the template:

```bash
python3 scripts/generate_bundles.py
```

The script writes `agents/{agent-id}/bundle.js` for every agent and
verifies each loads via a Node shim.

## License

MIT.
