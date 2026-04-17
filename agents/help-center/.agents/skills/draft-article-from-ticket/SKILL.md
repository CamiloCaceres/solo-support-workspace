---
name: draft-article-from-ticket
description: Use when a conversation in `../inbox/conversations/` has been resolved and its answer is reusable for future customers — drafts a KB article (how-to / troubleshooting / FAQ / known-issue / reference) into `articles/{slug}/` as a DRAFT for the solo founder to review before publishing.
---

# Draft Article From Ticket

## When to use

- The founder says "turn this ticket into a doc" and names or links a conversation.
- `gap-surface` promotes a gap that has a representative resolved ticket.
- You notice (during another skill) that a conversation contains a clean, reusable answer that doesn't exist anywhere else in `articles.json`.

Do NOT use for one-off, customer-specific answers (e.g. "your account is locked because of X" — that's not an article).

## Steps

1. Read the source conversation: `../inbox/conversations/{id}/thread.json` (and `../inbox/conversations.json` for metadata).
2. Check `articles.json` — if any existing article already covers this, stop and tell the founder which one instead.
3. Classify the article type from the resolution shape:
   - **how-to** — question is "how do I X?" and answer is steps
   - **troubleshooting** — question is "X is broken / not working" and answer diagnoses + fixes
   - **faq** — short conceptual question and answer
   - **known-issue** — unresolved defect with a workaround (chain to `known-issue-track` instead)
   - **reference** — lookup-style info (limits, formats, endpoints)
4. Pick a slug: kebab-case, 2–5 words, derived from the question (e.g. `reset-api-key`, `why-invoice-missing-tax`).
5. Write the article body to `articles/{slug}/article.md`:
   - Front-matter header with status / last-verified
   - TL;DR one-liner
   - Steps or explanation, plain language, concrete examples
   - Pull exact phrasing from the ticket's successful reply where possible, but generalize names/ids
6. Write `articles/{slug}/meta.json` with `status: "draft"`, `version: 1`, `sourceTicketIds: [<id>]`, `needsReview: false`.
7. Append an `ArticleIndexEntry` to `articles.json` (atomic write: `.tmp` + rename).
8. Post a chat message to the founder: "Drafted `{title}` from ticket {id} — review at `articles/{slug}/article.md`. Reply 'publish {slug}' when ready."

## Outputs

- Writes `articles/{slug}/article.md`
- Writes `articles/{slug}/meta.json`
- Appends to `articles.json`
- Sends a chat message to the founder
