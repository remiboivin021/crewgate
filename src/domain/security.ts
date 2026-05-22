// Copyright 2026 CrewGate.
//
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.opensource.org/licenses/mit
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
export function resolveApiKey(
  name: string,
  env: NodeJS.ProcessEnv = process.env,
  _config: Record<string, string> = {},
): string {
  const value = env[name];
  if (!value) {
    throw new Error(`MISSING_API_KEY: ${name}`);
  }
  return value;
}

export function assertSafeGitOperation(command: string): void {
  if (command.includes("git reset --hard")) {
    throw new Error("UNSAFE_GIT_OPERATION: git reset --hard is forbidden");
  }
}
