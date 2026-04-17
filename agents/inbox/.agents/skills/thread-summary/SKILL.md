---
name: thread-summary
description: Use when the founder reopens a long or old customer support conversation cold and asks to be caught up ("what's going on here", "summarize this thread", "remind me"), or before drafting a reply on any thread with >5 messages — produces a 3-bullet summary: where we are, what we promised, what the customer expects next.
---

# Thread Summary

## When to use
A `conversations/{id}/thread.json` has more than a handful of messages and the founder needs context fast. Typical triggers:
- Founder: "what's the story with the Acme thread?"
- Founder reopens a conversation dormant >3 days.
- Before `draft-reply` on any thread with 5+ messages — running this first makes the draft better.

## Steps
1. **Load** `conversations/{id}/thread.json` and the index row from `conversations.json`.
2. **Walk the thread chronologically.** Note: the customer's original ask, any scope changes, every promise the founder made, every answer given.
3. **Produce exactly three bullets:**
   - **Where we are** — last message, who sent it, current state (waiting on customer / waiting on us / drafting).
   - **What we promised** — outstanding commitments. Pull from `followups.json` filtered by this conversation, plus any uncaptured promises you see in the thread (and recommend running `promise-tracker` if you find some).
   - **What the customer expects next** — the most recent explicit or implied ask.
4. **Append the summary** as a dated block in `conversations/{id}/notes.md` so the founder has it persisted for next time too.

## Outputs
- Returns the 3-bullet summary to chat
- Appends a dated summary block to `conversations/{id}/notes.md`
