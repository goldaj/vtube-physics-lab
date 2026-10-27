# 00 — Contrat produit : habillage 2D automatique extensible pour avatars humanoïdes

État au 27 octobre 2026 : **cible de recherche et feuille de route, pas fonctionnalité livrée**.
Source : demande explicite du propriétaire, présente conversation. Le mot « universel » désigne une **architecture ouverte à de nouvelles catégories**, non une promesse mathématique de réussite sur toute image ou tout modèle.

## 1. Cible finale, sans plafond de catégories

Importer un avatar humanoïde animé en 2D, idéalement un modèle utilisable avec VTube Studio, supposé en sous-vêtements ou avec une base corporelle visible et documentée. Importer un **dessin 2D de vêtement**. L'application détecte ses parties, retrouve les régions et proportions correspondantes du corps, règle son ajustement, crée automatiquement ses déformations et attaches, ajoute sa physique secondaire, construit les masques et ordres de profondeur, puis suit les poses et mouvements de l'avatar. On change de vêtements rapidement, sans peindre de poids, poser manuellement chaque point d'ancrage ou créer les keyforms de chaque vêtement.

Le système doit permettre, après les premières catégories de vêtements usuels, **l'ajout de nouvelles silhouettes et structures de vêtement sans écrire une branche conditionnelle pour chacune**. Une catégorie inconnue doit passer par une représentation générique de pièces et de contraintes ; si ses données d'entrée sont insuffisantes, l'application doit déclarer une incertitude et demander une clarification ciblée ou proposer un mode dégradé explicite. « Zéro intervention manuelle » est le critère de succès sur l'ensemble **supporté**, et non une supposition imposée par une image 2D ambiguë.

### Jalons de validation (non exclusifs, non définitifs)
- Ensemble de départ : T-shirt, pull, pantalon, short, jupe, robe. **Ce sont des fixtures de test, non six classes fermées**.
- Élargissement : vestes, manteaux, chemises ouvertes, manches bouffantes, écharpes, combinaisons, superpositions, asymétries, robes longues/courtes, capuches, vêtements multipièces, textures ajourées ; puis catégories non vues lors de l'entraînement.
- Morphologies : variations indépendantes de taille, largeur d'épaules, poitrine, ventre, tour de taille, hanches, longueur de torse, bras et jambes. Les variations ne sont pas de simples zooms uniformes.

## 2. Hypothèses explicites et décisions provisoires

| ID | Hypothèse de travail, à réexaminer | Motivation / risque |
|---|---|---|
| H-BODY-01 | Avatar humanoïde frontal ou trois-quarts modéré, deux bras et deux jambes, articulations détectables. | Contrat restreint pour premier succès ; poses extrêmes et anatomies fantastiques restent hors validation initiale. |
| H-BODY-02 | Corps déjà animé et riggé **une seule fois**, sans rig spécifique pour chaque vêtement. | L'objectif est de supprimer le **rigging vestimentaire**, pas de prétendre animer un personnage 2D à partir de rien. |
| H-BODY-03 | Pour le modèle d'essai initial, fournir des repères corporels et zones d'occlusion de référence ; ne pas les confondre avec la capacité à les découvrir automatiquement sur un avatar tiers. | Séparer « autorig du vêtement » et « autoreconnaissance du corps ». |
| H-BODY-04 | Corpus d'essai : un avatar créé pour le projet, avec dessins/variantes dont nous détenons les droits, et figures paramétriques synthétiques. Jade peut servir plus tard si ses ressources et licences sont vérifiées. | Pas de dépendance cachée à un modèle propriétaire ou à des assets sous droit. |
| H-GAR-01 | Entrée privilégiée v1 : PNG transparent frontal **ou** dessin multicouche avec contrat d'annotations facultatives ; le moteur doit mesurer la différence de réussite selon le niveau d'information. | Une PNG aplatie ne montre pas l'arrière d'une manche ni toutes les coutures. |
| H-GAR-02 | Le « type » de vêtement est une **propriété descriptive**, pas l'identifiant d'un algorithme distinct : segments, ouvertures, zones cousues, zones libres, épaisseurs et calques génériques. | Éviter les six hardcodages non généralisables. |
| H-GAR-03 | Première déformation : attache aux articulations + cage corporelle + interpolation barycentrique/warp ; physique seulement sur zones libres. | Baseline plus interprétable qu'un réseau génératif de bout en bout. |
| H-GAR-04 | Moteur graphique du studio séparé du moteur Live2D de l'hôte ; il restitue un vêtement externe avec sa propre géométrie tant que l'intégration de calque est viable. | Ne pas promettre l'injection de nouveaux ArtMeshes/keyforms dans un .moc3 en cours d'exécution. |
| H-VTS-01 | La sortie « fonctionne dans VTube Studio » pourra requérir un **pont local synchronisé, une couche OBS/externe ou un export/recompilation via une chaîne Cubism autorisée**. | Choix d'architecture ouvert ; un item VTS épinglé n'est pas automatiquement un vêtement physique multiancrage. |
| H-QA-01 | Aucun résultat jugé bon sur un seul mannequin ni sur une photo figée. | Exiger poses dynamiques, morphologies et catégories non vues, plus essais perceptuels humains. |
| H-PHYS-01 | Simulation temps réel en 2D/2.5D, sans prétention à un patron 3D ni à un fit physique textile exact. | Problème inverse de 2D ambigu et potentiellement sous-déterminé. |
| H-SCOPE-01 | La première livraison peut se limiter aux silhouettes simples, mais l'API, le dataset et la métrologie doivent intégrer des vêtements encore inconnus. | L'ensemble supporté grandit par mesure, pas en modifiant l'objectif final. |

