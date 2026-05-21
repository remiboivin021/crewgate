# AI Safety Context

## Hallucination Mitigation

- **Fidelity Gate**: Checks semantic coherence between upstream and downstream artifacts using embeddings.
- **Adversarial Mirror**: Each gate output is challenged by a dedicated adversary before passing to the next gate.
- **Cupcake Policy**: Deterministic Rego rules enforce routing constraints — not subject to LLM hallucination.

## Trust Boundaries

- **Filesystem Isolation**: Each gate's `IArtifactPort` only allows writes to its own directory and reads from completed upstream gates.
- **Git Safety**: Only the Developer gate writes git commits. All other gates are read-only on git.
- **No Credential Exposure**: API keys come from `process.env` only — never from prompts or artifacts.

## Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|------------|
| LLM timeout | Gate hangs | Configurable timeout per gate, fail-closed |
| Invalid artifact | Downstream gate fails | Each gate validates format + schema of inputs |
| Pipeline crash | State may be inconsistent | State file is atomically written per gate checkpoint |
| Adversarial disagreement | Gate blocked | Adjudicator resolves with deterministic rules |

## Safety Constraints

- **Deterministic Overrides**: All safety-critical decisions (routing, file isolation, git operations) are implemented in deterministic TypeScript, never in LLM prompts.
- **Fail Closed**: If any gate cannot determine a verdict, the default is BLOCK (not PASS).
- **Audit Trail**: Every gate verdict, challenge, and override is recorded in append-only telemetry.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||