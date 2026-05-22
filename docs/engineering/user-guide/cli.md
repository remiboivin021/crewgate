# CLI Reference

> **v0.1 runtime.** The local pipeline core is implemented for `feat new`, `run`, and `status`.

## Usage

```
crewgate <command> [subcommand] [options]
```

## Commands

### `feat new "<description>"`

Creates a feature slug and initializes local pipeline state.

```
crewgate feat new "Add user authentication with OIDC"
```

Creates:
- Feature slug (auto-generated from description)
- Pipeline state file `.crewgate/state/<slug>.json`
- Runtime directories under `.crewgate/`

### `run <slug>`

Executes the pipeline for a previously declared feature.

```
crewgate run add-user-authentication-with-oidc
```

The runtime classifies the feature by level (`0-4`) and flow (`bugfix`, `feature`, `structural`, `security`) via the deterministic router, then executes the corresponding gate sequence. Each gate writes an artifact in `.crewgate/artifacts/<slug>/<gate>/artifact.txt`.

Current gate routing:

- level 1 bugfix: `ceo -> developer -> qa -> release`
- level 2 feature: `ceo -> cto -> techlead -> developer -> qa -> release`
- level 3/4 structural or security: `ceo -> cto -> techlead -> developer -> qa -> security -> release`

### `status [slug]`

Shows pipeline state.

```
crewgate status                    # all features
crewgate status <slug>             # specific feature
```

The command prints the stored JSON state for the requested feature, or the array of all feature states when no slug is provided.

## Global options

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show help message |
| `--version`, `-v` | Show version (`0.1.0`) |

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success (help, version) |
| 1 | Error (invalid input, missing arguments, missing state, or security/runtime failure) |

## Security rules

- API keys are read from environment variables only.
- Artifacts are sandboxed to `.crewgate/artifacts/<slug>/<gate>/`.
- Reset-based rollback is forbidden; `git reset --hard` is rejected by the runtime safety layer.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
