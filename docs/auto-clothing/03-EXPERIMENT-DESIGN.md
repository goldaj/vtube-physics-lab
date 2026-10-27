# 03 — Protocole expérimental, matrice de couverture et critères de passage

**Programme prospectif de tests**, aucun essai physique ou Live2D supplémentaire revendiqué par la rédaction de ce dossier. Les valeurs ci-dessous sont des **candidats à préenregistrer après étalonnage**, jamais des résultats.

## 1. Jeu initial contrôlé, évolution ouverte

### Corps : variations indépendantes
- Paramètres numériques normalisés, au moins 8 dimensions indépendantes (épaules, poitrine, ventre, taille, hanches, torse, bras, jambes) + éventuellement asymétries.
- Niveau N0 : 1 morphologie nominale ; N1 : 3 (fine, moyenne, large), mais sous forme de paramètres et non d'étiquettes d'identité ; N2 : au moins 6 compositions mixtes inédites ; N3 : avatars tiers autorisés.
- Générer au moins une paire avec **mêmes épaules et hanches différentes**, une paire avec **même hanches et bras de longueur différente**, une paire avec **taille similaire mais rapports de torse différents**. C'est indispensable pour réfuter une mise à l'échelle uniforme.
- Réserver certains vecteurs morphologiques avant de calibrer le solveur ; un avatar de « même taille » n'est pas une validation de corpulences.

### Vêtements : progression, pas liste fermée
- N0 : T-shirt simple frontal sur 1 corps (débogage).
- N1 : T-shirt, pull, pantalon, short, jupe, robe sur 3 morphologies, chacun en variante simple et volontairement difficile.
- N2 : nouvelles tenues créées après gel du solveur : combinaison, chemise ouverte, gilet long, manteau, jupe asymétrique ou toute création au graphe nouveau. **Aucune nouvelle branche de code par catégorie**.
- N3 : vêtements inconnus sur avatars nouveaux, textures multicouches, poses difficiles et empilement. Mesurer explicitement les cas nécessitant clarification.
- Catégories **non limitées en principe** ; tenir un registre des primitives de tissu nécessaires pour toute extension.

### Poses (proposition initiale à geler)
- statiques : neutre, rotation torse −30/−15/0/+15/+30°, respiration 0 / 0,5 / 1 ;
- articulées : bras levés, bras devant poitrine, croisement partiel, marche 2D, flexion coude, rotations indépendantes ;
- perturbations : changement instantané de tenue, replay interrompu puis repris, accélération du mouvement, faibles FPS, perte de tracking ;
- composées : combiner 2 à 3 contraintes, ne pas tester chaque variable uniquement isolément.

### Taille de la campagne : éviter le produit cartésien explosif
- Commencer par **6 morphologies × 6 premiers vêtements × 5 scénarios de pose = 180 combinaisons de scène**, chacune analysée sur plusieurs timestamps, **programme cible**, non run déjà effectué.
- Ajouter les variantes difficiles et leurs témoins dans un lot séparé.
- Utiliser d'abord échantillonnage pairwise/matrice équilibrée pour les dimensions secondaires ; réserver des combinaisons complètes ciblées (bras croisés × robe/pull et croisement jambes × jupe/short).
- Conserver des corps et vêtements entièrement nouveaux pour le holdout ; ne pas gonfler les preuves avec 10 000 frames du même corps-vêtement si les individus distincts n'ont pas changé.

## 2. Métriques : définitions, source et domaines

| Famille | Indicateur | Règle de preuve |
|---|---|---|
| Géométrie | triangles inversés/écrasés, variation aire et arêtes | Module de benchmark PR #6 ; normaliser dimensions ; max ET distribution |
| Alignement | glissement col, épaules, poignets, taille/bassin ; rapporté à une longueur corporelle | Comparer landmarks de vérité terrain, PAS seulement les points fixés par construction |
| Textile | coutures ouvertes, longueur de pan, contour, pli incorrect | Annotation de panneaux et masques ; métrique par région |
| Occlusion | IoU/erreur de masque et mauvais ordre bras/vêtement | Vérité terrain sur silhouettes ; rapport séparé pour modèle Live2D réel |
| Physique | latence de rétablissement, pénétrations, divergence, jitter à timestamps communs | Physique ON/OFF et variation du FPS |
| Généralisation | taux de nouveaux vêtements sans code spécifique, nouveaux corps sans retouche, refus correct | Corpus tenu à l'écart, code SHA gelé |
| UX | temps d'habillage, clics, corrections sémantiques, peinture de poids manuelle | Journal par essai ; **compter zéro peinture de poids comme critère nominal** |
| Rendu | FPS, p95 de latence, mémoire, temps de génération du FitPlan | Appareil/version/licence identiques ; ne pas compter seulement pointe instantanée |
| Perception | notes humaines sur silhouette, naturalité des plis, couverture, lisibilité des mains | Plusieurs évaluateurs sur images/vidéos aléatoires et aveugles |
| Sécurité | gestion d'import corrompu, refus, fuite de token, pause et déconnexion | Tests explicitement destructifs seulement en environnement de test isolé |

## 3. Seuils d'acceptation : hypothèses, non faits

