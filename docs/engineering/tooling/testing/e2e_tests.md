# End-to-End Tests

Scope, conventions, and rules for end-to-end validation. CrewGate is a CLI tool — E2E testing means spawning the CLI process, running a full pipeline, and asserting on stdout, exit code, and side effects.

Playwright is **not** used here — it is a browser automation framework. CLI tools are tested with Vitest + process execution.

---

## Stack

| Aspect | Choice |
|--------|--------|
| Framework | Vitest |
| Process execution | `execa` (recommended) or `Bun.$` |
| Location | `tests/e2e/` |
| Naming | `*.e2e.ts` |
| CI | GitHub Actions (separate job) |

---

## What E2E Tests Cover

Test the full system as a black box. These validate that components work together correctly:

- **Critical user journeys** — `crewgate run` through all 7 gates, end to end
- **CLI commands** — every command (`run`, `status`, `resume`, `cancel`, `rollback`) with valid and invalid arguments
- **Pipeline recovery** — resume after failure, rollback on validation failure
- **Plugin lifecycle** — install, load, execute, unload
- **Exit codes and error messages** — non-zero exit on failure, meaningful stderr

---

## What E2E Tests Avoid

| Pitfall | Why |
|---------|-----|
| Testing domain logic | Covered by unit tests — E2E is too slow and brittle |
| Testing adapter internals | Covered by integration tests |
| Testing UI/frontend | CrewGate is a CLI tool — no browser UI |
| Flaky assertions | Prefer retry-able checks over exact timing |
| Network-dependent tests | Mock LLM and external services in CI |

---

## Conventions

### File placement

```
tests/
└── e2e/
    ├── pipeline.test.e2e.ts       # Full pipeline run
    ├── resume.test.e2e.ts         # Resume from gate X
    ├── commands.test.e2e.ts       # CLI args, exit codes, --help
    └── plugin.test.e2e.ts         # Plugin load and execute
```

### Naming

- File: `description.test.e2e.ts`
- Test descriptions describe the scenario, not the code.

### Writing an E2E test

```typescript
import { describe, it, expect } from 'vitest'
import { execa } from 'execa'

describe('pipeline', () => {
  it('runs a feature through all gates and produces artifacts', async () => {
    const { stdout, exitCode } = await execa('crewgate', ['run', 'feature:add-login'])
    expect(exitCode).toBe(0)
    expect(stdout).toContain('"status": "passed"')
  })

  it('exits with code 1 and prints error when feature is unknown', async () => {
    const { stderr, exitCode } = await execa('crewgate', ['run', 'nope'], { reject: false })
    expect(exitCode).toBe(1)
    expect(stderr).toContain('unknown feature')
  })

  it('uses Bun.$ for inline execution', async () => {
    const { stdout } = await Bun.$`crewgate status`.quiet()
    expect(stdout).toContain('pipeline')
  })
})
```

---

## Running E2E Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run a specific file
bun run test:e2e tests/e2e/pipeline.test.e2e.ts
```

E2E tests are not run on every commit — they execute in a separate CI job on push to main or release branches.

---

## Test Environment

E2E tests require:

- Clean worktree (test fixtures create and destroy temp repos and worktrees)
- No external LLM calls (use a mock adapter)
- Pre-built CLI binary or `bun run` access

Environment variables:

| Variable | Required | Default |
|----------|----------|---------|
| `CREWGATE_BIN` | No | `bun run src/index.ts` |
| `CREWGATE_WORKTREE` | No | Temp directory |
| `CREWGATE_MOCK_LLM` | Yes for CI | `true` |

---

## CI Configuration (Planned)

```yaml
e2e:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: oven-sh/setup-bun@v2
    - run: bun install
    - run: bun run test:e2e
      env:
        CREWGATE_MOCK_LLM: 'true'
```

---

## When to Add an E2E Test

Add one when:

- A new user-facing command or flow is added
- A cross-component integration changes
- A pipeline gate sequence changes
- A critical failure mode was fixed (regression guard)
- Exit code or error output contract is established

Do NOT add E2E tests for:

- Logic that can be validated at unit or integration level
- Temporary features or experiments
- Configuration edge cases (test those at integration level)

---

## Related

- `unitest.md` — Unit-level testing
- `docs/engineering/standards.md` — Testing section
- `docs/engineering/tooling/build.md` — Build toolchain
- `docs/engineering/tooling/ci.md` — CI pipeline configuration

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
