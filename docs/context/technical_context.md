# Technical Context

## Core Stack

- **Primary Language**: TypeScript 5.x
- **Runtime**: Bun 1.x
- **CLI Framework**: Bun built-in (Bun.argv / Bun.write)
- **Package Manager**: Bun

## Pipeline Architecture

- **Pattern**: Hexagonal (domain/ports/adapters)
- **Router**: Cupcake policy engine (Rego compiled to Wasm)
- **Gate Execution**: Deterministic sequence with per-gate persona injection
- **State**: JSON-based (`.crewgate/state/<slug>.json`), machine-first

## Testing & Validation

- **Unit/Integration**: Vitest
- **E2E**: Playwright
- **Static Analysis**: TypeScript strict mode, ESLint
- **Architecture Validation**: Sentrux (DSM, health gate)

## AI/LLM Integration

- **Provider**: Routes through OpenCode's LLM infrastructure (no own API key management)
- **Adapter Pattern**: `ILLMPort` implemented by adapters (Claude, OpenAI, local)
- **Prompt System**: Persona files (`personas/*.md`) + behavior profiles (`behaviors/*.yaml`) injected per gate

## Storage

- **Artifacts**: `.crewgate/artifacts/<slug>/<gate>/` — per-gate scoped
- **State**: `.crewgate/state/<slug>.json` — pipeline checkpoint
- **Telemetry**: `.crewgate/telemetry/<YYYY-MM-DD>.jsonl` — append-only events
- **Benchmark**: `.crewgate/benchmark/results.json` + `delta.md`

## Deployment

- **Distribution**: npm package (primary)
- **CI/CD**: GitHub Actions
- **Runtime**: Self-hosted (no cloud dependency)

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||