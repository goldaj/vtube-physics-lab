# Architecture de recherche modulaire

```text
Séquences IA / VTS ou démonstration automatique
             │ (timings + IDs de paramètres, versionnés)
             ▼
  Core portable : schema → interpolation → horloge de replay
             │
             ├─────> banc Physics Lab : masse/ressort/amortissement
             │                  │
             │                  └─> prototype de vêtement 2D
             │
             ├─────> aperçu géométrique synthétique autonome sans assets tiers
             ├─────> futur Cubism SDK Web (binaire obtenu sous licence utilisateur)
             └─────> futur adaptateur VTube Studio (WS + autorisation explicite)

Distribution plus tard : manifest de version + assets autorisés,
cache PWA mobile / cloud optionnel; pas de serveur de production requis pour rejouer.
```

## Contrat de données v1
`vtube-physics/replay`, `version:1`, `durationMs` (0 à 600 000), `channels` avec IDs autorisés, limites `min/default/max`, `keys` en temps croissant. La sérialisation canonique ne stocke ni assets, ni mot de passe, ni vidéo, ni snapshot sensible.

## Choix de départ
JavaScript ECMAScript modules, Node 22 pour tests, UI statique sans runtime propriétaire ni dépendances, production de JSON validé. Les calculs purs sont importables depuis Node et navigateur. Le web prototype peut illustrer un squelette fictif uniquement.

## Pont vêtements
Sur corps canonique, points d'attache (cou/épaules/hanches) sont fournis *par la démo*. Le placement/maillage se calcule sans rig vestimentaire manuel. Dans un vrai modèle Live2D, retrouver ces attaches depuis `.moc3`/ArtMesh n'est pas garanti. Essayer des repères explicites / inférence sur PSD/segments. VTube Studio ItemPin peut attacher un élément à un ArtMesh mais ne l'intègre pas automatiquement à l'animation/deformation du modèle.

## Licences
`Cubism Core` n'est pas distribué sur GitHub selon la documentation officielle. Les licences SDK et de publication doivent être vérifiées à l'étape d'intégration réelle. Le POC n'inclut aucun composant propriétaire.
