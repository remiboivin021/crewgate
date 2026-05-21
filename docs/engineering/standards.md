# Engineering Standards

This document captures durable engineering conventions for the CrewGate project.

## Language & Runtime

- **Language:** TypeScript 5.x (strict mode, ES2022)
- **Runtime:** Bun 1.x
- **Package manager:** Bun
- **Module system:** ESM (ESNext modules)

## Architecture

- **Pattern:** Hexagonal (ports and adapters). Domain logic (`src/domain/`) must have **zero external dependencies**.
- **Layer isolation:** Domain never imports from adapters. Adapters implement port interfaces.
- **Inbound ports** define what the domain exposes (commands, config, events).
- **Outbound ports** define what the domain consumes (LLM, artifacts, notifiers).
- **New external dependencies** must be justified. Prefer standard library or Bun built-ins.

## Code style

- Prefer explicitness over implicit behavior.
- No unrelated refactoring during feature work (minimal change rule).
- Use `const` over `let` where possible.
- Async/await over raw promises or callbacks.
- No JS private fields (`#`); use TypeScript `private` where needed.
- Descriptive variable names. Avoid single-letter names except in trivial lambdas.

## Testing

- **Framework:** Vitest
- **Test location:** `tests/` directory, mirroring `src/` structure
- **Naming:** `*.test.ts`
- **Coverage target:** defined per project in `overlay.yaml` (planned)
- Unit tests for domain logic. Integration tests for adapters.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`.

- One logical change per commit.
- Must explain why the modifcation/implementation.

## Documentation

- **Code:** No comments in production code unless the "why" is not obvious from the "what" or for typedoc documentation.
- **Architecture:** Markdown in `docs/` with Mermaid diagrams where helpful.
- **API:** TypeDoc (config: `typedoc.json`).
- **Specifications:** Markdown in `specs/` — normative, versioned.
- **Persona prompts:** Markdown in `personas/` — one file per gate/adversary.
- **Behavior profiles:** YAML in `behaviors/` — tone, heuristics, constraints.

## Documentation site

- Built with MkDocs (Material theme).
- Mermaid and PlantUML for diagrams.
- Run `mkdocs build` to verify no broken links before committing doc changes.

## Governance

- Any structural change requires an ADR (`docs/governance/adr/`).
- Invariants (I-01, I-02, I-03) must not change without an ADR.
- Forbidden areas require explicit architect approval (see `AGENTS.md`).

## File conventions

- No trailing whitespace.
- Unix line endings (LF).
- One statement per line.
- 2-space YAML indentation.
- `camelCase` for variables and functions, `PascalCase` for types and classes, `kebab-case` for filenames.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
