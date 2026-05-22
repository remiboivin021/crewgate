# ADR 26-05-12: Pipeline Orchestration and CLI Design

**Status:** Accepted

Defines the v0.1 local runtime for `crewgate feat new`, `crewgate run`, and `crewgate status`, plus the deterministic routing and gate sequencing rules that back those commands.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |

## Context

CrewGate already documented a 7-gate autonomous pipeline, but the actual exported CLI was still a placeholder scaffold. The v0.1 roadmap requires the first runnable local core with persisted feature state, deterministic routing, and baseline security boundaries.

The change touches durable surfaces:

- public CLI behavior
- runtime state file structure under `.crewgate/state/`
- pipeline sequencing semantics
- trust boundaries around artifacts, environment keys, and git-safe behavior

## Decision

CrewGate v0.1 implements a local deterministic runtime with these rules:

1. `crewgate run` remains the sole pipeline execution entry point.
2. Feature state is persisted as JSON in `.crewgate/state/<slug>.json`.
3. Artifacts are written only under `.crewgate/artifacts/<slug>/<gate>/`.
4. Routing is implemented in repository-local TypeScript for v0.1, but a policy seam is preserved through `DynamicRouter` and a reference `policies/cupcake-routing.rego` file.
5. Gate execution is local and deterministic for now: persona and behavior files are resolved from the repository, then passed into a stubbed LLM adapter.
6. Security baseline is enforced in code through env-only key resolution, artifact path confinement, and rejection of `git reset --hard`.

## Consequences

Positive:

- The CLI is now runnable from a clean checkout.
- The persisted runtime contract is explicit and test-covered.
- The router can later be replaced by a real Cupcake adapter without changing the CLI contract.

Trade-offs:

- v0.1 does not yet implement external LLM providers, telemetry integrity, prediction market, or fidelity checks.
- The reference policy file is not yet executable; it exists to preserve the documented seam until a policy runtime is introduced.

## Compatibility

- No migration is required because the v0.1 state format is newly introduced.
- Future changes to state structure, gate set, or CLI semantics require a follow-up ADR or an update to this ADR.
