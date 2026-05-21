# Governance Index

Entry point for project governance and decision traceability.

## Pages

### [constitution.md](constitution.md)

Human-readable mirror of `.opencode/_constitution.md`. The supreme governing law — defines immutable rules, inviolable mechanisms, system invariants, and amendment policy. Must stay in sync with the immutable source.

### [authority-map.md](authority-map.md)

Who decides what. Layer-by-layer source of truth:

- Constitutional law → `.opencode/_constitution.md`
- Routing + config → `AGENTS.md`
- Skill behavior → `.opencode/skills/*/SKILL.md`
- Feature contract → `STATE.<slug>.md`
- Execution rail → `TODO.<slug>.md`
- Local decisions → `DECISIONS.<slug>.md`
- Durable decisions → ADR

Includes authority order (`$governance > $architect-security > $architect > $security > $qa > $review`), precedence rules, escalation map, and anti-drift policy.

### [decision-process.md](decision-process.md)

How significant project decisions are proposed, reviewed, and recorded:

- Default flow: state problem → define scope → evaluate options → record choice → link to implementation
- Escalate to ADR when decision affects architecture, boundaries, or long-term maintenance

### [contribution-model.md](contribution-model.md)

Who can contribute and how:

- Scoped, reviewable changes; public behavior changes must be documented; architectural changes link to ADR; AI-generated output requires human review
- Roles: Author (proposes), Reviewer (validates), Maintainer (final acceptance)

### [quickstart.md](quickstart.md)

Shortest valid path to work safely in an initialized repository:

- Read order (AGENTS.md → constitution → levels → workflows)
- Smallest valid flow (triage → planner → preflight → coder → qa/review/doc)
- Step-by-step: worktree → initialize artifacts → triage → planner → gates → preflight → code → commit
- Hard stops and ready-to-start checklist

### [levels.md](levels.md)

Change rigor classification (L1/L2/L3):

- **L1** — local low-risk (doc, typo, isolated fix): triage → planner → preflight → coder → review
- **L2** — standard bounded feature: adds qa + doc
- **L3** — structural or sensitive: adds architect/architect-security + adr + security + release
- Escalation rules, selection rule ("lowest level that is still honest")

### [workflows.md](workflows.md)

Canonical execution sequences for each work type:

- Standard feature, bug fix, structural change, security-sensitive change
- Governance-first rule, preflight placement rule, reclassification rule
- Core rules: no STATE → no preflight PASS → no coding
- Flow vs level relationship

### [adr/](adr/index.md)

Architecture Decision Records index:

- When to create an ADR (invariants, boundaries, contracts, schemas, pipeline semantics, trust)
- When NOT to create an ADR (local fixes, test-only, implementation choices)
- File naming: `<yy-mm-dd_slug>.md` from `_template.md`
- Status model: Proposed / Accepted / Rejected / Superseded
- Current ADRs: hexagonal architecture, pipeline orchestration, scoring engine, jury box protocol

### checklists/

Before-coding and before-merge checklists for operational safety.

---

| Maintainer/Author | Last modified |
|-------------------|---------------|
| Rémi Boivin       | 2026-05-22    |
