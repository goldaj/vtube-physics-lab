## Extension expérimentale, 27/10/2026, PR #6 non fusionnée

**P3-Q, instrumentation de recherche pour Codex** : ajout sur branche séparée du diagnostic de maillage (triangles inversés/écrasés, ratios d'aire et d'arêtes, glissement d'ancrage), séquences horodatées et rapport synthétique AI Replay. Voir `docs/GARMENT_QUALITY_BENCHMARK.md`. **Code et tests proposés, validation navigateur/Cubism et calibrage des seuils à faire.** La priorité reste un vrai test P3/P4 avec asset autorisé, et non le nombre de tests unitaires. Les tâches historiques ci-dessous décrivent le plan de la PR #1 lors de sa création, pas un état de livraison fusionné sur develop.

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
