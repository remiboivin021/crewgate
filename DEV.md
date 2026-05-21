# Development Guide

How to set up, build, and develop on CrewGate.

---

## Stack

| Aspect | Choice |
|--------|--------|
| Language | TypeScript 5.x (strict, ES2022) |
| Runtime | Bun 1.x |
| Package manager | Bun |
| Module system | ESM |
| Architecture | Hexagonal (ports and adapters) |
| Tests | Vitest |
| E2E tests | Vitest + execa (CLI process tests) |
| Docs | MkDocs + Material theme |
| Diagrams | PlantUML (C4), Mermaid |

---

## Prerequisites

- **Bun** 1.x — install: `curl -fsSL https://bun.sh/install | bash`
- **Git** 2.x
- **Node** 18+ (only for MkDocs — not needed for the TypeScript project itself)

---

## Setup

```bash
git clone git@github.com:remiboivin021/crewgate.git
cd crewgate
bun install
```

### Documentation site (Python/MkDocs)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs build --strict
```

---

## Project Structure

```
crewgate/
├── src/                   # TypeScript source (hexagonal)
│   ├── domain/           # Business logic — zero external deps
│   ├── ports/            # Port interfaces (inbound/outbound)
│   └── adapters/         # Adapter implementations
├── tests/                # Vitest tests mirroring src/
├── docs/                 # MkDocs documentation site
│   ├── architecture/     # C4 models, system boundaries
│   ├── engineering/      # Standards, tooling, testing
│   ├── governance/       # Constitution, levels, workflows, ADRs
│   └── ...
├── specs/                # NLSpec specifications
├── AGENTS.md             # OpenCode routing + config
├── AGENTS.override.md    # Project-specific overrides
├── .opencode/            # OpenCode skills and constitution
└── mkdocs.yml            # Documentation site config
```

---

## Commands

```bash
bun run <script>       # Run a package.json script
bun test               # Run all tests (Vitest)
bun run test:e2e       # Run E2E CLI process tests
mkdocs build --strict  # Build documentation site
```

---

## Development Workflow

This repository uses a governed multi-agent pipeline. Every feature change follows a sequence of gates before code is written.

### Quick path (10-second summary)

1. Create a worktree: `git worktree add ../wt-feat -b feature/my-thing`
2. Work inside it, never on main/develop
3. OpenCode handles triage → planner → gates → preflight → coder → QA → review
4. One task = one commit
5. Run `mkdocs build --strict` and `bun test` before merging

### Full reference

| Topic | Where |
|-------|-------|
| Governance pipeline | `docs/governance/quickstart.md` |
| Change levels (L1/L2/L3) | `docs/governance/levels.md` |
| Execution flows | `docs/governance/workflows.md` |
| OpenCode config | `docs/engineering/tooling/opencode/` |
| Testing conventions | `docs/engineering/tooling/testing/` |
| Documentation rules | `docs/engineering/tooling/documentation-rules.md` |
| Git workflow | `GIT.md` |

---

## Validation

```bash
# TypeScript
bun test                          # Unit + integration
bun run test:e2e                  # E2E CLI tests

# Documentation
mkdocs build --strict             # Must pass before merge

# Code style
bunx biome check src/             # Lint + format (if configured)
```

---

## Architecture Principles

- **Hexagonal** — domain has zero external dependencies
- **Ports** define contracts (inbound: commands/config/events; outbound: LLM/artifacts/notifications)
- **Adapters** implement ports — swappable without domain changes
- **No JS private fields** — use TypeScript `private`

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
