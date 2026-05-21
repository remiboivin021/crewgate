# Unit Tests

Scope, conventions, and rules for unit-level validation. CrewGate uses Vitest as the test runner with Bun as the runtime.

---

## Stack

| Aspect | Choice |
|--------|--------|
| Framework | Vitest |
| Runtime | Bun 1.x (via `bun test`) |
| Location | `tests/` mirroring `src/` structure |
| Naming | `*.test.ts` |
| Coverage | Defined per module in `overlay.yaml` (planned) |

---

## What Unit Tests Cover

Test these in isolation, without network, filesystem, or external services:

- **Domain logic** — all business rules, state transitions, calculations
- **Input validation** — boundary values, malformed input, type enforcement
- **Branching behavior** — conditionals, error paths, edge cases
- **Port interface contracts** — argument types, return types, error signatures
- **Pure functions** — anything deterministic given the same inputs

Domain logic (`src/domain/`) must have zero external dependencies — this makes unit testing straightforward. No mocking needed for pure domain code.

---

## What Unit Tests Avoid

| Pitfall | Why |
|---------|-----|
| Mocking external services | Use integration tests instead |
| Testing implementation details | Test behavior, not function internals |
| Testing generated code | Test the generator, not its output |
| Testing configuration wiring | Config loading is covered by integration tests |
| Snapshot-heavy tests | Fragile — prefer assertion-based tests |

---

## Conventions

### File placement

```
tests/
├── domain/
│   ├── GateOrchestrator.test.ts
│   ├── PolicyEngine.test.ts
│   └── model/
│       ├── Gate.test.ts
│       └── Feature.test.ts
├── ports/
│   └── inbound/
│       └── ICommandPort.test.ts
└── adapters/
    └── outbound/
        └── FileSystemAdapter.test.ts
```

### Naming

- File: `ModuleName.test.ts`
- Describe block: `describe('ModuleName', ...)`
- Test description: describes expected behavior, not the code path
  ```typescript
  // Good
  it('rejects a feature with no description', ...)

  // Bad
  it('calls validate() and returns false', ...)
  ```

### Structure a test file

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature', () => {
  it('rejects a feature with no description', () => {
    const feature = createFeature({ description: '' })
    expect(feature.isValid()).toBe(false)
  })

  it('accepts a well-formed feature request', () => {
    const feature = createFeature({ description: 'Add login' })
    expect(feature.isValid()).toBe(true)
  })
})
```

---

## Running Tests

```bash
# Run all tests
bun test

# Run with watch mode
bun test --watch

# Run a specific test file
bun test tests/domain/GateOrchestrator.test.ts

# Run with coverage
bun test --coverage
```

---

## Coverage Targets

Coverage targets are defined per module (planned). General guideline:

| Layer | Target |
|-------|--------|
| Domain logic | 90%+ line coverage |
| Port interfaces | 80%+ line coverage |
| Adapters | 70%+ line coverage |
| E2E | N/A (measured separately) |

These are targets, not hard gates. Preflight does not block on coverage thresholds (planned for future CI policy).

---

## Related

- `e2e_tests.md` — Integration and end-to-end testing
- `docs/engineering/standards.md` — Testing section
- `docs/engineering/tooling/build.md` — Build toolchain

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