**Pas de seuil universel postulé.** Les seuils seront gelés après l'étalonnage N0, avant d'évaluer N1/holdouts. Exemples candidats à critiquer :
- 0 triangle inversé/écrasé **dans les poses supportées** (c'est une garde géométrique défendable, mais une correction qui produit une silhouette laide demeure un échec).
- 0 tâche de rigging manuel vestimentaire et 0 édition de keyforms vestimentaires sur le chemin nominal ; tout clic de clarification est consigné, même en cas de réussite.
- Les mêmes timestamps donnent les mêmes frames et décisions, indépendamment de la fréquence de dessin (tolérance numérique explicitement définie et moteur/precision fixés).
- Un cas qui passe géométrie mais échoue l'avis humain ou l'occlusion **ne passe pas** au niveau de validation supérieur.
- Qualité temporelle, temps de préparation, FPS et taux de couverture : **d'abord mesurer un ordinateur de référence**, puis fixer les chiffres de réussite adaptés au matériel et à l'usage avant la campagne test.

### Passage E5/E6 → E10
Au moins un vêtement simple et un complexe tiennent sur morphologies N1 + une partie réservée N2, dans des mouvements variés, **sans rig manuel par tenue**, et avec dossier de contre-exemples. Le mannequin seul ne permet pas d'annoncer « compatible VTS ».

### Passage E10 → E11
Modèle Live2D autorisé, rig effectif, body landmarks ou plan de synchronisation vérifiés, tenue qui suit le vrai mouvement avec masques/occlusions testés. En absence de droits ou de données de pose, GO seulement sur voie alternative clairement limitée.

### Passage E11 → E12
VTS réellement en marche, version API/cadre de connexion explicités, taux de réussite sur morphologies et tenues, erreurs temporelles mesurées, méthode overlay/pinning/export décrite fidèlement. Un item VTS épinglé ne prouve pas à lui seul l'habillage multi-panneaux.

### Passage E12 → L3
Un nouveau type de vêtement (jamais vu par le solveur) et un nouveau corps compatible passent **sans ajout de code « par famille »** ni rig manuel ; en cas d'ambiguïté, le refus et la demande de précisions sont comptés correctement. L3 signifie test de généralisation **mesurée**, pas que toutes les tenues imaginables fonctionnent.

## 4. Ablations et hypothèses réfutables

| Hypothèse | Témoin | Test qui peut réfuter la valeur ajoutée |
|---|---|---|
| H-FIT : cage body-rig > échelle uniforme | un centre épinglé + scale | Même morphologies/tenues/poses : glissement, contour, avis humain égaux ou pires |
| H-WEIGHT : skinning généré > ancrages manuels minimaux | 2 ancrages fixes | Gains insuffisants ou coût/perception pire, surtout bras/coutures |
| H-OCC : masques graphes > tri z-index fixe | z-index unique | Occultations changent en mouvement et restent fausses/instables |
| H-PHY : zones libres simulées > statique | physique OFF | Entrées défavorables ou FPS/coût supérieurs sans gain humain robuste |
| H-VISION : segmentation modèle appris > heuristique | extraction alpha simple | Faux labels, coût ou dépendances plus importants et couverture inchangée |
| H-VTS : overlay paramétrique > item épinglé | VTS pinned item | Décalage temporel ou masques incohérents annulant le gain |
| H-GEN : graphe générique > classes dédiées | premiers 6 vêtements | Nouvelles structures nécessitent toujours code spécifique, donc généralisation non obtenue |

Rapports obligatoires : métriques par combinaison, médiane/p95/max, échecs/abstentions, méthodologie, appareil, version, SHA des modèles/assets, licence autorisant partage des sorties, hash du code, graine, qualité des annotations, décisions GO/NO-GO.

## 5. Manifeste de test proposé

Fiche minimale, non exécutable telle quelle :

- dataset_id, schema_version, source_license, source_kind (synthetic / genuine_live2d_authorized / vts_realtime);
- model_id+sha256 (identifiant non personnel), garment_id+sha256, model-asset license reference, solver_sha;
- garment_graph_version, BodyRigDescriptor_version, FitPlan_version, pose_replay_sha256;
- dimensions corporelles et scénario de pose **sans attributs identifiants d'une personne réelle** ;
- importer_mode (flat_png / layered / procedural), applied_interventions_count, manual_rig_steps_count, fitting_failure_category;
- geometry_metrics, occlusion_metrics, physics_metrics, performance_metrics, human_assessment;
- passed, criteria_version, abstained, reason, evidence_artifact_refs (contenu sensible hors Git);
- re-test instructions, date/conditions, limitation and decision.

## 6. Trois inconnues scientifiques à élucider tôt

1. Une image à plat peut-elle fournir assez d'information pour reconstruire l'attache d'une manche, les panneaux cachés et l'aisance visuelle sans utilisateur ? Comparer PNG vs couches/annotations et quantifier taux de refus correct.
2. Les coordonnées des pièces d'un vrai Live2D sont-elles récupérables et synchronisables sous l'environnement choisi ? Une API VTS de paramètres n'équivaut pas au maillage complet ; vérifier par un POC read-only avant toute promesse de « plug-and-play VTS ».
3. Le nombre de primitives du graphe reste-t-il relativement stable quand apparaissent de nouvelles familles ? Mesurer le coût de support d'un nouveau vêtement : corrections de données vs modifications du solveur.

Si l'un échoue, documenter sa réfutation et choisir explicitement une voie plus limitée au lieu d'allonger le plan sans modifier son hypothèse.
