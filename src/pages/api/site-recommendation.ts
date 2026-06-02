import type { APIRoute } from 'astro';
import siteConfig from '../../data/siteConfig.json';
import {
  internalRecommendationEmail,
  autoReplyRecommendationEmail,
  type LeadRecommendation,
  type AnswersSummary,
} from '../../lib/emailTemplates';
import {
  getRecommendation,
  SECTEUR_LABELS,
  PRIORITE_LABELS,
  CONTACT_LABELS,
  PRESENCE_LABELS,
  ELEMENT_LABELS,
  URGENCE_LABELS,
  SUITE_LABELS,
  type Answers,
  type SectorKey,
  type PriorityKey,
  type ContactKey,
  type PresenceKey,
  type ElementKey,
  type UrgencyKey,
  type NextStepKey,
} from '../../lib/siteRecommendation';

export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Payload {
  answers?: Partial<Answers> & { elements?: string[] };
  lead?: {
    nom?: string;
    entreprise?: string;
    telephone?: string;
    email?: string;
    preference?: string;
    message?: string;
  };
  website?: string;
  startTime?: number;
}

type SebSendMsg = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};
type Seb = { send: (msg: SebSendMsg) => Promise<unknown> };

function isKey<T extends string>(v: unknown, dict: Record<T, unknown>): v is T {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(dict, v);
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (payload.website && payload.website.trim()) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const startTime = typeof payload.startTime === 'number' ? payload.startTime : 0;
  if (!startTime || Date.now() - startTime < 1500) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const a = payload.answers ?? {};
  const errors: string[] = [];
  if (!isKey(a.secteur, SECTEUR_LABELS)) errors.push('secteur');
  if (!isKey(a.priorite, PRIORITE_LABELS)) errors.push('priorite');
  if (!isKey(a.contact, CONTACT_LABELS)) errors.push('contact');
  if (!isKey(a.presence, PRESENCE_LABELS)) errors.push('presence');
  if (!isKey(a.urgence, URGENCE_LABELS)) errors.push('urgence');
  if (!isKey(a.suite, SUITE_LABELS)) errors.push('suite');
  const elementsRaw = Array.isArray(a.elements) ? a.elements : [];
  const elements = elementsRaw.filter((e): e is ElementKey => isKey(e, ELEMENT_LABELS));

  const lead = payload.lead ?? {};
  const nom = (lead.nom ?? '').trim();
  const entreprise = (lead.entreprise ?? '').trim();
  const telephone = (lead.telephone ?? '').trim();
  const email = (lead.email ?? '').trim();
  const preference = (lead.preference ?? '').trim();
  const message = (lead.message ?? '').trim();

  if (!nom) errors.push('nom');
  if (email && !EMAIL_REGEX.test(email)) errors.push('email');

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ ok: false, error: 'validation', fields: errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const answers: Answers = {
    secteur: a.secteur as SectorKey,
    priorite: a.priorite as PriorityKey,
    contact: a.contact as ContactKey,
    presence: a.presence as PresenceKey,
    elements,
    urgence: a.urgence as UrgencyKey,
    suite: a.suite as NextStepKey,
  };

  const recommendation = getRecommendation(answers);

  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const seb = env?.SEB as Seb | undefined;

  if (!seb) {
    return new Response(
      JSON.stringify({ ok: false, error: 'binding_missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const leadObj: LeadRecommendation = {
    nom,
    entreprise: entreprise || undefined,
    email: email || undefined,
    telephone: telephone || undefined,
    preferenceContact: preference || undefined,
    message: message || undefined,
    receivedAt: new Date(),
  };

  const answersSummary: AnswersSummary = {
    secteur: SECTEUR_LABELS[answers.secteur],
    priorite: PRIORITE_LABELS[answers.priorite],
    contact: CONTACT_LABELS[answers.contact],
    presence: PRESENCE_LABELS[answers.presence],
    elements: answers.elements.map((e) => ELEMENT_LABELS[e]),
    urgence: URGENCE_LABELS[answers.urgence],
    suite: SUITE_LABELS[answers.suite],
  };

  const internal = internalRecommendationEmail({
    lead: leadObj,
    answers: answersSummary,
    recommendation,
  });

  try {
    await seb.send({
      from: `9site4 <${siteConfig.contact.email}>`,
      to: siteConfig.contact.notifyEmail,
      replyTo: email || siteConfig.contact.email,
      subject: internal.subject,
      text: internal.text,
      html: internal.html,
    });
  } catch (err) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error('[api/site-recommendation] internal email failed', detail);
    return new Response(
      JSON.stringify({ ok: false, error: 'send_failed', detail }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const envKeys = env ? Object.keys(env) : [];
  const discordKey = envKeys.find((k) => /discord/i.test(k) && /webhook/i.test(k));
  const discordWebhook =
    (discordKey && typeof env?.[discordKey] === 'string' && (env[discordKey] as string)) || null;

  const discordTask = discordWebhook
    ? fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '9site4 Recommandation',
          embeds: [
            {
              title: `Recommandation — ${nom}${entreprise ? ` (${entreprise})` : ''}`,
              color: 0x91a6ff,
              fields: [
                { name: 'Secteur', value: answersSummary.secteur, inline: true },
                { name: 'Priorité', value: recommendation.priority, inline: true },
                { name: 'Site recommandé', value: recommendation.recommendedSiteType },
                { name: 'Module', value: recommendation.recommendedModule, inline: true },
                ...(telephone ? [{ name: 'Téléphone', value: telephone, inline: true }] : []),
                ...(email ? [{ name: 'Email', value: email, inline: true }] : []),
                ...(preference ? [{ name: 'Préférence', value: preference, inline: true }] : []),
                { name: 'Suite souhaitée', value: answersSummary.suite, inline: true },
                ...(message ? [{ name: 'Message', value: message.slice(0, 1024) }] : []),
              ],
              timestamp: new Date().toISOString(),
              footer: { text: '9site4.re — recommandation' },
            },
          ],
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Discord ${r.status}`);
      })
    : Promise.resolve();

  const autoReplyTask = email && EMAIL_REGEX.test(email)
    ? (() => {
        const autoReply = autoReplyRecommendationEmail({ nom });
        return seb
          .send({
            from: `9site4 <${siteConfig.contact.email}>`,
            to: email,
            replyTo: siteConfig.contact.email,
            subject: autoReply.subject,
            text: autoReply.text,
            html: autoReply.html,
          })
          .then(() => undefined);
      })()
    : Promise.resolve();

  const [discordRes, autoReplyRes] = await Promise.allSettled([discordTask, autoReplyTask]);
  if (discordRes.status === 'rejected') {
    console.error('[api/site-recommendation] discord failed', String(discordRes.reason));
  }
  if (autoReplyRes.status === 'rejected') {
    console.error('[api/site-recommendation] auto-reply failed', String(autoReplyRes.reason));
  }

  return new Response(
    JSON.stringify({ ok: true, recommendation }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
