import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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

async function cmdFeatNew(desc: string): Promise<void> {
  console.log(`[crewgate] feat new — creating feature: "${desc}"`);
  console.log(`[crewgate] (not yet implemented — v0.1 scaffold)`);
}

async function cmdRun(slug: string): Promise<void> {
  console.log(`[crewgate] run — executing pipeline for: ${slug}`);
  console.log(`[crewgate] (not yet implemented — v0.1 scaffold)`);
}

async function cmdStatus(slug?: string): Promise<void> {
  if (slug) {
    console.log(`[crewgate] status — showing state for: ${slug}`);
  } else {
    console.log(`[crewgate] status — showing all features`);
  }
  console.log(`[crewgate] (not yet implemented — v0.1 scaffold)`);
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
  }
}

if (process.argv[1] && (process.argv[1].endsWith("crewgate") || process.argv[1].endsWith("index.ts"))) {
  main(process.argv.slice(2)).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
