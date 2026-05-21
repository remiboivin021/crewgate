# CLI Reference

> **v0.1 — Design Blueprint.** This guide documents the intended architecture and workflow. No pipeline execution, state management, or LLM integration is implemented yet.

## Usage

```
crewgate <command> [subcommand] [options]
```

## Commands

### `feat new "<description>"`

Intended to declare a new feature and initialize pipeline state.

```
crewgate feat new "Add user authentication with OIDC"
```

Designed to create:
- Feature slug (auto-generated from description)
- Feature branch `feat/<slug>`
- Pipeline state file `.crewgate/state/<slug>.json`

### `run <slug>`

Intended to execute the pipeline for a previously declared feature.

```
crewgate run add-user-authentication-with-oidc
```

Designed to classify the feature by level (0-4) and flow (bugfix/feature/structural/security) via the Dynamic Router, then execute the corresponding gate sequence. Each gate would produce artifacts in `.crewgate/artifacts/<slug>/<gate>/`.

### `status [slug]`

Intended to show pipeline state.

```
crewgate status                    # all features
crewgate status <slug>             # specific feature
```

## Global options

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show help message |
| `--version`, `-v` | Show version (`0.1.0`) |

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success (help, version) |
| 1 | Error (invalid input, missing arguments) |

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-22    |
