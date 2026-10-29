# 02 — Plan d'exécution détaillé, partie B : calques, physique, Live2D, VTS, généralisation

Suite directe de 01-BACKLOG-E0-E6.md. Même hiérarchie : E = étape avec critère de sortie, S = sous-étape, A/B/C/D = **sous-sous-étape opérationnelle**, et chaque décision produit artefact, test et trace. Les six types de vêtements initiaux sont des **fixtures** ; aucune frontière définitive du catalogue.

## E7 — Occlusions et empilement des tissus : plus qu'une image collée

**Hypothèse :** un rendu 2D/2.5D raisonnable exige des calques distincts et des masques de profondeur même sans simulation 3D réelle.

### S7.1 — Graphe des ordres de rendu
- **7.1.A** Exprimer un graphe de priorités partielles entre cheveux/bras/torse/jambes et panneaux textiles.
- **7.1.B** Pour chaque pose, marquer les régions du vêtement devant/derrière bras, mains et jambes (ex. bras posé sur une robe).
- **7.1.C** Détecter et refuser les cycles impossibles de profondeur ; ne pas les résoudre par ordre de dessin arbitraire.
- **7.1.D** Exporter l'ordre réellement choisi et la cause de chaque priorité pour debug.

### S7.2 — Masques automatiques du corps et des ouvertures
- **7.2.A** Générer des masques de peau/cheveux/bras/jambes depuis BodyRigDescriptor et chaque PoseFrame.
- **7.2.B** Générer trous du cou, poignets, manches et jambes du pantalon depuis GarmentDescriptor et FitPlan.
- **7.2.C** Calculer intersections de masque et mettre en place le clip correct sans effacer des motifs transparents valides.
- **7.2.D** Tester des cas adversariaux : un bras devant le torse, autre derrière ; jambe devant la jupe ; cheveux recouvrant un col.

