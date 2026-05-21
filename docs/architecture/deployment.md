# Deployment Model

## Distribution

CrewGate is distributed as an **npm package**. Installation via npm, yarn, or bun:

```bash
bun add crewgate
# or
npm install crewgate
```

## Runtime Requirements

- Bun 1.x (runtime)
- Cupcake CLI (for Rego policy evaluation)
- Git (for commit operations)

## CI/CD

- **Platform**: GitHub Actions
- **Lint**: TypeScript strict check, ESLint
- **Test**: Vitest (unit + integration), Playwright (E2E)
- **Architecture Gate**: Sentrux quality signal check
- **Release**: npm publish on tag

## Self-Hosted Deployment

CrewGate is self-hosted by design — no cloud dependency. The tool runs wherever Bun is available:

- Developer workstation
- CI runner (GitHub Actions, etc.)
- Dedicated build server

## Configuration

```yaml
# .crewgate/config.yaml
pipeline:
  default_level: 2
  default_flow: feature
  timeouts:
    ceo: 30000
    cto: 30000
    techlead: 30000
    developer: 60000
    qa: 30000
    security: 30000
    release: 15000
llm:
  provider: opencode  # routes through OpenCode's LLM
cupcake:
  policy_dir: ./policies
```

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||