/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  /**
   * Safelist défensive pour les couleurs custom de la charte.
   * Garantit que les variantes utilisées (couleur pleine + opacités courantes)
   * restent dans le CSS de production quelle que soit l'analyse statique
   * de l'environnement de build (Cloudflare, Vercel, OVH…).
   * Limitée aux préfixes effectivement utilisés dans le code pour éviter de
   * gonfler le CSS final.
   */
  safelist: [
    {
      pattern: /^(bg|text|ring|border|from|to|via|placeholder)-(bleu|bleu-nuit|orange|blanc-casse)(\/(5|10|15|20|25|30|40|50|55|60|65|70|75|80|85|90|95))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(pizza-tomate|pizza-basilic|pizza-creme|pizza-charbon|pizza-bois|pizza-rouge|pizza-vert|pizza-dore|pizza-blanc|pizza-marron)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(salon-blanc|salon-noir|salon-vert|salon-vert-clair|salon-gris|salon-creme|salon-encre|salon-cuivre|salon-laiton)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(spa-blanc|spa-creme|spa-sable|spa-rose|spa-terracotta|spa-argile|spa-cacao)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(resto-blanc|resto-blanc-casse|resto-bleu-poudre|resto-bleu-roi|resto-bleu-encre|resto-or)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(bp-blanc|bp-ciment|bp-acier|bp-anthracite|bp-jaune|bp-jaune-fonce|bp-rouge)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(agap-lin|agap-pierre|agap-rose|agap-sauge|agap-sauge-fonce|agap-violet|agap-violet-fonce|agap-feuille)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(volta-noir|volta-acier|volta-fumee|volta-blanc|volta-cyan|volta-cyan-fonce|volta-cuivre)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(coach-noir|coach-charbon|coach-graphite|coach-gris|coach-blanc|coach-lime|coach-lime-fonce)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(yoga-creme|yoga-papier|yoga-ocre|yoga-mousse|yoga-encre|yoga-pierre|yoga-blanc)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(vermeille-velours|vermeille-charbon|vermeille-bordeaux|vermeille-rose|vermeille-ivoire|vermeille-or|vermeille-blanc)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(verveine-creme|verveine-papier|verveine-glacier|verveine-sauge|verveine-beton|verveine-encre|verveine-blanc)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(mona-creme|mona-papier|mona-vert|mona-vert-fonce|mona-terracotta|mona-framboise|mona-cacao)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(aubry-perle|aubry-papier|aubry-nuit|aubry-prune|aubry-rose|aubry-encre|aubry-blanc)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(lagon-mangue|lagon-pitaya|lagon-lime|lagon-turquoise|lagon-charbon|lagon-coco|lagon-blanc)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(marlene-nacre|marlene-sable|marlene-rose|marlene-champagne|marlene-bordeaux|marlene-moka|marlene-noir)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(cap-mousse|cap-terre|cap-pierre|cap-papier|cap-rouge|cap-glacier|cap-charbon)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(sentiers-foret|sentiers-lichen|sentiers-terre|sentiers-brume|sentiers-soleil|sentiers-ciel|sentiers-noir)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(lazuli-lagon|lazuli-marine|lazuli-sable|lazuli-terracotta|lazuli-casse|lazuli-bois|lazuli-coco)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(lucas-noir|lucas-anthracite|lucas-perle|lucas-blanc|lucas-encre|lucas-vert|lucas-vert-fonce)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
    {
      pattern: /^(bg|text|ring|border|from|to|via)-(auberval-marine|auberval-encre|auberval-gris|auberval-feutre|auberval-blanc|auberval-or|auberval-vert)(\/(5|10|15|20|25|30|40|50|60|70|80|90))?$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        bleu: '#91A6FF',
        orange: '#FF8F00',
        'blanc-casse': '#FEFEFA',
        'bleu-nuit': '#0B1437',
        // Palette pizzeria — refonte trattoria éditoriale
        // (template /templates/pizzeria — pas la charte 9site4)
        'pizza-creme':   '#FAF7F0',  // warm cream (fond principal)
        'pizza-charbon': '#1C1A17',  // charbon brun-noir (textes/fonds sombres)
        'pizza-rouge':   '#A82532',  // rouge tomate mat (CTA, accents)
        'pizza-dore':    '#B89766',  // doré ancien (filets, micro-détails)
        'pizza-vert':    '#2D6A4F',  // vert basilic (badges info)
        'pizza-blanc':   '#FFFFFF',
        // Alias rétrocompat (anciens noms)
        'pizza-tomate':  '#A82532',
        'pizza-basilic': '#2D6A4F',
        'pizza-bois':    '#B89766',
        'pizza-marron':  '#8B4513',
        // Palette salon de coiffure (template /templates/salon)
        // Refonte : noir / blanc / vert forêt
        'salon-blanc':      '#FFFFFF',
        'salon-noir':       '#0A0A0A',
        'salon-vert':       '#2D4A3A',  // vert forêt foncé — accent / CTA (AAA sur blanc)
        'salon-vert-clair': '#5C7A66',  // vert clair — filets, micro-détails (AA sur blanc)
        'salon-gris':       '#F5F5F5',  // gris très clair — sections alternées
        // Anciens tokens conservés pour rétrocompat éventuelle
        'salon-creme':      '#F5F0E8',
        'salon-encre':      '#0A0A0A',  // alias désormais identique au noir
        'salon-cuivre':     '#2D4A3A',  // alias désormais identique au vert
        'salon-laiton':     '#5C7A66',  // alias désormais identique au vert clair
        // Palette spa (template /templates/spa — Elio spa)
        // Style "Nature Distilled" : argile, sable, terracotta, crème chaude.
        // Aucun chevauchement avec les autres templates.
        'spa-blanc':      '#FFFFFF',
        'spa-creme':      '#F5F0E1',  // crème chaude, fond principal
        'spa-sable':      '#D4C4A8',  // sable beige, sections alternées
        'spa-rose':       '#E8C9B8',  // rose poudre, micro-accents
        'spa-terracotta': '#C67B5C',  // terracotta — accents, titres italiques
        'spa-argile':     '#9C5B3D',  // argile foncé — CTA (AAA white-on-argile)
        'spa-cacao':      '#3A2F26',  // brun chocolat profond — texte / sections sombres
        // Palette restaurant (template /templates/resto — Le jardin perdu)
        // Style "Magazine éditorial gastronomique" : bleu roi + blanc cassé + or laiton.
        // Distinct du bleu lavande #91A6FF de la charte 9site4 main.
        'resto-blanc':       '#FFFFFF',
        'resto-blanc-casse': '#F5EFE3',  // warm cream papier — fond principal
        'resto-bleu-poudre': '#DDE3F0',  // papier bleuté très doux — micro-accents
        'resto-bleu-roi':    '#1E3A8A',  // bleu royal profond saturé — accents, titres, CTA
        'resto-bleu-encre':  '#131A36',  // bleu encre très sombre — fonds dark, texte
        'resto-or':          '#C8A65E',  // or laiton vieilli — filets ornementaux uniquement
        // Palette plomberie (template /templates/plomberie — Bernard Plomberie)
        // Style "Poster industriel utilitaire" : anthracite + jaune sécurité + ciment.
        // Codes BTP/chantier iconiques (caution tape). Aucun chevauchement.
        'bp-blanc':       '#FFFFFF',
        'bp-ciment':      '#E8E6E1',  // gris ciment warm — fond principal
        'bp-acier':       '#2E3340',  // gris acier — sections alternées, cards dark
        'bp-anthracite':  '#1A1D24',  // anthracite presque noir — fonds dark dominants
        'bp-jaune':       '#FFC72C',  // safety yellow — CTA, badges, accents
        'bp-jaune-fonce': '#D9A607',  // jaune foncé — hover yellow
        'bp-rouge':       '#E53935',  // rouge urgence — uniquement badge "URGENCE 24/7"
        // Palette paysagiste (template /templates/paysagiste — Les agapanthes)
        // Style "Carnet du paysagiste" : violet agapanthe + sauge + lin.
        // Distinct du vert forêt (salon), terracotta (spa), bleu (resto/main).
        'agap-lin':         '#F4F2EC',  // blanc lin froid neutre — fond principal
        'agap-pierre':      '#D8D8D2',  // gris pierre warm — sections alternatives
        'agap-rose':        '#E8D4D9',  // rose poudre légèrement violet — micro-accents
        'agap-sauge':       '#9DAB8E',  // sauge tendre — sections végétales
        'agap-sauge-fonce': '#5C7058',  // sauge foncé — détails, secondaire
        'agap-violet':      '#6B5B95',  // violet agapanthe — accent principal, CTA
        'agap-violet-fonce':'#3D2E5E',  // violet profond — fonds dark, header au scroll
        'agap-feuille':     '#1F2618',  // noir verdâtre — texte AAA
        // Palette électricien (template /templates/electricien — Volta)
        // Style "Tableau électrique digital" : noir technique + cyan électrique + cuivre.
        // Distinct de toutes les autres palettes (bleu roi resto, jaune plomberie, violet agap…).
        'volta-noir':       '#0F1115',  // noir technique — fond dominant
        'volta-acier':      '#272A33',  // acier sombre — sections alternées
        'volta-fumee':      '#E0E1E5',  // fumée claire — texte principal sur fond sombre
        'volta-blanc':      '#FFFFFF',
        'volta-cyan':       '#06D4F5',  // cyan électrique — accent CTA, icônes (AAA on dark)
        'volta-cyan-fonce': '#06A8C2',  // cyan foncé — hover, filets
        'volta-cuivre':     '#C26E2C',  // cuivre chaud — micro-accents décoratifs
        // Palette coach sportif (template /templates/coach — Foudre Coaching)
        // Style "Brutalist athletic" : noir profond + lime électrique saturé.
        // Distinct des palettes feutrées (resto bleu roi, paysagiste violet, electricien cyan).
        'coach-noir':       '#0A0A0A',  // noir profond — fond dominant
        'coach-charbon':    '#141414',  // sections alternées
        'coach-graphite':   '#1F1F1F',  // surfaces, cards, élévation
        'coach-gris':       '#6E6E6E',  // texte secondaire AAA
        'coach-blanc':      '#F5F5F5',  // texte primaire
        'coach-lime':       '#C6FF3A',  // lime saturé — accent CTA, stats, badges
        'coach-lime-fonce': '#8FBA00',  // hover lime
        // Palette yoga (template /templates/yoga — Souffle Studio)
        // Style "Slow & contemplatif" : crème chaude + ocre poussiéreux + vert mousse.
        // Volontairement opposée à coach (sport) : terreuse, douce, beaucoup d'air.
        'yoga-creme':  '#F5EFE6',  // crème chaude — fond principal
        'yoga-papier': '#EDE5D6',  // papier sablé doré — sections alternées
        'yoga-ocre':   '#C9885E',  // ocre poussiéreux — accent CTA, pulses
        'yoga-mousse': '#3F4A3A',  // vert mousse profond — secondaire
        'yoga-encre':  '#2A201A',  // brun encre — texte AAA, fond sombre
        'yoga-pierre': '#8A8378',  // gris-brun — texte secondaire
        'yoga-blanc':  '#FFFFFF',
        // Palette danse (template /templates/danse — Vermeille École de danse)
        // Style "Théâtre & ballet contemporain" : noir velours + bordeaux profond
        // + rose poudre + crème ivoire + or vieilli. Inspiration affiche d'opéra.
        'vermeille-velours':  '#1A0F12',  // noir velours bordeauté — fond dark dominant
        'vermeille-charbon':  '#2A1F22',  // sections élevées dark
        'vermeille-bordeaux': '#7A1A2A',  // bordeaux profond — accent CTA, signature
        'vermeille-rose':     '#E8C4C0',  // rose poudre — micro-accents
        'vermeille-ivoire':   '#F8F0E5',  // crème ivoire — fond light
        'vermeille-or':       '#B8956A',  // or vieilli — filets ornementaux
        'vermeille-blanc':    '#FFFFFF',
        // Palette ostéopathe (template /templates/osteo — Cabinet Verveine)
        // Style "Médical épuré, presque clinique mais chaleureux" :
        // blanc cassé dominant + bleu glacier + sauge poudré + gris béton + encre.
        // Palette quasi-monochrome, beaucoup d'air, ton calme.
        'verveine-creme':   '#FAFAF7',  // blanc cassé chaud — fond principal
        'verveine-papier':  '#F0EFE8',  // sections alternées
        'verveine-glacier': '#D8E4E5',  // bleu glacier très pâle — accent doux
        'verveine-sauge':   '#B5C2A8',  // vert sauge poudré — accent secondaire
        'verveine-beton':   '#5C5C58',  // gris béton chaud — texte secondaire
        'verveine-encre':   '#1C1C1A',  // noir encre — texte AAA
        'verveine-blanc':   '#FFFFFF',
        // Palette diététicienne (template /templates/dieteticienne — Mona Levray)
        // Style "Magazine Cuisine & santé éditorial" : crème blanche + vert
        // tendre pousse de salade + terracotta doux + brun cacao + framboise rare.
        'mona-creme':       '#FAF7F1',  // blanc cassé crème — fond principal
        'mona-papier':      '#F2EBDC',  // sections alternées papier kraft
        'mona-vert':        '#9BBC8B',  // vert pousse de salade — accent doux
        'mona-vert-fonce':  '#6B8C5C',  // vert foncé — texte/titres accent
        'mona-terracotta':  '#D27D54',  // terracotta doux — accents chauds
        'mona-framboise':   '#C84A5C',  // rose framboise — accent rare (fruits)
        'mona-cacao':       '#3E2A1E',  // brun cacao — texte AAA
        // Palette psychologue (template /templates/psychologue — Camille Aubry)
        // Style "carnet de bord intime, page de livre" : gris perle + bleu nuit
        // + prune + terre rose. Aucune saturation. Registre littéraire/philo.
        'aubry-perle':  '#E8EAF0',  // gris perle bleuté — fond principal
        'aubry-papier': '#F0F1F4',  // sections alternées légèrement clair
        'aubry-nuit':   '#2A3147',  // bleu nuit profond — accent texte/CTA
        'aubry-prune':  '#5D4257',  // prune assourdie — accent secondaire
        'aubry-rose':   '#C9A28A',  // terre rose — micro-accent ornemental
        'aubry-encre':  '#0F0F12',  // encre noire — texte AAA
        'aubry-blanc':  '#FFFFFF',
        // Palette bar à jus (template /templates/bar-jus — Lagon Pressé)
        // Style "POP tropical éclatant, énergie food-truck" : couleurs ultra
        // saturées, mangue + pitaya + lime + turquoise lagon. À l'opposé total
        // des templates restaurants déjà faits (gastro éditorial, trattoria).
        'lagon-mangue':    '#F4C430',  // jaune mangue saturé — accent dominant
        'lagon-pitaya':    '#E84B7C',  // rose pitaya — accent secondaire / CTA
        'lagon-lime':      '#A8DC2A',  // vert lime acide — micro-accent
        'lagon-turquoise': '#1FB8C8',  // turquoise lagon — accent froid
        'lagon-charbon':   '#1A1410',  // noir warm — texte AAA, contraste
        'lagon-coco':      '#FFF8EC',  // crème coco — fond doux
        'lagon-blanc':     '#FFFFFF',
        // Palette institut de beauté (template /templates/institut — Maison Marléne)
        // Style "boutique-hôtel parisien, raffiné mais charnel" : nacre + rose
        // poudré nu + champagne doré + bordeaux satiné + moka. Distinct du
        // vert forêt salon et du terracotta nature spa (même catégorie beauté).
        'marlene-nacre':     '#F8F4F0',  // blanc nacre — fond principal
        'marlene-sable':     '#EAD8C9',  // sable rose — sections alternées
        'marlene-rose':      '#E5BFB5',  // rose poudré nu — accent doux
        'marlene-champagne': '#C9A56C',  // doré champagne — filets ornementaux
        'marlene-bordeaux':  '#7E2A3C',  // bordeaux satiné — accent CTA
        'marlene-moka':      '#5C3B30',  // brun moka — texte secondaire
        'marlene-noir':      '#1A1213',  // noir warm — texte AAA
        // Palette gîte de montagne (template /templates/gite — Le Cap Anglais)
        // Style "carnet de voyage / topo-guide d'altitude" : vert mousse alpine
        // + brun terre + crème papier + rouge alerte balisage. Distinct des
        // palettes feutrées (boutique chic) ou saturées (POP food).
        'cap-mousse':  '#3D5840',  // vert mousse alpine — accent dominant
        'cap-terre':   '#6B4F3B',  // brun terre — texte secondaire
        'cap-pierre':  '#8A8B85',  // gris pierre — neutre froid
        'cap-papier':  '#F1EBDB',  // crème papier ancien — fond
        'cap-rouge':   '#C03A2C',  // rouge alerte balisage — accents rares
        'cap-glacier': '#5A8FA8',  // bleu glacier — accent froid
        'cap-charbon': '#1B1B17',  // noir charbon — texte AAA
        // Palette excursions (template /templates/excursions — Sentiers Croisés)
        // Style "aventure / récit photographique immersif" : vert tropical
        // sombre + lichen vif + terre cuite + soleil pâle. Distinct du
        // topo-guide papier (Cap Anglais) — même catégorie tourisme.
        'sentiers-foret':  '#0E2820',  // vert tropical sombre — fond dominant
        'sentiers-lichen': '#5C8A4A',  // vert lichen vif — accent principal
        'sentiers-terre':  '#B85A3D',  // terre cuite réunionnaise — accent chaud
        'sentiers-brume':  '#D9E0DA',  // brume claire — secondaire
        'sentiers-soleil': '#F5E6B5',  // soleil pâle — micro-accent
        'sentiers-ciel':   '#1E3A52',  // bleu profond ciel — accent froid
        'sentiers-noir':   '#0A140F',  // noir-vert — texte AAA
        // Palette location bord de mer (template /templates/location — Villa Lazuli)
        // Style "brochure de villa lifestyle, Airbnb haut de gamme" : bleu lagon
        // profond + sable doré + terracotta cassé + bois flotté. Distinct du
        // topo-guide (Cap Anglais) et du récit aventure (Sentiers Croisés).
        'lazuli-lagon':      '#3A7188',  // bleu lagon profond — accent dominant
        'lazuli-marine':     '#1B2D3A',  // encre marine — texte AAA, fond dark
        'lazuli-sable':      '#E5D4A8',  // sable doré
        'lazuli-terracotta': '#A85B3F',  // terracotta cassé — accent CTA
        'lazuli-casse':      '#FAF6ED',  // blanc cassé tropical — fond
        'lazuli-bois':       '#8C7159',  // bois flotté — secondaire
        'lazuli-coco':       '#CDDDB1',  // vert tendre coco — micro-accent
        // Palette consultant (template /templates/consultant — Lucas Ferrier)
        // Style "portfolio personnel modeste & sérieux" : noir profond + gris
        // perle + un seul accent vert électrique terminal. Format Notion/
        // Substack dense en texte, faible en visuel.
        'lucas-noir':        '#0F1115',  // noir profond — fond dominant dark
        'lucas-anthracite':  '#2A2D33',  // sections élevées dark
        'lucas-perle':       '#E8E6E2',  // gris perle — texte secondaire
        'lucas-blanc':       '#FAFAF7',  // blanc cassé — texte primaire
        'lucas-encre':       '#5A5C61',  // gris encre — labels
        'lucas-vert':        '#00D26A',  // vert électrique terminal — accent unique
        'lucas-vert-fonce':  '#00A055',  // vert sombre hover
        // Palette cabinet comptable (template /templates/comptable — Auberval & Associés)
        // Style "rapport annuel institutionnel, cabinet pro classique" : bleu
        // marine corporate + filets dorés ornementaux + vert validation rare.
        // Distinct du portfolio dense Notion/Substack du consultant.
        'auberval-marine': '#1A2944',  // bleu marine corporate — accent dominant
        'auberval-encre':  '#3A3A3F',  // gris encre — texte secondaire
        'auberval-gris':   '#EFEFEC',  // gris clair institutionnel
        'auberval-feutre': '#F8F7F3',  // blanc cassé feutré — fond
        'auberval-blanc':  '#FFFFFF',
        'auberval-or':     '#A78A4F',  // doré subtil — filets ornementaux
        'auberval-vert':   '#4F7A5C',  // vert validation — chiffres certifiés
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        'dm-sans': ['"DM Sans"', 'system-ui', 'sans-serif'],
        lora: ['Lora', 'Georgia', 'serif'],
        raleway: ['Raleway', 'system-ui', 'sans-serif'],
        bodoni: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        archivo: ['Archivo', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        syne: ['Syne', 'system-ui', 'sans-serif'],
        'space-grotesk': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'big-shoulders': ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        barlow: ['Barlow', 'system-ui', 'sans-serif'],
        'jetbrains': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'dm-serif': ['"DM Serif Display"', 'Georgia', 'serif'],
        spectral: ['Spectral', 'Georgia', 'serif'],
        lexend: ['Lexend', 'system-ui', 'sans-serif'],
        italiana: ['Italiana', 'Didot', 'Georgia', 'serif'],
        'inter-tight': ['"Inter Tight"', 'system-ui', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
        cardo: ['Cardo', 'Georgia', 'serif'],
        'public-sans': ['"Public Sans"', 'system-ui', 'sans-serif'],
        karla: ['Karla', 'system-ui', 'sans-serif'],
        newsreader: ['Newsreader', 'Georgia', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        reenie: ['"Reenie Beanie"', 'cursive'],
        caslon: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        albert: ['"Albert Sans"', 'system-ui', 'sans-serif'],
        'plex-mono': ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        bagel: ['"Bagel Fat One"', 'Impact', 'sans-serif'],
        onest: ['Onest', 'system-ui', 'sans-serif'],
        architects: ['"Architects Daughter"', 'cursive'],
        marcellus: ['Marcellus', 'Trajan', 'Georgia', 'serif'],
        mulish: ['Mulish', 'system-ui', 'sans-serif'],
        'eb-garamond': ['"EB Garamond"', 'Garamond', 'Georgia', 'serif'],
        bricolage: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        'crimson-pro': ['"Crimson Pro"', 'Georgia', 'serif'],
        familjen: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        tinos: ['Tinos', 'Georgia', 'serif'],
        'roboto-mono': ['"Roboto Mono"', 'ui-monospace', 'monospace'],
        yeseva: ['"Yeseva One"', 'Georgia', 'serif'],
        geist: ['"Geist Sans"', 'system-ui', 'sans-serif'],
        italianno: ['Italianno', 'cursive'],
        hanken: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        instrument: ['"Instrument Serif"', 'Georgia', 'serif'],
        'space-mono': ['"Space Mono"', 'ui-monospace', 'monospace'],
        'source-serif': ['"Source Serif 4"', 'Source Serif Pro', 'Georgia', 'serif'],
        'plex-sans': ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        'dm-mono': ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw + 1rem, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(11 20 55 / 0.04), 0 1px 3px 0 rgb(11 20 55 / 0.06)',
        'card-hover': '0 8px 24px -8px rgb(11 20 55 / 0.12), 0 2px 6px 0 rgb(11 20 55 / 0.06)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        'content': '72rem',
      },
    },
  },
  plugins: [],
};
