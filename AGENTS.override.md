# AGENTS.override.md

> Project-specific overrides for CrewGate.
> See `AGENTS.md` for routing rules, authority, and flow semantics.

## Identity

- **Project**: CrewGate
- **Author/Maintainer**: Remi Boivin
- **License**: MIT
- **Repository purpose**: Multi-agent pipeline orchestrator for OpenCode

## Stack

- Language: TypeScript 5.x
- Runtime: Bun 1.x
- Testing: Vitest (unit/integration), Playwright (E2E)
- CI: GitHub Actions
- Distribution: npm package

## Architecture Triggers (CrewGate-specific)

In addition to AGENTS.md triggers, `$architect` is required before:

- Pipeline gate sequence changes (add/remove/reorder gates)
- Dynamic Router classification logic changes
- State file format changes (`.crewgate/state/<slug>.json`)
- Cupcake policy interface changes
- ICommandPort / IRouterPort / ILLMPort contract changes

## Security Triggers (CrewGate-specific)

In addition to AGENTS.md triggers, `$security` is required before:

- Filesystem isolation boundary changes
- Telemetry format or storage changes
- Git safety mechanism changes (tag prefix, rollback strategy)
- New adapter for external LLM providers
- Changes to artifact port permissions

## Project-Specific Invariants

| ID | Invariant |
| --- | --- |
| I-CG-01 | Each gate writes only to `.crewgate/artifacts/<slug>/<gate>/` |
| I-CG-02 | State file is atomically written per gate completion |
| I-CG-03 | `crewgate run` is the sole entry point for pipeline execution |
| I-CG-04 | Telemetry is append-only, never modified in place |
| I-CG-05 | Rollback uses `git revert`, never `git reset --hard` |

## Forbidden Areas (CrewGate-specific)

Require explicit `$architect` approval:

- `policies/` — Cupcake Rego rules (impact routing determinism)
- `personas/` — Gate agent prompts (impact all gate outputs)
- `behaviors/` — Behavior profiles (impact gate heuristics)
- `.crewgate/config.yaml` — Pipeline configuration contract
- `src/ports/` — Hexagonal port interfaces
