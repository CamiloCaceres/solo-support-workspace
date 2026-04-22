# Research — `inbox` (delta)

**Scrape date:** 2026-04-22
**Status:** Existing agent. This MD is a **delta**, not a
first-build — the agent already ships with 10 skills at
`agents/inbox/`. The build task for this agent is narrow: add
coordinator-read behavior, regenerate `bundle.js` from the workspace
template, and top-up `houston.json` with `useCases`.

**Role:** Frontline triage + drafting (reactive, draft-only).

---

## Catalog input

From `gumloop-support-catalog-2026-04-22.md`:

- **Automated email triage** (Aron Korenblit, 784 views) — shape for
  `triage-incoming`.
- **Automated email draft responses with AI** (Aron Korenblit, 916
  views) — shape for `draft-reply`.
- **AI Customer Support Agent | Slack+Jira** (Katherine Duh, 428
  views) — shape for `triage-incoming` (classification branch) and
  `detect-bug-report` (ticket-creation branch).
- **AI Slack Support Agent | Linear** (Katherine Duh, 169 views) —
  variant of above with Linear target; same Houston shape, absorbed
  via Composio.

---

## Existing skill list — no changes proposed

| Skill | Gumloop seed / coverage gap | Keep? |
|-------|-----------------------------|-------|
| `triage-incoming` | Automated email triage + AI CS Agent classification | ✅ keep |
| `draft-reply` | Automated email draft responses | ✅ keep — add explicit **read `../head-of-support/support-context.md#voice`** step |
| `thread-summary` | coverage gap | ✅ keep |
| `customer-dossier` | coverage gap | ✅ keep |
| `promise-tracker` | coverage gap | ✅ keep |
| `sla-watchdog` | coverage gap | ✅ keep — SLA defaults live in `support-context.md#sla` now (not hardcoded) |
| `morning-briefing` | coverage gap | ✅ keep |
| `detect-bug-report` | AI CS Agent bug branch | ✅ keep |
| `churn-risk-scan` | coverage gap | ✅ keep |
| `stale-thread-rescue` | coverage gap | ✅ keep |

**Skill count:** 10 + `onboard-me` = 11 (within the role-guide's 5–10
recommendation; acceptable for the busiest agent in the vertical).

---

## Deltas to apply in the build phase

1. **CLAUDE.md edit.** Add a `## Cross-agent read` section:
   > Before any substantive drafting or routing, read
   > `../head-of-support/support-context.md`. It contains product
   > surface area, SLA tiers, VIP list, routing rules, voice
   > calibration, and known gotchas. If missing or empty, tell the
   > founder to spend 5 minutes with the Head of Support first
   > (`define-support-context`) and stop.
2. **SKILL.md edits** — every skill that drafts or routes prepends a
   "read context doc" step. Specifically: `triage-incoming` (for
   routing rules + VIP list), `draft-reply` (for voice + gotchas),
   `sla-watchdog` (for SLA tiers), `churn-risk-scan` (for segment
   thresholds), `morning-briefing` (for VIP priority).
3. **`houston.json`:** add full `useCases` array (see table below)
   and `agentSeeds` with onboarding card.
4. **`bundle.js`:** regenerate from workspace template so all four
   agents share a consistent dashboard shape.
5. **`config/` handling:** SLA thresholds, VIP list, routing rules
   all MOVE to `support-context.md`. Inbox stops having its own
   copies and reads from the coordinator's doc.

### Proposed use cases (for `houston.json` → `useCases`)

| Category | Title | Skill |
|----------|-------|-------|
| Triage | "Pull unread from my inbox and triage" | `triage-incoming` |
| Triage | "Give me my morning brief" | `morning-briefing` |
| Drafting | "Draft a reply for conversation {id}" | `draft-reply` |
| Drafting | "Summarize conversation {id}" | `thread-summary` |
| Customer | "Who is {customer}?" | `customer-dossier` |
| Commitments | "What did I promise and when is it due?" | `promise-tracker` |
| SLA | "What's about to breach SLA?" | `sla-watchdog` |
| Signals | "Scan the inbox for churn risk" | `churn-risk-scan` |
| Signals | "Is this a bug? Log it." | `detect-bug-report` |
| Recovery | "Surface stale threads waiting on me" | `stale-thread-rescue` |

---

## Roll-up

- **NEW skills:** 0 (shape is correct).
- **NEW use cases:** 10 (table above — feed `houston.json`).
- **SKIPS from catalog:** everything not already mapped above
  (see the consolidated workspace mapping in `../TEAM-GUIDE.md`).
- **Coverage gaps for v1:** none beyond what's already in the skill
  list. `customer-dossier` covers Stripe-MRR-aware profile reads
  via Composio; `churn-risk-scan` covers sentiment + repeat signals.

---

## Hand-off

Build phase for Inbox = **evolve in place**, not rebuild. Target
edits:

- `agents/inbox/CLAUDE.md` — add cross-agent-read section.
- `agents/inbox/houston.json` — replace stub `useCases` (if any)
  with the 10 above; seed `.houston/activity.json` onboarding card.
- `agents/inbox/.agents/skills/triage-incoming/SKILL.md` — prepend
  context-read step.
- `agents/inbox/.agents/skills/draft-reply/SKILL.md` — prepend
  context-read step (voice + gotchas).
- `agents/inbox/.agents/skills/sla-watchdog/SKILL.md` — read SLA
  tiers from context doc, drop any hardcoded defaults.
- `agents/inbox/.agents/skills/churn-risk-scan/SKILL.md` — read
  segment thresholds from context doc.
- `agents/inbox/.agents/skills/morning-briefing/SKILL.md` — read
  VIP list from context doc.
- `agents/inbox/bundle.js` — regenerate via
  `scripts/generate_bundles.py`.
