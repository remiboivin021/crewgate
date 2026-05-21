# Configuration Usage Guide

How to use the OpenCode configuration files day-to-day. This guide is for developers who need to change how the agent system behaves, routes, or enforces rules.

---

## Which File Does What

| File | Purpose | Who edits |
|------|---------|-----------|
| `AGENTS.md` | Organization-level defaults: skill routing, authority, invariants, execution flows, forbidden areas | Maintainer (rarely) |
| `AGENTS.override.md` | Project-specific overrides: stack, architecture triggers, security triggers, project invariants | Project team (when adding new surfaces) |
| `.opencode/_constitution.md` | Immutable supreme law — never edit | No one |
| `docs/governance/constitution.md` | Human-readable mirror of the constitution | Sync from source only |

**Rule of thumb:** If the change is about how *this project specifically* works, it goes in `AGENTS.override.md`. If it is about how the routing system itself works across projects, it goes in `AGENTS.md`.

---

## Precedence Chain (How Config is Resolved)

When the system needs to decide a rule, it reads in this order:

```
CONSTITUTION > AGENTS.override.md > AGENTS.md > NLSPEC > STATE > DECISIONS > TODO > verbal instruction
```

In practice:

1. **Constitution** wins everything — immutable.
2. **AGENTS.override.md** overrides AGENTS.md for this project.
3. **AGENTS.md** provides defaults for anything not in the override.
4. Everything below is scope-limited to the current feature.

**Implication:** If you put something in AGENTS.override.md, it shadows AGENTS.md. If you want the base behavior back, remove the override.

---

## Step-by-Step: Making a Configuration Change

### 1. Identify the need

Determine what the system is not enforcing or routing correctly. Common triggers:

- A new module needs to be added to forbidden areas
- A new security surface appeared (e.g. new LLM provider adapter)
- An invariant needs to be documented
- The pipeline gate sequence is changing
- A new external dependency with structural impact

### 2. Classify the change level

Use `docs/governance/levels.md` to classify:

| Level | Config impact | Example |
|-------|---------------|---------|
| L1 | Cosmetic only (comment typo) — still risky because config files are forbidden areas | Fixing a typo in an invariant description |
| L2 | Metadata only (descriptions, comments, reordering) | Clarifying a trigger description without changing its meaning |
| L3 | Structural config change | Adding an invariant, changing a forbidden area, updating architecture triggers |

**Config changes are almost always L3** because `AGENTS.md` and `AGENTS.override.md` are explicitly marked as forbidden areas requiring `$architect` approval.

### 3. Brainstorm

Before writing config, run through the questions in `configuration-brainstorming.md`. The goal is to understand blast radius, downstream impact, and whether an ADR is needed.

### 4. Draft the change

Edit the appropriate file:

- **New architecture trigger:** Add to `AGENTS.override.md` under `## Architecture Triggers (CrewGate-specific)`
- **New security trigger:** Add to `AGENTS.override.md` under `## Security Triggers (CrewGate-specific)`
- **New project invariant:** Add to `AGENTS.override.md` under `## Project-Specific Invariants`
- **New forbidden area:** Add to list in `AGENTS.override.md` under `## Forbidden Areas (CrewGate-specific)`
- **Skill routing or authority changes:** Edit `AGENTS.md` (rare — organizational default)

### 5. Validate

- Run `$preflight` — it checks AGENTS.md is fully initialized and has no template placeholders
- Run `mkdocs build --strict` if docs were updated
- If the change added a new invariant or architecture trigger, verify the corresponding documentation in `docs/governance/` or `docs/architecture/` is updated

### 6. Commit

```
docs(opencode): add X trigger to AGENTS.override.md

Task: T-NNN
```

---

## Configuration Change by Level

### L1 — Not possible for config

Config files are forbidden areas. Touching them requires explicit `$architect` approval, which makes it at least L3.

Exception: purely cosmetic changes (typo in a comment) could be argued as L1, but the risk of misclassification is high. When in doubt, escalate.

### L2 — Metadata only

Updating descriptions, clarifying comments, or reordering entries without changing behavior.

Example: Clarifying the description of an existing invariant.

### L3 — Structural (the default for config)

Any change that alters system behavior:

- Adding or removing invariants
- Adding or removing forbidden areas
- Changing architecture or security triggers
- Changing the skill routing table
- Changing the precedence or authority rules

**Required gates for L3 config changes:**
```
governance? → triage → planner → architect → adr → preflight → coder → doc → qa → review
```

The ADR is mandatory because config changes affect the system's structural contracts.

---

## Practical Examples

### Example 1: Adding a new forbidden area

**Scenario:** A new `plugins/` directory is created and must be protected.

**Steps:**
1. Triage → classifies as L3 (forbidden area change)
2. Planner → creates STATE with scope: add plugins/ to forbidden areas
3. Architect → approves, may require ADR
4. ADR → documents why plugins/ needs protection
5. Preflight → PASS
6. Coder → adds `plugins/` to `AGENTS.override.md` under `## Forbidden Areas (CrewGate-specific)`
7. Doc → updates any architecture doc referencing plugins/
8. QA / Review → validates
9. Commit

### Example 2: Adding a project-specific invariant

**Scenario:** A new rule: "Every gate output must be signed before storage."

**Steps:**
1. Triage → L3 (invariant change, touches I-CG surface)
2. Planner → STATE defines the new invariant
3. Governance → verifies no constitutional conflict
4. Architect → approves
5. ADR → records the decision
6. Preflight → PASS
7. Coder → adds I-CG-06 to `AGENTS.override.md`
8. Doc → syncs architecture docs
9. Commit

---

## Common Mistakes

| Mistake | Why it hurts | Fix |
|---------|-------------|-----|
| Editing the constitution | Immutable — breaks the governance model | Restore from git, edit AGENTS.override.md instead |
| Touching config without an ADR | Structural decisions need durable records | Create ADR before coding |
| Overriding AGENTS.md when AGENTS.override.md should be used | Breaks the layering model | Move project-specific config to override |
| Only updating one file when config references exist in docs | Silent documentation drift | Always sync docs after config changes |
| Classifying a config change as L2 | Config is a forbidden area — almost always L3 | Re-classify, add required gates |

---

## Related

- `configuration-brainstorming.md` — How to think through config decisions before writing
- `AGENTS.md` — The routing layer itself
- `AGENTS.override.md` — This project's overrides
- `docs/governance/levels.md` — Change level classification
- `docs/governance/adr/` — Architecture Decision Records
