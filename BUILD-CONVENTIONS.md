# Build Conventions — solo-support-workspace

Every build session (human or subagent) reads this before writing
files. Reference implementations:

- `../sdr-agent/` — canonical role-agent shape (CLAUDE.md, data-schema.md, onboard-me SKILL.md, houston.json).
- `../founder-marketing-workspace/` — canonical workspace with
  coordinator + shared-doc pattern + bundle generator.
- `../role-agents-workspace/role-agent-guide.md` — full agent contract
  (696 lines).
- `TEAM-GUIDE.md` (this workspace) — agent roster, coordinator
  pattern, skill lists, use cases.
- `research/*.md` (this workspace) — per-agent research MDs.

This doc is the **workspace-scoped addendum**. Everything in it
overrides defaults from the upstream role-agent-guide when in conflict.

---

## File tree per agent

```
agents/{agent-id}/
├── houston.json            # manifest (required)
├── CLAUDE.md               # 50–100 lines, pointer-style identity + skill index
├── data-schema.md          # documents every file read/written
├── README.md               # who this agent is for + first prompts
├── bundle.js               # read-only dashboard (generated, never hand-edited)
├── icon.png                # 256×256 solid-color PNG
├── .gitignore              # one line: *.tmp, + config/
└── .agents/skills/
    ├── onboard-me/SKILL.md
    ├── {skill-1}/SKILL.md
    └── …
```

---

## `houston.json` rules

Follow `../founder-marketing-workspace/BUILD-CONVENTIONS.md` almost
verbatim. Key points:

- **First tab `id` is `overview`**, never `dashboard` / `connections`
  / `settings` (those collide with app shell state).
- **`customComponent` is `"Dashboard"`** — matches
  `window.__houston_bundle__ = { Dashboard: Dashboard }`.
- **`agentSeeds` must include** `outputs.json` seeded to `"[]"` and
  `.houston/activity.json` seeded with the onboarding "Needs you"
  card.
- **Include the `job-description` built-in tab.** Houston renders it
  as four sub-tabs (Use Cases / Instructions / Skills / Learnings).
  The `useCases` array populates Use Cases.
- **Distinct `icon` (Lucide name) and `tags` per agent.**

### `useCases` writing rules

Every agent declares 5–10 use cases. Fields:

- **`category`** — 1–2 word group label ("Triage", "Foundation",
  "Accounts", "Renewals", etc.).
- **`title`** — verb-led CTA, stands on its own (the ONLY text on
  the Overview tile).
- **`blurb`** — 6–12 words. Answers "what exactly do I get?"
- **`prompt`** — short user-typed text with `{placeholders}`. Shown
  in Job Description.
- **`fullPrompt`** — 3–8 lines. Goal, inputs, deliverable, one
  non-obvious constraint. Copied to clipboard on tile click.
- **`description`** — 1–2 sentences, no marketing words. Job
  Description only.
- **`outcome`** — concrete artifact path and what to do with it.
- **`skill`** — slug of the SKILL.md this invokes.
- **`tool`** — optional external app name for the eyebrow.

Order matters on Overview. `useCases[0]` is the featured "Start
here" mission.

---

## `CLAUDE.md` template (50–100 lines)

Sections, in order:

1. `# I'm your {role}` — 2–3 lines: mission + boundary.
2. `## To start` — onboarding trigger rule.
3. `## My skills` — one line per skill with "use when" trigger.
4. `## Cross-agent read` (non-HoS agents only) — pointer to
   `../head-of-support/support-context.md`. Rule: **before any
   substantive output, read the context doc. If it's empty or
   missing, tell the founder to run Head of Customer Support's
   `define-support-context` first and stop.** (HoS agent omits this
   section and has a section about OWNING the doc.)
5. `## Composio is my only transport` — name the integration
   categories this agent uses (e.g. inbox, ticket-tracker, billing,
   usage-analytics).
6. `## Data rules` — agent root, never `.houston/<agent>/`, atomic
   writes, record id + timestamps, list key top-level files.
7. `## What I never do` — role-specific hard nos.

No fluff. If longer than ~100 lines, cut.

---

## `SKILL.md` template

