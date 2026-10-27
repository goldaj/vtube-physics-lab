# 04 — Passation Codex : objectif, ordre d'attaque, branches et décisions à ne pas perdre

Date : 27 octobre 2026. **Contribution documentaire de recherche. AUCUN nouveau modèle ajusté, vêtement rendu, test sur Cubism/VTS ni vêtement réel validé dans cette branche.**

## Relire dans cet ordre

1. 00-PRODUCT-CONTRACT.md : cible produit **sans plafond de familles de vêtements**, périmètre humanoïde initial, hypothèses et interfaces.
2. 01-BACKLOG-E0-E6.md : **7 grandes étapes** de critères jusqu'aux déformations stables, sous-étapes et actions atomiques.
3. 02-BACKLOG-E7-E13.md : **7 grandes étapes** pour occlusion, physique, véritables modèles Live2D, pont VTS, classes inédites, distribution.
4. 03-EXPERIMENT-DESIGN.md : protocole à préenregistrer, stratégie de corpus/holdout, critères GO/NO-GO, matrices et ablations.
5. docs/AUTO_CLOTHING.md, docs/EXPERIMENTS.md, docs/TASKS.md, docs/HANDOFF.md, docs/CODEX_ACTIVE_WORK.md, AGENTS.md, docs/CHATGPT_PROJECT_HISTORY.md : sources originelles, puis pointer aux addenda sur cette branche.
6. [PR #1](https://github.com/goldaj/vtube-physics-lab/pull/1) : prototype géométrique de départ sur feat/replay-clothing-spike, non fusionné.
7. [PR #6](https://github.com/goldaj/vtube-physics-lab/pull/6) : banc quantitatif indépendant, 21 tests CI réussis au 27/10/2026 ; son intégration n'est pas supposée acquise.

## Relations Git

- develop : cadrage existant ; n'est PAS réécrit par cette contribution.
- feat/replay-clothing-spike : base directe de **cette branche** pour que le plan s'appuie sur le code existant.
- research/gpt6-garment-quality-20261027 : branche sœur, PR #6, métriques et bench mesuré sur mannequin synthétique, non fusionnée.
- research/gpt6-universal-auto-clothing-plan-20261027 : présente branche, **docs uniquement** ; PR brouillon autonome contre feat/replay-clothing-spike.
- Aucune modification des branches Codex en cours, de Jade, d'Hyperliquid, du compte VTS ou d'assets sous licence.

**Si Codex fusionne PR #1 et PR #6 avant ce plan**, rebaser/cherry-pick seulement les documents pertinents après revue et suivi SHA ; pas de fusion automatique ni de reprise aveugle des statuts historiques. **Si PR #6 n'est pas intégrée**, marquer les mesures prévues comme dépendance externe, ne pas dupliquer inutilement le benchmark.

## Première journée de reprise productive : baby steps

1. Mettre en place le suivi E0.1 à E0.4 ; compiler un registre d'hypothèses et une checklist GO/NO-GO plutôt que coder 14 étapes simultanément.
2. Décider du contrat du premier mannequin humanoïde : segments, joints, **morphologie paramétrique** et vérité terrain. Ne pas utiliser les seuls cinq repères torse de src/garment.mjs comme s'ils étaient un corps complet.
3. Définir schema versionné BodyRigDescriptor et GarmentDescriptor **avant** de multiplier les vêtements. Créer fixtures purement synthétiques.
4. Écrire un premier test sur deux silhouettes **non liées par simple scaling**, pour un même T-shirt : épaules identiques/hanches différentes ; tout fit inchangé devra être considéré comme insuffisamment morphologique.
5. Construire ensuite le générateur de graphe textile simple et mesurer sa couverture du T-shirt, d'une manche et d'un pantalon ; ne pas implémenter six solveurs.
6. En parallèle de E3, faire une **courte étude read-only du pont Live2D/VTS** en documentant les champs accessibles. C'est un risque bloquant de l'architecture finale ; ne pas attendre E11 pour le découvrir.

## Point de décision technique à programmer tôt

**Jalon SPIKE-VTS-READ :**
- Contrat : lire un vrai modèle légalement autorisé et les paramètres du runtime choisi ; aucune écriture/injection des paramètres, aucun transfert de token hors coffre.
- Recherche : renseigner s'il est possible de récupérer contours/vertèbres animés / profondeur de drawables, ou seulement des paramètres abstraits.
- Sorties : tableau « observable / inféré / impossible », latence d'observation, SDK/version/licence, exemple autorisé, diagnostics.
- Trois conséquences possibles : rendu externe libre (succès en overlay), item VTS pinned seulement (baseline insuffisante), export/rebuild Cubism (étude d'outillage/licence distincte). Le premier résultat ne garantit pas le troisième.
- En absence de modèle/SDK disponible, classer le spike **bloqué** et poursuivre le mannequin synthétique, sans inventer une validation.

## Registre initial des risques majeurs

| R | Risque | Test de rupture | Réponse honnête |
|---|---|---|---|
| R1 | PNG insuffisante pour inférer une tenue | même silhouette compatible avec plusieurs coutures/ouvertures | confidence + questions ciblées / couches optionnelles |
| R2 | Avatar tiers non annoté et landmarks introuvables | corps nouveau impossible à segmenter | profiler + marquer unsupported ; programme d'inférence ultérieur |
| R3 | Mapping anatomique par simple zoom | épaules et hanches varient indépendamment | cage/poids localement générés |
| R4 | Tissu correct sur photo mais incorrect en mouvement | bras croisés, marche, rotation | contraintes E6/occlusion E7, mesure par frame |
| R5 | « VTS API » sans sommets d'ArtMesh | tester accessibilité réelle API/plugin | overlay runtime, exporter autrement si licite |
| R6 | Modification de .moc3 non disponible à chaud | spike de rendu/authoring | ne pas promettre des vêtements *nativement* intégrés à VTS |
| R7 | Géométrie propre mais rendu laid | évaluateurs humains et exemples difficiles | critère perceptuel indépendant |
| R8 | Correctif dur pour chaque famille | famille inconnue tenue à l'écart | primitive du graphe générique, ou NO-GO généralisation |
| R9 | Désalignement de paramètres / FPS | latence VTS et variation de rendu | horloges, buffer et fallback mesurés |
| R10 | Redistribution d'assets / Cubism non autorisée | audit source/licence/dependance | assets originaux synthétiques, SDK acquis officiellement |

## Questions qui n'empêchent PAS de démarrer E0–E2

- Modèle exact de référence : **proposition** mannequin vectoriel créé de zéro, car il rend les morphologies et landmarks mesurables. Un vrai avatar Live2D choisi plus tard doit être couvert E10/E11 ; Jade ne doit pas être utilisé implicitement.
- Entrée vêtement cible : dessins 2D PNG alpha et option couches/PSD autorisées ; la capacité à déduire les parties d'un PNG unique reste une hypothèse à vérifier.
- Physique : 2D/2.5D secondaire, pas simulation 3D anatomiquement exhaustive.
- Connecteur VTS final : **non tranché**, doit être choisi sur preuve de faisabilité et licence, pas préférence de développeur.
- Catalogue : **aucun nombre maximum** de familles ; les six types de départ sont des exemples d'instrumentation et de montée en compétence.

## Conditions de fin et de promotion

La « fonctionnalité principale réussie » ne peut pas être déclarée avant :
1. démonstration sur différentes proportions indépendantes pour au moins un haut et un bas ;
2. validation multimouvement, multi-couches, cas adversariaux et critères perceptuels ;
3. succès sur un vrai modèle Live2D autorisé ;
4. preuve du fonctionnement avec VTS (overlay ou intégration exacte explicitée) ;
5. rapport généralisation sur vêtements **non vus** par le solveur.

Un succès partiel peut être livré comme laboratoire expérimental, avec un libellé exact (L0/L1/L2/L3) et les catégories couvertes **à cet instant**.

## Règles de commit et de passation

- Branches indépendantes et PR en brouillon, code+tests+documentation contemporains pour chaque sous-jalon.
- Chaque pas du backlog possède : description, références de fichiers, résultat reproductible, statut vérifié/bloqué, hypothèse rejetée, résultat négatif, prochaine action atomique.
- Aucune action implicite VTS, aucune publication automatique des images des utilisateurs, aucun asset/SDK propriétaire non redistribuable.
- Après Codex : mettre à jour docs/TASKS.md, docs/HANDOFF.md, docs/CODEX_ACTIVE_WORK.md et docs/CHATGPT_PROJECT_HISTORY.md avec version/SHA/source fiable, pas de verbatim inventé.
- Pas de fusion ou annonce commerciale sur la seule base de ce document.
