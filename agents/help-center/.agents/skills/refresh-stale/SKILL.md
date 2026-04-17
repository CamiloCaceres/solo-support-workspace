---
name: refresh-stale
description: Use when the solo founder mentions a ship, deprecation, pricing change, or UI update — or on a scheduled scan — to find articles whose content may be wrong and mark them `needsReview: true` so docs don't silently rot out of date.
---

# Refresh Stale

## When to use

- Founder says "we just changed X", "we deprecated Y", "pricing changed", "new UI for Z".
- Scheduled scan: articles with `lastVerifiedAt` older than 90 days.
- `known-issue-track` or `broadcast-shipped` resolves something that contradicts an existing article.

## Steps

1. Determine the trigger:
   - **Founder-announced change** → scan all articles whose title, tags, or body reference the thing that changed.
   - **Scheduled scan** → read `articles.json`, filter `status === "published"` AND (`lastVerifiedAt` null OR older than 90 days).
   - **Contradicting ticket** → the caller passes a ticket id; read the thread and identify which articles' claims conflict with the resolution.
2. For each candidate article:
   - Read `articles/{slug}/article.md`
   - Identify the specific claim that is now suspect (UI label, price, feature name, step order, etc.)
3. Update `articles/{slug}/meta.json`:
   - Set `needsReview: true`
   - Set `reviewNotes` to a one-line explanation of *why* (e.g. "Pricing changed 2026-04-12 — still mentions old $19 tier")
   - Bump `updatedAt`
4. Also update the matching entry in `articles.json` (mirror `updatedAt`) via atomic write.
5. Do NOT rewrite the article body yet — rewriting is the founder's call (or a chained `draft-article-from-ticket` on the new source).
6. Report to chat: "Flagged N articles for review: {slug1}, {slug2}, … Reason: {trigger}."

## Outputs

- Updates `articles/{slug}/meta.json` for each flagged article
- Updates `articles.json` index entries
- Posts summary of flagged articles to chat
