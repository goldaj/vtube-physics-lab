> **État consolidé 29/10/2026 :** les travaux de la PR #6 (mesures de qualité) sont désormais dans la branche de la PR #7 avec le prototype #1. Les mentions « séparé » ci-dessous sont historiques ; la PR #7 est l'unique entrée de reprise pour Codex.

## Nouveau handoff R&D indépendant — PR #7 (27/10/2026)

Le propriétaire confirme que la finalité n'est **pas six types de vêtements** mais un **solveur 2D générique et extensible** qui habille de multiples corpulences de mannequins humanoïdes puis de vrais modèles animés VTube Studio, sans rig manuel pour chaque tenue. Aucun corpus ou solveur de cette ambition n'a été réalisé dans la présente contribution : elle est **documentaire uniquement**.

PR https://github.com/goldaj/vtube-physics-lab/pull/7, branche research/gpt6-universal-auto-clothing-plan-20261027, base feat/replay-clothing-spike. Lire docs/auto-clothing/00-PRODUCT-CONTRACT.md et 04-CODEX-HANDOFF.md, puis les backlogs et la matrice d'expérience (14 étapes, 56 sous-étapes, 224 actions). La PR #6 quantifie la géométrie synthétique, **elle ne prouve pas la compatibilité VTS**, et ne doit pas être dupliquée. Réévaluer tôt la disponibilité réelle des vertices/landmarks dans Cubism/VTS avant de promettre une injection vestimentaire native.

---


---

## Addendum GPT6 du 27/10/2026 : mesure des défauts de vêtements, en branche distincte

[PR #6](https://github.com/goldaj/vtube-physics-lab/pull/6) `research/gpt6-garment-quality-20261027` → `feat/replay-clothing-spike`. Pure instrumentation de géométrie/replay, **aucun changement de rendu/physique PR #1, aucun véritable modèle Live2D testé**. Le document de reprise technique et protocole est `docs/GARMENT_QUALITY_BENCHMARK.md` sur la PR #6. Les commandes prévues sont `npm run check && npm test && npm run bench:garment` ; ne revendiquer que les validations effectivement réussies. Avant une fusion, vérifier CI et tests visuels, et intégrer d'abord ou conjointement les modules de la PR #1. Ne pas mesurer le « succès auto-rig » avec les seules métriques synthétiques. Le contexte initial ci-dessous est conservé.

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

## Shell mobile PWA (essai code)
- `sw.js` intercepte uniquement des ressources statiques **allowlistées**, aucun asset personnel, et met en cache les modules du laboratoire. `manifest.webmanifest` décrit l'app autonome.
- Enregistrer le service worker sous HTTPS ou localhost. **Aucun test sur vrai téléphone ou lancement offline exécuté** pendant cette session; la présence du code PWA ne suffit pas à démontrer cette fonction. Ne pas promettre sauvegarde automatique des modèles ni sync cloud.

## Exécution rapide
- Windows : depuis la racine du ZIP de la PR, `python -m http.server 8000`, puis `http://localhost:8000/web/`.
- Tests Node 22 : `npm run check && npm test`.
- PR en brouillon avec README et démonstrateur; issues QA #2, vêtements #3, intégration Cubism/VTS #4, mobile/audio #5.
- `sw.js` contrôlé syntaxiquement dans le script check; fonctionnement réel du cache offline **à tester**.
