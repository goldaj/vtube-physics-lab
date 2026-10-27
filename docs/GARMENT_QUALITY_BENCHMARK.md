# Research harness: mesures quantitatives des vêtements 2D sans rig manuel

**Date : 27 octobre 2026. Statut : instrumentation synthétique, non validation d'un vrai vêtement Live2D.** Contribution GPT6 isolée `research/gpt6-garment-quality-20261027`, construite au-dessus de `feat/replay-clothing-spike` (PR #1), avec **sa propre PR de revue**. Aucun fichier de la branche d'origine n'est modifié par cette contribution.

## Pourquoi le faire

La PR #1 sait montrer une transformation PNG sur une silhouette synthétique, sans exiger de rig manuel pour chaque vêtement. Cependant, « une robe qui semble acceptable sur une pose » n'est pas une mesure réfutable. Ce harnais donne des indicateurs bruts, déterministes et vérifiables à Codex pour identifier des déformations dangereuses **avant** de comparer des méthodes sur des modèles autorisés.

## Livrables de code

- `src/garment-quality.mjs` : `inspectGarmentFrame(mesh, reference, {pose})`, `inspectGarmentSequence(frames, reference)`, `evaluateQualityGates(report, gates)` (seuils explicitement fournis, aucun score esthétique automatique).
- `src/garment-benchmark.mjs` : `buildSyntheticGarmentReport()`, réutilise `bodyPose`, `garmentMesh`, `simulateHemAt` et `demoReplay/sampleReplay/validateReplay` déjà présents en PR #1. Pas de réimplémentation de la physique existante.
- `tools/run-garment-quality.mjs` : imprime **uniquement** un JSON de rapport synthétique sur stdout. Aucun import d'image privée, caméra, SDK, accès VTube Studio, compte, réseau ni écriture de fichier.
- `tests/garment-quality.test.mjs` : tests de mesure avec cas hostiles ; `tests/garment-benchmark.test.mjs` : même trajectoire exacte et égalité de mesures aux mêmes timestamps malgré le pas de capture différent.
- `package.json` : `npm run check`, `npm test`, `npm run bench:garment`.

## Métrologie, unités et limites

| Champ de rapport | Calcul, unité et signification | Ce que cela ne prouve PAS |
|---|---|---|
| `invertedTriangles` | Nombre maximal de triangles dont l'aire orientée est inversée par rapport au maillage de repos, à un échantillon donné | Pas de collision ni de garantie de rendu visible |
| `collapsedTriangles` | Nombre maximal de triangles dont la double aire absolue est inférieure ou égale à `1e-12`, à un échantillon | Le seuil absolu dépend de la normalisation |
| `min/maxAreaRatio` | `abs(signedArea(mesh) / signedArea(rest))` par triangle ; sans unité | Un ratio proche de 1 n'assure pas une texture non déformée |
| `min/maxEdgeStretch` | Longueur d'arête déformée / longueur de repos ; sans unité | Ce n'est pas la déformation matérielle d'un vrai tissu |
| `maxAnchorSlip` | Distance euclidienne des deux coins supérieurs à `shoulderLeft/right`, en **coordonnées Canvas normalisées** | Les épaules du mannequin PR #1 sont connues : un glissement nul dans ce test est largement structurel, non une réussite de détection sur un vrai avatar |
| `maxVertexSpeedPerSec` | Plus grande vitesse apparente d'un point du maillage entre deux captures, unités Canvas normalisées/seconde | Inclut le mouvement demandé du corps, n'est ni le jerk ni une mesure absolue de l'absence de saccades ; dépend du pas de mesure |

**Note importante** : inversions et effondrements sont deux comptes disjoints dans une frame ; ils ne doivent pas être additionnés au nombre de triangles ayant « une anomalie quelconque » sans méthode de regroupement. Les maxima de la séquence ne signifient pas que tous les incidents surviennent au même instant. Les sources `reference` et `mesh` doivent partager les UV exacts et une topologie rectangulaire identique ; le contrôleur rejette sinon. Une référence dégénérée est refusée, plutôt que de créer une division infinie.

