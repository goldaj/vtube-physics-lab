# Instructions de travail : VTube Physics Lab

## But réel
Laboratoire de paramètres Live2D local + mobile, sans caméra, avec **AI Replay**, **Auto Demo**, **VTS Simulator**, **Physics Lab**, sauvegarde/rejeu et physique réglable. Le projet réunit les idées `vtube-physics-lab` et `live2d-remote-lab` de l'incubateur. **Recherche majeure : vêtements dessinés/importés en 2D, interchangeables et déformés automatiquement sans rig manuel**, spécifiée le 26/10/2026. La compatibilité réelle Live2D est une hypothèse à démontrer.

## Règles Codex / ChatGPT
- Lire README, docs/PRODUCT.md, docs/AUTO_CLOTHING.md, docs/EXPERIMENTS.md, docs/TASKS.md, docs/HANDOFF.md, docs/CHATGPT_PROJECT_HISTORY.md avant de coder.
- `develop` contient la documentation de cadrage; fonctionnalités sur `feat/*` et PR en brouillon, **aucun merge automatique sans revue**.
- Tests déterministes, exemples synthétiques et sans secrets. Séparer *hypothèse*, *code avec tests unitaires*, *test manuel navigateur*, *intégration réelle Live2D/VTS*; la CI ne valide pas un véritable modèle Cubism.
- Ne jamais embarquer/distribuer `Cubism Core` propriétaire ou un `.moc3`/PSD/PNG personnel ou tiers sans droit, ni portabilité téléphonique inventée.
- Demander autorisation par API VTube Studio; pas de connexion VTS ni de caméra implicites. Garder un fonctionnement autonome sans caméra possible.
- Documenter les vrais échanges utilisateurs et résumés historiques (pas de faux verbatim), ainsi que liens PR/SHA/tests et limitations dans `docs/CHATGPT_PROJECT_HISTORY.md`.
- Ne pas reconstruire inutilement le moteur de rendu Live2D : prototyper géométrie/physique uniquement comme harnais de mesure; utiliser Cubism SDK légalement obtenu pour le rendu final.
- Expériences vêtement : mesurer glissement, collision, contour sous mouvement, stabilité FPS et taux d'interventions manuelles, pas seulement une photo flatteuse.
- Documentation de reprise exacte dans `docs/HANDOFF.md`; penser à maintenir `docs/TASKS.md` à chaque tranche.

## Sécurité
Interdiction d'ajouter secrets, informations de comptes, modèles/assets privés, données de production. Les paramètres de rejeu IA éventuellement sensibles doivent rester locaux, sans téléversement implicite.

## État courant / lien Codex
Lire d'abord [docs/CODEX_ACTIVE_WORK.md](docs/CODEX_ACTIVE_WORK.md). Les fonctionnalités et tests sont sur une PR en brouillon distincte, non sur develop.

## Point d'entrée Codex sur la branche de réalisation
Lire [docs/CODEX_ACTIVE_WORK.md](docs/CODEX_ACTIVE_WORK.md) pour retrouver la PR active et les tests. Les changements de code de cette branche sont expérimentaux et **non fusionnés** sur develop.
