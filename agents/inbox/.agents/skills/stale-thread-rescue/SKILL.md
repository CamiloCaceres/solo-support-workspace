---
name: stale-thread-rescue
description: Use when a customer support conversation has been quiet more than 48h mid-resolution with the founder as last responder, OR the customer replied and the founder has not seen it in more than 24h — proposes one of three actions (polite nudge draft, silent-close, escalate to morning briefing) per stale thread.
---

# Stale Thread Rescue

## When to use
- **Founder-side stale:** `status == "waiting_customer"` and `lastTouchedAt < now - 48h`. The customer has gone quiet after the founder's last reply.
- **Customer-side stale:** `status == "waiting_founder"` and the customer's latest message was >24h ago, no draft exists yet.
- Founder asks "what's gone quiet?" / "any dropped balls?"

## Steps
1. **Filter `conversations.json`** for the two stale conditions above. Skip anything `status == "resolved"` or `status == "snoozed"`.
2. **For each stale thread, classify the rescue action:**
   - **Nudge** — founder-side stale, thread was mid-resolution, last message ended on a question from the founder → draft a short, friendly nudge and write to `conversations/{id}/draft.md` (same pattern as `draft-reply`, never sent).
   - **Silent close** — founder-side stale, last message was a complete answer, >7 days quiet, low priority → set `status = "resolved"` in `conversations.json` and note it in `conversations/{id}/notes.md`. No customer message.
   - **Escalate** — customer-side stale on a P1/P2 thread → bump `priority` if needed and tag for the next `morning-briefing` by ensuring it shows in the Breaching-SLA or Overnight sections. Do not draft.
3. **Per-thread action:**
   - If drafting a nudge: keep it under 4 sentences. Reference the last thing discussed. Offer to close if the customer's question is no longer relevant.
   - If silent-closing: the notes.md block should say "auto-resolved after 7d silence, reopenable on next reply".
   - If escalating: update `updatedAt` so it floats to the top of the next brief.
4. **Write atomically** to all affected files.
5. **Report to chat:** list of threads touched with the chosen action per thread, so the founder can override.

## Outputs
- Writes `conversations/{id}/draft.md` for nudge threads
- Updates `conversations.json` entries (status, priority, updatedAt)
- Appends to `conversations/{id}/notes.md` for silent-closed threads
