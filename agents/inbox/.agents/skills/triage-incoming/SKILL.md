---
name: triage-incoming
description: Use when a new inbound customer support message arrives via any Composio-connected channel (Gmail, Intercom, Front, Help Scout, Zendesk, Slack, etc.) and has not yet been triaged — categorizes it, assigns priority from customer MRR + content signals, VIP-flags, and writes to `conversations.json` + `conversations/{id}/thread.json`.
---

# Triage Incoming

## When to use
A new inbound message has landed and no `conversations.json` entry exists for its thread yet, OR an existing entry needs re-triage because the content materially changed (e.g. a how-to turned into an outage report). For the solo founder, triage happens constantly — every fresh reply that arrives needs this skill run before anything else.

## Steps
1. **Identify the source** — the founder names the channel or the message is referenced by external id. Use `composio search <channel>` to find the correct fetch slug (e.g. Gmail thread fetch, Intercom conversation fetch). Do NOT hardcode tool slugs.
2. **Fetch the raw thread** via Composio. Pull subject, all messages, sender email, external message ids.
3. **Resolve the customer.** Look up `customers.json` by sender email. If not found, create a new index entry + a skeleton `customers/{slug}/profile.json` (slug = kebab-cased email local-part, deduped if needed).
4. **Categorize** the content into one of: `bug | how-to | feature | billing | account | security | other`. Use content signals — error messages and stack traces lean bug; "how do I…" leans how-to; "can you add…" leans feature; keywords like "refund", "invoice", "charge" lean billing.
5. **Assign priority (P1–P4).** Start from MRR: MRR >= $500/mo → base P2; VIP tag → P1 floor. Escalate on content: "down", "can't log in", "data loss", "production" → bump one level (max P1). De-escalate on "whenever you get a chance" → bump down one level.
6. **Set SLA fields.** P1: `firstReplyDueAt` = now + 1h. P2: 4h. P3: 24h. P4: 72h. `breached = false` initially.
7. **Write atomically.** Upsert into `conversations.json`. Write full messages to `conversations/{id}/thread.json`. Append a `kind: "conversation"` event to the customer's `history.json`.

## Outputs
- Writes to `conversations.json` (index upsert)
- Writes to `conversations/{id}/thread.json` (full thread)
- Writes to `customers.json` (new customer row if needed)
- Writes to `customers/{slug}/profile.json` (skeleton if new)
- Appends to `customers/{slug}/history.json`
