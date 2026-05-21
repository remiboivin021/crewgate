# OpenCode Tooling

CrewGate uses OpenCode as its AI-agent governance and execution framework. This page documents how OpenCode is configured in this project and how to use it day-to-day.

For the governance framework itself (constitution, authority, decision process), see `docs/governance/`.

---

## Project Configuration

### `AGENTS.md`

Routing layer and project configuration for AI agents. Defines:

- **Skill routing** — which skill to invoke for each type of task (`$triage`, `$planner`, `$coder`, `$qa`, etc.)
- **Authority** — which skills can veto others (e.g. `$governance` blocks constitutional violations)
- **Execution flows** — the sequence of skills for features, bugfixes, structural changes, security changes
- **Hard gates** — `STATE.<slug>.md` must exist before coding, one active task at a time, one commit per task
- **Invariants** — I-01 (additive contracts), I-02 (explicit trust boundaries), I-03 (deterministic operations)
- **Forbidden areas** — require `$architect` approval before touching
index/user
### `AGENTS.override.md`

Project-specific overrides. Adds CrewGate-specific:

- **Stack**: TypeScript 5.x, Bun 1.x, Vitest, Playwright, GitHub Actions
- **Architecture triggers**: pipeline gate changes, router logic, state format, Cupcake policy interface, port contracts
- **Security triggers**: filesystem isolation, telemetry, git safety, LLM adapters, artifact permissions
- **Invariants**: I-CG-01 through I-CG-05 (artifact isolation, atomic state, single entry point, append-only telemetry, safe rollback)
- **Forbidden areas**: `policies/`, `personas/`, `behaviors/`, config, port interfaces

### Constitution

| File | Rule |index/user
|------|------|
| `.opencode/_constitution.md` | Immutable source of truth — never edit |
| `docs/governance/constitution.md` | Human-readable mirror — must stay in sync |

Before any feature work, both must exist and be consistent. `$preflight` blocks coding if the mirror is missing.

---

## Skills Reference

Skills are invoked with the `$name` prefix (e.g. `$triage`, `$planner`).

| Skill | When | What it does | Veto? |
|-------|------|-------------|-------|
| `$governance` | Constitutional/invariant questions | Checks rules, blocks violations | Yes |
| `$triage` | Start of every new request | Classifies request, selects flow | No |
| `$planner` | After triage | Produces `STATE.<slug>.md` (feature contract) | No |
| `$architect` | Structural decisions | Validates boundaries, blast radius | Yes |
| `$architect-security` | Structural + security combined | Validates both | Yes |
| `$security` | Security-sensitive changes | Threat model, auth, secrets | Yes |
| `$adr` | Durable decisions | Produces Architecture Decision Record | No |
| `$preflight` | Before coding | Final readiness gate | No (blocks) |
| `$coder` | During implementation | Only skill that writes production code | No |
| `$test-gen` | Test generation (TDD red phase) | Generates tests from NLSpec | No |
| `$qa` | After implementation | Validates criteria, regressions | Yes |
| `$review` | After QA | Scope, process, atomicity check | Yes |
| `$doc` | After implementation | Syncs documentation | No |
| `$release` | Before merge | Final readiness check | No |

### Authority hierarchy

```
$governance > $architect-security > $architect > $security > $qa > $review
$planner (scope) | $preflight (gate) | $triage (routing) — no veto
$coder — execution only, no veto
```

---

## Working Artifacts

### `STATE.<slug>.md` — The Feature Contract

Created by `$planner`. Must exist before any coding. Contains:

- Mission and scope
- Acceptance criteria
- Allowed and forbidden areas
- Blast radius
- Required gates
- Execution plan
- Drift rules

**Rule:** No STATE = no coding. If scope expands, return to `$planner`.

### `TODO.<slug>.md` — The Execution Rail

Copied from `.opencode/_TODO.md` (immutable template). Must have exactly one active task under `# Current Task` at all times.

### `DECISIONS.<slug>.md` — Local Decision Memory

Copied from `.opencode/_DECISIONS.md` (immutable template). Logs significant non-trivial choices during implementation. May start empty but must exist.

### Templates (immutable)

