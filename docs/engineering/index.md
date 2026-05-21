# Engineering Index

Entry point for engineering practices and contributor-facing operational standards.

## Contents

### [standards.md](standards.md)

Coding and repository conventions for the CrewGate project:

- **Stack** — TypeScript 5.x strict, Bun 1.x, ESM
- **Architecture** — Hexagonal (ports and adapters), domain has zero external dependencies
- **Code style** — explicitness, const over let, async/await, no JS private fields
- **Testing** — Vitest, `tests/` directory, coverage targets
- **Commits** — Conventional Commits (`type(scope): description`), one task = one commit
- **Documentation** — Markdown in `docs/`, TypeDoc for API, YAML for behaviors, Mermaid for diagrams
- **Governance** — ADR required for structural changes, invariants I-01 through I-03
- **File conventions** — LF line endings, camelCase/PascalCase/kebab-case, 2-space YAML

### [newcomer_guide.md](newcomer_guide.md)

Onboarding guide for new contributors:

- **What is CrewGate** — multi-agent pipeline orchestrator (v0.1 scaffold)
- **Setup** — clone, `bun install`, `bun run crewgate --version`
- **Project structure** — src/, personas/, behaviors/, specs/, docs/, tests/
- **Reading path** — PROJECT.md → AGENTS.md → user-guide/ → specs/
- **First-day checklist** — browse personas/, run tests, build
- **Validation** — `bun run test`, `bun run build`
- **Commit rules** — one per logical change, conventional format

### [artifact_provenance.md](artifact_provenance.md)

Traceability for build and generated outputs:

- **Tracking per artifact** — origin, generator, inputs, validation, retention
- **Artifact types** — builds (dist/), test reports, release notes, generated documentation (site/)
- **Purpose** — ensure every output can be traced back to its source

### [external_project_usage.md](external_project_usage.md)

How CrewGate can be reused or embedded by other projects:

- **Stable surface** — ICommandPort, ILLMPort, PipelineConfig
- **Integration** — npm package, OpenCode plugin interface
- **Questions** — what is stable, what is mandatory, what is private
- **Principle** — document the narrowest supported interface, not internal details

### [user-guide/](user-guide/index.md)

User-facing documentation for CrewGate v0.1:

- **Installation** — prerequisites, build from source, directory structure
- **Quick Start** — intended workflow: `feat new` → `run` → `status`
- **CLI Reference** — commands, options, exit codes (scaffold-only)
- **Pipeline & Gates** — design of the 7 gates (CEO → Release), personas, behaviors, filesystem isolation
- **Personas** — 7 gate prompts + 4 adversary definitions
- **Behaviors** — YAML profiles: tone, heuristics, constraints, context overrides
- **Routing** — levels (0-4), flows (bugfix/feature/structural/security), Cupcake classification design
- **Configuration** — `plugin.config.yaml` (design reference, not consumed yet)

---

| Maintainer/Author | Last modified |
|-------------------|---------------|
| Rémi Boivin       | 2026-05-22    |
