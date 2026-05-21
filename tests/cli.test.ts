import { describe, expect, it, vi } from "vitest";
import { VERSION, loadManifest, main } from "../src/index.ts";

describe("crewgate scaffold", () => {
  it("should export version 0.1.0", () => {
    expect(VERSION).toBe("0.1.0");
  });

  it("should load plugin manifest", () => {
    const manifest = loadManifest();
    expect(manifest).not.toBeNull();
    expect(manifest!.name).toBe("crewgate");
    expect(manifest!.version).toBe("0.1.0");
  });

  it("should print help on --help", async () => {
    const logs: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((msg: string) => {
      logs.push(msg);
    });
    await main(["--help"]);
    expect(logs.some((l) => l.includes("Usage"))).toBe(true);
    spy.mockRestore();
  });

  it("should print version on --version", async () => {
    const logs: string[] = [];
    const spy = vi.spyOn(console, "log").mockImplementation((msg: string) => {
      logs.push(msg);
    });
    await main(["--version"]);
    expect(logs.some((l) => l.includes("0.1.0"))).toBe(true);
    spy.mockRestore();
  });

  it("should reject unknown command", async () => {
    const exitCode = vi.fn();
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code: number): never => {
      exitCode(code);
      throw new Error(`exit ${code}`);
    });
    const errs: string[] = [];
    vi.spyOn(console, "error").mockImplementation((msg: string) => {
      errs.push(msg);
    });

    await expect(main(["bogus"])).rejects.toThrow();
    expect(errs.some((l) => l.includes("unknown command"))).toBe(true);

    exitSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
