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

import { INotifierPort } from '../../ports/outbound/INotifierPort';
import { Gate } from '../../domain/model/Gate';

/**
 * Implements INotifierPort
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export class SlackAdapter implements INotifierPort {
  /**
   * Sends a notification to a Slack channel
   * @param gate - Concerned gate
   * @param result - Result to notify
   */
  async notify(gate: Gate, result: any): Promise<void> {
    // TODO: Send Slack notification
  }
}
