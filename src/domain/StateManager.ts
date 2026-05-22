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

import { mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { Feature } from "./model/Feature";

export class StateManager {
  constructor(private readonly stateRoot: string = join(process.cwd(), ".crewgate", "state")) {
    mkdirSync(this.stateRoot, { recursive: true });
  }

  getCurrentState(slug?: string): Feature | Feature[] | null {
    return slug ? this.load(slug) : this.list();
  }

  create(feature: Feature): Feature {
    this.save(feature);
    return feature;
  }

  load(slug: string): Feature {
    const path = this.getStatePath(slug);
    const parsed = JSON.parse(readFileSync(path, "utf-8")) as Feature;
    this.assertValid(parsed);
    return parsed;
  }

  list(): Feature[] {
    return readdirSync(this.stateRoot)
      .filter((entry: string) => entry.endsWith(".json"))
      .map((entry: string) => this.load(entry.replace(/\.json$/, "")));
  }

  save(feature: Feature): void {
    this.assertValid(feature);
    const path = this.getStatePath(feature.slug);
    mkdirSync(dirname(path), { recursive: true });
    const tmpPath = `${path}.tmp`;
    writeFileSync(tmpPath, JSON.stringify(feature));
    renameSync(tmpPath, path);
  }

  updateState(feature: Feature, patch: Partial<Feature>): Feature {
    const updated: Feature = {
      ...feature,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.save(updated);
    return updated;
  }

  private getStatePath(slug: string): string {
    return join(this.stateRoot, `${slug}.json`);
  }

  private assertValid(feature: Feature): void {
    const required = [
      feature.id,
      feature.slug,
      feature.title,
      feature.description,
      feature.createdAt,
      feature.updatedAt,
      feature.status,
      feature.artifactsRoot,
    ];
    if (required.some((value) => !value) || !Array.isArray(feature.completedGates)) {
      throw new Error("INVALID_STATE");
    }
  }
}
