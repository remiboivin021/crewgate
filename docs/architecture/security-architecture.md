# Security Architecture

## Threat Model

| Threat | Source | Impact | Mitigation |
|--------|--------|--------|------------|
| API key leak | Artifacts, git | Credential exposure | Keys from env only, never logged, never in artifacts |
| Gate scope violation | LLM writes outside artifact dir | File corruption, scope creep | Scoped IArtifactPort per gate |
| Downstream gate trust | Gate accepts invalid upstream artifact | Cascade failure | Each gate validates format + type + schema |
| Input poisoning | Crafted feature description | Wrong routing/decision | Cupcake policy validation |
| Policy escape | Malicious Rego | Arbitrary code execution | Cupcake runs in isolated Wasm, no filesystem access |
| Supply chain | Compromised dependency | Full compromise | Lockfile, pinned versions, minimal dependencies |

## Trust Boundaries

- **Internal (Trusted)**: `.crewgate/state/`, `.crewgate/artifacts/`, `.crewgate/config.yaml`
- **External (Untrusted)**: Feature input (user), LLM responses (OpenCode), git state
- **Read-Only**: `personas/`, `behaviors/`, `policies/` — loaded at startup

## Filesystem Isolation

```
.crewgate/artifacts/<slug>/<gate>/  # writable by current gate only
.crewgate/state/<slug>.json         # writable by pipeline manager only
personas/                           # read-only (loaded at startup)
behaviors/                          # read-only (loaded at startup)
policies/                           # read-only (loaded by Cupcake at startup)
```

## Key Management

CrewGate does not manage LLM API keys. All LLM calls are routed through OpenCode's existing LLM infrastructure. No keys are stored, logged, or written to artifacts by CrewGate.

## Git Safety

- No git config modification
- Tags prefixed `crewgate/` — namespace isolated from user tags
- Only Developer gate creates commits; all other gates are read-only on git
- Commit format enforced: `type(scope): description`

## Cupcake Policy Sandbox

- No filesystem access in Rego
- No network access
- Stateless evaluation: input → rule → output
- Policy directory read-only at startup

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    |