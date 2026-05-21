# Constraints

## Functional Constraints

- **Deterministic Routing**: Feature level and flow classification MUST be deterministic for same inputs (Rego/Wasm).
- **Scope Enforcement**: Each gate MUST validate inputs from upstream gates before proceeding.
- **Gate Isolation**: No gate may write outside its scoped artifact directory.
- **Commit Discipline**: Only the Developer gate may create git commits.

## Technical Constraints

- **TypeScript + Bun**: No Python or other runtime dependencies.
- **Zero External API Dependencies for Core Logic**: Domain layer has no network dependencies.
- **LLM via OpenCode**: CrewGate does not manage its own API keys — it routes through OpenCode's LLM infrastructure.
- **Performance Budget**: Gate execution should complete within 30s for Level 0-2, 120s for Level 3-4.

## Security Constraints

- **Filesystem Isolation**: Writes scoped to `.crewgate/artifacts/<slug>/<gate>/` only.
- **No Credential Storage**: API keys from environment only, never written to disk.
- **Git Safety**: Tags prefixed `crewgate/`, uses `git revert`, never `git reset --hard`.

## Compliance & Governance

- **ADR Required**: Any structural change to pipeline, gate contracts, or routing requires an ADR.
- **Audit Trail**: All gate verdicts and artifacts are per-feature and immutable after gate completion.
- **Licensing**: MIT License.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||