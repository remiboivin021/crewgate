# PROJECT.md

Ce document sert de source de vérité courte pour présenter le projet, son périmètre, ses contraintes et ses règles d'exécution. Il est conçu pour être lisible rapidement par un humain comme par un agent IA.

## 1. Identité du projet

- Nom du projet : CrewGate
- Type : Multi-agent pipeline orchestrator / CLI
- Statut : active
- Propriétaire : Remi Boivin
- Référent technique : Remi Boivin

## 2. Résumé

CrewGate est un orchestrateur de pipeline multi-agent autonome pour OpenCode. Il exécute une séquence déterministe de 7 gates (CEO→CTO→TechLead→Dev→QA→Security→Release) avec miroir adversarial, prédiction market et validation de fidélité. Point d'entrée unique : `crewgate run`.

## 3. Objectif principal

Fournir un pipeline gated, auditable et déterministe pour les features OpenCode, avec garantie de qualité à chaque étape via des gate agents spécialisés.

## 4. Objectifs secondaires

- Classification automatique des features par niveau (0-4) et flow (bugfix/feature/structural/security).
- Isolation des gates : chaque gate écrit dans son propre répertoire d'artefacts.
- Miroir adversarial : chaque gate est challengée par un adversaire dédié.
- Validation de fidélité : détection de dérive sémantique entre gates via embeddings.

## 5. Hors périmètre

- Modification des skills OpenCode (lecture seule).
- Gestion des clés API LLM (routage via OpenCode).
- Fonctionnalités multi-projets (v0.4+).

## 6. Utilisateurs cibles

- Utilisateur principal : Développeurs utilisant OpenCode pour le développement assisté par IA.
- Parties prenantes : Opérateurs de pipeline CI/CD, relecteurs de qualité.

## 7. Besoin à couvrir

### Contexte

OpenCode fournit des skills spécialisés pour chaque étape de développement (triage, planner, coder, qa, etc.), mais la coordination entre ces étapes est manuelle et non gated. Il n'existe pas de pipeline déterministe qui garantit que chaque étape respecte le scope, valide les contrats et produit des artefacts vérifiables.

### Problème ou manque

Il manque un orchestrateur autonome qui :
- Classe automatiquement une feature request par niveau de complexité.
- Exécute une séquence de gates avec des personae spécialisées.
- Valide la fidélité entre les gates.
- Challenge chaque output avec un adversaire.
- Produit une piste d'audit complète et immuable.

### Impact attendu

Réduction des erreurs de scope, amélioration de la qualité des commits, traçabilité complète des décisions, et exécution reproductible des workflows de développement.

## 8. Proposition de solution

Pipeline hexagonale à 7 gates avec routing dynamique via Cupcake (Rego/Wasm). Chaque gate est un agent avec sa propre persona, son profil de comportement, et son contrat d'entrée/sortie. Trois mécanismes transversaux (prédiction market, fidélité, adversarial) garantissent la qualité à chaque transition.

## 9. Contraintes non négociables

- Fonctionnelles : Pipeline déterministe pour mêmes entrées. Scope enforcement à chaque gate.
- Techniques : TypeScript + Bun. Aucune dépendance externe pour le domaine.
- Sécurité : Isolation filesystem par gate. Pas de stockage de credentials. Télémétrie append-only.
- Gouvernance : Tout changement structurel requiert un ADR.

## 10. Hypothèses

- Les LLM disponibles via OpenCode sont suffisants pour l'exécution des gates.
- La classification par niveau (title/description → Level 0-4) est fiable pour le routing.
- Les embeddings détectent la dérive sémantique entre artefacts de gates adjacentes.

## 11. Risques connus

- Risque : Hallucination LLM dans un verdict de gate
  Impact : élevé
  Mitigation : Adversarial mirror + Fidelity gate + verdict validation par Cupcake.

- Risque : Dérive de scope entre gates
  Impact : moyen
  Mitigation : Fidelity checker avec embedding similarity + scope enforcement.

- Risque : Panne du LLM OpenCode
  Impact : élevé
  Mitigation : Timeout configurable par gate, fail-closed (BLOCK par défaut).

## 12. Contrats publics et interfaces exposées

| Contrat | Emplacement | Politique de compatibilité |
|---------|-------------|----------------------------|
| ICommandPort | `crewgate/src/ports/inbound/ICommandPort.ts` | Additive-only |
| IRouterPort | `crewgate/src/ports/inbound/IRouterPort.ts` | ADR requis |
| ILLMPort | `crewgate/src/ports/outbound/ILLMPort.ts` | Additive-only |
| PipelineConfig | `.crewgate/config.yaml` | Versionné |

## 13. Architecture en une vue

- Entrée : Feature request (description + metadata).
- Traitement : Dynamic Router → Gate pipeline (7 gates) avec cross-cutting checks.
- Sortie : Commits (via Developer gate) + artefacts + télémétrie.
- Persistance : `.crewgate/state/`, `.crewgate/artifacts/`, `.crewgate/telemetry/`.
- Intégrations externes : OpenCode LLM (via adaptateur), Cupcake (Rego/Wasm).

## 14. Stack et environnement

- Langage principal : TypeScript
- Runtime : Bun
- Outils de build : Bun
- Outils de test : Vitest + Playwright
- CI/CD : GitHub Actions

## 15. Organisation du dépôt

| Zone | Rôle |
|------|------|
| `src/` | Logique hexagonale (domain, ports, adapters) |
| `personas/` | Prompts des gate agents (7 gates + 4 adversaries) |
| `behaviors/` | Profils de comportement YAML |
| `policies/` | Règles Cupcake Rego |
| `specs/` | Spécifications normatives |
| `.crewgate/` | Configuration + state + artefacts (runtime) |
| `docs/` | ADRs, Architecture, Contexte |

## 16. Flux de travail attendu

1. `crewgate feat new "description"` → crée state + branche.
2. Dynamic Router classifie (Level + Flow).
3. Pipeline exécute les gates séquentiellement avec validation.
4. Chaque gate produit des artefacts vérifiés par le gate suivant.
5. Developer gate crée le commit. Release gate valide le déploiement.
6. Télémétrie complète disponible via `crewgate log`.

## 17. Critères de réussite

- Pipeline exécute une feature Level 2 complète en <60s.
- Fidelity gate détecte >90% des dérives sémantiques intentionnelles.
- Aucun gate ne peut écrire hors de son répertoire d'artefacts.
- Chaque exécution produit une piste d'audit complète et vérifiable.

## 18. Critères d'acceptation minimum

- `crewgate run <slug>` exécute le pipeline complet.
- `crewgate status` montre l'état actuel.
- `crewgate rollback` annule le dernier commit.
- Les artefacts sont isolés par gate.
- Le pipeline refuse les entrées invalides (format/schema).

## 19. Documentation liée

- README : `README.md`
- Docs architecture : `docs/architecture/`
- Contexte : `docs/context/`
- ADRs : `docs/governance/adr/`

## 20. Instructions pour agents IA

- Lire `AGENTS.md` et `AGENTS.override.md` avant toute action.
- Respecter les contrats d'interface définis dans `specs/`.
- Ne jamais modifier les personae ou behaviors sans validation de fidélité.
- Tout changement structurel au pipeline requiert un ADR.

---
Maintainer/Author: Remi Boivin
Version: 0.1.0
Last modified: 2026-05-21
---
