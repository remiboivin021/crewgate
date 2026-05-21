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

import { IArtifactPort } from '../../ports/outbound/IArtifactPort';
import * as fs from 'fs/promises';

/**
 * Implements IArtifactPort
 *
 * @initialis 2026/05/21
 * @author Remi Boivin
 */
export class FileSystemAdapter implements IArtifactPort {
  /**
   * Writes content to a file on disk
   * @param path - File path
   * @param content - Content to write
   */
  async write(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  /**
   * Reads content from a file on disk
   * @param path - File path
   * @returns {Promise<string>}
   */
  async read(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8');
  }
}
