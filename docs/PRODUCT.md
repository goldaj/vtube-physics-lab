# Contrat produit consolidé (2026-10-26)

## Origines
Les anciennes notes `vtube-physics-lab` indiquaient un banc de réglages physiques Live2D. `live2d-remote-lab` indiquait visualiseur web, simulateur VTube Studio et rejeu de séquences. Les discussions récupérées du 13/09/2026 détaillaient modes **AI Replay, Auto Demo, VTS Simulator, Physics Lab**, accès PC/téléphone, modèle publié en version et téléphone autonome après téléchargement. Les échanges de 2026 antérieurs sont **partiels**.

## Persona et workflow
Depuis le PC de création/IA : export du modèle **autorisé**, des paramètres et des séquences. Le client léger téléphone les récupère une fois, puis visualise et rejoue *sans caméra et sans PC connecté* (une fois assets et runtime présents). Une synchronisation/versioning cloud peut ajouter de nouvelles versions, **pas une dépendance permanente**.

Modes :
- **AI Replay** : capturer/charger une séquence de paramètres (pas les images vidéos) puis rejouer exactement au même instant.
- **Auto Demo** : animation autonome synthétique (respiration, balancement), sans caméra.
- **VTS Simulator** : approximer un profil de paramètres VTube Studio pour reproduire des entrées; la parité réelle nécessitera test sur VTS, pas d'API cachée.
- **Physics Lab** : varier gravité, ressort/amortissement et comparer la réponse déterministe, notamment cheveux, tissus et accessoires.
- **Future Auto Clothing** : vêtement dessiné en 2D, interchangeabilité et adaptation de sa déformation/physique automatiquement, sans recoder un modèle pour chaque tenue. **Exigence explicitement ajoutée le 26/10/2026.**

## Non-objectifs immédiats
Pas de capture visage/caméra, pas d'agent IA complet, pas de boutique/vêtements payants, pas de cloud obligatoire, pas d'éditeur de rigging généraliste, pas de promesse de compatibilité universelle de tous les modèles.

## Preuves de réussite graduées
1. Rejeu de paramètres sur horloge contrôlée identique et portable.
2. Harnais visuel lisible PC/téléphone et réglage physique reproductible.
3. Habillage automatique simple sur personnage canonique, **puis** vrai rig/ArtMeshes Live2D autorisé.
4. Reprise offline sur téléphone après téléchargement des ressources; version choisie, séquence rejouée.
5. Calcul et validation des efforts manuels restants pour les vêtements; vérifier si l'objectif « pas de rig » tient.
