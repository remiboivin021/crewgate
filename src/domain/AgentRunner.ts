// Copyright 2026 CrewGate.
//
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.opensource.org/licenses/mit// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ILLMPort } from "../ports/outbound/ILLMPort";
import type { Feature } from "./model/Feature";
import type { Gate } from "./model/Gate";

export class AgentRunner {
  constructor(
    private readonly llmPort: ILLMPort,
    private readonly repoRoot: string = process.cwd(),
  ) {}

  async run(gate: Gate, feature: Feature, upstreamArtifacts: string[]): Promise<string> {
    const personaPath = join(this.repoRoot, gate.personaPath);
    const behaviorPath = join(this.repoRoot, gate.behaviorPath);

    if (!existsSync(personaPath)) {
      throw new Error(`MISSING_PERSONA: ${gate.id}`);
    }

    if (!existsSync(behaviorPath)) {
      throw new Error(`MISSING_BEHAVIOR: ${gate.id}`);
    }

    const persona = readFileSync(personaPath, "utf-8").trim();
    const behavior = readFileSync(behaviorPath, "utf-8").trim();
    const prompt = [
      `gate=${gate.id}`,
      `title=${feature.title}`,
      `description=${feature.description}`,
      `persona=${persona}`,
      `behavior=${behavior}`,
      `upstream=${upstreamArtifacts.join("\n") || "none"}`,
    ].join("\n");

    const completion = await this.llmPort.complete(prompt);
    return JSON.stringify({
      gate: gate.id,
      title: feature.title,
      level: feature.level ?? null,
      flow: feature.flow ?? null,
      completion,
    });
  }
}
