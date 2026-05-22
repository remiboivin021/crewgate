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
import type { Feature, PipelineFlow, PipelineLevel } from "./model/Feature";

export interface RouteClassification {
  level: PipelineLevel;
  flow: PipelineFlow;
}

export class DynamicRouter {
  classify(feature: Pick<Feature, "title" | "description">): RouteClassification {
    const text = `${feature.title} ${feature.description}`.toLowerCase();

    if (/(auth|security|vulnerability|cve)/.test(text)) {
      return { level: 3, flow: "security" };
    }

    if (/(architecture|rewrite)/.test(text)) {
      return { level: 4, flow: "structural" };
    }

    if (/(migration|module|database)/.test(text)) {
      return { level: 3, flow: "structural" };
    }

    if (/(fix|bug|hotfix|regression)/.test(text)) {
      return { level: 1, flow: "bugfix" };
    }

    if (/(doc|markdown|readme)/.test(text) && text.split(/\s+/).length < 50) {
      return { level: 0, flow: "feature" };
    }

    return { level: 2, flow: "feature" };
  }
}
