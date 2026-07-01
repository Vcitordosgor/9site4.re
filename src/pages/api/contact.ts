import type { APIRoute } from 'astro';
import siteConfig from '../../data/siteConfig.json';
import {
  internalContactEmail,
  autoReplyContactEmail,
  type LeadContact,
} from '../../lib/emailTemplates';
import { qualifyLead, mapSource, defaultQualification } from '../../lib/leadScoring';
import { createNotionLead } from '../../lib/notionLead';

export const prerender = false;

interface ContactPayload {
  nom?: string;
  entreprise?: string;
  secteur?: string;
  telephone?: string;
  email?: string;
  besoin?: string;
  preference?: string;
  message?: string;
  website?: string;
  source?: string;
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
  let payload: ContactPayload;
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
  const telephone = (payload.telephone ?? '').trim();
  const email = (payload.email ?? '').trim();
  const besoin = (payload.besoin ?? '').trim();
  const preference = (payload.preference ?? '').trim();
  const message = (payload.message ?? '').trim();

  const errors: string[] = [];
  if (!nom) errors.push('nom');
  if (!secteur) errors.push('secteur');
  if (!telephone || !PHONE_REGEX.test(telephone)) errors.push('telephone');
  if (!email || !EMAIL_REGEX.test(email)) errors.push('email');

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

  const sourceLabel = mapSource(payload.source) ?? undefined;

  let qualification;
  try {
    qualification = qualifyLead(
      {
        nom,
        entreprise,
        email,
        telephone,
        secteur,
        besoin,
        message,
        preferenceContact: preference,
        source: sourceLabel,
      },
      'contact'
    );
  } catch (err) {
    console.error('[api/contact] qualifyLead failed', err);
    qualification = defaultQualification();
  }

  const lead: LeadContact = {
    nom,
    entreprise: entreprise || undefined,
    email,
    telephone,
    secteur: secteur || undefined,
    besoin: besoin || undefined,
    message: message || undefined,
    preferenceContact: preference || undefined,
    source: sourceLabel,
    qualification,
    receivedAt: new Date(),
  };

  const internal = internalContactEmail(lead);

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
    console.error('[api/contact] internal email failed', detail);
    return new Response(
      JSON.stringify({ ok: false, error: 'send_failed', detail }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2) Best-effort tasks: Discord + auto-reply + Notion (never block 200)
  const envKeys = env ? Object.keys(env) : [];
  const discordKey = envKeys.find((k) => /discord/i.test(k) && /webhook/i.test(k));
  const discordWebhook =
    (discordKey && typeof env?.[discordKey] === 'string' && (env[discordKey] as string)) || null;

  const discordTask = discordWebhook
    ? fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '9site4 Contact',
          embeds: [
            {
              title: `Nouveau lead — ${nom}${entreprise ? ` (${entreprise})` : ''}`,
              color: 0x91a6ff,
              fields: [
                { name: 'Nom', value: nom, inline: true },
                ...(entreprise ? [{ name: 'Entreprise', value: entreprise, inline: true }] : []),
                { name: 'Secteur', value: secteur, inline: true },
                { name: 'Téléphone', value: telephone, inline: true },
                { name: 'Email', value: email, inline: true },
                ...(besoin ? [{ name: 'Besoin', value: besoin, inline: true }] : []),
                ...(preference ? [{ name: 'Préférence', value: preference, inline: true }] : []),
                ...(message ? [{ name: 'Message', value: message.slice(0, 1024) }] : []),
              ],
              timestamp: new Date().toISOString(),
              footer: { text: '9site4.re — contact' },
            },
          ],
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Discord ${r.status}`);
      })
    : Promise.resolve();

  // Auto-reply only if prospect email looks valid (already validated above)
  const autoReply = autoReplyContactEmail(lead);
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

  // Notion — crée le lead dans le CRM (marque forcée à "9site4")
  const notionMessage = [
    besoin ? `Besoin : ${besoin}` : '',
    secteur ? `Secteur : ${secteur}` : '',
    preference ? `Préférence contact : ${preference}` : '',
    message ? `Message : ${message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const notionToken =
    typeof env?.NOTION_TOKEN === 'string' ? (env.NOTION_TOKEN as string) : null;
  const notionTask = notionToken
    ? createNotionLead(
        {
          nom,
          email,
          telephone,
          entreprise: entreprise || undefined,
          message: notionMessage || undefined,
          marque: '9site4',
        },
        notionToken
      )
    : Promise.resolve();

  const [discordRes, autoReplyRes, notionRes] = await Promise.allSettled([
    discordTask,
    autoReplyTask,
    notionTask,
  ]);
  if (discordRes.status === 'rejected') {
    console.error('[api/contact] discord failed', String(discordRes.reason));
  }
  if (autoReplyRes.status === 'rejected') {
    console.error('[api/contact] auto-reply failed', String(autoReplyRes.reason));
  }
  if (notionRes.status === 'rejected') {
    console.error('[api/contact] notion failed', String(notionRes.reason));
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
