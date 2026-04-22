# Research — `head-of-support`

**Scrape date:** 2026-04-22
**Scraped by:** Claude Code session
**Pages scraped:** `gumloop.com/templates/solutions/support`, `gumloop.com/templates`
**Role:** Head of Customer Support (coordinator, Solo Support Workspace)
**Scope:** The coordinator agent that owns the shared support-context
doc, calibrates voice, defines routing + escalation rules, runs the
weekly review, and synthesizes voice-of-customer signals. Every other
agent in the workspace reads its context doc before substantive work.

---

## Catalog input

Full scrape lives at `gumloop-support-catalog-2026-04-22.md` (9
templates). Templates relevant to this role:

- **Community Feedback Analysis** (Arslan Ali) — pattern mining over
  collected customer feedback. Shape only; our source is resolved
  tickets + inbox history, not community web-scrape.

Everything else for this role is **coverage gap**.

---

## Templates

### 001 — Community Feedback Analysis

- **Source:** gumloop.com/templates/solutions/support (listing)
- **Creator:** Arslan Ali
- **Difficulty:** UNKNOWN (not labeled)
- **Workflow shape:**
  - **Inputs:** a corpus of customer feedback (scraped or pasted)
  - **Transform:** AI clustering + theme extraction
  - **Outputs:** synthesized report (Google Docs in the template)
- **Tools they used (noted, not copied):** web scrape + Google Docs
- **Houston mapping:**
  - **Primitive skill:** `synthesize-voice-of-customer` (NEW-SKILL,
    role-scoped to HoS) — clusters tickets + inbox traffic over a
    window, outputs a VoC report markdown.
  - **Use case:** "Mine the last month of tickets for positioning +
    product signals" → `synthesize-voice-of-customer`.
  - **Belongs in role:** `head-of-support`. A parallel skill
    (`detect-repeat-question`) lives in `help-center` — different
    output shape (HC outputs KB-gap candidates; HoS outputs a
    strategic VoC report).
  - **Verdict:** `NEW-SKILL`.
- **Notes:** Shape transfer only — source is inbox + HC patterns,
  not scraped forums.

---

## Coverage gaps (dominant source of skills)

The coordinator role is effectively invented from role knowledge.
Nothing else on Gumloop covers it.

- **`define-support-context`** — author/update the shared
  `support-context.md` (product map, ICP, tone, SLA tiers, VIPs,
  routing rules, known gotchas). Single highest-leverage skill in
  the workspace — everything downstream reads this doc.
- **`voice-calibration`** — ingest 10+ past founder replies (via
  Composio inbox), extract stylistic fingerprint, write
  `support-context.md#voice` + `voice-samples/`. Re-runnable.
- **`tune-routing-rules`** — update the "bug vs feature vs outage vs
  billing" decision tree in `support-context.md#routing`.
- **`draft-escalation-playbook`** — draft P1/P2/outage/security-incident
  playbooks (step-by-step, who-to-tell, what-to-say). Stored at
  `playbooks/{slug}.md`.
- **`weekly-support-review`** — aggregate Inbox, Help Center, and
  Success state into a single founder-facing review (volumes,
  breaches, ships, churn flags, renewals, top themes). Writes to
  `reviews/{YYYY-MM-DD}.md`.
- **`synthesize-voice-of-customer`** — see above (from template 001).

---

## Roll-up

### Proposed skills

| Skill | Derived from | Description opener |
|-------|--------------|--------------------|
| `onboard-me` | standard | Use when the founder says "onboard me" / "set me up" or first contact with no `config/` |
| `define-support-context` | coverage gap | Use when the founder asks to "set up support" / "define our support context" / or when no `support-context.md` exists yet |
| `voice-calibration` | coverage gap | Use when the founder asks to "calibrate my support voice" / "train on how I write" / before any other agent drafts |
| `tune-routing-rules` | coverage gap | Use when the founder wants to update what counts as a bug / feature request / outage / billing question |
| `draft-escalation-playbook` | coverage gap | Use when the founder says "draft the P1 playbook" / "what do we do when {x} happens" / incident-shaped requests |
| `weekly-support-review` | coverage gap | Use when the founder says "weekly review" / "how was the support week" / Monday ritual |
| `synthesize-voice-of-customer` | template 001 + gap | Use when the founder says "what are customers saying" / "mine the last {N} tickets for themes" |

### Proposed use cases (feed README + CLAUDE.md first-prompts)

| Use case (end-user prompt) | Skill |
|----------------------------|-------|
| "Set up our support context — product, tone, SLAs, VIPs" | `define-support-context` |
| "Calibrate my support voice from 10 past replies" | `voice-calibration` |
| "Update our routing rules — what counts as a bug" | `tune-routing-rules` |
| "Draft the P1 / outage playbook" | `draft-escalation-playbook` |
| "Give me the weekly support review" | `weekly-support-review` |
| "Mine the last month of tickets for product + positioning signals" | `synthesize-voice-of-customer` |

### Data owned

- `support-context.md` — the **shared doc** every other agent reads.
- `voice-samples/{id}.md` — captured founder replies used to
  calibrate voice.
- `playbooks/{slug}.md` — escalation + incident playbooks.
- `routing-rules.md` — optional split-out of context doc's routing
  section when it gets long.
- `reviews/{YYYY-MM-DD}.md` — weekly support reviews.
- `voc-reports/{YYYY-MM-DD}.md` — voice-of-customer synthesis reports.
- `outputs.json` — index feeding the Overview dashboard.
- `config/profile.json` — learned context from `onboard-me` (who the
  founder is, who they serve, what they sell).

### Coverage gaps for this role's v1 build

None unaddressed — every coverage gap listed above is in the
proposed skill list.

---

## Hand-off

This MD is the spec. The build phase:

1. Reads this file + `../TEAM-GUIDE.md` + `../BUILD-CONVENTIONS.md`.
2. Uses the "Proposed skills" table as the skill list (plus
   `onboard-me`).
3. Uses the "Proposed use cases" table as the README "First prompts"
   and `houston.json` → `useCases` entries.
4. Applies `../role-agents-workspace/role-agent-guide.md` for the
   build phase.
5. **This is the coordinator** — its CLAUDE.md has a section about
   OWNING the shared doc (not reading it), and it never stops on a
   "context missing" condition — instead it proposes running
   `define-support-context`.
