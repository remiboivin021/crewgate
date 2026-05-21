# Governance Index

Entry point for project governance and decision traceability.

## Pages

### [quickstart.md](quickstart.md)

Shortest valid path to work safely in an initialized repository:

- Read order (AGENTS.md → constitution → levels → workflows)
- Smallest valid flow (triage → planner → preflight → coder → qa/review/doc)
- Step-by-step: worktree → initialize artifacts → triage → planner → gates → preflight → code → commit
- Hard stops and ready-to-start checklist

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
