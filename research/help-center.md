# Research — `help-center` (delta)

**Scrape date:** 2026-04-22
**Status:** Existing agent. This MD is a **delta** — the agent
already ships with 8 skills at `agents/help-center/`. Build task:
add coordinator-read, top-up `houston.json` with `useCases`,
regenerate `bundle.js`.

**Role:** Knowledge + patterns + broadcasts + feature-request
attribution + weekly digest + known-issues tracker.

---

## Catalog input

From `gumloop-support-catalog-2026-04-22.md`:

- **Community Feedback Analysis** (Arslan Ali) — shape for
  `detect-repeat-question` (pattern clustering) and `gap-surface`
  (rank what to write docs for). A parallel skill
  (`synthesize-voice-of-customer`) lives in HoS for the
  strategic/positioning output.
- **Convert Technical Documentation to FAQs** (Arslan Ali) — marked
  SKIP-PRIMARY. Wrong source direction for our v1 (we want
  ticket → article, not docs → FAQ). Noted as a **future extension**
  for `refresh-stale` when the founder has an existing docs site.
- **Lana Linear** (Zachary Boland) — tracker-specific; absorbed into
  `known-issue-track` via Composio Linear slugs.

---

## Existing skill list — no changes proposed

| Skill | Gumloop seed / coverage gap | Keep? |
|-------|-----------------------------|-------|
| `draft-article-from-ticket` | coverage gap | ✅ keep |
| `detect-repeat-question` | Community Feedback Analysis (clustering) | ✅ keep |
| `gap-surface` | coverage gap | ✅ keep |
| `refresh-stale` | coverage gap + Convert Tech Docs to FAQs (future extension) | ✅ keep |
| `capture-feature-request` | AI Customer Support Agent feature branch | ✅ keep |
| `broadcast-shipped` | coverage gap | ✅ keep |
| `weekly-digest` | coverage gap | ✅ keep |
| `known-issue-track` | Lana Linear shape (tracker sync) | ✅ keep |

**Skill count:** 8 + `onboard-me` = 9 (within role-guide range).

---

## Deltas to apply in the build phase

1. **CLAUDE.md edit.** Add a `## Cross-agent read` section pointing
   to `../head-of-support/support-context.md` (for tone on
   broadcasts/digests + routing rules for tracker targets). The
   existing "reads `../inbox/`" section stays — that's the
   resolved-ticket source.
2. **SKILL.md edits** — `broadcast-shipped` reads voice from
   context doc before drafting; `weekly-digest` reads SLA tiers from
   context doc to label breach counts correctly; `known-issue-track`
   reads `routing-rules.md` (or the routing section of
   `support-context.md`) to know whether bugs go to Linear vs GitHub.
3. **`houston.json`:** add full `useCases` array + `agentSeeds`.
4. **`bundle.js`:** regenerate from workspace template.

### Proposed use cases (for `houston.json` → `useCases`)

| Category | Title | Skill |
|----------|-------|-------|
| Articles | "Draft an article from conversation {id}" | `draft-article-from-ticket` |
| Gaps | "What should I write docs for?" | `gap-surface` |
| Gaps | "What am I answering over and over?" | `detect-repeat-question` |
| Refresh | "Flag articles affected by {ship/deprecation}" | `refresh-stale` |
| Requests | "Log this as a feature request" | `capture-feature-request` |
| Broadcasts | "We shipped {feature} — tell the customers who asked" | `broadcast-shipped` |
| Rhythm | "What happened this week?" | `weekly-digest` |
| Issues | "Promote {bug} to a known issue" | `known-issue-track` |

---

## Roll-up

- **NEW skills:** 0.
- **NEW use cases:** 8.
- **SKIPS:** Convert Tech Docs → FAQs (wrong direction for v1), Lana
  Linear (absorbed into Composio baseline).
- **Coverage gaps for v1:** none beyond the skill list.

---

## Hand-off

Build phase for Help Center = **evolve in place**. Target edits:

- `agents/help-center/CLAUDE.md` — add cross-agent read for
  `../head-of-support/support-context.md` (keep existing
  `../inbox/` reads).
- `agents/help-center/houston.json` — add `useCases` + onboarding
  card seed.
- `agents/help-center/.agents/skills/broadcast-shipped/SKILL.md` —
  read voice from context doc.
- `agents/help-center/.agents/skills/weekly-digest/SKILL.md` — read
  SLA tiers for breach labeling.
- `agents/help-center/.agents/skills/known-issue-track/SKILL.md` —
  read routing rules to pick tracker target.
- `agents/help-center/bundle.js` — regenerate via
  `scripts/generate_bundles.py`.
