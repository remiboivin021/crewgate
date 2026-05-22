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
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { main, loadManifest, VERSION } from "../src/index.ts";
import { DynamicRouter } from "../src/domain/DynamicRouter.ts";
import { GateOrchestrator } from "../src/domain/GateOrchestrator.ts";
import { StateManager } from "../src/domain/StateManager.ts";
import { AgentRunner } from "../src/domain/AgentRunner.ts";
import { ScopedArtifactPort } from "../src/adapters/outbound/ScopedArtifactPort.ts";
import { assertSafeGitOperation, resolveApiKey } from "../src/domain/security.ts";
import type { ILLMPort } from "../src/ports/outbound/ILLMPort.ts";

class StubLLM implements ILLMPort {
  async complete(prompt: string): Promise<string> {
    return `stub:${prompt.slice(0, 32)}`;
  }
}

function scaffoldRuntime(root: string): void {
  mkdirSync(join(root, "personas"), { recursive: true });
  mkdirSync(join(root, "behaviors"), { recursive: true });

  const gates = ["ceo", "cto", "techlead", "developer", "qa", "security", "release"];
  for (const gate of gates) {
    writeFileSync(join(root, "personas", `${gate}.md`), `# ${gate}\n`);
    writeFileSync(join(root, "behaviors", `${gate}.yaml`), `mode: standard\n`);
  }

  writeFileSync(join(root, "personas", "cto-archi.md"), "# cto-archi\n");
}

describe("crewgate v0.1 runtime", () => {
  let cwd: string;
  let tmpRoot: string;

  beforeEach(() => {
    cwd = process.cwd();
    tmpRoot = mkdtempSync(join(tmpdir(), "crewgate-test-"));
    scaffoldRuntime(tmpRoot);
    process.chdir(tmpRoot);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.chdir(cwd);
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("exports version and manifest metadata", () => {
    expect(VERSION).toBe("0.1.0");
    const manifest = loadManifest();
    expect(manifest).not.toBeNull();
    expect(manifest!.name).toBe("crewgate");
    expect(manifest!.version).toBe("0.1.0");
  });

  it("creates feature state and prints the slug", async () => {
    const logs: string[] = [];
    vi.spyOn(console, "log").mockImplementation((message?: unknown) => {
      logs.push(String(message));
    });

    await main(["feat", "new", "Add authentication migration"]);

    const stateDir = join(tmpRoot, ".crewgate", "state");
    const stateFiles = [readFileSync(join(stateDir, "add-authentication-migration.json"), "utf-8")];
    expect(stateFiles[0]).toContain('"slug":"add-authentication-migration"');
    expect(logs.some((line) => line.includes("add-authentication-migration"))).toBe(true);
  });

  it("runs the bugfix pipeline and persists gate outputs", async () => {
    await main(["feat", "new", "Fix login bug"]);
    await main(["run", "fix-login-bug"]);

    const rawState = readFileSync(
      join(tmpRoot, ".crewgate", "state", "fix-login-bug.json"),
      "utf-8",
    );
    expect(rawState).toContain('"status":"COMPLETED"');
    expect(rawState).toContain('"flow":"bugfix"');
    expect(rawState).toContain('"completedGates":["ceo","developer","qa","release"]');

    expect(
      readFileSync(
        join(tmpRoot, ".crewgate", "artifacts", "fix-login-bug", "developer", "artifact.txt"),
        "utf-8",
      ),
    ).toContain("developer");
  });

  it("reports status for one feature and for all features", async () => {
    await main(["feat", "new", "Fix login bug"]);
    const logs: string[] = [];
    vi.spyOn(console, "log").mockImplementation((message?: unknown) => {
      logs.push(String(message));
    });

    await main(["status", "fix-login-bug"]);
    await main(["status"]);

    expect(logs.some((line) => line.includes("fix-login-bug"))).toBe(true);
    expect(logs.some((line) => line.includes("PENDING"))).toBe(true);
  });

  it("classifies structural and security-sensitive work deterministically", () => {
    const router = new DynamicRouter();

    expect(router.classify({ id: "1", title: "Fix login bug", description: "Regression" })).toEqual({
      level: 1,
      flow: "bugfix",
    });
    expect(
      router.classify({
        id: "2",
        title: "Add architecture rewrite",
        description: "rewrite module boundaries",
      }),
    ).toEqual({
      level: 4,
      flow: "structural",
    });
    expect(
      router.classify({
        id: "3",
        title: "Add authentication policy",
        description: "security hardening",
      }),
    ).toEqual({
      level: 3,
      flow: "security",
    });
  });

  it("rejects artifact path traversal outside the current gate scope", async () => {
    const adapter = new ScopedArtifactPort(join(tmpRoot, ".crewgate", "artifacts"), "sample", "developer", [
      "ceo",
    ]);

    await expect(adapter.write("../escape.txt", "bad")).rejects.toThrow(/scope/i);
  });

  it("reads API keys from environment only", () => {
    expect(() =>
      resolveApiKey("OPENAI_API_KEY", {}, { OPENAI_API_KEY: "from-config" }),
    ).toThrow(/missing_api_key/i);

    expect(resolveApiKey("OPENAI_API_KEY", { OPENAI_API_KEY: "from-env" }, {})).toBe("from-env");
  });

  it("rejects unsafe git reset operations", () => {
    expect(() => assertSafeGitOperation("git reset --hard HEAD~1")).toThrow(/unsafe_git_operation/i);
  });

  it("executes the level-2 feature route without the security gate", async () => {
    const stateManager = new StateManager(join(tmpRoot, ".crewgate", "state"));
    const runner = new AgentRunner(new StubLLM(), tmpRoot);
    const orchestrator = new GateOrchestrator(
      stateManager,
      runner,
      new DynamicRouter(),
      join(tmpRoot, ".crewgate", "artifacts"),
    );

    await orchestrator.run({
      id: "sample-feature",
      slug: "sample-feature",
      title: "Add dashboard",
      description: "A medium feature",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      status: "PENDING",
      completedGates: [],
      artifactsRoot: join(tmpRoot, ".crewgate", "artifacts", "sample-feature"),
    });

    const saved = stateManager.load("sample-feature");
    expect(saved.completedGates).toEqual([
      "ceo",
      "cto",
      "techlead",
      "developer",
      "qa",
      "release",
    ]);
    expect(saved.flow).toBe("feature");
    expect(saved.level).toBe(2);
  });

  it("executes all seven gates for a security-sensitive route", async () => {
    const stateManager = new StateManager(join(tmpRoot, ".crewgate", "state"));
    const runner = new AgentRunner(new StubLLM(), tmpRoot);
    const orchestrator = new GateOrchestrator(
      stateManager,
      runner,
      new DynamicRouter(),
      join(tmpRoot, ".crewgate", "artifacts"),
    );

    await orchestrator.run({
      id: "auth-policy",
      slug: "auth-policy",
      title: "Add authentication policy",
      description: "security hardening",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      status: "PENDING",
      completedGates: [],
      artifactsRoot: join(tmpRoot, ".crewgate", "artifacts", "auth-policy"),
    });

    const saved = stateManager.load("auth-policy");
    expect(saved.completedGates).toEqual([
      "ceo",
      "cto",
      "techlead",
      "developer",
      "qa",
      "security",
      "release",
    ]);
    expect(saved.flow).toBe("security");
    expect(saved.level).toBe(3);
  });
});
