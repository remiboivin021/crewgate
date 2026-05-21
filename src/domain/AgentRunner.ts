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

import { Gate } from './model/Gate';
import { ILLMPort } from '../ports/outbound/ILLMPort';

/**
 * Execution of an agent with its persona
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export class AgentRunner {
  constructor(private llmPort: ILLMPort) {}

  /**
   * Executes a gate via an LLM agent
   * @param gate - The gate to execute
   * @returns {Promise<string>} The execution result
   */
  async run(gate: Gate): Promise<string> {
    // TODO: Charger la persona et exécuter via LLM
    return "";
  }
}
