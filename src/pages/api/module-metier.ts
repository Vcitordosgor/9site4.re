import type { APIRoute } from 'astro';
import siteConfig from '../../data/siteConfig.json';
import {
  validateModuleMetierPayload,
  type ModuleMetierPayload,
} from '../../lib/moduleMetier/validatePayload';

/**
 * Endpoint Worker du Module Métier — PRÊT MAIS NON CÂBLÉ.
 *
 * Rôle : recevoir la demande formatée (mode production du moteur), valider le
 * payload et envoyer l'e-mail au pro (filet de sécurité, AVANT l'ouverture de
 * wa.me côté client). AUCUNE persistance. Réponse JSON propre.
 *
 * Hors scope (à faire au déploiement par client) : mapping métier→adresse
 * côté serveur (ici on fait confiance à destination.email du payload de démo),
 * vérification Turnstile réelle, rate-limiting.
 */

export const prerender = false;

type SebSendMsg = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};
type Seb = { send: (msg: SebSendMsg) => Promise<unknown> };

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: ModuleMetierPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // Honeypot — succès silencieux, aucun e-mail.
  if (payload.website && payload.website.trim()) {
    return json({ ok: true }, 200);
  }

  const errors = validateModuleMetierPayload(payload);
  if (errors.length > 0) {
    return json({ ok: false, error: 'validation', fields: errors }, 400);
  }

  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const seb = env?.SEB as Seb | undefined;
  if (!seb) {
    return json({ ok: false, error: 'binding_missing' }, 500);
  }

  try {
    await seb.send({
      from: `9site4 <${siteConfig.contact.email}>`,
      to: payload.destination!.email!,
      subject: `Nouvelle demande — ${payload.label}`,
      text: payload.texte!,
      html: payload.html || undefined,
    });
  } catch (err) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error('[api/module-metier] email failed', detail);
    return json({ ok: false, error: 'send_failed', detail }, 502);
  }

  return json({ ok: true }, 200);
};
