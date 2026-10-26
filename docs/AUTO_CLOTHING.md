# Programme de recherche : vêtement 2D interchangeable **sans rig manuel**

**Nouvelle exigence utilisateur, 2026-10-26.** La question « l'avait-on dit dans les conversations plus anciennes ? » n'a pas trouvé de formulation explicite dans les souvenirs/relevés accessibles. Ne pas inventer d'antériorité.

## Vision
Importer un dessin 2D transparent (chemise, manteau, robe, manche, cheveux/écharpe à plus long terme) et l'habiller sur le personnage déjà riggé **sans re-rigger le vêtement** : attache, échelle, déformation adaptée aux paramètres d'origine, balancement secondaire, collisions et ordre de rendu. Permettre changement instantané de tenue.

## État de l'art 2026
- [Live2D auto-generation of deformer](https://docs.live2d.com/en/cubism-editor-manual/auto-generation-of-deformer/) crée des déformeurs automatiques pour humains plutôt frontaux/droits, mais impose des limites de posture et ne constitue pas un vêtement autonome interchangeable tout terrain.
- [Live2D model format](https://docs.live2d.com/en/cubism-sdk-manual/model-web/) : vertex/keyform/deformers sont compilés dans `.moc3` par Cubism Editor. Le SDK d'exécution n'offre pas magiquement un ArtMesh de vêtement riggé avec tout son historique de déformation.
- [VTube Studio Item System](https://github.com/DenchiSoft/VTubeStudio/wiki/Item-System) : PNG/items *pinned* au modèle (y compris ArtMesh). Attache utile comme première baseline mais pas simulation complète de manches/tissu.
- [PSD2Live](https://github.com/tsunehimatoi/psd2live) annonce un pipeline open source PSD → mesh, deformer, physique et export Cubism; vérifier version, licence, robustesse et compatibilité des exports **avant de recréer ce pipeline**.

## Hypothèses et expériences ordonnées
H0 : accessoire simple pinned à 1 ou 2 points; évaluer glissement sur bras/torse; ne pas appeler cela auto-rig.
H1 : **transfert de déformations** des points/maillages corporels vers un mesh vestimentaire inféré (barycentric weights / skinning 2D). Texture 2D warping; pas d'authoring par poses du vêtement.
H2 : physique secondaire (ressort, amortissement, contraintes longueur et collisions) sur régions libres : bas de veste, manches, jupe; ne pas refaire une robe riggée à la main.
H3 : segmentation automatique de dessin/PSD, classification manche/ourlet/col, points de couture, profondeur avant/arrière. Évaluer IA uniquement si H1/H2 prouvent insuffisants; une PNG monolithique ne contient pas automatiquement le même niveau de structure qu'un PSD.
H4 : intégration vrai modèle Cubism/VTS. Décider entre calque runtime externe synchrone (plus facile mais couches/occlusion limitées) et réexport modèle Cubism via pipeline existant (plus fidèle, licence/tech plus lourdes).

## Mesures
- Forme/contour corrects à 0°, 15°, 30° param angle, rotations bras, respiration.
- Glissement des épaulettes vs repères du corps (pixels normalisés), artefacts de manches, pénétration vêtement-corps, stabilité à 15/30/60 FPS.
- Dispersion physique si pas-à-temps variable; reproductibilité du rejeu (une même entrée doit donner la même trajectoire).
- Temps d'installation par vêtement (objectif de recherche : quelques clics), **besoin réel de correction manuelle**. Documenter cas d'échec, pas cacher les avatars non standards.

## Limites honnêtes
Pas d'algorithme actuellement intégré garantissant adaptation correcte pour tous les vêtements et modèles. Réduire la promesse à une catégorie (T-shirt frontal) pour le premier test. Ne pas publier assets ni `Cubism Core` sans droits.
