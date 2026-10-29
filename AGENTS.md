> **État consolidé 29/10/2026 :** les travaux de la PR #6 (mesures de qualité) sont désormais dans la branche de la PR #7 avec le prototype #1. Les mentions « séparé » ci-dessous sont historiques ; la PR #7 est l'unique entrée de reprise pour Codex.

## Avis à Codex : nouvelle cible auto-clothing sans limite de familles (27/10/2026)

**PR #7 (brouillon, documentaire)** : https://github.com/goldaj/vtube-physics-lab/pull/7
Branche autonome research/gpt6-universal-auto-clothing-plan-20261027, fondée sur feat/replay-clothing-spike, **PR sœur de PR #6**. La nouvelle demande est l'habillage 2D automatique de modèles humanoïdes animés de différentes corpulences, à terme pour **tout vêtement représentable**, sans rig manuel par tenue et avec fonctionnement réel sur VTube Studio. Les six exemples cités ne sont **pas** une taxonomie fermée.

Lire EN PREMIER : docs/auto-clothing/00-PRODUCT-CONTRACT.md → 01-BACKLOG-E0-E6.md → 02-BACKLOG-E7-E13.md → 03-EXPERIMENT-DESIGN.md → 04-CODEX-HANDOFF.md ; puis les consignes préexistantes ci-dessous. Ce nouveau programme comprend 14 étapes, 56 sous-étapes et 224 actions atomiques **proposées, non réalisées**. Ne pas inventer de compatibilité Cubism/VTS ; ne pas fusionner automatiquement et ne pas toucher au code de PR #1/PR #6 ou aux assets sous licence.

---


---

# Contribution expérimentale GPT6 du 27/10/2026, uniquement sur cette branche

La PR [#6](https://github.com/goldaj/vtube-physics-lab/pull/6), branche `research/gpt6-garment-quality-20261027`, **dépend de la PR #1** (`feat/replay-clothing-spike`), cible directement cette dernière et ne demande aucun merge automatique. Elle ajoute une instrumentation quantitative **sans modifier les algorithmes de physique/maillage de la PR #1**. Avant reprise Codex, lire `docs/GARMENT_QUALITY_BENCHMARK.md`, les tests `tests/garment-quality.test.mjs` et `tests/garment-benchmark.test.mjs`, puis la PR #6 et ses statuts CI. Les métriques ne valident ni un vrai vêtement sans rig ni une intégration Cubism. Ne pas confondre seuil expérimental et résultat objectif d'acceptation humaine. Pas d'asset tiers, de connexion VTS ni de déploiement.

---

# Instructions de travail : VTube Physics Lab

## But réel
Laboratoire de paramètres Live2D local + mobile, sans caméra, avec **AI Replay**, **Auto Demo**, **VTS Simulator**, **Physics Lab**, sauvegarde/rejeu et physique réglable. Le projet réunit les idées `vtube-physics-lab` et `live2d-remote-lab` de l'incubateur. **Recherche majeure : vêtements dessinés/importés en 2D, interchangeables et déformés automatiquement sans rig manuel**, spécifiée le 26/10/2026. La compatibilité réelle Live2D est une hypothèse à démontrer.

## Règles Codex / ChatGPT
- Lire README, docs/PRODUCT.md, docs/AUTO_CLOTHING.md, docs/EXPERIMENTS.md, docs/TASKS.md, docs/HANDOFF.md, docs/CHATGPT_PROJECT_HISTORY.md avant de coder.
- `develop` contient la documentation de cadrage; fonctionnalités sur `feat/*` et PR en brouillon, **aucun merge automatique sans revue**.
- Tests déterministes, exemples synthétiques et sans secrets. Séparer *hypothèse*, *code avec tests unitaires*, *test manuel navigateur*, *intégration réelle Live2D/VTS*; la CI ne valide pas un véritable modèle Cubism.
- Ne jamais embarquer/distribuer `Cubism Core` propriétaire ou un `.moc3`/PSD/PNG personnel ou tiers sans droit, ni portabilité téléphonique inventée.
- Demander autorisation par API VTube Studio; pas de connexion VTS ni de caméra implicites. Garder un fonctionnement autonome sans caméra possible.
- Documenter les vrais échanges utilisateurs et résumés historiques (pas de faux verbatim), ainsi que liens PR/SHA/tests et limitations dans `docs/CHATGPT_PROJECT_HISTORY.md`.
- Ne pas reconstruire inutilement le moteur de rendu Live2D : prototyper géométrie/physique uniquement comme harnais de mesure; utiliser Cubism SDK légalement obtenu pour le rendu final.
- Expériences vêtement : mesurer glissement, collision, contour sous mouvement, stabilité FPS et taux d'interventions manuelles, pas seulement une photo flatteuse.
- Documentation de reprise exacte dans `docs/HANDOFF.md`; penser à maintenir `docs/TASKS.md` à chaque tranche.

## Sécurité
Interdiction d'ajouter secrets, informations de comptes, modèles/assets privés, données de production. Les paramètres de rejeu IA éventuellement sensibles doivent rester locaux, sans téléversement implicite.

## État courant / lien Codex
Lire d'abord [docs/CODEX_ACTIVE_WORK.md](docs/CODEX_ACTIVE_WORK.md). Les fonctionnalités et tests sont sur une PR en brouillon distincte, non sur develop.

## Point d'entrée Codex sur la branche de réalisation
Lire [docs/CODEX_ACTIVE_WORK.md](docs/CODEX_ACTIVE_WORK.md) pour retrouver la PR active et les tests. Les changements de code de cette branche sont expérimentaux et **non fusionnés** sur develop.