**Garde-fous opt-in** : `evaluateQualityGates` exige des seuils explicites (`maxEdgeStretch`, `minAreaRatio`, etc.). Il refuse une métrique inconnue, non finie ou indisponible. Aucun seuil de validité esthétique universelle n'est livré ; des paramètres choisis a posteriori ne peuvent pas prouver un edge.

## Exécution et reproductibilité

```bash
npm run check
npm test
npm run bench:garment
```

Démonstration par défaut : `demoReplay()` de 8 000 ms (préexistante), pose et maillage `6 x 6`, ressort à paramètres de la PR #1, captures à `200 ms` avec instant final inclus. JSON standardisé `vtube-garment-quality-synthetic-v1`. Durée du benchmark limitée à 15 s et intervalle borné à 20…2000 ms pour éviter de multiplier des simulations depuis t=0 sans budget. Toutes les métriques sont horodatées, et l'échantillon d'une seule frame n'invente pas de vitesse.

Une comparaison loyale doit garder **même modèle, même replay, maillage/résolution, définition du repos, timestamps, physique et capture**, et publier les mauvaises frames, pas simplement une meilleure image. Pour comparer 30/60 FPS, calculer et rapprocher *les mêmes timestamps*, en indiquant si l'approximation de vitesse varie avec le pas de capture. Rejouer les mêmes données ne prouve pas que l'intégration réelle du renderer suive ces paramètres.

## Programme scientifique après reprise par Codex

**P3-Q1 : tests visuels et versionnement.** Inspecter `npm run bench:garment`, archiver rapport JSON et screenshot/vidéo d'un mannequin synthétique. Signaler explicitement triangles inversés, zones trop tendues, trous aux coutures. Fixer la version du référentiel et les tolérances avant comparaison de variantes. Tester sur navigateur desktop, pas uniquement Node. Les résultats de ce nouveau harnais **ne constituent pas** un passage de P3/P8.

**P3-Q2 : contrôles négatifs.** Générer sciemment un maillage inversé, écrasé, avec UV incompatibles, ancrage décalé, image sans manches segmentées. Chaque échec doit être détecté là où la métrique le couvre et explicitement déclaré hors champ sinon. La suite Node inclut déjà les quatre premiers cas géométriques.

**P3-Q3 : vraies conditions comparables.** Sur asset dont la licence est vérifiée, collecter des repères corporels réels de manière reproductible et mesurer la correction manuelle, l'occlusion avant/arrière et les collisions. Comparer **baseline VTS Item pinned** (H0), transfert de déformation sans rig (H1), puis ressort secondaire (H2). Faire une évaluation visuelle humaine aveugle avec cas d'échec comptabilisés ; ne pas optimiser sur un seul T-shirt canonique.

**P3-Q4 : limites et décisions.** Des métriques « propres » sur un corps synthétique ne démontrent pas le vêtement sans rig sur un vrai avatar ; elles sont une condition nécessaire locale, pas suffisante. Une performance insuffisante justifie un `NO-GO` documenté, non une proclamation de réussite. Lire `docs/AUTO_CLOTHING.md` avant tout transfert sur Cubism/PSD. Aucun logiciel propriétaire ou asset sous droit n'est intégré ici.

## Ordre de reprise Codex

1. Relire `AGENTS.md`, `docs/CODEX_ACTIVE_WORK.md` et `docs/HANDOFF.md` pour distinguer PR #1 et la PR expérimentale de mesure.
2. Relire cette note, puis `src/garment-quality.mjs`, `src/garment-benchmark.mjs`, les tests.
3. Exécuter `npm run check && npm test && npm run bench:garment`, **noter les résultats effectivement observés**. Les tests locaux du contributeur sont une mesure partielle ; privilégier CI GitHub et inspection visuelle séparée.
4. Enregistrer dans la roadmap la relation P3-Q1 à Q4, décider quelles métriques sont réellement utiles, choisir un seul jeu de seuils **avant** d'évaluer des variantes.
5. Fusionner seulement après revue : cette PR dépend du code de la PR #1, et ne doit pas être fusionnée sur `develop` isolément si sa base de modules `src/garment.mjs`, `src/physics.mjs`, `src/replay.mjs` n'y est pas encore présente.
6. Garder cet instrument distinct de la recherche Live2D réelle, des promesses de clothing autorig et des décisions de licence.