```markdown
---
name: {skill-id}
description: Use when {observable trigger} — {one-sentence summary of what happens}.
---

# {Skill Title}

## When to use

- Explicit trigger phrases the user says.
- Implicit triggers (another skill calls this as a dependency).
- Cadence rules (e.g. weekly, per-account, per-incident).

## Steps

1. **Read support context** (non-HoS agents only):
   `../head-of-support/support-context.md`. If missing, tell the
   user to run Head of Customer Support's `define-support-context`
   first and stop.
2. **Read config** needed for this skill. If missing, ask ONE
   targeted question with modality hint (connected app > file >
   URL > paste). Write to `config/{file}.{json|md}` and continue.
3. {actual work — concrete, numbered, imperative}
4. **Write** the markdown / JSON artifact (atomic: `*.tmp` → rename).
5. **Append to `outputs.json`** — new entry with the Output schema.
6. **Summarize to user** — one paragraph + path.

## Outputs

- `{path}`
- Appends to `outputs.json` with `{ id, type, title, summary, path,
  status, createdAt, updatedAt }`.
```

**Rules:**

- Description starts with "Use when…" and names an observable trigger.
- One skill = one purpose. If a skill does 3 things, it's 3 skills.
- Every skill that drafts messages reads voice from
  `../head-of-support/support-context.md#voice`. No per-agent voice
  configs.
- Every skill that writes externally (ticket, outreach, broadcast)
  goes through Composio. No hardcoded tool names. Use
  `composio search <category>` at runtime.
- Atomic writes: `*.tmp` then rename.

---

## `outputs.json` schema (every agent)

```ts
interface Output {
  id: string;           // uuid v4
  type: string;         // agent-specific enum — see each agent's data-schema.md
  title: string;
  summary: string;      // 2–3 sentences
  path: string;         // relative to agent root
  status: "draft" | "ready";
  createdAt: string;
  updatedAt: string;
}
```

Read-merge-write. Never overwrite the whole array. On update,
refresh `updatedAt` and leave `createdAt` alone.

---

## `bundle.js` — generator pattern

**Don't author `bundle.js` directly.** Generated from
`scripts/bundle_template.js` + agent's `houston.json` by
`scripts/generate_bundles.py`. Regenerate after editing `useCases`,
the template, or taglines:

```bash
python3 scripts/generate_bundles.py
```

Hard rules the template enforces:

- `var React = window.Houston.React;` — never `import React`.
- `React.createElement` (aliased as `h`). No JSX.
- Export: `window.__houston_bundle__ = { Dashboard: Dashboard };`.
- Scoped `<style>` block with CSS custom properties — NOT Tailwind
  classes outside Houston's scanned set.
- Single monochrome palette across the workspace.
- Keep `useHoustonEvent("houston-event", ...)` literal string in a
  comment (the Phase-6 grep check looks for it).

---

## `data-schema.md` template

Document every file the agent reads or writes:

1. `config/` files — what learned context, written by which skill.
2. Top-level files at agent root — `outputs.json`, plus role-specific
   indexes.
3. Subfolders — per-entity content (e.g. `conversations/{id}/*`).
4. Cross-agent reads (non-HoS agents) — the support context doc,
   plus sister-agent data (Help Center reads Inbox; Success reads
   Inbox + Help Center).
5. Atomic-write rule + `.houston/` prohibition.

---

## `README.md` per agent (~40 lines)

```markdown
# {Agent Name}

{2-sentence mission.}

## First prompts

- "{use case 1}"
- "{use case 2}"
- …

## Skills

{bulleted list matching CLAUDE.md}

## Cross-agent reads

(non-HoS only) Reads `../head-of-support/support-context.md` before
substantive output. HoS owns the doc.

## Outputs

Markdown under `{topic}/{slug}.md` + a record in `outputs.json`
(shown in Overview dashboard).
```

---

## `.gitignore` per agent

```
*.tmp
config/
```

Config is per-install state — never committed.

---

## Hard rules (break = rebuild)

1. **Never write under `.houston/<agent-path>/`** at runtime.
   Exception: the seeded `.houston/activity.json` onboarding card
   (install-time only).
2. **Never use JSX or build tools** — IIFE `bundle.js` with
   `React.createElement`.
3. **Never hardcode tool names** — Composio only, discovered at
   runtime.
4. **Atomic writes** — temp-file + rename. Partial JSON crashes
   dashboards.
5. **`onboard-me` max 3 questions.** Scope + modality preamble +
   3 questions + hand-off.
6. **Every skill description starts with "Use when…"**
7. **Non-HoS agents read the support context doc first.** If
   missing, stop and tell the user.
8. **First tab id is `overview`**, never `dashboard` / `connections`
   / `settings`.
9. **`agentSeeds` includes every file the dashboard reads on
   mount.** Ours read `outputs.json` → seed to `"[]"`.
10. **One monochrome palette** across all four agents. No per-agent
    accent colors — reads as one product.
