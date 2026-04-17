# Solo Support Workspace

A two-agent Houston workspace for **solo founders and small teams (2-5 people)** who manage their own customer support and want to automate the parts that burn time without losing the voice and judgment that makes support from a founder feel different.

## Who this is for

You're the CEO, CTO, or founding engineer. You also handle `support@`. Your inbox fills up Monday morning, you context-switch into support 8-15 times a day, and you've been meaning to write docs for the same five questions you keep answering. You don't want a help-desk product — you want agents that do the invisible work so you stay in the loop without drowning.

## The two agents

### 📥 Inbox — the frontline desk
Owns every inbound conversation. Triages, drafts replies in your voice, tracks promises you make, watches SLAs, detects bugs worth filing, flags churn risk from sentiment, and gives you a morning briefing. **Never sends — always drafts.** You approve in chat.

Skills: `triage-incoming`, `draft-reply`, `thread-summary`, `customer-dossier`, `promise-tracker`, `sla-watchdog`, `morning-briefing`, `detect-bug-report`, `churn-risk-scan`, `stale-thread-rescue`.

### 📚 Help Center — the knowledge + patterns layer
Turns every resolved ticket into knowledge. Drafts KB articles, spots recurring questions that need docs, logs feature requests with customer attribution, broadcasts when those features ship ("you asked, we built it"), posts a weekly support digest, tracks known issues.

Skills: `draft-article-from-ticket`, `detect-repeat-question`, `gap-surface`, `refresh-stale`, `capture-feature-request`, `broadcast-shipped`, `weekly-digest`, `known-issue-track`.

The two agents share data through the filesystem (Help Center reads Inbox's `conversations/` and `bug-candidates.json`), so patterns surface automatically — you don't wire them together, they just see each other's work.

## Integrations

Every external tool (Gmail, Intercom, Front, Help Scout, Zendesk, Linear, GitHub, Notion, Stripe, Slack, etc.) is accessed through **[Composio](https://composio.dev)**. There are no per-tool documents or configs in this workspace — the agents discover and call tools via `composio search <keyword>` + `composio` execution. Connect whatever you use in Houston's Integrations tab; the agents adapt.

## Install

In Houston: **Add from GitHub** → paste this repo's URL. Houston will install both agents and drop them into a workspace under `~/Documents/Houston/Solo Support Workspace/`.

## Try these first

Once installed, the most useful first prompts:

**Inbox:**
- `Pull unread from my connected inbox and triage` — fires `triage-incoming` across new arrivals
- `Give me my morning brief` — ranked "start here" digest
- `Draft a reply for conversation <id>` — pulls dossier, matches your voice
- `Who is <customer>?` — full dossier

**Help Center:**
- `What should I write docs for?` — `gap-surface` ranks top recurring questions
- `What happened this week?` — weekly digest
- `We just shipped <feature> — tell the customers who asked` — cross-references requests, drafts per-customer notes

## Structure

```
solo-support-workspace/
├── workspace.json
├── README.md
└── agents/
    ├── inbox/
    │   ├── houston.json
    │   ├── CLAUDE.md
    │   ├── bundle.js
    │   ├── icon.png
    │   ├── data-schema.md
    │   └── .agents/skills/<10 skills>/SKILL.md
    └── help-center/
        ├── houston.json
        ├── CLAUDE.md
        ├── bundle.js
        ├── icon.png
        ├── data-schema.md
        └── .agents/skills/<8 skills>/SKILL.md
```

## Data layout

Each agent stores data at its root (never under `.houston/<agent>/`, which the file watcher skips). See each agent's `data-schema.md` for the full contract.

Everything is JSON (index files) + markdown (drafts, articles, notes, digests), written with temp-file-rename atomicity. Easy to read, easy to export, easy to move.

## License

MIT.
