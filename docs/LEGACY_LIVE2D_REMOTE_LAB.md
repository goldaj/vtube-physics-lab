# Historique de l'idée Live2D Remote Lab transférée de l'incubateur

L'ancien texte ci-dessous est conservé à l'identique, daté d'avant la consolidation dans `goldaj/vtube-physics-lab` le 2026-10-26. Les besoins **d'audio distant**, de synchronisation réseau sécurisée, de publication/versioning et de téléphone fonctionnant hors du Wi-Fi local restent enregistrés; **pas implémentés** dans le premier prototype.

Source originale : https://github.com/goldaj/projects-incubator/blob/main/ia-et-multimedia/live2d-remote-lab.md (ancien historique Git).

---

# Live2D Remote Lab — visualiseur et banc de rejeu sur téléphone

**Statut : idée à isoler d'un projet déjà existant.** Enrichi le 2026-10-26. Le concept remonte à des échanges de septembre 2026 autour de Live2D, VTube Studio et d'un personnage piloté par une IA.

## Intention réellement exprimée
Voir et entendre à distance, **depuis un téléphone**, un avatar Live2D préparé sur PC, idéalement sans que le téléphone exécute l'IA et **sans caméra de tracking**. L'avatar bouge grâce aux événements, expressions ou mouvements envoyés par l'IA du PC, pas grâce à la tête de l'utilisateur. L'accès doit fonctionner **hors du Wi-Fi local**, avec hébergement sobre, voire gratuit à petite échelle, et mises à jour du modèle après nouvel export. Cette demande s'inscrit historiquement dans l'écosystème de **Jade** et de **VTube Studio**, qui ont déjà leurs propres travaux.

## Scénarios d'usage
1. Préparer/rigguer un modèle sur PC dans Cubism, exporter les ressources Live2D, puis publier une **version** consultable sur mobile.
2. Sur un téléphone distant, ouvrir un visualiseur, charger cette version, écouter les voix associées et voir les expressions/mouvements générés par l'IA du PC.
3. Depuis le PC, rejouer un scénario de test « clignement → regard → sourire → parole » et comparer le résultat sur le téléphone et dans VTube Studio.
4. Remplacer le modèle par une nouvelle version sans réinstaller l'application mobile, avec possibilité de revenir à la version précédente si celle-ci est cassée.

## Découpage technique proposé, à tester
- **Publication des assets** : export `.model3.json`, `.moc3`, textures, motions, `.physics3.json` et manifeste versionné ; droits d'utilisation et tailles vérifiés.
- **Lecteur** : SDK Live2D Cubism Web compatible/licencié ou solution autorisée équivalente ; mesurer mémoire, FPS, latence, chauffage et consommation sur smartphone.
- **Pilotage** : protocole d'événements documenté (expressions, paramètres, motions, synchronisation audio), valeurs bornées, horodatage et répétition de séquences.
- **Modes distincts** : (A) laboratoire autonome avec séquences enregistrées, (B) miroir du pilotage PC en réseau, (C) éventuelle synchronisation plus riche avec les outils existants.
- **Réseau** : stockage statique du modèle, endpoint ou WebSocket sécurisé pour commandes si temps réel justifié, reconnexion, version des messages, auth, limites de débit ; aucun port domestique exposé par défaut.
- **Comparaison** : rendu natif dans VTube Studio et rendu web ne sont pas identiques ; noter les différences au lieu de promettre une reproduction parfaite.

## Vrai périmètre de l'incubateur
**Ce laboratoire ne doit pas dupliquer Jade**, ses connecteurs ni son client distant s'ils sont déjà en cours de réalisation. Il a un sens autonome comme **outillage générique de test, visualisation et rejeu Live2D**, réutilisable sur plusieurs modèles sans lancer le chatbot. Si le seul objectif est d'améliorer le téléphone de Jade, transférer plutôt ces exigences dans son dépôt et retirer cette fiche.

## Premier protocole, sans lancement de code
Vérifier licences Live2D/VTS, export autorisé et formats utilisables sur le web ; définir dix événements synthétiques, une cible de latence à **choisir après mesure**, un protocole réseau sans secrets, et la manière de comparer les paramètres physiques. Mesurer fiabilité, fps, consommation et écarts de rendu sur une configuration mobile de référence.

**À trancher :** outil de labo autonome ou fonctionnalité Jade, moteur de rendu web licite, nécessité du mode temps réel, limites de l'offre d'hébergement.