## 3. À distinguer absolument : trois niveaux de réussite

- **L0 : mannequin du laboratoire.** Silhouette canonique ou paramétrique + replay synthétique. Fournit preuve de géométrie, réinitialisation, déterminisme ; aucune preuve de compatibilité VTS.
- **L1 : modèle réel Live2D dont les droits sont établis.** Modèle animé localement avec SDK légalement obtenu ou export autorisé ; vêtements dynamiques externes correctement alignés sur ses paramètres/poses, masques et profondeur cohérents. Pas forcément encore affiché *dans* l'application VTube Studio.
- **L2 : rendu opérationnel synchronisé avec VTube Studio.** Le modèle fonctionne en VTS, et les vêtements suivent toutes les animations retenues. Méthode d'intégration/autorisation/licence vérifiée. La superposition peut être un rendu externe composité si cela satisfait les usages déclarés ; ne pas revendiquer l'injection native dans le modèle si ce n'est pas fait.
- **L3 : généralisation ouverte.** Une nouvelle morphologie et des vêtements d'une famille **non présente dans le jeu de développement** sont traités sans code dédié ni réglage manuel substantiel, ou refusés explicitement avec un diagnostic utile. L'objectif est d'accroître continuellement la couverture, pas de figer « universel » après six exemples.

Un passage L0→L1→L2 est **obligatoire** pour déclarer une compatibilité VTube Studio. L3 est un programme continu, mesuré sur des jeux vraiment inconnus.

## 4. Architecture fonctionnelle provisoire

1. **Import avatar** → vérification droits et format → lecture du modèle et des paramètres existants → proposition des repères et segmentation du corps → adaptation corrigible du profil corps.
2. **Import vêtement** → validation du dessin et de ses dimensions/alpha → décomposition des pièces / ouvertures / calques → estimation d'incertitude et informations manquantes.
3. **Association générique** → évaluation des proportions et lignes d'attache → construction d'une cage autour des régions du corps → représentation normalisée des coutures, parties libres et occultations.
4. **Auto-déformation** → maillage 2D du vêtement et champ de poids générés algorithmiquement → transfert de mouvement corporel depuis le modèle → conservation d'un volume/longueur de tissu plausible dans la projection 2D.
5. **Physique secondaire** → régions libres seulement, intégrateur temporel à pas fixe, freinage/rétablissement/collision, budget CPU/GPU borné ; séparation mouvement imposé / inertie.
6. **Compositing** → calques avant/arrière du corps, ordres de profondeur, masques, croisement bras/torse, éclairage éventuellement cohérent, résolution et filtrage du textile.
7. **Lecture/édition** → démonstrations, comparaisons côte à côte, métriques, warnings et export reproductible ; **pas de rigging manuel vêtement** dans le chemin nominal.
8. **Pont VTS/Cubism** → connecteur facultatif avec consentement et lecture seule au départ ; test de compatibilité des paramètres ; choix documenté entre overlay, intégration autorisée ou export.
9. **Catalogue extensible** → chaque nouveau vêtement est décrit par une géométrie/structure, pas par une classe métier inscrite dans le solveur ; versions, droits, profils, tests de migration, refus explicites.

