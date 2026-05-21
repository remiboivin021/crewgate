# Architecture Overview

## The CrewGate Pipeline

CrewGate is a standalone 7-gate pipeline orchestrator. It operates independently of OpenCode skills — `crewgate run` is the single entry point for execution.

### Architecture Pattern

Hexagonal (ports and adapters) — domain logic has zero external dependencies. All I/O goes through defined port interfaces implemented by adapters.

### 1. Dynamic Router (Cupcake/Rego)

Classifies each feature request by level (0-4) and flow (bugfix/feature/structural/security). Routing is deterministic — same inputs always produce same classification. Uses Rego policies compiled to WebAssembly via Cupcake.

### 2. Gate Pipeline

```
Level 0:           Commit direct
Level 1 bugfix:    CEO → Dev → QA → Release
Level 2:           CEO → CTO → TechLead → Dev → QA → Release
Level 3-4:         CEO → CTO → TechLead → Dev → QA → Security → Release
```

### 3. State & Artifact Management

- State: Single JSON file per feature (`.crewgate/state/<slug>.json`)
- Artifacts: Per-gate directory (`.crewgate/artifacts/<slug>/<gate>/`)

### 4. CLI Entry Points (v0.1)

| Command | Description |
|---------|-------------|
| `crewgate feat new "<desc>"` | Create feature branch + state |
| `crewgate run <slug>` | Execute pipeline |
| `crewgate status [slug]` | Show pipeline state |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||