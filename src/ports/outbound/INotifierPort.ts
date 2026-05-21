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

import { Gate } from '../../domain/model/Gate';

/**
 * Interface for notifications
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export interface INotifierPort {
  /**
   * Sends a notification
   * @param gate - The concerned gate
   * @param result - The gate result
   */
  notify(gate: Gate, result: any): Promise<void>;
}
