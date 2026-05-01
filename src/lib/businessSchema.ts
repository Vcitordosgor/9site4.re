/**
 * Génère un schema.org LocalBusiness à partir des données d'un template.
 * Renvoie null si le minimum (nom + ville ou adresse) n'est pas présent.
 *
 * Usage : <script type="application/ld+json" set:html={JSON.stringify(localBusinessSchema(data, type))} />
 */

type AnyData = Record<string, any>;

export function localBusinessSchema(data: AnyData, type = 'LocalBusiness'): Record<string, any> | null {
  const info = data?.info ?? data;
  if (!info?.nom || (!info.adresseLigne1 && !info.adresse && !info.ville)) return null;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
    name: info.nom,
  };

  if (info.soustitre) schema.description = info.soustitre;
  if (info.tagline && !schema.description) schema.description = info.tagline;

  // Adresse
  const street = info.adresseLigne1 || info.adresse;
  const city = info.ville;
  if (street || city) {
    schema.address = {
      '@type': 'PostalAddress',
      ...(street && { streetAddress: street }),
      ...(city && { addressLocality: city }),
      addressCountry: 'RE',
    };
    const postal = (info.adresseLigne2 || '').match(/\b(974\d{2})\b/);
    if (postal) schema.address.postalCode = postal[1];
  }

  if (info.telephone || info.telephoneCompact) {
    schema.telephone = info.telephoneHref || info.telephone || info.telephoneCompact;
  }
  if (info.email) schema.email = info.email;
  if (info.instagram) {
    const handle = String(info.instagram).replace('@', '');
    schema.sameAs = [`https://instagram.com/${handle}`];
  }

  // Horaires
  if (Array.isArray(info.horaires) && info.horaires.length) {
    const days: Record<string, string> = {
      'Lundi': 'Mo', 'Mardi': 'Tu', 'Mercredi': 'We', 'Jeudi': 'Th',
      'Vendredi': 'Fr', 'Samedi': 'Sa', 'Dimanche': 'Su',
    };
    const opens: string[] = [];
    for (const h of info.horaires) {
      if (!h.label || !h.jour || h.ouvert === false) continue;
      const range = h.label.match(/(\d{1,2})h?\s*[-–]\s*(\d{1,2})h?/);
      if (!range) continue;
      const [, o, c] = range;
      const dayKey = Object.keys(days).find(d => h.jour.includes(d));
      if (!dayKey) continue;
      opens.push(`${days[dayKey]} ${o.padStart(2, '0')}:00-${c.padStart(2, '0')}:00`);
    }
    if (opens.length) schema.openingHours = opens;
  }

  return schema;
}
