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
import { join, normalize, relative } from "path";
import type { IArtifactPort } from "../../ports/outbound/IArtifactPort";

export class ScopedArtifactPort implements IArtifactPort {
  private readonly featureRoot: string;

  constructor(
    artifactsRoot: string,
    private readonly slug: string,
    private readonly currentGate: string,
    private readonly completedGates: string[],
  ) {
    this.featureRoot = join(artifactsRoot, slug);
    mkdirSync(join(this.featureRoot, currentGate), { recursive: true });
  }

  async write(path: string, content: string): Promise<void> {
    const resolved = this.resolveInsideGate(path);
    writeFileSync(resolved, content);
  }

  async read(path: string): Promise<string> {
    for (const gate of this.completedGates) {
      const candidate = join(this.featureRoot, gate, path);
      if (existsSync(candidate)) {
        return readFileSync(candidate, "utf-8");
      }
    }
    throw new Error(`ARTIFACT_NOT_FOUND: ${path}`);
  }

  private resolveInsideGate(path: string): string {
    const gateRoot = join(this.featureRoot, this.currentGate);
    const resolved = normalize(join(gateRoot, path));
    const rel = relative(gateRoot, resolved);
    if (rel.startsWith("..") || rel.includes("../")) {
      throw new Error("ARTIFACT_SCOPE_VIOLATION");
    }
    mkdirSync(gateRoot, { recursive: true });
    return resolved;
  }
}
