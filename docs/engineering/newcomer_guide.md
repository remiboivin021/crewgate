# Newcomer Guide

This document helps a new contributor get productive without relying on implicit project knowledge.

## What is CrewGate?

CrewGate is a multi-agent pipeline orchestrator for OpenCode — a deterministic 7-gate pipeline (CEO→CTO→TechLead→Dev→QA→Security→Release) that coordinates AI agents to produce verified software changes. See `PROJECT.md` for the full overview.

**Status:** v0.1 scaffold. The CLI commands exist, persona prompts and behavior profiles are defined. Pipeline execution is not implemented yet.

## Setup

```sh
git clone <repo-url>
cd crewgate
bun install
bun run crewgate --version
```

## Project structure

```
src/              # TypeScript source (hexagonal architecture)
  domain/         #   Business logic (GateOrchestrator, AgentRunner, StateManager, PolicyEngine)
  ports/          #   Interface definitions (inbound + outbound)
  adapters/       #   Implementations (CLI, filesystem, git, etc.)
personas/         # LLM prompt files for each gate agent
behaviors/        # YAML behavior profiles (tone, heuristics, constraints)
specs/            # Normative specifications (gates, cross-cutting, operations, security)
docs/             # Documentation site (MkDocs)
tests/            # Test files (Vitest)
plugin.config.yaml  # Gate pipeline configuration (design reference)
```

## Reading path

1. `PROJECT.md` — project identity, scope, constraints
2. `AGENTS.md` — AI agent routing (if working with AI assistance)
3. `docs/engineering/user-guide/` — user-facing documentation (installation, CLI, pipeline, personas, behaviors, routing, configuration)
4. `specs/overview.md` — pipeline architecture and routing design
5. `specs/gates/` — per-gate specifications
6. `specs/operations/` — structure, rules, config, telemetry

## Key source files

| File | What it does |
|------|-------------|
| `src/index.ts` | CLI entry point, command routing |
| `src/domain/GateOrchestrator.ts` | Pipeline orchestration (scaffold) |
| `src/domain/AgentRunner.ts` | LLM agent execution (scaffold) |
| `src/domain/StateManager.ts` | Pipeline state persistence (scaffold) |
| `src/ports/` | Interface contracts |
| `src/adapters/` | I/O implementations |

## First-day checklist

- [ ] Read `PROJECT.md`
- [ ] Run `bun install` and `bun run crewgate --help`
- [ ] Browse `personas/` to understand the 7 gate agents
- [ ] Browse `behaviors/` to understand behavior profiles
- [ ] Read `specs/overview.md` for pipeline architecture
- [ ] Run `bun run test` to verify test suite passes
- [ ] Run `bun run build` to verify compilation

## Validation paths

| Action | Command |
|--------|---------|
| Run unit tests | `bun run test` |
| Build TypeScript | `bun run build` |
| Build docs site | see `docs/tooling/documentation-rules.md` |
| Lint / typecheck | `bun run typecheck` (if configured) |

## Committing

- One commit per logical change
- Format: `type(scope): description`
- See conventional commits and `AGENTS.md` for commit rules

## Questions?

Open an issue or ask the maintainer (Rémi Boivin).

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
