/**
 * Typographie française : l'espace devant « ? » et « ! » devient insécable,
 * pour que le signe ne parte jamais seul à la ligne. Aucun mot n'est modifié.
 */
export function nbspPunct(text: string): string {
  return text.replace(/[ \u202F]([?!])/g, '\u00A0$1');
}
