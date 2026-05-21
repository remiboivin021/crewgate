# ADR Index

Architecture Decision Records — durable, versioned records for structural decisions that affect the system's long-term shape.

## Purpose

ADRs exist to make structural reasoning, contract evolution, compatibility choices, and long-term tradeoffs reviewable over time. Record decisions affecting:

- architecture boundaries and invariants
- public contracts (API, CLI, config, schema)
- runtime semantics and pipeline shape
- trust boundaries and migration/rollback strategy
- durable operational assumptions

They are **not** for routine local implementation choices (use `DECISIONS.<slug>.md` instead).

## Relationship to other layers

```
Constitution (immutable law)
  → AGENTS.md (routing + config)
    → ADRs (durable structural decisions)
      → STATE.<slug>.md (feature contract)
        → DECISIONS.<slug>.md (local decisions)
          → TODO.<slug>.md (execution rail)
```

## When an ADR is Required

Create one when a change affects or may affect system invariants, module/package boundaries, public API/CLI contracts, config structure or compatibility, schemas or file formats, pipeline/runtime semantics, trust boundaries, migration/rollback requirements, or repo governance assumptions.

If the constitution, governance flow, architect gate, or preflight policy says ADR is required, implementation must not proceed until the ADR gate is satisfied.

## When NOT to create an ADR

Small local fixes, narrow feature implementation choices, test-only work, documentation-only work, isolated refactors with no durable architectural effect, and temporary implementation details that don't change long-term system assumptions.

## Rules

- **Naming**: `docs/governance/adr/<yy-mm-dd_slug>.md`
- **Template**: every new ADR must use `_template.md`
- **Status model**: Proposed → Accepted / Rejected → Superseded
- **Quality bar**: must make obvious what problem existed, why it needed ADR, what was chosen, what alternatives were considered, what invariants/contracts are affected, whether migration/rollback is needed, what tradeoffs remain, and what follow-up is required.
- **Migration and rollback** sections are mandatory whenever applicable (schema/config changes, public contracts, persisted state, runtime behavior, compatibility, deployment).

## Current ADRs

- [`26-05-12_hexagonal-architecture.md`](26-05-12_hexagonal-architecture.md) — Architecture hexagonale pour Prospection MVP
- [`26-05-12_pipeline-orchestration-cli.md`](26-05-12_pipeline-orchestration-cli.md) — Phase 3 : Pipeline Orchestration and CLI Design
- [`26-05-12_scoring-engine-extensibility.md`](26-05-12_scoring-engine-extensibility.md) — Scoring Engine Extensibility via Rule Pattern
- [`26-05-19_jury-box-architecture.md`](26-05-19_jury-box-architecture.md) — Jury Box Architecture & Robust Autonomy Protocol

## Practical rule of thumb

Use `DECISIONS.<slug>.md` for local implementation choices and temporary tradeoffs. Use ADR for decisions future contributors must know months later — if forgetting the decision later would create architectural confusion, it probably deserves an ADR.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
