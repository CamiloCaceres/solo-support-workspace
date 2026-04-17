---
name: capture-feature-request
description: Use when an inbox conversation or direct founder message contains a feature ask — records the request in `requests.json` with the requesting customer's slug attached, merges with existing similar requests, and optionally syncs to Linear/GitHub via Composio so the solo founder never loses a customer ask.
---

# Capture Feature Request

## When to use

- Inbox conversation contains wording like "I wish…", "it would be great if…", "do you support…?", "any plans for…?" — and the answer is "not yet".
- Founder says "add this to the feature request list" or "customer X asked for Y".
- You're reviewing `../inbox/conversations/` and spot an unaddressed ask that wasn't filed.

## Steps

1. Extract the ask:
   - **title** — one short phrase ("bulk export", "dark mode", "Zapier integration")
   - **summary** — 1–2 sentences of what & why
   - **requestingCustomer** — the customer slug from `../inbox/customers.json` (match by conversation → customerId → slug)
2. Read `requests.json`. Look for an existing record with a semantically similar `title`:
   - If found → **merge**: add the customer slug to `requestingCustomers` (dedupe), refresh `updatedAt`, optionally expand `summary` if the new wording adds detail.
   - If not found → **append** a new `FeatureRequest` with `roadmapStatus: "requested"` and `linearId: null`.
3. Atomic-write `requests.json`.
4. **Optional Composio sync** (only if configured):
   - Check whether Linear / GitHub is connected: `composio search linear create issue` and verify the tool is available + authed.
   - If connected AND the founder has opted in (stored preference, or they just said "sync to linear"): execute the appropriate Composio tool to create / update the tracker issue. Capture the returned id into `linearId` or `githubIssueUrl`.
   - If not connected: do nothing — never half-sync. Mention once that `composio link <slug>` would enable it, then stop bringing it up.
5. Report to chat: "Captured feature request: '{title}' from {customer-slug} (N total requesters). {Linear/GitHub status}."

## Outputs

- Appends / merges into `requests.json`
- Optionally creates or updates a Linear / GitHub issue via Composio
- Posts a confirmation to chat
