---
name: known-issue-track
description: Use when `../inbox/bug-candidates.json` has a new entry or multiple conversations hit the same defect — registers a known-issue record, drafts a public status article, optionally promotes to Linear/GitHub via Composio, and updates status as the solo founder's fix moves through its states.
---

# Known Issue Track

## When to use

- New entry appears in `../inbox/bug-candidates.json`.
- You notice ≥2 conversations in `../inbox/conversations/` reporting the same symptom.
- Founder says "this is a known bug" or "track this as a known issue".
- Existing known-issue needs a status bump (founder: "we pushed a fix for the timeout bug").

## Steps

1. Identify the defect:
   - From `bug-candidates.json` → read the candidate's description + linked conversation ids.
   - From multiple tickets → cluster like `detect-repeat-question` does, confirm the same underlying defect.
2. Check `known-issues.json` for a matching active entry:
   - If found → **update** its `affectedCustomerSlugs` (union) and `updatedAt`. Skip to step 5.
   - If not → continue to step 3.
3. Register a new `KnownIssue`:
   - `title`, `symptoms` (what the customer sees), `workaround` (if any), `status: "investigating"`, `affectedCustomerSlugs` from source tickets, `trackerId: null`, `statusArticleSlug: null`.
   - Atomic-write `known-issues.json`.
4. Draft a status article:
   - Slug: `known-issue-{short-id}` (e.g. `known-issue-a1b2c3`).
   - Write `articles/known-issue-{id}/article.md` — clear, empathetic, states the symptom, any workaround, current status, and that you'll update it.
   - Write `articles/known-issue-{id}/meta.json` with `status: "draft"` and category `known-issue`.
   - Append to `articles.json`.
   - Set `statusArticleSlug` on the known-issue record.
5. **Composio tracker sync** (if configured):
   - `composio search linear create issue` (or github) → if authed, execute and store returned id in `trackerId`.
   - If not connected: note in chat that `composio link <slug>` would enable sync.
6. State transitions (when called for an update):
   - `investigating` → `workaround-available` (when a workaround is added)
   - `workaround-available` → `fix-in-progress` (when founder says "working on it")
   - `fix-in-progress` → `resolved` (when founder confirms deploy)
   - On `resolved`: update the article body, set `status: "archived"` or keep published with a resolution note, bump `lastVerifiedAt`. Optionally chain to `broadcast-shipped` to notify affected customers.
7. Report to chat: "Known issue '{title}' — status: {status}, {N} customers affected, article: `articles/known-issue-{id}/`, tracker: {id or none}."

## Outputs

- Appends / updates `known-issues.json`
- Writes `articles/known-issue-{id}/article.md` + `meta.json`
- Appends to `articles.json`
- Optionally creates a Linear / GitHub issue via Composio
- Posts status to chat
