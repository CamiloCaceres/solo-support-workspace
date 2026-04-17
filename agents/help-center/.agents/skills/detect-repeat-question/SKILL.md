---
name: detect-repeat-question
description: Use when scanning recent inbox conversations (last 30–60 days) to find semantically similar incoming questions — clusters them, and once a cluster hits ≥3 occurrences with no matching article, appends a gap record so the solo founder can see what to document next.
---

# Detect Repeat Question

## When to use

- On a weekly cadence (typically before `weekly-digest` or `gap-surface` runs).
- When the founder says "what are people asking about lately?" or "what questions keep coming up?".
- After any large influx of new conversations in `../inbox/conversations.json`.

## Steps

1. Read `../inbox/conversations.json`. Filter to conversations with `createdAt` in the last 30–60 days (start with 30; widen to 60 if too few).
2. For each conversation, read `../inbox/conversations/{id}/thread.json` and extract the first customer message (the original question).
3. Cluster by **meaning**, not keywords:
   - Normalize: strip names/ids/urls, lowercase, collapse whitespace.
   - Group messages whose intent and subject match (e.g. "how do I reset my API key?" and "where do I regenerate my token?" are the same cluster).
   - Use your judgment — this is semantic clustering, not string match.
4. For each cluster with `size >= 3`:
   - Check `articles.json` for any published article covering this topic. If one exists, skip (log internally, don't append).
   - Check `gaps.json` for an existing gap with a semantically equivalent `question`. If match → merge: bump `occurrenceCount`, union `sourceTicketIds`, update `updatedAt`.
   - Otherwise → append a new `Gap` record with `status: "open"`, a canonical phrasing of the question, the occurrence count, and the source ticket ids.
5. Also look for broader themes across multiple clusters (e.g. "onboarding confusion" spanning 4 different questions). For each theme with frequency ≥ 5, update or append to `patterns.json`.
6. Atomic-write `gaps.json` and `patterns.json`.
7. Report: "Found N new gaps, updated M existing, M new patterns this scan."

## Outputs

- Appends / merges into `gaps.json`
- Appends / updates `patterns.json`
- Writes a brief summary back to chat
