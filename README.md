# VTube Physics Lab / Live2D Remote Lab

**Statut :** phase de recherche et première expérimentation indépendante des outils propriétaires.

## Vision consolidée

Laboratoire portable pour visualiser, expérimenter la physique et rejouer des animations de modèle 2D VTuber, **sans caméra**. PC et téléphone autonomes après transfert des ressources autorisées. Quatre modes envisagés : **AI Replay**, **Auto Demo**, **VTS Simulator**, **Physics Lab**. Le nom du dépôt est historique; les fonctions documentées sous « Live2D Remote Lab » sont **regroupées ici** pour éviter deux développements concurrents.

### Nouvelle ambition R&D : vêtements 2D sans rig manuel
Dessiner/importer un vêtement en 2D (image avec transparence), le poser sur un modèle, puis **estimer automatiquement les attaches, les déformations et une physique plausible**, de façon interchangeable. Cette fonction a été **explicitement formulée par le propriétaire le 26/10/2026**. On doit vérifier sa faisabilité sur un vrai modèle Live2D avant de promettre l'absence totale de rigging. [Plan vêtements](docs/AUTO_CLOTHING.md).

## Ce qu'on développe en premier
1. **Contrat de séquences de paramètres** versionné et indépendant de VTube Studio, avec lecture déterministe; même fichier réutilisable pour une animation IA enregistrée et pour des tests physiques.
2. **Harnais web autonome** pour rejouer des paramètres sans caméra, avec un personnage 2D générique **sans modèle Live2D propriétaire**.
3. **Expérience vêtements** : ancrage automatique d'une image 2D aux repères du corps fictif et mouvements secondaires, avant toute intégration Cubism.
4. **Adaptateurs** : vrai moteur Cubism SDK Web (installé par utilisateur selon licence), puis VTube Studio local avec autorisation; distribution mobile/cache hors réseau ensuite.

### Limites importantes
- Ni éditeur Cubism, ni VTube Studio natif, ni avatar Live2D réel livré ici.
- L'expérience vêtement **n'équivaut pas à un auto-rig Live2D universel**. Une pièce PNG simple ne contient pas la segmentation manches/ourlets, l'ordre des couches ou les contraintes du squelette.
- Ne pas committer **Cubism Core**, modèles tiers, PSD/PNG personnels, plugins propriétaires ou tokens VTube Studio dans ce dépôt public.
- Les API VTube Studio nécessitent consentement/permissions. L'app sera utilisable en mode laboratoire autonome sans VTS.

Voir [produit](docs/PRODUCT.md), [méthodologie](docs/EXPERIMENTS.md), [roadmap](docs/TASKS.md), [architecture](docs/ARCHITECTURE.md), [passation Codex](docs/HANDOFF.md), [historique](docs/CHATGPT_PROJECT_HISTORY.md).

## Application web installable, socle hors ligne
Le shell `web/` dispose d'un manifeste et d'un service worker à liste blanche (`sw.js`) afin de pouvoir être relancé hors réseau après un **premier chargement réussi depuis une origine sécurisée (HTTPS ou localhost)**. Les dessins et JSON **ne sont pas persistés automatiquement** entre les sessions; les exporter manuellement. Les vrais modèles Live2D, l'audio distant, les versions cloud et les assets libres/licenciés restent à implémenter. Le mode de test `http://localhost:8000/web/` peut fonctionner hors connexion une fois le cache correctement installé et vérifié sur navigateur compatible; la validation mobile réelle n'a pas été faite.
