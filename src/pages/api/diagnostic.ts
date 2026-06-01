import type { APIRoute } from 'astro';
import siteConfig from '../../data/siteConfig.json';
import {
  internalDiagnosticEmail,
  autoReplyDiagnosticEmail,
  type LeadDiagnostic,
} from '../../lib/emailTemplates';

export const prerender = false;

interface DiagnosticPayload {
  nom?: string;
  entreprise?: string;
  secteur?: string;
  aSite?: string;
  urlSite?: string;
  lienRezo?: string;
  objectif?: string;
  telephone?: string;
  email?: string;
  preference?: string;
  message?: string;
  website?: string;
}

const PHONE_REGEX = /^[+]?[\d\s().-]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type SebSendMsg = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};
type Seb = { send: (msg: SebSendMsg) => Promise<unknown> };

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: DiagnosticPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot — silent OK, no email sent
  if (payload.website && payload.website.trim()) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nom = (payload.nom ?? '').trim();
  const entreprise = (payload.entreprise ?? '').trim();
  const secteur = (payload.secteur ?? '').trim();
  const aSiteRaw = (payload.aSite ?? '').trim();
  const urlSite = (payload.urlSite ?? '').trim();
  const lienRezo = (payload.lienRezo ?? '').trim();
  const objectif = (payload.objectif ?? '').trim();
  const telephone = (payload.telephone ?? '').trim();
  const email = (payload.email ?? '').trim();
  const preference = (payload.preference ?? '').trim();
  const message = (payload.message ?? '').trim();

  const errors: string[] = [];
  if (!nom) errors.push('nom');
  if (!entreprise) errors.push('entreprise');
  if (!secteur) errors.push('secteur');
  if (!aSiteRaw) errors.push('aSite');
  if (!objectif) errors.push('objectif');
  if (!telephone || !PHONE_REGEX.test(telephone)) errors.push('telephone');
  if (!email || !EMAIL_REGEX.test(email)) errors.push('email');
  if (!preference) errors.push('preference');

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ ok: false, error: 'validation', fields: errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const seb = env?.SEB as Seb | undefined;

  if (!seb) {
    return new Response(
      JSON.stringify({ ok: false, error: 'binding_missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const aSite: 'oui' | 'non' = aSiteRaw === 'oui' ? 'oui' : 'non';

  const lead: LeadDiagnostic = {
    nom,
    entreprise: entreprise || undefined,
    secteur,
    aSite,
    url: aSite === 'oui' && urlSite ? urlSite : undefined,
    reseaux: lienRezo || undefined,
    objectif: objectif || undefined,
    email,
    telephone,
    preferenceContact: preference || undefined,
    message: message || undefined,
    receivedAt: new Date(),
  };

  const internal = internalDiagnosticEmail(lead);

  // 1) Internal notification — MANDATORY
  try {
    await seb.send({
      from: `9site4 <${siteConfig.contact.email}>`,
      to: siteConfig.contact.notifyEmail,
      replyTo: email,
      subject: internal.subject,
      text: internal.text,
      html: internal.html,
    });
  } catch (err) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error('[api/diagnostic] internal email failed', detail);
    return new Response(
      JSON.stringify({ ok: false, error: 'send_failed', detail }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2) Best-effort: Discord + auto-reply
  const envKeys = env ? Object.keys(env) : [];
  const discordKey = envKeys.find((k) => /discord/i.test(k) && /webhook/i.test(k));
  const discordWebhook =
    (discordKey && typeof env?.[discordKey] === 'string' && (env[discordKey] as string)) || null;

  const discordTask = discordWebhook
    ? fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '9site4 Diagnostic',
          embeds: [
            {
              title: `Diagnostic — ${nom} (${entreprise})`,
              color: 0x91a6ff,
              fields: [
                { name: 'Secteur', value: secteur, inline: true },
                { name: 'A déjà un site', value: aSite, inline: true },
                { name: 'Objectif', value: objectif, inline: true },
                { name: 'Téléphone', value: telephone, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Préférence', value: preference, inline: true },
                ...(urlSite ? [{ name: 'URL', value: urlSite }] : []),
                ...(lienRezo ? [{ name: 'Insta / Google', value: lienRezo }] : []),
                ...(message ? [{ name: 'Message', value: message.slice(0, 1024) }] : []),
              ],
              timestamp: new Date().toISOString(),
              footer: { text: '9site4.re — diagnostic gratuit' },
            },
          ],
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Discord ${r.status}`);
      })
    : Promise.resolve();

  const autoReply = autoReplyDiagnosticEmail(lead);
  const autoReplyTask = seb
    .send({
      from: `9site4 <${siteConfig.contact.email}>`,
      to: email,
      replyTo: siteConfig.contact.email,
      subject: autoReply.subject,
      text: autoReply.text,
      html: autoReply.html,
    })
    .then(() => undefined);

  const [discordRes, autoReplyRes] = await Promise.allSettled([discordTask, autoReplyTask]);
  if (discordRes.status === 'rejected') {
    console.error('[api/diagnostic] discord failed', String(discordRes.reason));
  }
  if (autoReplyRes.status === 'rejected') {
    console.error('[api/diagnostic] auto-reply failed', String(autoReplyRes.reason));
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
