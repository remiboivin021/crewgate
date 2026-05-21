# Governance Index

Entry point for project governance and decision traceability.

## Pages

### [constitution.md](constitution.md)

Human-readable mirror of `.opencode/_constitution.md`. The supreme governing law — defines immutable rules, inviolable mechanisms, system invariants, and amendment policy. Must stay in sync with the immutable source.

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

---

| Maintainer/Author | Last modified |
|-------------------|---------------|
| Rémi Boivin       | 2026-05-22    |
