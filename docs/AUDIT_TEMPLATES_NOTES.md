# Audit & notation des 40 templates 9site4 — Post passe "wow signatures"

**Date** : 12 juin 2026
**Commit base** : 290f94f (post-merge des 4 batches wow)
**Grille** : moyenne de 5 critères (signature / identité visuelle / crédibilité métier / UX mobile / désir d'achat).

## Tableau complet — 40 templates

| # | Slug | Signature | Note /10 |
|---|---|---|---|
| 1 | yoga | Cercle respiratoire inspirez/expirez 12s | **9.0** |
| 2 | garage | Compte-tours 0→7400 RPM + checklist 32 points | **8.6** |
| 3 | patisserie | Entremets 5 couches qui s'assemble au scroll | **8.5** |
| 4 | bar-jus | Verre sticky qui change de couleur au survol des jus | **8.4** |
| 4 | gite | Brumes du cirque + altimètre 0→1220m + profil altimétrique | **8.4** |
| 4 | paysagiste | Vigne botanique qui pousse + plan jardin interactif | **8.4** |
| 4 | conciergerie | Checklist "Sept jours. Six gestes." auto-cochée | **8.4** |
| 4 | comptable | Rapport annuel : compteurs + courbe SVG + ProfilSelector :has() | **8.4** |
| 4 | architecte | Plan axonométrique qui se dessine + cachet rouge | **8.4** |
| 4 | psychologue | Esperluette qui respire (sobriété déontologique) | **8.4** |
| 11 | naturopathe | Tige végétale qui pousse + 6 feuilles en cascade | 8.3 |
| 11 | glacier | Boule de glace qui respire + parfums interactifs | 8.3 |
| 13 | pizzeria | Four à bois pulsant 450°C + fix header | 8.2 |
| 13 | spa | Goutte d'eau + 3 ondulations concentriques + fix image | 8.2 |
| 13 | coach | Compteur reps 00→12 + barre d'effort lime | 8.2 |
| 13 | aide-domicile | Grille semaine qui se remplit cellule par cellule | 8.2 |
| 13 | avocat | Balance qui s'équilibre + "Considérant que..." | 8.2 |
| 13 | dieteticienne | Assiette équilibrée 4 portions | 8.1 |
| 19 | salon | Ciseaux qui glissent et coupent un fil | 8.1 |
| 20 | osteo | Colonne vertébrale 14 vertèbres qui s'aligne | 8.0 |
| 20 | resto | Wordmark Bodoni + Cave + chiffres romains | 8.0 |
| 20 | tatoueur | Trait d'aiguille SVG sur 4,5s | 8.0 |
| 23 | danse | Rotation typo Danser/Bouger/Vivre + silhouette dorée | 7.9 |
| 23 | wedding | Pétales + lignes serpentines entrelacées | 7.9 |
| 25 | excursions | Tracé sentier qui se dessine 1580→3070m | 7.8 |
| 25 | plongee | Bulles + profondeur-mètre 0→−40m au scroll | 7.8 |
| 25 | photographe | Iris obturateur 6 lames qui s'ouvre + grain | 7.8 |
| 25 | consultant | Courbe +184% qui se trace + terminal | 7.8 |
| 25 | institut | Médaillon M + couronne florale zoom-in 2,4s | 7.8 |
| 25 | boulangerie | Vapeur du four (6 puffs) + timeline 6 gestes | 7.8 |
| 25 | auto-ecole | Route SVG qui se trace + jalons + 92% réussite | 7.8 |
| 32 | plomberie | Manomètre rouge→vert + 3 LEDs en cascade | 7.7 |
| 33 | fleuriste | 8 pétales qui flottent en continu | 7.6 |
| 33 | creche | Mobile bébé 3 formes pastels | 7.6 |
| 33 | location | Vagues SVG océan + golden hour | 7.6 |
| 33 | surf | 3 couches de vagues SVG qui ondulent | 7.6 |
| 33 | studio-audio | Equalizer 56 barres gradient violet→cyan | 7.6 |
| 38 | notaire | Sceau de cire qui rebondit | 7.4 |
| 39 | electricien | Tableau NF C 15-100 + pulse + scroll-reveal | 7.3 |
| 40 | cafe-torref | Stats Probat L12 + lot daté (pas de vraie animation signature) | **7.0** |

**Moyenne globale : 7.96/10** (319/40)

---

## Top 10 — Les plus convaincants

1. **yoga (9.0)** — chef-d'œuvre, signature parfaitement intégrée au métier
2. **garage (8.6)** — compte-tours + checklist 32 points = crédibilité atelier totale
3. **patisserie (8.5)** — entremets qui s'assemble = signature narrative remarquable
4-10. **bar-jus, gite, paysagiste, conciergerie, comptable, architecte, psychologue (8.4)** — chacun a une identité forte qui résonne immédiatement avec son métier

## Bottom 5 — À retravailler en priorité

| # | Slug | Note | Diagnostic |
|---|---|---|---|
| 1 | **cafe-torref** | 7.0 | **Signature wow ABSENTE** — DA OK mais aucun moment animé identifiable. À ajouter : vapeur tasse + courbes torréfaction interactives (cf. brief initial non implémenté). |
| 2 | **electricien** | 7.3 | Signature = ornement décoratif passif (pas d'interaction au scroll), section Tarifs absente |
| 3 | **notaire** | 7.4 | Un seul moment signature, calculateur frais basique (8%/3% en dur), sections peu différenciantes |
| 4 | **fleuriste / creche / location / surf / studio-audio** | 7.6 | Signatures correctes mais hero photo classique, retombent en cards standard sans 2e moment fort |

---

## 5 verdicts globaux

### Ce qui marche bien partout
- **Cohérence palette/typo** : chaque template a sa propre identité visuelle, jamais confondu avec un autre
- **`prefers-reduced-motion` respecté** systématiquement → accessibilité OK
- **Zéro CLS** sur toutes les signatures (transform/opacity only)
- **Crédibilité métier** : vocabulaire et structure des pages sonnent juste pour le pro du métier

### Ce qui pèche systématiquement
- **Beaucoup de signatures sont "one-shot"** (jouent une fois au scroll/load puis figées) → effet wow s'épuise dès la 2ᵉ visite
- **Mobile sous-traité sur certains templates** (danse hidden md:block sur la silhouette, bar-jus verre desktop-only)
- **Preuves sociales étiquetées "démo · exemples"** sur plusieurs templates affaiblissent la crédibilité commerciale
- **Pas de 2ᵉ moment animé** : un seul wow par template, le reste du scroll retombe en sections standards

### La signature la plus inoubliable
**Yoga (9.0)** — cercle inspirez/expirez, c'est LA référence. Signature continue, lisible, métier, dégagée du scroll. Tous les autres devraient s'en inspirer.

### Le template qui transforme le plus
**Garage (8.6)** — un prospect garagiste qui voit le compte-tours monter + la checklist 32 points se cocher se dit immédiatement "ils ont compris mon métier". Crédibilité atelier + détails techniques (Bebas/JetBrains, Ordre de Réparation) = conversion forte.

### Le template qui transforme le moins
**Café-torréfacteur (7.0)** — direction artistique solide MAIS aucune animation wow réellement implémentée. Un torréfacteur qui le voit ne se distingue pas d'un site Wix premium. **À retravailler en priorité.**

---

## Bug critique trouvé pendant l'audit

`src/components/templates/avocat/Associes.astro` lignes 33-35 : `{a.titre}` était affiché 2× (nom de l'associé + titre identique). Corrigé : `{a.nom}` sur la balise `<h3>`. Commité.

---

## Recommandations prochaine passe (par ordre d'impact)

1. **Café-torréfacteur** — implémenter la signature manquante (vapeur tasse animée + courbes torréfaction au hover)
2. **Notaire** — ajouter 1 second moment signature (timeline succession sobre, ou texte qui se "scelle" progressivement)
3. **Électricien** — transformer la signature passive en interactive (interrupteur on/off qui éclaire la section)
4. **Mobile audit** sur les 5 templates qui cachent la signature en desktop-only
5. **Retirer ou re-formuler les mentions "démo · exemples"** sur plongée, excursions, etc. (affaiblissent la conversion)

**Score moyen 7.96/10. Site largement présentable en l'état. 3-5 templates méritent une 2ᵉ passe ciblée pour passer la moyenne à 8.3+.**
