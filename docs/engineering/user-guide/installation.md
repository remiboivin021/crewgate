# Installation

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. No pipeline execution, state management, or LLM integration is implemented yet.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| [Bun](https://bun.sh) | 1.x | Runtime and package manager |

LLM integration will route through OpenCode's infrastructure once pipeline execution is implemented.

## Install from source

```sh
git clone <repository-url>
cd crewgate
bun install
```

Verify the installation:

```sh
bun run crewgate --version
# CrewGate v0.1.0
```

## Build from source (optional)

```sh
bun run build     # compiles TypeScript → dist/
bun run crewgate --help
```

## Directory structure

```
crewgate/
  src/              # TypeScript source (hexagonal architecture)
  personas/         # Agent prompt files (7 gates + 4 adversary definitions + template)
  behaviors/        # YAML behavior profiles (tone, heuristics, constraints)
  specs/            # Normative specifications
  docs/             # Documentation site
  plugin.config.yaml  # Gate pipeline configuration
```

Runtime directories (`.crewgate/`) will be created by the pipeline engine once implemented.

## Next steps

→ [Quick Start](quickstart.md)
→ [CLI Reference](cli.md)

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
