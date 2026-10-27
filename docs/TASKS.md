## Nouveau programme cible auto-clothing générique (PR #7, 27/10/2026)

**Objectif non borné par les six premières catégories** : modèle humanoïde 2D animé, morphologies variées, vêtement importé sans rig individuel, niveaux L0 mannequin → L1 vrai Live2D → L2 VTS fonctionnel → L3 généralisations sur types de vêtements inconnus. Les catégories exemple T-shirt, pull, pantalon, short, jupe, robe servent seulement à qualifier les premiers jalons.

**Source détaillée actuelle :** docs/auto-clothing/00-PRODUCT-CONTRACT.md ; 01-BACKLOG-E0-E6.md ; 02-BACKLOG-E7-E13.md ; 03-EXPERIMENT-DESIGN.md ; 04-CODEX-HANDOFF.md. **E0–E13** = 14 étapes de recherche, 56 sous-étapes, 224 actions atomiques. Toutes au stade « À faire/proposé » dans cette contribution de documentation. Les anciennes entrées P0–P8 ci-dessous restent historiquement pertinentes mais ne suffisent plus comme décomposition exhaustive de la nouvelle cible. Ne pas effacer les décisions ou code de PR #1/PR #6.

# Roadmap — 2026-10-26

| ID | Livrable | État |
|---|---|---|
| P0 | Vision unifiée Physics Lab + Live2D Remote Lab, modes, vêtements auto | Cadrage |
| P1 | Schéma de replay versionné, interpolation, tests Node | À coder |
| P2 | Harnais navigateur : replay, auto demo, sliders physique, corps fictif | À coder |
| P3 | Garment benchmark: image 2D et déformation sans rig vestimentaire manuel | À coder comme expérience, **sans promettre Cubism** |
| P4 | Rendu réellement connecté à Cubism SDK Web avec assets autorisés | Étude d'intégration |
| P5 | Mode VTS Simulator (protocole, consentement, noms paramètres) | Étude d'intégration |
| P6 | Cache PWA du shell de laboratoire | Code ajouté, **non validé sur téléphone ni hors réseau** ; données utilisateur non persistées |
| P6b | Cloud/versioning et audio distant entre PC et téléphone | Étude; besoin conservé dans LEGACY_LIVE2D_REMOTE_LAB.md |
| P7 | AI Replay en provenance d'un agent IA concret | Étude |
| P8 | Auto Clothing sur vrai modèle/PSD + métriques | R&D majeure, conditionnée par P3/P4 |

## Suite utile
1. Écrire replay déterministe + tests.
2. Démo contrôlable avec corps générique, paramètres et synthèse sans caméra.
3. Étudier transfert d'une PNG vers mesh et physique à attaches, tester quels mouvements fonctionnent réellement.
4. Vérifier licences, choix d'un asset de test public et contraintes SDK avant chargement de modèle réel.
5. Ne pas multiplier les modes/dépendances avant de pouvoir rejouer exactement la même entrée, noter conditions de la comparaison.
