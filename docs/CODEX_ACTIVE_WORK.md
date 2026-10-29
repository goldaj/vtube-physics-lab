> **État consolidé 29/10/2026 :** les travaux de la PR #6 (mesures de qualité) sont désormais dans la branche de la PR #7 avec le prototype #1. Les mentions « séparé » ci-dessous sont historiques ; la PR #7 est l'unique entrée de reprise pour Codex.

## Nouvelle contribution scientifique GPT6 (27/10/2026) — PR #7, lecture prioritaire

https://github.com/goldaj/vtube-physics-lab/pull/7 — research/gpt6-universal-auto-clothing-plan-20261027 → feat/replay-clothing-spike, brouillon documentaire, indépendant de la PR #6 métriques (https://github.com/goldaj/vtube-physics-lab/pull/6).

**Intention actualisée du propriétaire :** adapter automatiquement des dessins de vêtements 2D à des avatars humanoïdes de plusieurs morphologies, avec compatibilité VTube Studio animée à démontrer. T-shirt/pull/pantalon/short/jupe/robe = premier sous-ensemble de validation, **pas de limite de catégorie à terme**. Programme R&D 14 étapes, 56 sous-étapes, 224 micro-actions en docs/auto-clothing/00 à 04, dont protocole tests et passation. Rien du plan n'est encore implémenté/validé comme habillage universel. L'ordre de traitement des PR #1/#6/#7 reste à définir par Codex, sans merge automatique. L'historique ci-dessous reste utile.


---

## Contribution stackée, postérieure au travail principal (27/10/2026)

Une **PR complémentaire #6**, `research/gpt6-garment-quality-20261027` → `feat/replay-clothing-spike`, apporte un banc de mesure falsifiable des vêtements du mannequin de la PR #1. **Ce n'est pas la branche active de Codex**, et elle n'est pas fusionnée. Lire `docs/GARMENT_QUALITY_BENCHMARK.md` (sur la PR #6), puis `tests/garment-quality.test.mjs` et `tests/garment-benchmark.test.mjs`. Ne pas intégrer seule à `develop` sans les trois modules fondateurs de la PR #1. Les règles ci-dessous sur la PR #1 restent applicables ; le texte de 2026-10-26 demeure historique.

# Codex : reprise de l'expérience VTube Physics Lab

Dernière mise à jour : 2026-10-26. Ce fichier sur `develop` permet de retrouver la branche active sans supposer que le code est fusionné.

## Source de vérité
- [PR #1 active en brouillon](https://github.com/goldaj/vtube-physics-lab/pull/1) : `feat/replay-clothing-spike` → `develop`, contient code, tests et documentation détaillée.
- `develop` : spécifications produit unifiées, AGENTS et contexte historique. Pas de code de l'expérience fusionné.
- [Actions PR](https://github.com/goldaj/vtube-physics-lab/actions/runs/40373672025) : succès après livraison complète de `web/app.mjs`. Huit tests Node + syntaxe; **aucun test navigateur/Live2D réel**.
- Ancienne action rouge 40372132724 expliquée : contrôle de syntaxe cherchait le fichier UI qui n'existait pas encore à ce commit intermédiaire. Ce n'était pas un test physique échoué.
- [Incubateur PR #4](https://github.com/goldaj/projects-incubator/pull/4) **fusionnée** pour retirer l'idée Live2D Remote Lab, déjà recopiée en entier dans `docs/LEGACY_LIVE2D_REMOTE_LAB.md` sur PR #1. La fiche VTube Physics de Jeux était déjà absente lors de ce travail.

## Besoin produit stabilisé
Quatre modes sans caméra : **AI Replay, Auto Demo, VTS Simulator, Physics Lab**. Visualisation mobile autonome et versioning, audio distant en futur. Depuis le 26/10/2026, nouveau chantier prioritaire de recherche : **vêtements 2D interchangeables et déformés automatiquement sans rig manuel de chaque vêtement**.
**Important** : ce besoin n'a pas été explicitement retrouvé dans le résumé du 13/09/2026; il est confirmé aujourd'hui. Ne pas le présenter comme ancien verbatim.

## Prochaines issues
- [#2](https://github.com/goldaj/vtube-physics-lab/issues/2) : QA web visuelle, dessin/import PNG/replay, hors ligne, test tactile.
- [#3](https://github.com/goldaj/vtube-physics-lab/issues/3) : véritable recherche auto-clothing sur un modèle riggé, comparaison PSD2Live/Cubism/VTS.
- [#4](https://github.com/goldaj/vtube-physics-lab/issues/4) : SDK Web Live2D, paramètres VTube Studio authentifiés et licences.
- [#5](https://github.com/goldaj/vtube-physics-lab/issues/5) : mobile offline complet, versioning, audio distant.

## Règles importantes
- Ne pas fusionner la PR #1 sans revue et essai navigateur.
- Le petit mannequin Canvas est une **instrumentation synthétique**. Il ne représente pas une compatibilité réelle Cubism et ne nécessite pas de caméra.
- Ne pas committer Cubism Core ni modèles privés; vérifier licences et données d'essai autorisées.
- Ne pas prétendre que le PWA / hors ligne téléphone a été testé: seul le cache du shell est codé.
- Lire `docs/HANDOFF.md`, `docs/AUTO_CLOTHING.md`, `docs/EXPERIMENTS.md`, `docs/TASKS.md` **sur la PR #1**, puis reprendre par les tests.
- Chaque session doit mettre à jour contexte ChatGPT en distinguant verbatim certain et résumé reconstruit.
