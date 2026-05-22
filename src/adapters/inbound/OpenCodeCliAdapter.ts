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

import type { ICommandPort } from "../../ports/inbound/ICommandPort";
import type { Feature } from "../../domain/model/Feature";
import { GateOrchestrator } from "../../domain/GateOrchestrator";

/**
 * Implements ICommandPort via opencode hooks
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export class OpenCodeCliAdapter implements ICommandPort {
  constructor(private orchestrator: GateOrchestrator) {}

  /**
   * Starts the pipeline for a feature
   * @param feature - Feature to process
   */
  async run(feature: Feature): Promise<void> {
    await this.orchestrator.run(feature);
  }

  /**
   * Resumes the pipeline at a given step
   * @param gateId - Step identifier
   */
  async resume(gateId: string): Promise<void> {
    await this.orchestrator.resume(gateId);
  }

  /**
   * Retrieves the current orchestrator status
   */
  status(slug?: string): any {
    return this.orchestrator.getStatus(slug);
  }
}
