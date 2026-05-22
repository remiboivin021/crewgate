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

export type PipelineFlow = "bugfix" | "feature" | "structural" | "security";
export type PipelineLevel = 0 | 1 | 2 | 3 | 4;
export type FeatureStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

/**
 * Representation of a feature or change to be processed.
 */
export interface Feature {
  id: string;
  slug: string;
  title: string;
  description: string;
  branch?: string;
  createdAt: string;
  updatedAt: string;
  status: FeatureStatus;
  currentGate?: string | null;
  completedGates: string[];
  artifactsRoot: string;
  level?: PipelineLevel;
  flow?: PipelineFlow;
  lastError?: string;
}
