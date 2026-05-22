// Copyright 2026 CrewGate.
//
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.opensource.org/licenses/mit
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { AgentRunner } from "./domain/AgentRunner";
import { DynamicRouter } from "./domain/DynamicRouter";
import { GateOrchestrator } from "./domain/GateOrchestrator";
import type { Feature } from "./domain/model/Feature";
import { StateManager } from "./domain/StateManager";
import type { ILLMPort } from "./ports/outbound/ILLMPort";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const VERSION = "0.1.0";

const MANIFEST_PATH = join(__dirname, "..", ".opencode", "plugins", "crewgate.json");

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  entrypoint: string;
  commands: Array<{
    name: string;
    subcommands?: string[];
    description: string;
  }>;
  permissions: string[];
}

export function loadManifest(): PluginManifest | null {
  if (!existsSync(MANIFEST_PATH)) return null;
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
}

const HELP_TEXT = `
CrewGate v${VERSION} — Multi-agent pipeline orchestrator for OpenCode

Usage:
  crewgate feat new "<desc>"    Create feature branch + state
  crewgate run <slug>           Execute pipeline for a feature
  crewgate status [slug]        Show pipeline state for one or all features

Options:
  --help                        Show this help message
  --version                     Show version
`;

function printHelp(): void {
  console.log(HELP_TEXT.trim());
}

function printVersion(): void {
  console.log(`CrewGate v${VERSION}`);
}

class LocalLLMAdapter implements ILLMPort {
  async complete(prompt: string): Promise<string> {
    return `local:${prompt.slice(0, 48)}`;
  }
}

function getRepoRoot(): string {
  return process.cwd();
}

function ensureRuntimeScaffold(root: string): void {
  const runtimeDirs = [
    ".crewgate/state",
    ".crewgate/artifacts",
    ".crewgate/archive",
    ".crewgate/telemetry",
    "policies",
    "personas",
    "behaviors",
  ];
  for (const dir of runtimeDirs) {
    mkdirSync(join(root, dir), { recursive: true });
  }

  const configPath = join(root, ".crewgate", "config.yaml");
  if (!existsSync(configPath)) {
    writeFileSync(
      configPath,
      [
        "runtime:",
        "  entrypoint: crewgate run",
        "  state_dir: .crewgate/state",
        "  artifacts_dir: .crewgate/artifacts",
      ].join("\n"),
    );
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function buildRuntime(root: string): { stateManager: StateManager; orchestrator: GateOrchestrator } {
  ensureRuntimeScaffold(root);
  const stateManager = new StateManager(join(root, ".crewgate", "state"));
  const orchestrator = new GateOrchestrator(
    stateManager,
    new AgentRunner(new LocalLLMAdapter(), root),
    new DynamicRouter(),
    join(root, ".crewgate", "artifacts"),
  );
  return { stateManager, orchestrator };
}

async function cmdFeatNew(desc: string): Promise<void> {
  const root = getRepoRoot();
  const { stateManager } = buildRuntime(root);
  const slug = slugify(desc);
  const now = new Date().toISOString();
  const path = join(root, ".crewgate", "state", `${slug}.json`);

  if (existsSync(path)) {
    throw new Error(`FEATURE_ALREADY_EXISTS: ${slug}`);
  }

  const feature: Feature = {
    id: slug,
    slug,
    title: desc,
    description: desc,
    createdAt: now,
    updatedAt: now,
    status: "PENDING",
    currentGate: null,
    completedGates: [],
    artifactsRoot: join(root, ".crewgate", "artifacts", slug),
  };

  stateManager.create(feature);
  console.log(`[crewgate] created feature ${slug}`);
}

async function cmdRun(slug: string): Promise<void> {
  const root = getRepoRoot();
  const { stateManager, orchestrator } = buildRuntime(root);
  const feature = stateManager.load(slug);
  const completed = await orchestrator.run(feature);
  console.log(
    `[crewgate] completed ${completed.slug} level=${completed.level} flow=${completed.flow} gates=${completed.completedGates.join(",")}`,
  );
}

async function cmdStatus(slug?: string): Promise<void> {
  const root = getRepoRoot();
  const { orchestrator } = buildRuntime(root);
  const status = orchestrator.getStatus(slug);
  console.log(JSON.stringify(status));
}

export async function main(args: string[]): Promise<void> {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    return;
  }

  if (args[0] === "--version" || args[0] === "-v") {
    printVersion();
    return;
  }

  const cmd = args[0];

  switch (cmd) {
    case "feat": {
      const sub = args[1];
      if (sub === "new") {
        const desc = args.slice(2).join(" ");
        if (!desc) {
          console.error("Error: feat new requires a description");
          console.log("Usage: crewgate feat new \"<description>\"");
          process.exit(1);
          return;
        }
        await cmdFeatNew(desc);
      } else {
        console.error(`Error: unknown subcommand "feat ${sub ?? ""}"`);
        printHelp();
        process.exit(1);
      }
      break;
    }

    case "run": {
      const slug = args[1];
      if (!slug) {
        console.error("Error: run requires a feature slug");
        console.log("Usage: crewgate run <slug>");
        process.exit(1);
        return;
      }
      await cmdRun(slug);
      break;
    }

    case "status": {
      const slug = args[1];
      await cmdStatus(slug);
      break;
    }

    default:
      console.error(`Error: unknown command "${cmd}"`);
      printHelp();
      process.exit(1);
      return;
  }
}

if (process.argv[1] && (process.argv[1].endsWith("crewgate") || process.argv[1].endsWith("index.ts"))) {
  main(process.argv.slice(2)).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
