---
name: voice-calibration
description: Use when the user says "calibrate my voice" / "train on how I write" / "pull my sent replies" — searches Composio for the connected inbox, pulls 10–20 recent outbound support replies, extracts tone cues, and rewrites the voice section of `support-context.md`.
---

# Voice Calibration

## When to use

- "calibrate my voice" / "train on how I write" / "pull my sent
  replies."
- After `define-support-context` when the voice section is `TBD`.
- Re-run whenever the founder says their tone has drifted or they
  want the agents to re-learn from recent replies.

## Steps

1. **Read `support-context.md`.** If missing, run
   `define-support-context` first (or coordinate with the founder).

2. **Discover the connected inbox.** Run `composio search inbox` or
   `composio search email-sent` (try both — the exact slug depends
   on which provider the founder has linked: Gmail, Front,
   Intercom, Help Scout, Zendesk, etc.). If no inbox is connected,
   tell the founder which category to link (connect one of: Gmail,
   Front, Intercom, Help Scout, Zendesk) and stop.

3. **Pull 10–20 recent outbound replies.** Execute the list-sent /
   search-sent tool slug. Filter to replies that look like support
   (thread depth > 1, or label/folder contains `support`, or
   recipient not internal). Aim for 10–20 most recent.

4. **Extract tone cues from the samples:**
   - Greeting pattern (e.g. "Hey Jane," vs "Hi," vs no greeting).
   - Sentence length — short / medium / long.
   - Formality — casual / professional / direct.
   - Signature / sign-off convention.
   - Repeated phrases or quirks ("I'll dig in," "to be clear,"
     em-dash use, etc.).
   - Forbidden-sounding phrases that would look wrong coming from
     them (e.g. "I apologize for the inconvenience").

5. **Save raw samples.** Write 3–5 verbatim redacted excerpts to
   `voice-samples/{YYYY-MM-DD}-batch.md` with one-line context per
   sample (what the customer asked). Redact customer names / emails
   / any PII — use `{Customer}` / `{Email}` placeholders.

6. **Update `support-context.md`.** Read the current doc, find the
   Tone + voice section, replace it with:
   - A one-paragraph tone summary (direct / warm / human, specific
     traits).
   - 3–5 verbatim excerpts (the shortest-but-most-representative).
   - "Forbidden phrases" bullet list.
   Write atomically (`.tmp` → rename).

7. **Append to `outputs.json`** with
   `type: "context-edit"`, title "Voice calibrated from {N}
   samples", summary = 2 sentences on what the tone looks like,
   path = `support-context.md`, status `draft`.

8. **Summarize to user.** One paragraph: what the tone looks like
   ("direct, warm, em-dash heavy; never apologizes for inconvenience")
   and one line reminding them that every draft across the
   workspace now pulls from this.

## Outputs

- `voice-samples/{YYYY-MM-DD}-batch.md` (raw samples)
- `support-context.md` (voice section updated)
- Appends to `outputs.json` with `type: "context-edit"`.
