# Passation Codex (2026-10-26)

## Situation
Dépôt public `goldaj/vtube-physics-lab` créé par propriétaire, initialement README/LICENSE. `develop` initialisée, cadrage, architecture, plan et journal. L'incubateur possède deux idées proches : `jeux/vtube-physics-lab.md` et `ia-et-multimedia/live2d-remote-lab.md`. Elles sont unifiées **dans ce dépôt**, pour ne pas multiplier les projets couvrant AI Replay et Physics Lab.

## Fonctions retenues
AI Replay, Auto Demo, VTS Simulator, Physics Lab; téléphone sans caméra ni PC connecté après publication/download (mode offline); physics ajustable. 2026-10-26 : le propriétaire ajoute explicitement des **vêtements 2D interchangeables avec adaptation de la déformation et de la physique sans rig manuel**. Dans les vieux échanges retrouvés, cette exigence n'était pas attestée mot à mot. C'est un objectif de R&D, pas une capacité existante.

## Source de vérité technique
- docs/AUTO_CLOTHING.md : état de l'art + H0-H4, transfert de déformations et repères.
- docs/EXPERIMENTS.md : tests falsifiables, métriques de stabilité et coût manuel.
- docs/TASKS.md : phases sans dispersion.
- docs/CHATGPT_PROJECT_HISTORY.md : verbatim authentique et résumés anciens non verbatim.

## Sécurité
Ne pas ajouter Cubism Core propriétaire, `.moc3` tiers ou assets personnels dans Git. Pas de connexion automatique à VTube Studio (autorisation). Le harnais ne prouve ni rendu réel Cubism, ni bonne déformation d'un vrai vêtement.

## Convention
Branches `feat/*`, PR brouillon vers develop, tests continus; Codex peut reprendre avec références commits, succès CI et commandes exactes à compléter à mesure du développement. Ne pas fusionner sans revue.

## Premier code écrit / revue CI
- [PR #1](https://github.com/goldaj/vtube-physics-lab/pull/1) : `feat/replay-clothing-spike`, corps synthétique, vêtements interchangeables par PNG/canvas, paramètres et replay JSON versionné.
- [Actions CI](https://github.com/goldaj/vtube-physics-lab/actions/runs/40372532646) : **8 tests Node + syntaxe verts** après ajout du fichier `web/app.mjs`. L'exécution de base 40372132724 a échoué **uniquement car web/app.mjs n'avait pas encore été ajouté**, pas à cause des algorithmes; vérifié dans les logs.
- Aucun test navigateur manuel, smartphone, ni vrai modèle Live2D ou VTS exécuté à cette date. La géométrie d'un vêtement PNG reste un benchmark sur corps synthétique.
- L'idée Live2D Remote Lab décrivait aussi **audio distant** et **connexion hors réseau local**; contexte complet transféré dans `docs/LEGACY_LIVE2D_REMOTE_LAB.md`, sans affirmer que ces fonctions sont déjà codées.
- Ne pas oublier `docs/AUTO_CLOTHING.md` : le transfert de déformation vers vraie peau / ArtMeshes reste un problème non résolu. Voir aussi PSD2Live et ses capacités déjà proches de l'auto-rig.
