# Chronologie du projet VTube Physics Lab et Live2D Remote Lab

**Attention : archive partielle.** Les anciennes conversations complètes ne sont pas disponibles ici; seuls quelques extraits résumés ont pu être retrouvés. Ne pas inventer de transcript intégral ni d'horodatages.

## 2026-09-13 (récupération mémoire, résumés non verbatim)
**Utilisateur (résumé non verbatim) :** modèle VTuber piloté par IA sur PC; téléphone sans caméra, affichage via fichiers publiés/cloud, fonctionnement autonome après téléchargement; correspondance des paramètres VTube Studio.
**Assistant (résumé non verbatim) :** propose Live2D Remote Lab modes AI Replay, Auto Demo, VTS Simulator et Physics Lab, publication/versions, rejoue de paramètres IA et physique modifiable.
**Assistant (résumé non verbatim) :** constate que viewers/riggers/renderers existent déjà; différenciation sur versioning PC→cloud, replay IA et interface adaptée; ne pas recoder le renderer.
**Limite :** aucune demande de vêtements sans rig manuel explicitement retrouvée dans ces extraits.

## 2026-10-26 — nouvelle exigence utilisateur (verbatim visible)
> On n'avait pas aussi une notion d'avoir des vêtements interchangeables qui s'adaptent à la physique ? On le dessine en 2D et le lab le fait s'adapter pour qu'il n'y ait pas besoin de le rig ou autre.
> On garde ça dans un coin de la tête si c'était pas explicite jusqu'à aujourd'hui
> Bref je t'ai coupé, tu peux reprendre avec ces nouvelles informations à prendre en compte.

**Assistant (résumé non verbatim) :** confirme l'ajout à l'étude auto-vêtement, refuse d'affirmer que l'idée était déjà attestée. Envisage transfert de déformation du corps, contraintes/physique secondaires, test T-shirt simple et comparaison à l'état de l'art Live2D/PSD2Live. Poursuit la création du dépôt.
**Pas de secrets, modèles privés, screenshots personnels ou exports de l'utilisateur recopiés sur GitHub.**

## 2026-10-26 — Première session d'implémentation
**Assistant (résumé non verbatim)** : initialisation `develop` puis branche `feat/replay-clothing-spike` et [PR #1](https://github.com/goldaj/vtube-physics-lab/pull/1). Écriture d'un schéma de rejeu déterministe sans caméra, simulation de ressort, repères corporels fictifs, maillage pour texture de vêtement, dessin/import/export PNG et UI.
**Preuve :** Node checks et huit tests réussis au workflow [40372532646](https://github.com/goldaj/vtube-physics-lab/actions/runs/40372532646). **Échec précédent 40372132724** dû à la référence prématurée au fichier `web/app.mjs` avant son ajout, corrigé par la tranche suivante.
**Limites :** pas d'essai sur vrai Live2D/SDK, pas de synchronisation distante/mobile autonome encore démontrée.
**Préservation historique :** copie intégrale de la fiche enrichie `live2d-remote-lab.md` dans `docs/LEGACY_LIVE2D_REMOTE_LAB.md`, notamment audio distant et connexion hors Wi-Fi.

**Assistant (résumé de la même session, non verbatim)** : ajoute un cache PWA limité au shell et manifeste pour préparer le laboratoire sans réseau après chargement; ne revendique pas de test offline smartphone ni de persistance de données utilisateur.

## 2026-10-26 — Fin de session et coordination Codex
**Assistant (résumé non verbatim)** : consolide le dépôt sous une PR en brouillon, conserve le contexte de l'idée Remote Lab enrichie, ajoute service worker et manifeste, crée des issues de QA / recherche vêtements / Cubism-VTS / mobilité-audio. L'incubateur [PR #4](https://github.com/goldaj/projects-incubator/pull/4) a été fusionnée ; la fiche VTube Physics côté Jeux était déjà absente sur main. Un point d'entrée `docs/CODEX_ACTIVE_WORK.md` a été ajouté sur develop. Aucun test visuel navigateur ni compatibilité réelle Live2D n'ont été revendiqués.


## 2026-10-27 — Programme auto-clothing humanoïde extensible : demande explicite du propriétaire

**Utilisateur (verbatim exact, message de la présente conversation ; heure du message non attestée)** :

> Sur un modèle humanoïde tout simple, sur des tests avec plusieurs corpulences du moment que ça colle avec un modèle humanoïde simple, on colle une vêtement simple du type humain normal ; robe, t-shirt, pull, pantalon, short, jupe, ce genre de choses, on veut que ça s'adapte automatiquement pour toutes ces combinaisons.
> Détails les étapes pour arriver à ça. Pour chaque étape, détails les sous étapes.
> Pour chaque sous étapes, tu détailleras les sous-sous-étapes trop proches d'actions simples. S'il faut émettre des hypothèses parce que tu n'as pas tous les détails, tu expliciteras t'es hypothèses. Et ensuite tu documenteras tout ça dans le github à l'attention de celui qui prendra le relai pour les développements.
> En exemple de modèle tu peux prendre ce que tu veux, par exemple un model vtubestudio par défaut ou même Jade puisqu'elle est humanoïde. Ou encore un truc créé de zéro. Comme tu veux.
> Mais l'idée à la fin c'est que ça doit coller avec un modèle vtubestudio qui sera animé en 2D, hypothétiquement sans vêtements (en sous vêtements) par-dessus lesquels on plaquera proprement les vêtements qu'on propose avec ce studio (et n'importe quel vêtements à terme) et qui s'adaptera tout seul au modèle.

**Utilisateur (verbatim exact, précision apportée avant fin du travail)** :

> Ne te limite pas à 6 familles de vêtements, à terme il n'y a pas de limite. Ça c'est juste une étape parmis d'autres

**Assistant (résumé non verbatim du travail effectué le 27/10/2026)** : création d'une branche **documentaire autonome** « research/gpt6-universal-auto-clothing-plan-20261027 » et de la [PR #7](https://github.com/goldaj/vtube-physics-lab/pull/7) ciblant « feat/replay-clothing-spike » (PR #1), indépendante de la PR #6 consacrée aux mesures. Le plan comporte 14 grandes étapes E0–E13, 56 sous-étapes et 224 actions directement réalisables, les hypothèses, risques, interfaces et protocole d'évaluation. La capacité à traiter de nouveaux vêtements **non vus** sans code de famille ni rig vestimentaire manuel est l'objectif central ; les six catégories proposées sont seulement les fixtures initiales. Des contraintes d'accès aux ArtMeshes VTS, de licence et de donnée sous-déterminée sont explicitées. **Aucun code, prototype d'auto-adaptation généralisée, benchmark nouveau ni essai sur véritable avatar Cubism/VTS réalisé pour cette PR documentaire**. Aucune fusion dans « develop », Jade ou les projets Hyperliquid.

**Documentation Codex à relire en priorité** : docs/auto-clothing/00-PRODUCT-CONTRACT.md, 01-BACKLOG-E0-E6.md, 02-BACKLOG-E7-E13.md, 03-EXPERIMENT-DESIGN.md, 04-CODEX-HANDOFF.md, puis les pointeurs ajoutés à AGENTS.md, AUTO_CLOTHING.md, TASKS.md, HANDOFF.md et CODEX_ACTIVE_WORK.md. Les anciens échanges complets ne sont toujours pas prétendus exhaustivement archivés.
