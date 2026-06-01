/**
 * Email templates for 9site4 lead notifications.
 *
 * All HTML is rendered with inline CSS for Gmail (mobile + desktop) compatibility.
 * - No <script>, no position:fixed, no display:grid, no pseudo-classes.
 * - All user-provided values MUST pass through escapeHtml() before being injected.
 */

import siteConfig from '../data/siteConfig.json';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type LeadContact = {
  nom: string;
  entreprise?: string;
  email: string;
  telephone: string;
  secteur?: string;
  besoin?: string;
  message?: string;
  preferenceContact?: string; // 'whatsapp' | 'email' | 'phone' or label
  receivedAt?: Date;
};

export type LeadDiagnostic = {
  nom: string;
  entreprise?: string;
  secteur: string;
  aSite: 'oui' | 'non';
  url?: string;
  reseaux?: string;
  objectif?: string;
  email: string;
  telephone: string;
  preferenceContact?: string;
  message?: string;
  receivedAt?: Date;
};

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function escapeHtml(value: string | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

/** Sanitize a phone number for use in tel: and wa.me/ links. */
function sanitizePhone(phone: string): string {
  // Keep leading + if present, strip everything else non-digit
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/** Strip + and leading zeros for wa.me/<num> (international format, no plus). */
function phoneForWhatsApp(phone: string): string {
  return sanitizePhone(phone).replace(/^\+/, '');
}

/** Format date in Indian/Reunion timezone: "03/06/2025 à 14h32". */
function formatReunionDate(d: Date): string {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Indian/Reunion',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} à ${get('hour')}h${get('minute')}`;
}

/* -------------------------------------------------------------------------- */
/* Shared style fragments (inline CSS)                                        */
/* -------------------------------------------------------------------------- */

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const STYLE = {
  outer: `margin:0;padding:24px 12px;background:#f7f7f9;font-family:${FONT_STACK};color:#2A2A35;`,
  card: `max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);box-sizing:border-box;`,
  brand: `font-size:14px;font-weight:700;color:#14161F;letter-spacing:0.5px;`,
  badge: `display:inline-block;background:#91a6ff;color:#ffffff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;margin-left:8px;`,
  subtitle: `margin:8px 0 0;font-size:13px;color:#6B6B7A;`,
  h1: `margin:20px 0 8px;font-size:22px;font-weight:700;color:#14161F;line-height:1.3;`,
  dateLine: `margin:0 0 24px;font-size:13px;color:#6B6B7A;`,
  sectionTitle: `margin:24px 0 12px;font-size:14px;font-weight:700;color:#14161F;text-transform:uppercase;letter-spacing:0.5px;`,
  tableLabel: `padding:8px 12px 8px 0;font-size:13px;color:#6B6B7A;font-weight:600;vertical-align:top;width:40%;word-wrap:break-word;`,
  tableValue: `padding:8px 0;font-size:14px;color:#14161F;font-weight:500;vertical-align:top;word-wrap:break-word;word-break:break-word;`,
  msgBox: `margin:8px 0 0;padding:16px;background:#f7f7f9;border-left:3px solid #91a6ff;border-radius:4px;font-size:14px;color:#2A2A35;line-height:1.5;word-wrap:break-word;`,
  action: `margin:24px 0 0;padding:14px 16px;background:#fff7ed;border-radius:8px;font-size:13px;color:#7c4a03;line-height:1.5;`,
  footer: `margin:28px 0 0;padding-top:16px;border-top:1px solid #ececf2;font-size:12px;color:#8b8b96;line-height:1.5;`,
  preheader: `display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:#f7f7f9;`,
  btn: (bg: string) =>
    `display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 16px;border-radius:8px;text-align:center;`,
};

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

function renderRow(label: string, value: string | undefined | null): string {
  const v = (value ?? '').trim();
  if (!v) return '';
  return `<tr>
    <td style="${STYLE.tableLabel}">${escapeHtml(label)}</td>
    <td style="${STYLE.tableValue}">${escapeHtml(v)}</td>
  </tr>`;
}

function renderRowHtml(label: string, valueHtml: string | null): string {
  if (!valueHtml) return '';
  return `<tr>
    <td style="${STYLE.tableLabel}">${escapeHtml(label)}</td>
    <td style="${STYLE.tableValue}">${valueHtml}</td>
  </tr>`;
}

function renderContactButtons(lead: { nom: string; email: string; telephone: string }): string {
  const phone = sanitizePhone(lead.telephone);
  const wa = phoneForWhatsApp(lead.telephone);
  const waMsg = encodeURIComponent(
    `Bonjour ${lead.nom}, merci pour votre demande sur 9site4. Je reviens vers vous concernant votre projet de site internet.`
  );
  const telHref = `tel:${escapeHtml(phone)}`;
  const mailHref = `mailto:${escapeHtml(lead.email)}`;
  const waHref = `https://wa.me/${escapeHtml(wa)}?text=${waMsg}`;

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 0;">
    <tr>
      <td style="padding:4px;" align="center">
        <a href="${telHref}" style="${STYLE.btn('#14161F')};width:100%;display:block;">📞 Appeler</a>
      </td>
      <td style="padding:4px;" align="center">
        <a href="${mailHref}" style="${STYLE.btn('#91a6ff')};width:100%;display:block;">✉ Email</a>
      </td>
      <td style="padding:4px;" align="center">
        <a href="${waHref}" style="${STYLE.btn('#25D366')};width:100%;display:block;">💬 WhatsApp</a>
      </td>
    </tr>
  </table>`;
}

/* -------------------------------------------------------------------------- */
/* Internal email — Contact                                                   */
/* -------------------------------------------------------------------------- */

export function internalContactEmail(lead: LeadContact): EmailContent {
  const receivedAt = lead.receivedAt ?? new Date();
  const dateStr = formatReunionDate(receivedAt);
  const titleId = (lead.entreprise && lead.entreprise.trim()) || lead.nom;
  const subject = `[Nouveau lead 9site4] Contact — ${titleId}`;
  const preheader = 'Nouvelle demande depuis le formulaire contact 9site4.';

  const emailLink = `<a href="mailto:${escapeHtml(lead.email)}" style="color:#91a6ff;text-decoration:none;">${escapeHtml(lead.email)}</a>`;
  const telLink = `<a href="tel:${escapeHtml(sanitizePhone(lead.telephone))}" style="color:#91a6ff;text-decoration:none;">${escapeHtml(lead.telephone)}</a>`;

  const rows = [
    renderRow('Nom', lead.nom),
    renderRow('Entreprise', lead.entreprise),
    renderRow('Secteur', lead.secteur),
    renderRow('Besoin', lead.besoin),
    renderRowHtml('Email', emailLink),
    renderRowHtml('Téléphone', telLink),
    renderRow('Préférence de contact', lead.preferenceContact),
  ].join('');

  const messageBlock = lead.message && lead.message.trim()
    ? `<div style="${STYLE.sectionTitle}">Message du prospect</div>
       <div style="${STYLE.msgBox}">${nl2br(lead.message.trim())}</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="${STYLE.outer}">
  <span style="${STYLE.preheader}">${escapeHtml(preheader)}</span>
  <div style="${STYLE.card}">
    <div>
      <span style="${STYLE.brand}">9site4</span>
      <span style="${STYLE.badge}">Nouveau lead</span>
      <p style="${STYLE.subtitle}">Contact</p>
    </div>
    <h1 style="${STYLE.h1}">${escapeHtml(lead.nom)}${lead.entreprise ? ` — ${escapeHtml(lead.entreprise)}` : ''}</h1>
    <p style="${STYLE.dateLine}">Reçu le ${escapeHtml(dateStr)} (heure 974)</p>

    <div style="${STYLE.sectionTitle}">Résumé</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${rows}
    </table>

    <div style="${STYLE.sectionTitle}">Contacter rapidement</div>
    ${renderContactButtons(lead)}

    ${messageBlock}

    <div style="${STYLE.action}">
      <strong>Action recommandée :</strong> Reprendre contact selon sa préférence, qualifier son besoin, puis proposer un échange court pour cadrer son projet.
    </div>

    <div style="${STYLE.footer}">
      Demande reçue depuis 9site4.re — Vous pouvez répondre directement à cet email (Reply-To = prospect).
    </div>
  </div>
</body>
</html>`;

  const text = [
    `Nouveau lead 9site4 — Contact`,
    `Reçu le ${dateStr} (heure 974)`,
    ``,
    `Nom : ${lead.nom}`,
    lead.entreprise ? `Entreprise : ${lead.entreprise}` : null,
    lead.secteur ? `Secteur : ${lead.secteur}` : null,
    lead.besoin ? `Besoin : ${lead.besoin}` : null,
    `Email : ${lead.email}`,
    `Téléphone : ${lead.telephone}`,
    lead.preferenceContact ? `Préférence : ${lead.preferenceContact}` : null,
    lead.message && lead.message.trim() ? `\nMessage :\n${lead.message.trim()}` : null,
    ``,
    `Action : reprendre contact selon sa préférence, qualifier le besoin, proposer un échange court.`,
    ``,
    `— 9site4.re`,
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Internal email — Diagnostic                                                */
/* -------------------------------------------------------------------------- */

export function internalDiagnosticEmail(lead: LeadDiagnostic): EmailContent {
  const receivedAt = lead.receivedAt ?? new Date();
  const dateStr = formatReunionDate(receivedAt);
  const titleId = (lead.entreprise && lead.entreprise.trim()) || lead.nom;
  const subject = `[Nouveau diagnostic 9site4] ${titleId} — ${lead.secteur}`;
  const preheader = 'Nouvelle demande de diagnostic gratuit depuis 9site4.';

  const emailLink = `<a href="mailto:${escapeHtml(lead.email)}" style="color:#91a6ff;text-decoration:none;">${escapeHtml(lead.email)}</a>`;
  const telLink = `<a href="tel:${escapeHtml(sanitizePhone(lead.telephone))}" style="color:#91a6ff;text-decoration:none;">${escapeHtml(lead.telephone)}</a>`;

  const rows = [
    renderRow('Nom', lead.nom),
    renderRow('Entreprise', lead.entreprise),
    renderRow('Secteur', lead.secteur),
    renderRow('A déjà un site', lead.aSite === 'oui' ? 'Oui' : 'Non'),
    renderRow('Objectif', lead.objectif),
    renderRowHtml('Email', emailLink),
    renderRowHtml('Téléphone', telLink),
    renderRow('Préférence de contact', lead.preferenceContact),
  ].join('');

  // "Présence actuelle" — only if any of url / reseaux / message
  const hasUrl = !!(lead.url && lead.url.trim());
  const hasReseaux = !!(lead.reseaux && lead.reseaux.trim());
  const hasMessage = !!(lead.message && lead.message.trim());
  const showPresence = hasUrl || hasReseaux || hasMessage;

  let presenceBlock = '';
  if (showPresence) {
    const presenceRows: string[] = [];
    if (hasUrl) {
      const urlSafe = escapeHtml(lead.url!.trim());
      presenceRows.push(
        renderRowHtml(
          'Site actuel',
          `<a href="${urlSafe}" style="color:#91a6ff;text-decoration:none;word-break:break-all;">${urlSafe}</a>`
        )
      );
    }
    if (hasReseaux) {
      // reseaux may already contain URL(s); render as plain text + linkify if it looks like a URL
      const raw = lead.reseaux!.trim();
      const looksLikeUrl = /^https?:\/\//i.test(raw);
      const valHtml = looksLikeUrl
        ? `<a href="${escapeHtml(raw)}" style="color:#91a6ff;text-decoration:none;word-break:break-all;">${escapeHtml(raw)}</a>`
        : escapeHtml(raw);
      presenceRows.push(renderRowHtml('Instagram / Google', valHtml));
    }
    let msgInPresence = '';
    if (hasMessage) {
      msgInPresence = `<div style="${STYLE.sectionTitle}">Message du prospect</div>
        <div style="${STYLE.msgBox}">${nl2br(lead.message!.trim())}</div>`;
    }
    presenceBlock = `
      <div style="${STYLE.sectionTitle}">Présence actuelle</div>
      ${presenceRows.length ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${presenceRows.join('')}</table>` : ''}
      ${msgInPresence}
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="${STYLE.outer}">
  <span style="${STYLE.preheader}">${escapeHtml(preheader)}</span>
  <div style="${STYLE.card}">
    <div>
      <span style="${STYLE.brand}">9site4</span>
      <span style="${STYLE.badge}">Nouveau diagnostic</span>
      <p style="${STYLE.subtitle}">Diagnostic gratuit</p>
    </div>
    <h1 style="${STYLE.h1}">${escapeHtml(lead.nom)}${lead.entreprise ? ` — ${escapeHtml(lead.entreprise)}` : ''}</h1>
    <p style="${STYLE.dateLine}">Reçu le ${escapeHtml(dateStr)} (heure 974)</p>

    <div style="${STYLE.sectionTitle}">Résumé</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${rows}
    </table>

    ${presenceBlock}

    <div style="${STYLE.sectionTitle}">Contacter rapidement</div>
    ${renderContactButtons(lead)}

    <div style="${STYLE.action}">
      <strong>Action recommandée :</strong> Analyser la présence actuelle du prospect puis répondre avec 3 priorités simples — 1) ce qui est déjà clair, 2) ce qui peut être amélioré, 3) ce que 9site4 recommande comme structure de site.
    </div>

    <div style="${STYLE.footer}">
      Demande reçue depuis 9site4.re — Vous pouvez répondre directement à cet email (Reply-To = prospect).
    </div>
  </div>
</body>
</html>`;

  const text = [
    `Nouveau diagnostic 9site4`,
    `Reçu le ${dateStr} (heure 974)`,
    ``,
    `Nom : ${lead.nom}`,
    lead.entreprise ? `Entreprise : ${lead.entreprise}` : null,
    `Secteur : ${lead.secteur}`,
    `A déjà un site : ${lead.aSite === 'oui' ? 'Oui' : 'Non'}`,
    lead.objectif ? `Objectif : ${lead.objectif}` : null,
    `Email : ${lead.email}`,
    `Téléphone : ${lead.telephone}`,
    lead.preferenceContact ? `Préférence : ${lead.preferenceContact}` : null,
    hasUrl ? `Site actuel : ${lead.url}` : null,
    hasReseaux ? `Instagram / Google : ${lead.reseaux}` : null,
    hasMessage ? `\nMessage :\n${lead.message!.trim()}` : null,
    ``,
    `Action : 3 priorités — déjà clair / à améliorer / recommandation 9site4.`,
    ``,
    `— 9site4.re`,
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Auto-reply — simpler design                                                */
/* -------------------------------------------------------------------------- */

function autoReplyHtmlShell(opts: {
  preheader: string;
  title: string;
  bodyParagraphsHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(opts.title)}</title></head>
<body style="${STYLE.outer}">
  <span style="${STYLE.preheader}">${escapeHtml(opts.preheader)}</span>
  <div style="${STYLE.card}">
    <div>
      <span style="${STYLE.brand}">9site4</span>
    </div>
    <h1 style="${STYLE.h1}">${escapeHtml(opts.title)}</h1>
    ${opts.bodyParagraphsHtml}
    <div style="${STYLE.footer}">
      9site4 — Sites professionnels à La Réunion.<br>
      <a href="https://9site4.re" style="color:#91a6ff;text-decoration:none;">9site4.re</a>
    </div>
  </div>
</body>
</html>`;
}

export function autoReplyContactEmail(lead: LeadContact): EmailContent {
  const subject = 'Votre demande a bien été reçue — 9site4';
  const preheader = 'Merci pour votre message, nous revenons vers vous rapidement.';
  const nomSafe = escapeHtml(lead.nom);

  const paras = `
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Bonjour ${nomSafe},</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Merci pour votre message. Votre demande a bien été reçue par 9site4.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Nous allons revenir vers vous avec une réponse claire concernant votre projet de site professionnel.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">En attendant, vous pouvez consulter nos réalisations :<br>
      <a href="https://9site4.re/realisations/" style="color:#91a6ff;text-decoration:none;">https://9site4.re/realisations/</a>
    </p>
    <p style="margin:16px 0 0;font-size:15px;color:#2A2A35;line-height:1.6;">À très vite,<br>L'équipe 9site4</p>
  `;

  const html = autoReplyHtmlShell({
    preheader,
    title: 'Votre demande a bien été reçue',
    bodyParagraphsHtml: paras,
  });

  const text = `Bonjour ${lead.nom},

Merci pour votre message. Votre demande a bien été reçue par 9site4.

Nous allons revenir vers vous avec une réponse claire concernant votre projet de site professionnel.

En attendant, vous pouvez consulter nos réalisations :
https://9site4.re/realisations/

À très vite,
L'équipe 9site4`;

  return { subject, html, text };
}

export function autoReplyDiagnosticEmail(lead: LeadDiagnostic): EmailContent {
  const subject = 'Votre demande de diagnostic gratuit a bien été reçue — 9site4';
  const preheader = 'Merci pour votre demande de diagnostic, vous recevrez bientôt un retour adapté.';
  const nomSafe = escapeHtml(lead.nom);

  const paras = `
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Bonjour ${nomSafe},</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Merci pour votre demande de diagnostic gratuit.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Nous allons regarder les informations transmises afin d'identifier les points qui peuvent être clarifiés, structurés ou améliorés dans votre présence web.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">Vous recevrez un retour clair et adapté à votre activité.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#2A2A35;line-height:1.6;">En attendant, vous pouvez consulter nos réalisations :<br>
      <a href="https://9site4.re/realisations/" style="color:#91a6ff;text-decoration:none;">https://9site4.re/realisations/</a>
    </p>
    <p style="margin:16px 0 0;font-size:15px;color:#2A2A35;line-height:1.6;">À très vite,<br>L'équipe 9site4</p>
  `;

  const html = autoReplyHtmlShell({
    preheader,
    title: 'Votre demande de diagnostic a bien été reçue',
    bodyParagraphsHtml: paras,
  });

  const text = `Bonjour ${lead.nom},

Merci pour votre demande de diagnostic gratuit.

Nous allons regarder les informations transmises afin d'identifier les points qui peuvent être clarifiés, structurés ou améliorés dans votre présence web.

Vous recevrez un retour clair et adapté à votre activité.

En attendant, vous pouvez consulter nos réalisations :
https://9site4.re/realisations/

À très vite,
L'équipe 9site4`;

  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Exports for testing / introspection                                        */
/* -------------------------------------------------------------------------- */

export const __testing = {
  sanitizePhone,
  phoneForWhatsApp,
  formatReunionDate,
  senderEmail: siteConfig.contact.email,
  notifyEmail: siteConfig.contact.notifyEmail,
};
