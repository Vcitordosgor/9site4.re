/**
 * formatMessage — fonction PURE. Transforme (config + valeurs saisies) en
 * message structuré, en deux rendus :
 *   - texte : pour le lien wa.me ET l'aperçu dans le mockup téléphone
 *   - html  : même contenu mis en forme pour l'e-mail (CSS inline, Gmail-safe)
 *
 * Règles : les champs facultatifs vides sont omis. Aucun effet de bord.
 */

import type { ModuleMetierConfig, FieldValues } from './types';

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC[c]);
}

/** Interpole {id} par la valeur saisie (ex. reponsePro "Bonjour {nom}"). */
export function interpolate(template: string, values: FieldValues): string {
  return template.replace(/\{(\w+)\}/g, (_m, id: string) => {
    const v = (values[id] ?? '').trim();
    return v || _m;
  });
}

export interface FormattedMessage {
  texte: string;
  html: string;
}

/**
 * Construit la liste (label, valeur) des champs à afficher :
 * un champ facultatif vide est omis ; un champ requis vide reste listé vide
 * (ne devrait pas arriver après validation, mais on ne masque pas l'erreur).
 */
function visibleLines(config: ModuleMetierConfig, values: FieldValues) {
  const lines: Array<{ label: string; value: string }> = [];
  for (const champ of config.champs) {
    const raw = (values[champ.id] ?? '').trim();
    if (!raw && !champ.requis) continue; // facultatif vide → omis
    lines.push({ label: champ.label, value: raw });
  }
  return lines;
}

export function formatMessage(
  config: ModuleMetierConfig,
  values: FieldValues
): FormattedMessage {
  const lines = visibleLines(config, values);

  // ---- Texte (wa.me + aperçu mockup) ----
  const texte = [
    '📋 9SITE4 · NOUVEAU FORMULAIRE',
    `Nouvelle demande — ${config.label}`,
    '',
    ...lines.map((l) => `${l.label} : ${l.value}`),
    '',
    '✅ Demande prête à traiter',
  ].join('\n');

  // ---- HTML (e-mail) ----
  const rows = lines
    .map(
      (l) =>
        `<tr>` +
        `<td style="padding:4px 12px 4px 0;color:#5b6270;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          l.label
        )}</td>` +
        `<td style="padding:4px 0;color:#0b0d13;font-size:14px;font-weight:600">${escapeHtml(
          l.value
        ).replace(/\n/g, '<br>')}</td>` +
        `</tr>`
    )
    .join('');

  const html =
    `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e6e8ee;border-radius:16px;overflow:hidden">` +
    `<div style="background:#0b0d13;color:#ffffff;padding:16px 20px">` +
    `<div style="font-size:11px;letter-spacing:.18em;color:#91a6ff;font-weight:700">📋 9SITE4 · NOUVEAU FORMULAIRE</div>` +
    `<div style="font-size:16px;font-weight:700;margin-top:4px">Nouvelle demande — ${escapeHtml(
      config.label
    )}</div>` +
    `</div>` +
    `<table style="width:100%;border-collapse:collapse;padding:0;margin:0"><tbody style="display:block;padding:16px 20px">${rows}</tbody></table>` +
    `<div style="padding:12px 20px;background:#f4f5f8;color:#166534;font-size:13px;font-weight:700">✅ Demande prête à traiter</div>` +
    `</div>`;

  return { texte, html };
}

/**
 * URL wa.me pré-remplie. Encodage strict (accents, émojis, retours ligne).
 * Le numéro est normalisé (on retire tout sauf les chiffres — wa.me veut le
 * format international sans "+").
 */
export function whatsappUrl(config: ModuleMetierConfig, texte: string): string {
  const num = (config.destination.whatsapp || '').replace(/[^\d]/g, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(texte)}`;
}
