# Interfaces & Contracts

## Internal Port Interfaces

### ICommandPort (Inbound)

```typescript
interface ICommandPort {
  run(feature: FeatureDescriptor): Promise<PipelineResult>
  status(slug?: string): Promise<PipelineStatus[]>
}
```

### IConfigPort (Inbound)

```typescript
interface IConfigPort {
  load(): PipelineConfig
}
```

### ILLMPort (Outbound)

```typescript
interface ILLMPort {
  complete(prompt: Prompt): Promise<Completion>
}
```

### IArtifactPort (Outbound)

```typescript
interface IArtifactPort {
  write(filename: string, content: string): Promise<void>
  read(filename: string): Promise<string>
  list(gate: string): Promise<string[]>
}
```

### IRouterPort (Outbound)

```typescript
interface IRouterPort {
  classify(feature: FeatureDescriptor): RouteClassification
}

type RouteClassification = {
  level: 0 | 1 | 2 | 3 | 4
  flow: 'bugfix' | 'feature' | 'structural' | 'security'
}
```

## External Contracts

| Contract | Protocol | Consumer |
|----------|----------|----------|
| Cupcake Policy Evaluation | Rego/Wasm via Cupcake CLI | IRouterPort |
| OpenCode LLM | OpenCode plugin interface | ILLMPort (default adapter) |
| Filesystem | POSIX file API via Bun | IArtifactPort |
| Git | `git` CLI via Bun.spawn | IArtifactPort (commit adapter) |

## User Interfaces

- **CLI**: Primary interface — `crewgate` command with subcommands.
- **Plugin Manifest**: `.opencode/plugins/crewgate.json` for OpenCode integration.

---

| Author      | Last modified |
|-------------|---------------|
| Rémi Boivin | 2026-05-21    ||