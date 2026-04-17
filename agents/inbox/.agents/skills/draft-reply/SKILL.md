---
name: draft-reply
description: Use when a triaged customer support conversation is ready for a response and no `draft.md` exists yet (or the founder explicitly asks for a fresh draft) — pulls the customer dossier, matches the founder's voice from past sent messages, and writes `conversations/{id}/draft.md` without sending.
---

# Draft Reply

## When to use
A conversation in `conversations.json` has status `open` or `waiting_founder`, the customer's most recent message has no corresponding draft at `conversations/{id}/draft.md`, and the founder either asked to draft a reply to it or the morning briefing surfaced it. **Never call this skill to send — this agent drafts only.**

## Steps
1. **Load the thread** from `conversations/{id}/thread.json`. Identify the latest customer message — that is what the draft responds to.
2. **Run the `customer-dossier` skill** for the customer on this thread. Pull: plan, MRR, open bugs on `bug-candidates.json`, open followups, any `churn-flags` entry, last 3 conversations from history.
3. **Sample founder voice.** If the Composio account has a "sent" folder slug available, search 10–20 of the founder's most recent outbound replies (any channel). Extract tone cues: sign-off, greeting style, sentence length, whether they use em-dashes, whether they use customer's first name. If no sample is available, use: direct, warm, short paragraphs, no corporate hedging, no "I apologize for the inconvenience".
4. **Draft the reply in the founder's voice.** Address the specific ask. If a bug: acknowledge, confirm repro if possible, state next step. If how-to: answer crisply, link to KB only if the `help-center` agent has published one (check is optional). If billing: state facts, propose action. Never promise a date the founder hasn't approved — say "I'll get back to you with a timeline."
5. **Append a dossier snippet** to `conversations/{id}/notes.md` (plan, MRR, open bugs, churn status) so the founder has context when approving.
6. **Write atomically** to `conversations/{id}/draft.md`. Set `conversations.json` entry's `status = "waiting_founder"` and roll `updatedAt`.

## Outputs
- Writes `conversations/{id}/draft.md`
- Appends dossier snippet to `conversations/{id}/notes.md`
- Updates `conversations.json` entry (status, updatedAt)
