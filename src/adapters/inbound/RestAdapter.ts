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

import { ICommandPort } from '../../ports/inbound/ICommandPort';
import { Feature } from '../../domain/model/Feature';
import { GateOrchestrator } from '../../domain/GateOrchestrator';

/**
 * Implements ICommandPort via HTTP
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export class RestAdapter implements ICommandPort {
  constructor(private orchestrator: GateOrchestrator) {}

  /**
   * Starts the pipeline via a REST request
   * @param feature - Feature to process
   */
  async run(feature: Feature): Promise<void> {
    return this.orchestrator.run(feature);
  }

  /**
   * Resumes the pipeline via a REST request
   * @param gateId - Step identifier
   */
  async resume(gateId: string): Promise<void> {
    return this.orchestrator.resume(gateId);
  }

  /**
   * Retrieves status via REST
   */
  status(): any {
    return this.orchestrator.getStatus();
  }
}