| Template | Working copy | Rule |
|----------|-------------|------|
| `.opencode/_STATE.md` | `STATE.<slug>.md` | Copy, never edit source |
| `.opencode/_TODO.md` | `TODO.<slug>.md` | Copy, never edit source |
| `.opencode/_DECISIONS.md` | `DECISIONS.<slug>.md` | Copy, never edit source |
| `.opencode/skills/*` | — | Never edit during feature work |

---

## Execution Flows

The flow depends on what you're doing:

```
standard feature:
  triage → planner → nlspec → test-gen → preflight → coder → qa → review → doc → release

bug fix:
  triage → planner → nlspec → test-gen → preflight → coder → qa → review

structural change:
  governance? → triage → planner → architect → adr → preflight → coder → qa → review → doc → release

security-sensitive:
  governance? → triage → planner → architect-security → adr → preflight → coder → security → qa → review → doc → release
```

If a constitutional or invariant surface is touched, governance comes first.

---

## Practical Workflow

### 1. Triage the request

Start with `$triage`. It classifies the request, determines the change level (L1/L2/L3), selects the flow, and identifies required gates.

### 2. Plan the feature

`$planner` produces `STATE.<slug>.md` — the contract for the change. This defines exactly what is in scope and what is not.

### 3. Initialize working artifacts

```bash
cp .opencode/_TODO.md TODO.<slug>.md
cp .opencode/_DECISIONS.md DECISIONS.<slug>.md
```

### 4. Satisfy required gates

If the level or flow requires `$architect`, `$security`, `$adr`, or `$governance`, satisfy them before preflight.

### 5. Run preflight

`$preflight` verifies readiness. It checks:

- Correct branch and worktree
- AGENTS.md fully initialized
- Constitution source + mirror present
- STATE.<slug>.md complete and valid
- Working artifacts initialized
- Required gates satisfied
- No collisions or conflicts

If preflight PASSes, coding can begin.

### 6. Implement

Only `$coder` writes production code. Rules:

- Stay inside Allowed Areas defined in STATE
- No opportunistic refactoring
- Log decisions in `DECISIONS.<slug>.md`
- If scope expands → STOP → return to `$planner`

### 7. Commit after each task

```text
type(scope): description
```

Append `| commit: <short-SHA>` to the completed task line in `TODO.<slug>.md`.

### 8. Validate

Run `$qa` to validate acceptance criteria and check regressions. Then `$review` for process integrity.

### 9. Documentation and release

`$doc` syncs documentation. `$release` is the final readiness check before merge.

---

## Commit Discipline

Hard rules:

- No `STATE.<slug>.md` → no coding
- One active task in `TODO.<slug>.md` at all times
- One task = one commit, immediately after completion
- Commit format: `type(scope): description`
- Done lines in `TODO.<slug>.md` must end with `| commit: <short-SHA>`

---

## Key Rules

| Rule | Description |
|------|-------------|
| **Minimal Change** | Smallest safe diff that satisfies the contract |
| **No Opportunistic Refactor** | No renaming, reorganizing, or modernizing unrelated code |
| **Scope Discipline** | Anything not in STATE is out of scope |
| **Drift Rule** | If scope expands or plan becomes invalid → STOP → return to planner |
| **Gate Semantics** | A gate is not satisfied by being in the flow — it must be explicitly satisfied |
| **Documentation Rule** | `$doc` is required when behavior, config, API, CLI, or architecture changes |
| **Precedence** | CONSTITUTION > AGENTS.override.md > AGENTS.md > NLSPEC > STATE > DECISIONS > TODO > verbal instruction |

---

## Practical Guides

| Guide | Use this when... |
|-------|-----------------|
| [Configuration Usage](configuration-usage.md) | You need to edit `AGENTS.md` or `AGENTS.override.md` — step-by-step from triage to commit |
| [Configuration Brainstorming](configuration-brainstorming.md) | You are unsure what config surface a change touches — diagnostic questions, blast radius, decision tree |

## References

| File | Purpose |
|------|---------|
| `AGENTS.md` | Skill routing, authority, flows, rules |
| `AGENTS.override.md` | Project-specific overrides |
| `.opencode/_constitution.md` | Supreme law (immutable) |
| `docs/governance/constitution.md` | Human-readable mirror |
| `docs/governance/quickstart.md` | Shortest valid path to work safely |
| `docs/governance/levels.md` | Change level classification |
| `docs/governance/workflows.md` | Detailed execution workflows |
| `docs/governance/authority-map.md` | Authority and veto map |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
