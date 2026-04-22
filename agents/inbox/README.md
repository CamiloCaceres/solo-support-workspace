# Inbox

Frontline support desk. I triage every inbound, draft replies in
your voice, track promises, watch SLAs, catch bugs and churn
signals, and give you a morning brief. Drafts only — I never send.

## First prompts

- "Pull unread from my connected inbox and triage"
- "Give me my morning brief"
- "Draft a reply for conversation {id}"
- "Who is {customer}?"
- "What did I promise and when is it due?"
- "What's about to breach SLA?"
- "Scan the inbox for churn risk"
- "Is this a bug? Log it — conversation {id}"
- "What threads are waiting on me?"

## Skills

- `onboard-me` — first-run setup
- `triage-incoming` — categorize + priority-tag + VIP-flag
- `draft-reply` — voice-matched, dossier-aware, approval-gated
- `thread-summary` — asked / said / open / next step
- `customer-dossier` — billing + history + bugs + flags
- `promise-tracker` — every commitment + due date
- `sla-watchdog` — SLA tiers come from the shared context doc
- `morning-briefing` — ranked 'start here' digest
- `detect-bug-report` — repro + severity + routing
- `churn-risk-scan` — 30-day sentiment + patterns
- `stale-thread-rescue` — 48h+ waiting on you

## Cross-agent reads

- `../head-of-support/support-context.md` — **mandatory** before
  any triage or drafting. SLA tiers, VIP list, routing rules,
  voice, gotchas. If missing, I stop and tell you to run Head of
  Customer Support first.

## Outputs

Markdown + JSON under `conversations/`, `customers/`,
`morning-brief.md`, `conversations.json`, `customers.json`,
`followups.json`, `bug-candidates.json`, `churn-flags.json`,
`outputs.json`.
