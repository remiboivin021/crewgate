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

import { join } from "path";
import { ScopedArtifactPort } from "../adapters/outbound/ScopedArtifactPort";
import type { Feature } from "./model/Feature";
import type { Gate, GateId } from "./model/Gate";
import { AgentRunner } from "./AgentRunner";
import { DynamicRouter } from "./DynamicRouter";
import { StateManager } from "./StateManager";

export class GateOrchestrator {
  constructor(
    private readonly stateManager: StateManager,
    private readonly agentRunner: AgentRunner,
    private readonly router: DynamicRouter,
    private readonly artifactsRoot: string = join(process.cwd(), ".crewgate", "artifacts"),
  ) {}

  async run(feature: Feature): Promise<Feature> {
    const classification = feature.level !== undefined && feature.flow
      ? { level: feature.level, flow: feature.flow }
      : this.router.classify(feature);

    let current = this.stateManager.updateState(feature, {
      level: classification.level,
      flow: classification.flow,
      status: "IN_PROGRESS",
      currentGate: null,
    });

    for (const gateId of this.getGateSequence(classification.level, classification.flow)) {
      if (current.completedGates.includes(gateId)) {
        continue;
      }

      const gate = this.makeGate(gateId);
      current = this.stateManager.updateState(current, { currentGate: gateId });
      const artifacts = new ScopedArtifactPort(
        this.artifactsRoot,
        current.slug,
        gateId,
        current.completedGates,
      );
      const upstreamArtifacts = await Promise.all(
        current.completedGates.map(async (completedGate) => {
          try {
            return await artifacts.read("artifact.txt");
          } catch {
            return completedGate;
          }
        }),
      );
      const output = await this.agentRunner.run(gate, current, upstreamArtifacts);
      await artifacts.write("artifact.txt", output);
      current = this.stateManager.updateState(current, {
        completedGates: [...current.completedGates, gateId],
      });
    }

    return this.stateManager.updateState(current, {
      status: "COMPLETED",
      currentGate: null,
    });
  }

  async resume(slug: string): Promise<Feature> {
    const feature = this.stateManager.load(slug);
    return this.run(feature);
  }

  getStatus(slug?: string): Feature | Feature[] | null {
    return this.stateManager.getCurrentState(slug);
  }

  private getGateSequence(level: number, flow: string): GateId[] {
    if (flow === "bugfix" && level <= 1) {
      return ["ceo", "developer", "qa", "release"];
    }
    if (level <= 2) {
      return ["ceo", "cto", "techlead", "developer", "qa", "release"];
    }
    return ["ceo", "cto", "techlead", "developer", "qa", "security", "release"];
  }

  private makeGate(id: GateId): Gate {
    const personaPath = id === "cto" ? "personas/cto-archi.md" : `personas/${id}.md`;
    return {
      id,
      name: id,
      personaPath,
      behaviorPath: `behaviors/${id}.yaml`,
      status: "PENDING",
    };
  }
}
