# Audit GitHub et passation — 30 octobre 2026

Inventaire vérifié des branches ; pas de validation fonctionnelle ou de tests exécutés. Aucune suppression par intuition.

Branche par défaut : `main`. PR ouvertes : aucune.

## Branches (5)
- `develop`
- `feat/replay-clothing-spike`
- `main`
- `research/gpt6-garment-quality-20261027`
- `research/gpt6-universal-auto-clothing-plan-20261027`

## Reprise critique

- La PR #7 a été fusionnée dans `develop`, pas nécessairement dans `main`. Vérifier les deux cibles.
- Les PR #1 et #6 ont été clôturées sans fusion explicite : vérifier l'ascendance.
- Tester l'auto-déformation des vêtements 2D, la physique, les replays déterministes, Live2D et VTube Studio.
- Comparer SHA, ascendance et diff de chaque branche à sa cible, préserver assets et production.

**Statut :** inventaire réalisé ; tests et qualification approfondie à faire.

## Vérification supplémentaire du graphe Git

- **Comparaison actualisée :** `main...develop` diverge : 38 commits propres à develop, 7 commits propres à main, 38 fichiers modifiés dans le diff. Fusion automatique déconseillée ; revoir les 7 commits de main et la physique avant rapprochement.
