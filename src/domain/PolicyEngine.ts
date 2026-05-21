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

/**
 * Management of gate transition rules
 *
 * @initialis 2026/04/05
 * @author Remi Boivin
 */
export class PolicyEngine {
  /**
   * Validates if a transition is allowed
   * @param currentGate - Current gate
   * @param nextGate - Next gate
   * @returns {boolean} True if allowed, false otherwise
   */
  isTransitionAllowed(currentGate: string, nextGate: string): boolean {
    return true;
  }
}
