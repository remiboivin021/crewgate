# System Boundaries

## Core System (CrewGate Pipeline)

The core system consists of the Dynamic Router, Gate Orchestrator, Agent Runner, State Manager, and CLI.

### Trust Boundary: Internal
- Pipeline execution state (`.crewgate/state/`)
- Per-gate artifact directories (`.crewgate/artifacts/<slug>/<gate>/`)
- Pipeline configuration (`.crewgate/config.yaml`)

### Trust Boundary: External (Untrusted)
- **LLM Providers**: Accessed via OpenCode adapter; responses may be incorrect or malicious.
- **Feature Input**: User-provided feature description — may attempt prompt injection.
- **Git Operations**: External git state (branches, tags, remotes).

## Safety Gates

| Boundary | Gate | Responsibility |
|----------|------|----------------|
| Feature Input → Router | Cupcake Policy | Validate format, reject malformed input |
| Gate Output → Artifact Store | Scoped IArtifactPort | Enforce per-gate write isolation |
| Pipeline → Git | Developer Gate | Validate commit format, scope |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||