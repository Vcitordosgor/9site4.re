import type { APIRoute } from 'astro';
import siteConfig from '../../data/siteConfig.json';

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
}

const PHONE_REGEX = /^[+]?[\d\s().-]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  if (!besoin) errors.push('besoin');
  if (!preference) errors.push('preference');

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ ok: false, error: 'validation', fields: errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const lines = [
    `Nom : ${nom}`,
    entreprise ? `Entreprise : ${entreprise}` : null,
    `Secteur : ${secteur}`,
    `Téléphone : ${telephone}`,
    `Email : ${email}`,
    `Besoin : ${besoin}`,
    `Préférence de contact : ${preference}`,
    message ? `\nMessage :\n${message}` : null,
  ].filter(Boolean);
  const text = `Nouvelle demande depuis le formulaire 9site4.re\n\n${lines.join('\n')}`;

  const html = `
    <p><strong>Nouvelle demande depuis le formulaire 9site4.re</strong></p>
    <ul>
      <li><strong>Nom :</strong> ${escapeHtml(nom)}</li>
      ${entreprise ? `<li><strong>Entreprise :</strong> ${escapeHtml(entreprise)}</li>` : ''}
      <li><strong>Secteur :</strong> ${escapeHtml(secteur)}</li>
      <li><strong>Téléphone :</strong> ${escapeHtml(telephone)}</li>
      <li><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></li>
      <li><strong>Besoin :</strong> ${escapeHtml(besoin)}</li>
      <li><strong>Préférence de contact :</strong> ${escapeHtml(preference)}</li>
    </ul>
    ${message ? `<p><strong>Message :</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : ''}
  `;

  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const seb = env?.SEB as
    | { send: (msg: { from: string; to: string; subject: string; text: string; html?: string; replyTo?: string }) => Promise<unknown> }
    | undefined;

  if (!seb) {
    return new Response(
      JSON.stringify({ ok: false, error: 'binding_missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await seb.send({
      from: `9site4 Contact <contact@9site4.re>`,
      to: siteConfig.contact.notifyEmail,
      replyTo: email,
      subject: `Demande de contact — ${nom}${entreprise ? ` (${entreprise})` : ''}`,
      text,
      html,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: 'send_failed', detail: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
