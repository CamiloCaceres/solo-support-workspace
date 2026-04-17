---
name: detect-bug-report
description: Use when a customer message contains a reproducible defect (error messages, stack traces, "it used to work and now doesn't", explicit repro steps, screenshots of a broken UI) — extracts repro steps, severity, and affected customer(s), then appends to `bug-candidates.json` so the `help-center` sister agent can promote to Linear/GitHub via Composio.
---

# Detect Bug Report

## When to use
Trigger signals in the latest customer message or any recent message on the thread:
- An error message, HTTP status, or stack trace pasted.
- Phrase: "used to work", "suddenly broken", "stopped working", "regression".
- Explicit reproduction steps ("I clicked X, then Y, then saw Z").
- Screenshot referenced that shows an error state.
- Multiple customers reporting the same symptom in the last 7 days (pattern-detection pass).

The `triage-incoming` skill sets category = `bug` on obvious cases — this skill goes deeper and writes the actionable record.

## Steps
1. **Pull the thread** from `conversations/{id}/thread.json`. Locate the message(s) with defect signals.
2. **Extract repro steps.** If the customer gave them, normalize into an ordered list. If not, write "No explicit repro — needs follow-up" as the first step.
3. **Assess severity:**
   - `critical` — data loss, security, full outage, payment broken.
   - `high` — core workflow broken for paying customers, no workaround.
   - `medium` — feature broken with workaround, or broken for a subset.
   - `low` — cosmetic, rare edge case.
4. **Pattern-detect affected customers.** Scan `conversations.json` for the last 14 days, category=`bug`, with similar keywords in subject or thread. Collect their `customerSlug`s into `affectedCustomerSlugs`.
5. **Check for dedup.** If `bug-candidates.json` already has an entry with matching summary keywords and status != `dismissed`, append this customer's slug to `affectedCustomerSlugs` and refresh `updatedAt` rather than creating a new entry.
6. **Write atomically** to `bug-candidates.json`:
   ```json
   { "id": "<uuid>", "conversationId": "...", "customerSlug": "...", "summary": "...", "repro": ["..."], "severity": "high", "affectedCustomerSlugs": ["..."], "status": "new", "createdAt": "...", "updatedAt": "..." }
   ```
7. **Append** a `kind: "bug_reported"` event to `customers/{slug}/history.json`.
8. **Do not promote to Linear/GitHub yourself.** The `help-center` agent owns that step.

## Outputs
- Appends or updates entry in `bug-candidates.json`
- Appends to `customers/{slug}/history.json`