### Objets conceptuels versionnés (noms à choisir par Codex)

- BodyRigDescriptor v1 : référentiel de coordonnées, landmarks (avec confiance), régions et contours, articulations/limites, occlusion, association paramètres↔déformations, format/licence du modèle. Une autorisation de copie des assets ne découle jamais de la simple lecture.
- GarmentDescriptor v1 : image ou couches, masques, régions couvertes, ouvertures (col/poignets/ourlets/taille), coutures, points virtuels, aisance désirée, parties rigides/libres, avant/arrière, provenance, incertitude.
- FitPlan v1 : version solveur, source + hashes, silhouette, maillage, ancrages générés, contraintes, zones masquées, paramètres physiques, incompatibilités et diagnostic ; aucun token VTS.
- PoseFrame v1 : temps mono-croissant, paramètres normalisés, landmarks ou champ de déformation **effectivement disponible**, version du modèle, statut de perte de tracking ; jamais attribuer des repères inexistants à l'API.
- RenderReport v1 : métriques de qualité et coût, signalement d'échec, exemples par pose, origine synthétique/réelle, comparaisons aux baselines.

## 5. Point essentiel d'intégration avec le monde réel

Le format Live2D déplace les sommets/ArtMeshes selon des paramètres et des keyforms compilés dans le fichier de modèle. Le SDK Web charge le modèle pour le rendre et accéder à ses paramètres ; il n'est pas raisonnable de **supposer** que le fichier exécutable accepte l'ajout à chaud d'une tenue riggée avec des déformeurs arbitraires. Le plugin VTube Studio expose des paramètres et un système d'items/attaches ; ce n'est pas une promesse contractuelle d'accès aux positions de tous les sommets animés de chaque ArtMesh.

**Décision de conception :** prototyper **d'abord** un rendu vestimentaire autonome et synchronisé ; faire un spike de faisabilité VTS/Cubism avant de promettre « dans VTS ». Trois voies à confronter : A : items VTS épinglés (baseline basse) ; B : overlay live local contrôlé par les paramètres VTS avec compositing externe ; C : pipeline d'authoring/export via Cubism si possible et légalement autorisé.

## 6. Non-objectifs du premier cycle et risques

Ne pas faire : recréer un éditeur Live2D complet, confondre vue frontale et géométrie cachée, entraîner sur assets tiers sans droits, forcer une PNG ambiguë à recevoir une structure inventée sans avertissement, uploader un avatar ou une image privé(e), intégrer un sdk propriétaire dans le repo Git, toucher à Jade ou à Hyperliquid, brancher une caméra ou un compte VTS sans consentement.

### Références techniques vérifiées le 27/10/2026
- Live2D Cubism modèle/Web et données compilées : https://docs.live2d.com/en/cubism-sdk-manual/model-web/
- Cubism Core et distribution hors GitHub : https://docs.live2d.com/en/cubism-sdk-manual/cubism-core/
- VTS items/ArtMesh pinning (baseline) : https://github.com/DenchiSoft/VTubeStudio/wiki/Item-System
- VTS API (paramètres, item pinning, permissions) : https://github.com/DenchiSoft/VTubeStudio/blob/master/README.md
- Auto-deformer Editor et ses limites sur angles/poses : https://docs.live2d.com/en/cubism-editor-manual/auto-generation-of-deformer/
- Licence de publication SDK et possibles applications extensibles : https://www.live2d.com/en/sdk/license/

Les sources sont des **documents de référence** et ne valident aucune implémentation de ce dépôt.
