#!/usr/bin/env bash
#
# delete-safe-49.sh — suppression des 49 branches distantes PROUVÉES sûres
# (contenu 100% présent dans main : vérifié par git cherry + ré-application inverse du patch).
# Repo : 9site4.re — remote : origin — prod : main (JAMAIS supprimée).
#
# Généré en lecture seule. À exécuter depuis TON terminal (suppression bloquée 403 côté génération).
#
# Usage :
#   bash scripts/delete-safe-49.sh            # supprime les 49 puis prune
#   DRY_RUN=1 bash scripts/delete-safe-49.sh  # affiche sans supprimer
#
set -euo pipefail
REMOTE="origin"
PROTECTED_REGEX='^(main|master|HEAD)$'

BRANCHES=(
  "a11y-mobile"
  "bar-jus-real-photos"
  "claude/setup-email-routing-u6PUA"
  "feature/page-abonnement"
  "improvements-crafts"
  "improvements-food"
  "improvements-pro"
  "improvements-wellness"
  "pages-style-alignment"
  "perf-sweep"
  "photos-auto-ecole"
  "photos-avocat"
  "photos-batch-1-food-tourism"
  "photos-batch-2-wellness"
  "photos-batch-3-artisans"
  "photos-batch-4-creative"
  "pizzeria-premium-refonte"
  "pizzeria-real-photos"
  "qa-crafts-sport"
  "qa-food"
  "qa-personal-gallery"
  "qa-tourism-pro"
  "qa-wellness"
  "realisations-polish-final"
  "resto-premium-refonte"
  "resto-real-photos"
  "salon-premium-refonte"
  "salon-real-photos"
  "seo-demo-banner"
  "templates-quality-pass-37"
  "worktree-agent-a0f65349219c54882"
  "worktree-agent-a1a88a76d000e8e21"
  "worktree-agent-a2dd033f9f56a53cb"
  "worktree-agent-a360ecfd43b9fbc04"
  "worktree-agent-a41f3c809a0a0b4a2"
  "worktree-agent-a486689b77378b7f0"
  "worktree-agent-a49dda0905d71d348"
  "worktree-agent-a4f29a31df8eced92"
  "worktree-agent-a6dac935bcaff4fdb"
  "worktree-agent-a74d2181498cc3f5d"
  "worktree-agent-a7aba733fd1da769a"
  "worktree-agent-a8379a41cceb8877f"
  "worktree-agent-a86993a6131d06301"
  "worktree-agent-a9706fb9bf2d2c330"
  "worktree-agent-acf743353709e1190"
  "worktree-agent-af1c56cb33c195445"
  "worktree-agent-af1f3d9f4c9ffab69"
  "worktree-agent-af85f60e0ae4112d3"
  "worktree-agent-afb23dfcb03e24096"
)

echo "Branches à supprimer : ${#BRANCHES[@]}"

# Garde-fou : refuser si une branche protégée s'est glissée dans la liste
for b in "${BRANCHES[@]}"; do
  if [[ "$b" =~ $PROTECTED_REGEX ]]; then
    echo "ABORT : branche protégée détectée : '$b'" >&2
    exit 1
  fi
done

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  printf 'git push %s --delete\n' "$REMOTE"
  printf '  %s\n' "${BRANCHES[@]}"
else
  git push "$REMOTE" --delete "${BRANCHES[@]}"
  echo "Nettoyage des refs de suivi locales…"
  git remote prune "$REMOTE"
fi
echo "Terminé."
