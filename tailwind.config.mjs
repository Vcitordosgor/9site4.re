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
