# Contre-audit et passation — VTube Physics Lab (2026-10-30)

GitHub : 5 branches, 3 PR et racine examinées. **Aucun rig Cubism/Live2D ouvert, aucune simulation matérielle ni VTube Studio lancé** durant cette passe.

## Branches par rapport à main
- `main` : `06a84a90977fb2040972ac3782eea0333cd1c407` ; référence actuellement définie.
- `develop` (`7fc21840d6f54df418a99df41fd0a66cc6fce10c`) : **diverged**, 38 commit(s) exclusif(s), 4 derrière. Branche de développement active : conserver ; review de sa divergence avant merge main.
- `feat/replay-clothing-spike` (`a1f124c8a3baf01f4f7541434614b7a508e41c99`) : **diverged**, 8 commit(s) exclusif(s), 4 derrière. Historique à comparer à develop, sans suppression intuitive.
- `research/gpt6-garment-quality-20261027` (`1471b94f2f69fa008dc40ad654b4ae44fe165887`) : **diverged**, 24 commit(s) exclusif(s), 4 derrière. Historique à comparer à develop, sans suppression intuitive.
- `research/gpt6-universal-auto-clothing-plan-20261027` (`62e8ce5d42e351b468850616aeaa77aea4a089e6`) : **diverged**, 37 commit(s) exclusif(s), 4 derrière. Historique à comparer à develop, sans suppression intuitive.

## PR
- [#7](https://github.com/goldaj/vtube-physics-lab/pull/7) : closed, fusionnée ; [DRAFT][GPT6] Auto-clothing humanoïde extensible : roadmap E0–E13, 224 actions, Live2D/VTS.
- [#6](https://github.com/goldaj/vtube-physics-lab/pull/6) : closed, non fusionnée ; [DRAFT][GPT6] Mesurer les déformations des vêtements 2D sur AI Replay déterministe.
- [#1](https://github.com/goldaj/vtube-physics-lab/pull/1) : closed, non fusionnée ; [WIP] AI Replay déterministe + banc d'essai vêtements 2D auto-déformés.

## Arborescence
`AGENTS.md`, `LICENSE`, `README.md`, `docs`.

## Contradictions techniques à vérifier
1. L'ancienne recherche de vêtements et AI Replay a été absorbée dans `develop`, mais pas nécessairement publiée dans `main`. **Ne pas écraser main ou develop sans tests** et sans vérifier la branche cible effective.
2. Tester les déformations physiques de vêtements 2D sur une suite de mouvements reproductibles, points de fixation, collisions et auto-intersections ; mesurer erreur et dérive dans le temps.
3. Rejouer le banc d'essai déterministe sur différents FPS et hardware, distinguer qualité de simulation et qualité visuelle du rig final.
4. Préserver sources Cubism, meshes, textures, expressions et rigging. Vérifier la licence et les capacités VTube Studio avant toute automatisation par agent.
5. Revisiter la roadmap E0–E13/224 actions : sélectionner un jalon réellement exécuté et démontrable, documenter entrées/sorties et métriques.
6. Le statut Git divergent **n'autorise ni suppression ni merge automatique**, même si des PR sont clôturées. Aucun test physique effectué pendant l'audit.


## Observation CI GitHub (30 octobre 2026)
- [Replay and clothing spike](https://github.com/goldaj/vtube-physics-lab/actions/runs/40919783943) : **success** sur `develop` avant l'audit. Aucune exécution sur la branche par défaut `main` observée dans les trois derniers runs.

Les contrôles ci-dessus ne démontrent ni la validité fonctionnelle en environnement réel ni la publication d'une release. Ne pas substituer ce statut aux tests manuels et matériels prévus dans la passation.
