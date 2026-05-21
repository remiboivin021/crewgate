# Tooling Summary

## Language & Runtime

- **TypeScript** 5.x with strict mode, ES2022 target, ESM modules
- **Bun** 1.x — runtime, package manager, test runner

## Build & Test

- **TypeScript compiler** (`tsc`) for production builds
- **Vitest** for unit and integration tests

## Documentation

- **MkDocs** with Material theme for the documentation site
- **Mermaid** and **PlantUML** for diagrams
- **TypeDoc** for API documentation

## AI & Governance

- **OpenCode** for AI-agent governance and orchestration
- **Cupcake** (Rego/Wasm) for policy enforcement (planned)

## Pages

### [build.md](build.md)

Build tooling configuration — compilers, formatters, linters. (Template stub — to be filled with CrewGate-specific TS/Bun toolchain once established.)

### [testing/](testing/unitest.md)

Test strategy split across two files:

- **[unitest.md](testing/unitest.md)** — unit-level validation: deterministic business logic, input validation, branching behavior, error handling. Do NOT test implementation-coupled code as substitute for behavioral coverage.
- **[e2e_tests.md](testing/e2e_tests.md)** — end-to-end validation: critical user journeys, boundary integrations, high-risk cross-component regressions. Do NOT test logic that can be validated faster at a lower level.

### [documentation-rules.md](documentation-rules.md)

Rules for maintaining the project documentation — MkDocs structure, diagram conventions, review process. (Template stub.)

### [opencode/](opencode/index.md)

How OpenCode is configured and used in the CrewGate project:

- **Project config** — AGENTS.md, AGENTS.override.md, constitution
- **Skills** — all 14 skills with descriptions and veto rights
- **Working artifacts** — STATE, TODO, DECISIONS files
- **Execution flows** — feature, bugfix, structural, security-sensitive
- **Practical workflow** — triage → preflight → coder → qa → review → release
- **Commit discipline** — format, hard gates, one task = one commit
- **Rules** — minimal change, no opportunistic refactor, scope discipline, drift, precedence

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
