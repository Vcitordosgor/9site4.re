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
  ],
  theme: {
    extend: {
      colors: {
        bleu: '#91A6FF',
        orange: '#FF8F00',
        'blanc-casse': '#FEFEFA',
        'bleu-nuit': '#0B1437',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
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
