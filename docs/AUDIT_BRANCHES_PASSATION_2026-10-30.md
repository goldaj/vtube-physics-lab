# Audit GitHub et passation VTube Physics Lab — 30/10/2026

## Mission
Laboratoire **autonome** pour comparer la physique Live2D/VTube Studio et explorer l'ajustement automatique des vêtements 2D. Différent de Jade (produit personnage) et d'un lecteur Live2D distant. Ne pas interpréter des métriques sur replays comme une validation visuelle Cubism/VTube Studio ; distinguer simulation de rig réel.

## Branches (cible par défaut `main`)
- `main` : `e0ccda7bb2c3f0ea63a1dd885b0fdfa03f2d74e6` ; branche de référence, ne pas toucher à l'application sans validation.
- `develop` : `7fc21840d6f54df418a99df41fd0a66cc6fce10c` ; `diverged`, ahead 38, behind 8. Travail non absorbé par main ; conserver pour recherche ou intégration après tests.
- `feat/replay-clothing-spike` : `a1f124c8a3baf01f4f7541434614b7a508e41c99` ; `diverged`, ahead 8, behind 8. Travail non absorbé par main ; conserver pour recherche ou intégration après tests.
- `research/gpt6-garment-quality-20261027` : `1471b94f2f69fa008dc40ad654b4ae44fe165887` ; `diverged`, ahead 24, behind 8. Travail non absorbé par main ; conserver pour recherche ou intégration après tests.
- `research/gpt6-universal-auto-clothing-plan-20261027` : `62e8ce5d42e351b468850616aeaa77aea4a089e6` ; `diverged`, ahead 37, behind 8. Travail non absorbé par main ; conserver pour recherche ou intégration après tests.

## PR
- [#7](https://github.com/goldaj/vtube-physics-lab/pull/7) : fusionnée ; `research/gpt6-universal-auto-clothing-plan-20261027` → `develop`.
- [#6](https://github.com/goldaj/vtube-physics-lab/pull/6) : fermée sans fusion ; `research/gpt6-garment-quality-20261027` → `feat/replay-clothing-spike`.
- [#1](https://github.com/goldaj/vtube-physics-lab/pull/1) : fermée sans fusion ; `feat/replay-clothing-spike` → `develop`.

## Critique du travail courant
- Vérifier les différences `develop` versus `main` : le code de recherche/garment peut être intégré à `develop` sans être prêt pour `main`. Ne pas fusionner tout l'arbre par facilité.
- Les vêtements interchangeables doivent conserver alignement, collision, attache et déformation sous posture/animation, **sans rig manuel obligatoire** ; c'est une cible, pas une capacité prouvée.
- Sur les replays, contrôler déterminisme sur seeds identiques, invariants physiques, collisions entre vêtements/corps et artefacts de déformation. Tester Cubism/VTS sur poste réel, mesurer erreurs et limites d'API/licence.
- Vérifier la PR #7 et ses E0–E13 comme programme de recherche, pas livraison complète. Préserver sources 2D natives et préférences de l'utilisateur.

## Prochain agent
Lire README (« # vtube-physics-lab »), AGENTS.md, docs/PROJECT_INTENT_FROM_INCUBATOR.md et docs/CHATGPT_PROJECT_HISTORY.md ; inspecter la roadmap d'auto-clothing et les fixtures. Exécuter tests numériques puis rendre/observer des cas difficiles avec outils officiels ; documenter résultats reproductibles, sans annoncer une IA de rig entièrement automatique. Aucun test local n'a été exécuté ni aucune branche fusionnée/supprimée pendant cette passe.
