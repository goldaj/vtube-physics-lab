# Protocole falsifiable

## E1 — Replay portable déterministe
- Charger un JSON synthétique versionné et rejouer à t=0, t=mi-parcours et t=fin; vérifier mêmes paramètres à résolution 16 ms et interpolation explicite.
- Tenter champs malformés, timestamps dupliqués/non triés, non finis, valeurs hors plage, formats inconnus et fichiers trop volumineux : refus.
- Exécuter hors caméra, sur PC puis téléphone sans connexion au PC; la preuve offline mobile sera vérifiée plus tard.

## E2 — Moteur physique secondaire
- Injection d'un mouvement paramétré, calcul à pas fixe, comparer 30 et 60 images par seconde pour les mêmes timestamps.
- Expérimenter ressort/amortissement/gravité; mesurer dépassement, stabilisation et dérive; documenter instabilités.

## E3 — Vêtement sans rig (test de vérité)
- Importer un dessin PNG autorisé d'un T-shirt simple, utiliser corps canonique annoté *automatiquement* par la démo.
- Tourner/respirer/bouger bras, mesurer ancrage épaule, échelle, pli/bas de tissu, et noter les artefacts de mapping texture.
- Vérifier réinitialisation après changement de tenue, absence de rebond résiduel.
- Puis répéter sur **un vrai modèle Live2D autorisé**; si repères inconnus, documenter le nombre de clics manuels nécessaires. H1/H2 sont prouvés uniquement à cette étape.

## E4 — Intégration VTube Studio et mobile
- Demander autorisation via API WS locale, lire IDs/ranges paramètres autorisés; déconnecter sans exposition du token.
- Publier une version consentie du modèle et séquence, rejouer localement sur téléphone sans caméra.
- Mesurer FPS, mémoire, consommation, erreurs et dérive physique.

## Fiche de résultats
Date/commit, navigateur/appareil, SDK/version modèle/licence, vidéo/entrée synthétique utilisée, métriques, captures autorisées, hypothèse réfutée/confirmée, suite. **Aucune expérience réelle n'est déclarée exécutée avant preuve.**
