> Cadrage transféré depuis l'incubateur le 2026-10-26. Ce dépôt dédié est désormais la source de vérité ; la description demeure hypothétique, aucun test ni benchmark n'est attesté.
>
> Source historique : https://github.com/goldaj/projects-incubator/blob/main/jeux/vtube-physics-lab.md (voir l'historique Git après retrait de l'index).

# VTube Physics Lab — tester le mouvement d'un modèle Live2D

**Statut :** projet transféré vers un dépôt autonome ; les fonctions et protocoles ci-dessous restent des hypothèses à challenger.

## Question produit
Comment régler et comparer **les paramètres de physique et les mouvements d'un avatar 2D** sans refaire manuellement la même séquence dans VTube Studio, et surtout **sans caméra** ? Contexte d'origine : essais autour d'un modèle Live2D destiné à être piloté par une IA plutôt qu'un face-tracking humain.

## Cas d'usage
Un créateur choisit un modèle autorisé, configure une animation de référence (inclinaison de tête, mouvement d'yeux, bouche, cheveux, vêtements), enregistre un jeu de paramètres A, puis B. Il rejoue exactement la même chronologie et compare le comportement. Il peut isoler une oscillation indésirable, un mouvement trop amorti, une collision visuelle ou une différence entre Cubism et VTube Studio.

## Fonctions théoriques
- Définir la **liste réelle des paramètres** `ParamAngleX`, `ParamEyeLOpen` et autres **par inspection du modèle**, ne pas supposer que tous sont présents.
- Générer des **séquences synthétiques** horodatées avec amplitudes, durée, interpolation, boucles et événements sonores facultatifs.
- Piloter un moteur de rendu/physics compatible ou un VTube Studio accessible par son API autorisée ; déclarer la différence entre **pilotage de paramètres** et **simulation du moteur de physique Live2D**.
- Afficher courbes entrée/sortie, dépassement, délai de stabilisation, état et captures comparables.
- Sauvegarder les presets A/B avec versions du modèle et des fichiers `.physics3.json`.
- Vérifier les bornes et éviter d'écraser le modèle source pendant les tests.

## MVP à expérimenter
Un petit modèle d'essai sous licence adéquate, trois paramètres physiques, un fichier de scénario reproductible, deux presets et une comparaison de mouvements. Commencer par inspecter les capacités réelles de Cubism SDK / VTube Studio et leurs licences ; **une API de pilotage ne permet pas nécessairement de modifier toute la physique interne**.

## Différence avec Live2D Remote Lab
Physics Lab vise **la calibration et la mesure des mouvements** ; Remote Lab vise **l'affichage sur téléphone distant et le rejeu**. Les deux pourraient partager le format de scénarios, mais il faut éviter d'en faire deux produits doublonnant Jade ou des fonctions déjà codées dans son dépôt.

## Incertitudes
Besoin d'un rendu sans VTube Studio ou tolérance à sa dépendance ? Réglages éditables à chaud ou simples comparaisons hors ligne ? Qualité perceptuelle mesurée manuellement ou instrumentée ? Décider seulement après une revue des capacités SDK/API et des droits d'usage.

**Aucun rig, modèle ou benchmark n'est fourni dans ce dépôt public.**
