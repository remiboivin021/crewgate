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

import { Feature } from '../../domain/model/Feature';

/**
 * Interface for incoming commands (CLI, API)
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export interface ICommandPort {
  /**
   * Starts the pipeline
   * @param feature - Feature to process
   */
  run(feature: Feature): Promise<void>;

  /**
   * Resumes at a given step
   * @param gateId - Step identifier
   */
  resume(gateId: string): Promise<void>;

  /**
   * Retrieves the status
   */
  status(): any;
}
