# 01 — Plan d'exécution détaillé, partie A : fondations, morphologies et adaptation

**Mode d'emploi :** chaque « étape » est un jalon à valider avant le suivant ; chaque S = sous-étape, et chaque action A/B/C/D est une **sous-sous-étape directement exécutable**. Ne pas fusionner des actions pour gagner artificiellement une phase. Lorsqu'un paramètre, une classe ou une métrique n'est pas démontré, le choisir comme **hypothèse versionnée**, pas comme vérité. Lire aussi 00-PRODUCT-CONTRACT.md et 03-EXPERIMENT-DESIGN.md.

**Principe transversal :** les familles de vêtements ci-dessous sont seulement un échantillon croissant. Le modèle interne de « garment graph » (zones, coutures, ouvertures, attaches, drapé, occlusion) reste **ouvert à des familles jamais codées explicitement**. Toute proposition « ajoutons une branche if robe/if short » doit démontrer pourquoi une simple combinaison d'éléments génériques ne suffit pas.

## E0 — Cadrer l'essai sans se mentir sur « automatique »

**Entrée :** PR #1 (simulation, mannequin synthétique), PR #6 (métriques, distincte et non fusionnée), souhait d'adaptation humanoïde générale.

### S0.1 — Définition vérifiable du succès
- **0.1.A** Rédiger une séquence utilisateur nominale : sélectionner corps animé → déposer dessin du vêtement → ajustement lancé → prévisualisation sous animation → valider → exporter.
- **0.1.B** Marquer toutes les étapes qui seraient actuellement manuelles (repères, poids, segmentation, retouche d'image, keyforms, ordre des calques).
- **0.1.C** Fixer les observables « zéro rig vêtement » : **0 création manuelle de keyforms, 0 peinture manuelle de poids, 0 rattachement point par point** ; mesurer séparément le nombre de clics éventuels pour clarifier un vêtement ambigu.
- **0.1.D** Écrire les messages exacts « compatible », « compatible sous réserve », « données insuffisantes », « échec » et les interdictions de promotion en cas de doute.
- **Livrable :** contrat d'acceptation testable, sans prétendre que zéro clic est universel.

### S0.2 — Frontière de l'entrée supportée
- **0.2.A** Écrire le minimum d'informations requises sur un humanoïde : contours du tronc, épaules, coudes, poignets, bassin, genoux, chevilles + orientations connues.
- **0.2.B** Écrire le minimum d'informations requises sur un vêtement : silhouette, transparence/masque, ouvertures et longueur, position relative du cou/ceinture, nombre de pièces quand disponible.
- **0.2.C** Énumérer les cas sous-déterminés : T-shirt photographié sur un humain, vêtement plié, image de face sans dos, jupe cachée derrière des bras.
- **0.2.D** Définir une sortie structurée d'incompatibilité plutôt qu'un résultat « joli » mais physiquement faux.

### S0.3 — Faire l'audit de l'existant avant d'ajouter un solveur
- **0.3.A** Lire et essayer src/garment.mjs, src/replay.mjs, src/physics.mjs ; conserver les huit tests originaux.
- **0.3.B** Examiner la PR #6 et sa métrologie ; éviter d'écrire une deuxième mesure de triangles, stretch ou glissement.
- **0.3.C** Relever les dimensions/limites actuelles (mannequin tronc-only, PNG unique, absence de jambes/bras articulés).
- **0.3.D** Faire un tableau « à réutiliser / à généraliser / à remplacer après preuve », avec interfaces et coût de migration.

### S0.4 — Geler un micro-protocole de référence
- **0.4.A** Fixer versions Node/navigateur, seed, horodatages, paramètres de pose, dimensions de l'image test.
- **0.4.B** Créer une baseline témoin : image épinglée à un point, échelle uniforme, zéro physique secondaire.
- **0.4.C** Définir au moins une métrique géométrique, une temporelle, une perceptuelle et une d'effort humain pour chaque essai.
- **0.4.D** Consigner comment rejouer le même essai et où conserver ses rapports sous Git (synthétique seulement) ou hors Git (assets privés).
- **DoD E0 :** personne extérieure capable de répéter une démo et de comprendre ce qui n'est PAS validé.

## E1 — Construire un générateur de corps humanoïdes 2D articulés

**Hypothèse :** un mannequin de référence vectoriel développé ici est licite et bien plus contrôlable qu'un modèle VTS tiers pour les premiers tests. Le rig du **corps** est autorisé une fois.

### S1.1 — Modèle de corps paramétrique
- **1.1.A** Dessiner des primitives séparées (torse, bassin, bras gauche/droit, avant-bras, cuisses, mollets, tête) et exposer contours et points d'articulation.
- **1.1.B** Créer un squelette 2D à contraintes de longueur et angles explicites, indépendant de toute tenue.
- **1.1.C** Normaliser le système de coordonnées : unités du canevas, origine, conventions avant/arrière, taille, ratio pixel/unités.
- **1.1.D** Exporter chaque silhouette et ses repères en un format versionné déterministe ; générer une vue debug des repères.

### S1.2 — Variations de morphologie, non réductibles au zoom
- **1.2.A** Ajouter un vecteur morphologique : épaules, poitrine, abdomen, taille, hanches, longueur torse/bras/jambes, proportions gauche/droite dans une enveloppe réaliste.
- **1.2.B** Définir un générateur borné produisant de manière reproductible des silhouettes « fines / moyennes / fortes » puis des formes intermédiaires mixtes.
- **1.2.C** Vérifier que modifier le bassin sans changer les épaules n'est pas traité comme simple grossissement global.
- **1.2.D** Sauvegarder les paramètres, pas les descriptions corporelles subjectives, pour les essais et la métrologie.

### S1.3 — Animation corporelle contrôlée
- **1.3.A** Définir un jeu de poses : frontal neutre, bras bas, bras levés, coude plié, rotation torse ±15/30°, marche simulée, respiration.
- **1.3.B** Composer les paramètres conjointement : bras croisés + rotation + respiration, bassin en mouvement + marche.
- **1.3.C** Rejouer ces trajectoires depuis un temps absolu, y compris pause/scrub/reprise, sans dépendre du FPS de rendu.
- **1.3.D** Enregistrer pour chaque frame les positions réelles des articulations, contours corporels et profondeur théorique.

### S1.4 — Validation indépendante du corps
- **1.4.A** Tester longueurs osseuses, absence de NaN, joints continus, orientation des polygones, collisions corporelles au repos.
- **1.4.B** Comparer les mêmes poses à 30 et 60 FPS aux timestamps communs.
- **1.4.C** Capturer les poses incompatibles (bras traversant le torse du modèle) et les marquer comme exclusions *du corpus initial*, pas de l'objectif à terme.
- **1.4.D** Verrouiller quelques silhouettes/poses en jeu de test « held-out morphologies » que le solveur n'utilisera pas pour se régler.
- **DoD E1 :** corps animés diversifiés, déterministes, repères vérifiables, aucune tenue encore requise.

## E2 — Construire un corpus de vêtements extensible, à droits clairs

### S2.1 — Corpus minimal initial
- **2.1.A** Dessiner en interne au moins un T-shirt, un pull, un pantalon, un short, une jupe et une robe ; documenter leurs droits et versions.
- **2.1.B** Pour chaque catégorie, créer un exemple simple et un contre-exemple défavorable (manche ample, jupe asymétrique, pantalon évasé, etc.).
- **2.1.C** Exporter une version PNG aplatie et une version en pièces nommées/masques afin d'étudier l'information perdue.
- **2.1.D** Stocker les métadonnées sans annotation manuelle *nécessaire à l'utilisation* ; les masques de vérité terrain sont permis pour **évaluer** le système.

### S2.2 — Représentation de pièces sans classes codées en dur
- **2.2.A** Définir une primitive « panneau » avec contour 2D, UV, épaisseur visuelle facultative et ordre de profondeur.
- **2.2.B** Définir des relations : couture, ouverture, bord libre, zone élastique, zone de recouvrement, bande de fixation.
- **2.2.C** Décrire les six exemples **uniquement** comme des graphes de ces primitives, sans six moteurs différents.
- **2.2.D** Ajouter un vêtement composite inconnu au moment du codage, par exemple combinaison courte ou veste à capuche, pour voir si le format l'exprime sans changement de schéma.

### S2.3 — Contrats d'entrée et échecs explicites
- **2.3.A** Rejeter formats corrompus, dimensions extrêmes, décompression excessive, masques non finis et pixels invalides.
- **2.3.B** Valider les bords alpha et détecter les zones opaques disjointes, trous, ouvertures et pièces superposées.
- **2.3.C** Distinguer PNG de vêtement à plat, image sur mannequin, photo libre, PSD multicouche et illustration stylisée ; ne jamais les traiter comme équivalents par défaut.
- **2.3.D** Décrire les informations introuvables dans une PNG unique et émettre un état « clarification nécessaire » avec un nombre limité de questions ciblées.

### S2.4 — Tests d'extension sans fuite
- **2.4.A** Réserver plusieurs créations originales non utilisées pendant le développement, issues de catégories distinctes ou nouvelles.
- **2.4.B** Versionner deux jeux : « développement » et « généralisation », interdire de sélectionner des seuils en examinant la seconde.
- **2.4.C** Tester la migration du format après ajout d'une nouvelle notion (ex. doublure/fermeture), sans invalider les anciens fichiers.
- **2.4.D** Construire une page d'atlas de comparaison avec identifiant et provenance pour chaque tenue.
- **DoD E2 :** un nouveau vêtement simple peut être **représenté** comme graphe sans code spécialisé, même s'il ne se déforme pas encore.

## E3 — Décrire et identifier le corps réel, sans présumer de l'API VTS

### S3.1 — BodyRigDescriptor et capteurs virtuels
- **3.1.A** Formaliser le fichier corps : espaces de coordonnées, landmarks, confiance, régions, contours, ordre de profondeur, transformations et mapping paramètres.
- **3.1.B** Écrire un parseur validant type/version, distances plausibles, hiérarchie osseuse, compatibilité avec les poses connues.
- **3.1.C** Ajouter les masques de visibilité et le marquage « landmark deviné / vérifié / introuvable ».
- **3.1.D** Protéger la chaîne contre valeurs NaN, repères hors image, IDs dupliqués et modèles incomplets.

### S3.2 — Adaptateur pour le corps synthétique
- **3.2.A** Construire les landmarks à partir du rig E1 et produire le BodyRigDescriptor exact.
- **3.2.B** Calculer automatiquement contours et projections des points articulaires à chaque frame.
- **3.2.C** Tester la sérialisation/reprise et la reproductibilité de tous les repères sur un même replay.
- **3.2.D** Comparer la sortie adaptateur aux vérités terrain du générateur sur les silhouettes réservées.

### S3.3 — Spécification du futur adaptateur Live2D
- **3.3.A** Identifier quel jeu de données exact est disponible : fichier .model3.json, .moc3 via Cubism autorisé, nom des paramètres, scènes/transformations.
- **3.3.B** Écrire un prototype **sans réseau VTS** simulant les paramètres mais pas les points réellement inconnus.
- **3.3.C** Définir la procédure d'inférence de landmarks depuis des masques/drawables **si techniquement exposés** dans le renderer choisi ; conserver statut « inaccessible » sinon.
- **3.3.D** Préparer la liste de tests d'écarts du mapping entre deux avatars Live2D distincts, sans baser le système sur des noms de paramètres uniques.

### S3.4 — Détection et confiance sur nouvel avatar
- **3.4.A** Implémenter une hypothèse géométrique simple (contours, symétrie, segmentation de parties) avant toute IA.
- **3.4.B** Mesurer les erreurs landmark sur versions connues synthétiques en retirant délibérément des indices.
- **3.4.C** Proposer un schéma d'aide ponctuelle seulement quand la confiance chute ; journaliser les interventions, sans déguiser ces gestes en zéro-click.
- **3.4.D** Rejeter proprement non-humanoïdes et rigs incompatibles dans le premier profil, avec capacité d'extension future documentée.
- **DoD E3 :** interface corps utilisable sans connaissance de VTS et niveau de confiance explicite.

## E4 — Analyser un vêtement arbitraire sans moteur par catégorie

### S4.1 — Prétraitement des pixels et des couches
- **4.1.A** Extraire silhouette alpha, composantes connexes, bords internes, trous, régions semi-transparentes.
- **4.1.B** Déduire l'orientation probable et l'échelle du dessin ; traiter les asymétries sans miroir imposé.
- **4.1.C** Chercher les traces de plusieurs pièces (manches, jambes, doublures) en séparant segmentation et hypothèses.
- **4.1.D** Produire un diagnostic de qualité d'entrée (coupe, opacité, zones manquantes) avant le fit.

### S4.2 — Graphe sémantique incertain
- **4.2.A** Proposer des points de col, bretelles/épaulettes, poignets, taille, hanches, ourlets, fourches, ouvertures.
- **4.2.B** Identifier les parties fixes, souples et libres ; conserver les plusieurs interprétations plausibles plutôt que forcer la première.
- **4.2.C** Assembler le graphe de panneaux/coutures/gap depuis des primitives E2, sans tester un nom de famille comme condition nécessaire.
- **4.2.D** Exporter les scores de confiance par élément et les masques superposés pour vérification humaine.

### S4.3 — Baseline classique puis modèle appris, uniquement si utile
- **4.3.A** Établir une heuristique explicite de segmentation sur silhouettes propres et PSD multicouches.
- **4.3.B** Mesurer ses échecs par structure (une jambe occultée, col opaque, manche disjointe, transparence).
- **4.3.C** Seulement après ces échecs, choisir un modèle de vision compact/segmentation avec droits de données clarifiés et mode hors ligne testé.
- **4.3.D** Comparer les deux voies à contraintes de temps, taux d'erreur, disponibilité et intervention humaine identiques ; maintenir fallback sans IA si nécessaire.

### S4.4 — Politique de refus et généralisation
- **4.4.A** Test d'entrée nouvelle : tenue qui n'appartient à aucune des six catégories de départ.
- **4.4.B** Vérifier que la sérialisation et le solveur l'acceptent comme graphe **si son graphe est valide**, et non parce qu'un nom a été ajouté à une liste.
- **4.4.C** Quand les ambiguïtés sont non résolues, proposer une clarification minimale sur les régions manquantes, mais **pas** un éditeur manuel de rig par points.
- **4.4.D** Mesurer pour chaque famille et catégorie tenue hors développement : couverture, exactitude du graphe, taux de clarification et refus correct.
- **DoD E4 :** chaque tenue devient un graphe générique et auditable ; les confusions sont mesurées et refusées.

## E5 — Adaptation automatique aux proportions et morphologies

### S5.1 — Mise en correspondance de régions, sans mise à l'échelle unique
- **5.1.A** Associer les ouvertures du vêtement à des bandes corporelles (col/épaule/poignet/taille/bassin/cheville) depuis E3/E4.
- **5.1.B** Résoudre les ancrages de torse, bras et jambes séparément, avec continuité aux coutures et fermeture des jonctions.
- **5.1.C** Préserver les proportions graphiques intentionnelles (ample, près du corps, long/court) et autoriser des valeurs d'aisance estimées, non un « tout étirer à 100 % ».
- **5.1.D** Produire plusieurs FitPlan candidats si une tenue admet plusieurs placements ; départager avec une fonction de coût explicite.

### S5.2 — Corps de différentes corpulences
- **5.2.A** Générer fit pour morphologies E1, par produit croisé raisonnablement échantillonné des attributs indépendants.
- **5.2.B** Mesurer séparément l'effet de changer les épaules, la poitrine, le ventre, les hanches, la taille et les longueurs de membres.
- **5.2.C** Détecter compression locale extrême, chevauchement aux aisselles/entrejambe et parties sortant du contour.
- **5.2.D** Émettre une condition « fit visuel hors domaine » sans choisir silencieusement une taille de vêtement différente de celle importée.

### S5.3 — Construction de la cage déformable
- **5.3.A** Construire une cage topologique autour des segments corporels et des coutures ; séparer les maillages par panneau.
- **5.3.B** Définir les poids de transfert depuis les segments/landmarks corporels vers les sommets du vêtement.
- **5.3.C** Générer automatiquement ces poids par harmonisation/coordonnées barycentriques ou solveur équivalent ; **aucune peinture de poids par utilisateur**.
- **5.3.D** Vérifier que le maillage conserve ses ouvertures et des UV valides après auto-adaptation.

### S5.4 — Tests fit différentiel / retour utilisateur
- **5.4.A** Capturer les mêmes tenues sur au moins une silhouette nominale et deux silhouettes tenues à l'écart, sous poses fixes communes.
- **5.4.B** Comparer au témoin d'épinglage/réticule + échelle uniforme, même résolution, même dessin.
- **5.4.C** Faire noter par au moins deux observateurs indépendants l'alignement, l'ampleur, les déchirures et le besoin de retouche.
- **5.4.D** Archiver les images/mesures de la pire combinaison et les taux de refus correct ; ne pas optimiser seulement la moyenne.
- **DoD E5 :** une même tenue s'adapte automatiquement à plusieurs silhouettes sans saisie de rig par utilisateur ; résultat vérifié par mesures, pas seulement par apparence neutre.

## E6 — Suivre toute l'animation sans effondrer le vêtement

### S6.1 — Déformation primaire à partir de la pose
- **6.1.A** Appliquer chaque PoseFrame validée aux cages E5 en gardant les coutures et les attaches.
- **6.1.B** Calculer les triangles du vêtement selon l'orientation et la profondeur locale du corps, sans faire suivre les manches uniquement au torse.
- **6.1.C** Interpoler les positions avec continuity temporelle indépendante de la fréquence de dessin ; vérifier pause/reprise/scrub déterministes.
- **6.1.D** Mesurer stretch, ratios de surface, déformations aux jonctions et triangles inversés avec l'instrument PR #6 si assimilé.

### S6.2 — Contraintes de forme et réparation contrôlée
- **6.2.A** Définir des contraintes de longueurs/bords/coutures/aire régularisée avec poids bornés ; séparer erreurs de mannequin et erreurs de vêtement.
- **6.2.B** Ajouter un résolveur minimal déterministe capable de limiter un triangle écrasé sans modifier silencieusement l'ensemble de la silhouette.
- **6.2.C** Tester cas extrêmes : bras croisés, manches en tension, jupe qui traverse les jambes, ourlet qui s'écrase.
- **6.2.D** Refuser la frame ou basculer en rendu sécurisé lorsque l'optimisation diverge ; journaliser la dégradation.

### S6.3 — Coût et stabilité temporelle
- **6.3.A** Mesurer temps CPU et allocations par frame sur résolutions de maillage croissantes et plusieurs tenues.
- **6.3.B** Comparer la trajectoire à 15/30/60 FPS en alignant les **mêmes** timestamps de replay.
- **6.3.C** Tester saccades, trous de 200 ms, retour après suspension et échanges rapides de tenue.
- **6.3.D** Séparer latence de calcul, de peinture, de rendu navigateur et de source VTS ; pas de pourcentage de FPS sans environnement.

### S6.4 — Choix de solveur et ablations
- **6.4.A** Faire tourner successivement épinglage VTS-like, déformation uniforme, skinning basé articulations, cage déformable, cage + contraintes.
- **6.4.B** Mesurer comparativement pour chaque variante la même matrice morphologie×tenue×pose.
- **6.4.C** Identifier cas où la variante plus complexe régresse ; documenter coûts d'initialisation et d'exécution.
- **6.4.D** Conserver le solveur le plus simple satisfaisant les critères gelés, même si l'alternative IA est plus spectaculaire.
- **DoD E6 :** tenue stable en mouvement et sur silhouettes distinctes, sans rig vestimentaire manuel, avec échecs explicites.