### S7.3 — Superpositions de plusieurs tenues
- **7.3.A** Définir une interface de couches : sous-vêtements, vêtement bas, vêtement haut, couche externe, accessoire sans imposer une liste fermée.
- **7.3.B** Définir des contraintes incompatibles (deux pans au même plan impossible, doublure et veste qui s'interpéntrent).
- **7.3.C** Tester T-shirt+pantalon, pull+jupe, veste+robe puis combinaison multipanneaux inconnue.
- **7.3.D** Mesurer coûts de rendu, conflits et rapport d'échec d'occlusion par séquence.

### S7.4 — Critères perceptuels et paramètres inconnus
- **7.4.A** Définir avec des images annotées ce qu'est une occultation correcte ; permettre qu'un masque soit « inconnu ».
- **7.4.B** Confronter les graphes de profondeur aux vérités terrain des silhouettes simulées.
- **7.4.C** Réserver des poses où l'ordre de profondeur change pendant l'animation ; tester la continuité.
- **7.4.D** Corriger le modèle de profondeur générique, **pas** ajouter un correctif « robe gauche + bras droit » par nom de vêtement.
- **DoD E7 :** le textile passe devant/derrière les bonnes régions dans les poses supportées, sans clipping arbitraire caché.

## E8 — Physique secondaire des zones libres, indépendante de la classe de vêtement

### S8.1 — Région rigide, attachée ou libre
- **8.1.A** Décrire chaque panneau par masse apparente, souplesse, amortissement, bord attaché/bord libre et contraintes.
- **8.1.B** Classifier physiquement le vêtement depuis son graphe, texture et annotations facultatives, **sans sélectionner seulement un preset robe/pantalon**.
- **8.1.C** Affecter le moteur de contraintes aux pans libres et garder ancrages/coutures sur le corps.
- **8.1.D** Publier les hypothèses de matériau ; une PNG n'indique pas l'épaisseur ou la densité physique réelles.

### S8.2 — Simulation stable et bornée
- **8.2.A** Réutiliser le ressort à pas fixe de src/physics.mjs lorsque pertinent, puis isoler un solveur de panneaux multi-points versionné.
- **8.2.B** Fixer bornes de vitesse, déplacement, accélération et temps CPU maximum avant optimisation.
- **8.2.C** Implémenter collisions 2D contre régions corporelles et **entre couches textiles** dans les cas représentables.
- **8.2.D** Valider l'absence d'explosion numérique au replay long, à la pause, au scrub, au changement brutal de pose.

### S8.3 — Réinitialisation et transition vestimentaire
- **8.3.A** Réinitialiser état mécanique du vêtement remplacé, sans effacer l'état de pose du corps.
- **8.3.B** Tester changement robe→pantalon→jupe pendant un mouvement avec même timestamp de contrôle.
- **8.3.C** Tester suspension de l'appli, retour après plusieurs secondes, jump temporel et boucle du replay.
- **8.3.D** Mesurer résidus d'impulsion, traversées et pics de latence ; documenter la stratégie de refroidissement/snap.

### S8.4 — Comparaison obligatoire physique OFF/ON
- **8.4.A** Préenregistrer la matrice « body + fit sans physique » comme témoin.
- **8.4.B** Activer physique avec paramètres déclarés avant observation des scénarios tenus à l'écart.
- **8.4.C** Comparer contour, faux plis, traversées, dérive, coût, avis humains sur mêmes frames.
- **8.4.D** Rejeter la physique qui dégrade le fit, même si l'animation paraît plus vivante sur une seule prise.
- **DoD E8 :** physique secondaire stable et facultative, sans franchir les attaches ni détériorer les silhouettes réservées.

## E9 — Banc de tests multifactoriel, falsification et ergonomie

### S9.1 — Matrice de tests couverte et tenue à l'écart
- **9.1.A** Générer la matrice profils de corps × tenues × ensembles de poses × conditions de simulation.
- **9.1.B** Identifier sources d'images et licences ; stocker hors Git les ressources tierces non redistribuables.
- **9.1.C** Séparer développement/validation/holdout selon **identité de vêtement et de corps**, pas seulement par frames d'une même animation.
- **9.1.D** Prévoir des cas inconnus : nouveau graphe vestimentaire, silhouette mixte inédite, pose avec croisement et occlusion.

### S9.2 — Mesures et contrôle de qualité
- **9.2.A** Réutiliser métriques PR #6 (stretch, area, flip, collapse, ancrage, vitesse) ; ajouter masque d'occlusion, intersection corps/tissu et couture ouverte.
- **9.2.B** Compter automatiquement frames rejetées/invalides, temps d'installation, temps de correction, pourcentage sans intervention et débit.
- **9.2.C** Définir une grille d'acceptation humaine sur lisibilité, tombé, occlusion, fidélité de la texture, perception de taille ; annotateurs indépendants.
- **9.2.D** Publier moyennes ET pires cas ET intervalles d'incertitude ; les meilleurs exemples seuls ne valent pas validation.

### S9.3 — Qualité des expériences
- **9.3.A** Déclarer seuils/critères, appareil, version, entrées et calendrier de mesure avant de regarder le holdout.
- **9.3.B** Comparer les mêmes cas à image simplement redimensionnée, à un point épinglé, à deux points, à cage+physique.
- **9.3.C** Mesurer la sensibilité aux paramètres et aux hypothèses de matériau/morphologie, puis justifier leur plage.
- **9.3.D** Faire tourner un test « futurs frames ajoutées » et un test de reprise sauvegardée pour écarter fuite temporelle ou non-déterminisme.

### S9.4 — Utilisation par une personne non technique
- **9.4.A** Proposer interface « déposer corps / déposer vêtement / appliquer / changer / revenir en arrière ».
- **9.4.B** Observer un petit groupe de testeurs sur au moins deux morphologies qu'ils n'ont pas déjà configurées.
- **9.4.C** Comptabiliser les actions réellement demandées par le logiciel, en distinguant correction sémantique et rigging.
- **9.4.D** Faire évoluer l'UX à partir des échecs constatés sans modifier les tests scientifiques déjà gelés.
- **DoD E9 :** rapport complet, y compris refus, coûts, corrections, tests à l'aveugle et nouveaux types.

## E10 — Démontrer l'intégration sur un véritable modèle Live2D autorisé

**Ne pas choisir le modèle de Jade par facilité si ses droits, paramètres et fichiers sources ne sont pas déjà clarifiés.** Préférer un modèle d'essai créé pour le projet, paramétré et exporté légalement.

### S10.1 — Sélection et préparation licites
- **10.1.A** Identifier modèle source dont les droits de modification, test et diffusion sont explicites.
- **10.1.B** Vérifier version Cubism Editor, SDK, fichiers .model3.json/.moc3 et textures, sans les recopier dans Git si sous licence incompatible.
- **10.1.C** Identifier si le modèle possède corps/bras/jambes **suffisamment visibles**, sous-vêtements et mouvement riggé.
- **10.1.D** Enregistrer version et hash des assets locaux, documenter source et conditions d'usage sans les publier.

### S10.2 — Observation des paramètres et vrais drawables
- **10.2.A** Charger le modèle avec le Cubism SDK obtenu par la voie officielle, selon sa licence, dans un harnais local dédié.
- **10.2.B** Inventorier paramètres et ranges qui contrôlent angles, respiration, bras, jambes et mouvements réellement exposés.
- **10.2.C** Déterminer expérimentalement quels contours/sommets/ArtMeshes et ordres de dessin sont lisibles dans le runtime sélectionné.
- **10.2.D** Distinguer informations connues du modèle de celles absentes dans l'API ; ne pas fabriquer des landmarks « provenant de VTS » quand ils sont inférés.

### S10.3 — Transfert du modèle réel dans l'interface de pose
- **10.3.A** Construire un adaptateur BodyRigDescriptor pour ce modèle sans modifier les composants génériques du solveur.
- **10.3.B** Échantillonner les poses réelles dans l'ordre et les timings du replay versionné ; extraire références vérifiables.
- **10.3.C** Ajuster le vêtement E5 et mesurer les différences entre correspondance vraie et repères inférés.
- **10.3.D** Valider que le même vêtement est interchangeable et suit bras/bassin/torse sur ce **vrai modèle**, pas seulement sur le mannequin E1.

### S10.4 — Séparation des responsabilités
- **10.4.A** Comparer moteur vêtement en overlay externe (contrôle total de géométrie mais limites d'occlusion) avec éventuelle chaîne d'authoring/export.
- **10.4.B** Préparer un spike de reconstitution de calques compatible avec les drawables effectivement disponibles, sans modifier ni redistribuer Core.
- **10.4.C** Signaler rigging du **modèle corps** nécessaire une fois versus rigging interdit de la **tenue** à chaque ajout.
- **10.4.D** Produire rapport GO/NO-GO sur véritable modèle, listant poses/vêtements/morphologies qui échouent.
- **DoD E10 :** vidéo/replay autorisé sur vrai modèle avec données de QA, preuve distincte de l'essai VTS. Aucun succès déclaré si aucun modèle légal n'est réellement utilisé.

## E11 — Intégration réelle VTube Studio : trancher le chemin technique

**Contrainte :** l'API VTube Studio fournit des fonctionnalités de paramètres et d'items, pas nécessairement l'ensemble des vertices animés du modèle; vérifier la version plutôt que présumer une injection native.

### S11.1 — Cartographie officielle de l'API
- **11.1.A** Consigner pour la version testée les appels d'autorisation, liste des modèles, liste/valeur des paramètres, items/pinning et fonctionnalités de couche.
- **11.1.B** Définir un connecteur local explicitement autorisé, token conservé hors Git et hors export de rapports.
- **11.1.C** Tester connexion, changement de modèle, expiration/erreur, fermeture et refus utilisateur **sans écriture/injection de paramètres** pour le premier spike.
- **11.1.D** Mesurer cadence, timestamp et dérive entre frame du modèle dans VTS et données de paramètre accessibles.

### S11.2 — Trois voies de rendu, démontrées séparément
- **11.2.A** Voie A témoin : PNG item épinglé à l'ArtMesh ; mesurer glissement sur bras/torse et ordre de profondeur. Cela **ne** démontre **pas** l'auto-fit.
- **11.2.B** Voie B : application vestimentaire externe rend sa tenue depuis paramètres VTS/landmarks locaux et produit une sortie compositable (par ex. OBS) synchronisée au modèle.
- **11.2.C** Voie C : étudier export/réassemblage de modèle via workflow d'édition/compilation Cubism autorisé si nécessaire pour obtenir les vrais calques/masques ; ne pas promettre l'automatisation du .moc3 sans preuve.
- **11.2.D** Mesurer pour chaque voie latence, compatibilité, fluidité, fidélité des masques, coût de licence et interventions. La voie la plus simple qui satisfait le produit l'emporte.

### S11.3 — Correction de pose, perte de flux et reconfiguration
- **11.3.A** Mapper les paramètres réellement exposés vers PoseFrame et marquer ceux absents avec statut « indisponible ».
- **11.3.B** Synchroniser poses vêtement et corps sur une horloge définie ; tester variation de latence et FPS.
- **11.3.C** Lors d'un changement de modèle/tenue ou perte VTS, arrêter la mise à jour, figer/masquer proprement puis reconstruire le FitPlan validé.
- **11.3.D** Démontrer qu'aucun token, modèle, texture personnelle ni rendu de l'utilisateur n'est envoyé à un service distant sans autorisation explicite.

### S11.4 — Test de réception VTS
- **11.4.A** Faire tourner sur **un vrai VTube Studio** un avatar humanoïde autorisé, plusieurs morphologies si disponibles et un jeu de vêtements variés.
- **11.4.B** Capturer des séquences de mouvements, incluant superposition et obstacles, avec consignes de licence/consentement.
- **11.4.C** Faire noter indépendamment alignement, retard, occlusion et recours aux corrections, puis comparer aux voies A/B/C.
- **11.4.D** Déclarer **GO L2** seulement si le résultat fonctionne réellement **pendant** l'animation VTS, même si la méthode est un overlay ; documenter explicitement la méthode choisie.
- **DoD E11 :** protocole VTS reproduit avec versions et sources, méthode d'intégration prouvée, et limitations publiées.

## E12 — Généralisation au-delà des premières catégories sans nouvelle branche de code

### S12.1 — Taxonomie extensible et profil inconnu
- **12.1.A** Ajouter 3 à 5 nouveaux types de vêtements NON utilisés pour concevoir le solveur (ex. manteau, combinaison, cape, salopette, pièce asymétrique).
- **12.1.B** Générer leur GarmentDescriptor depuis images/graphes, sans changer le solveur et sans nouvelle constante « type de vêtement ».
- **12.1.C** Vérifier que les primitives de coutures/ouvertures couvrent les nouveaux graphes ; sinon introduire une **primitive générique versionnée**, justifiée par plusieurs exemples.
- **12.1.D** Tenir un journal « modification solveur nécessaire / description suffisante / refus correct » pour mesurer la généralisation réelle.

### S12.2 — Morphologies inconnues et complexité croissante
- **12.2.A** Introduire des silhouettes mixtes, proportions moins standards et asymétries visuelles dans des limites explicitement définies.
- **12.2.B** Comparer le même vêtement et la même pose sur ces corps, sans retoucher le FitPlan manuellement.
- **12.2.C** Tester ensembles en couches, fermeture ouverte, manches volumineuses, pans qui se croisent et vêtements à relief simulé.
- **12.2.D** Signaler régions du modèle hors domaine (ailes, queues, membres supplémentaires) comme extensions de modèle anatomique futures ; ne pas annoncer couverture illimitée.

### S12.3 — Stratégie d'apprentissage éventuelle, conditionnelle
- **12.3.A** Identifier les limites démontrées des heuristiques et du solveur générique sur holdouts externes.
- **12.3.B** Si pertinent, collecter/annoter uniquement des données consenties dont les droits autorisent entraînement et distribution de métadonnées.
- **12.3.C** Entraîner un classifieur d'éléments géométriques ou une proposition de masques, **pas un modèle de styles qui invente la tenue à la place du dessin**.
- **12.3.D** Comparer sans fuite « solveur seul » vs « solveur + vision », coût et couverture alignés, avec modèle de secours explicable.

### S12.4 — Tests de non-régression transversaux
- **12.4.A** Pour chaque nouveau vêtement, exécuter automatiquement le benchmark complet antérieur, et pas seulement une image du nouvel objet.
- **12.4.B** Surveiller régressions du T-shirt d'origine, du pantalon, des superpositions et des morphologies extrêmes.
- **12.4.C** Conserver tous les échecs, classer causes et mesurer nombre de jours/actions nécessaires pour ajouter la nouvelle catégorie.
- **12.4.D** Ne déclarer extension universelle que si de nouveaux vêtements passent **sans classe ni rig manuel dédié** ; sinon publier « domaine élargi de X à Y ».
- **DoD E12 :** démonstration documentée sur familles tenues hors développement, avec incidents et refus inclus.

## E13 — Livrable utilisable, sécurité, documentation et continuité

### S13.1 — Produit autonome minimal
- **13.1.A** Construire un chemin utilisateur de bout en bout : choisir avatar → vêtement → ajustement automatique → animation → changement instantané → export/partage local.
- **13.1.B** Tester sauvegarde/migration de BodyRigDescriptor, GarmentDescriptor, FitPlan et métadonnées sans exporter secrets ou licences ambiguës.
- **13.1.C** Définir UI de prévisualisation et outils de diagnostic simples ; l'édition manuelle fine du rig n'est **pas** nécessaire au chemin nominal.
- **13.1.D** Garder le mode sans caméra et la démo offline dès que les assets autorisés sont locaux ; distinguer les fonctionnalités PC/VTS/cloud.

### S13.2 — Robustesse et coût
- **13.2.A** Mesurer RAM/VRAM, coût initial de préparation et FPS sur machines cibles connues puis sur un PC modeste.
- **13.2.B** Tester fichiers énormes/corrompus, données manquantes, interruption, panne graphique, perte VTS, import simultané de tenues.
- **13.2.C** Prévenir téléchargement/exécution implicites, refus de contenu non licencié, stockage des tokens uniquement dans un coffre local.
- **13.2.D** Préparer retour arrière, purge des seuls caches du studio et restauration des états sans affecter VTube Studio ou le modèle original.

### S13.3 — Distribution et droits
- **13.3.A** Relire licence Cubism SDK/Core, restrictions d'outils extensibles, licences modèles/PNG/PSD et conditions de diffusion avant publication.
- **13.3.B** Expliciter la différence entre bibliothèque interne utilisée pour test, redistribution de modèle et export propre à l'utilisateur.
- **13.3.C** Contrôler secrets et assets du diff Git, vérifier que le dépôt n'embarque ni Cubism Core ni modèles tiers.
- **13.3.D** Produire guides d'installation/réinstallation et désinstallation complète de l'outil et du connecteur VTS.

### S13.4 — Fin de jalon, preuves et transfert Codex
- **13.4.A** Publier versions, tests unitaires/intégrés, CI, benchmarks, limites et rapports d'expérience, y compris négatifs.
- **13.4.B** Journaliser décisions d'architecture, variantes abandonnées, dette visuelle et erreurs de morphologie/catégorie.
- **13.4.C** Mettre à jour AGENTS, ROADMAP/TASKS, CODEX_ACTIVE_WORK, HANDOFF et CHATGPT_PROJECT_HISTORY depuis la branche sélectionnée.
- **13.4.D** Faire une revue d'acceptation indépendante sur un véritable VTS et des vêtements non vus ; émettre GO, GO limité ou NO-GO avant fusion/annonce.
- **DoD E13 :** produit de laboratoire exploitable, reproductible, sans secrets, clairement délimité ; aucune garantie de textile « universel » affirmée au-delà des cas réellement validés.

## Séquence de dépendances conseillée

E0 → E1 & E2 en parallèle → E3 & E4 en parallèle → E5 → E6 → E7 → E8 → E9 (mesures dès E1, audit formel ici) → E10 → E11 → E12 → E13.

**Chemin critique technique à challenger immédiatement :** la validité du BodyRigDescriptor sur un vrai Live2D/VTS et l'accès réel aux poses/ArtMeshes. Faire un **spike précoce borné** en parallèle de E3/E4 ; ne pas attendre E10 pour découvrir que le pont de données est impossible.

**Si un test bloque**, conserver les artefacts et les hypothèses réfutées ; avancer uniquement sur une voie alternative explicitement décrite (par ex. overlay externe plutôt qu'injection native). Ne jamais dénaturer un jalon en prétendant qu'un rendu du mannequin est un modèle VTS.
