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
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        'dm-sans': ['"DM Sans"', 'system-ui', 'sans-serif'],
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
