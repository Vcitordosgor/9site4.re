/** @jsxImportSource preact */
import { useRef, useState, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { trackEvent } from '../../lib/tracking';

const SECTEURS = [
  { value: 'restaurant', label: 'Restaurant / Café' },
  { value: 'artisan', label: 'Artisan / BTP' },
  { value: 'institut', label: 'Institut / Bien-être' },
  { value: 'gite', label: 'Gîte / Location' },
  { value: 'liberal', label: 'Profession libérale' },
  { value: 'coach', label: 'Coach / Indépendant' },
  { value: 'commerce', label: 'Commerce local' },
  { value: 'autre', label: 'Autre' },
];

const OBJECTIFS = [
  { value: 'premier_site', label: 'Créer mon premier site' },
  { value: 'ameliorer', label: 'Améliorer mon site actuel' },
  { value: 'plus_demandes', label: 'Recevoir plus de demandes' },
  { value: 'mieux_presenter', label: 'Mieux présenter mes prestations' },
  { value: 'plus_pro', label: 'Rendre mon activité plus professionnelle' },
  { value: 'inconnu', label: 'Je ne sais pas encore' },
];

// Préférence de RAPPEL du prospect (comment il souhaite être recontacté),
// distincte du canal d'envoi du formulaire (POST email unique).
const PREFERENCES = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telephone', label: 'Téléphone' },
  { value: 'email', label: 'Email' },
];

const PHONE_REGEX = /^[+]?[\d\s().-]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormData {
  nom: string;
  entreprise: string;
  secteur: string;
  aSite: string;
  urlSite: string;
  lienRezo: string;
  objectif: string;
  telephone: string;
  email: string;
  preference: string;
  message: string;
}

export default function DiagnosticForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [aSite, setASite] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const mountedAt = useMemo(() => Date.now(), []);

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Time-trap anti-bot : ignorer silencieusement si soumission < 1500ms après le mount.
    if (Date.now() - mountedAt < 1500) {
      setSubmitted(true);
      form.reset();
      return;
    }
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) {
      setSubmitted(true);
      form.reset();
      return;
    }

    const data: FormData = {
      nom: ((fd.get('nom') as string) || '').trim(),
      entreprise: ((fd.get('entreprise') as string) || '').trim(),
      secteur: ((fd.get('secteur') as string) || '').trim(),
      aSite: ((fd.get('aSite') as string) || '').trim(),
      urlSite: ((fd.get('urlSite') as string) || '').trim(),
      lienRezo: ((fd.get('lienRezo') as string) || '').trim(),
      objectif: ((fd.get('objectif') as string) || '').trim(),
      telephone: ((fd.get('telephone') as string) || '').trim(),
      email: ((fd.get('email') as string) || '').trim(),
      preference: ((fd.get('preference') as string) || '').trim(),
      message: ((fd.get('message') as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.nom) errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.entreprise) errs.entreprise = 'Veuillez indiquer votre entreprise.';
    if (!data.secteur) errs.secteur = 'Veuillez choisir un secteur.';
    if (!data.aSite) errs.aSite = 'Indiquez si vous avez déjà un site.';
    if (!data.objectif) errs.objectif = 'Veuillez choisir un objectif principal.';
    if (!data.telephone) errs.telephone = 'Veuillez indiquer un numéro de téléphone.';
    else if (!PHONE_REGEX.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu (ex. +262 692 00 00 00).';
    if (!data.email) errs.email = 'Veuillez indiquer une adresse email.';
    else if (!EMAIL_REGEX.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.preference) errs.preference = 'Veuillez choisir une préférence de contact.';

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }

    setServerError(null);
    setSending(true);
    try {
      const sourcePath = typeof window !== 'undefined' ? window.location.pathname : '';
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: sourcePath }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as Record<string, unknown>));
        const code = (body as { error?: string }).error ?? `http_${res.status}`;
        const detail = (body as { detail?: string }).detail;
        setServerError(
          code === 'validation'
            ? 'Certains champs sont invalides.'
            : `L'envoi a échoué [${code}${detail ? ` — ${detail}` : ''}]. Merci de réessayer dans un instant.`
        );
        return;
      }
      // Tracking conversion (sans PII : seulement secteur).
      trackEvent({
        name: 'diagnostic_form_submit',
        category: 'conversion',
        label: 'email',
        source: 'diagnostic_form',
        sector: data.secteur,
        page_type: 'diagnostic',
      });
      setSubmitted(true);
      form.reset();
      setASite('');
    } catch {
      setServerError("Impossible d'envoyer la demande (réseau). Merci de réessayer dans un instant.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        class="bg-blanc-casse rounded-2xl ring-1 ring-bleu-nuit/10 shadow-card p-8 text-center"
      >
        <div class="mx-auto flex w-14 h-14 rounded-full bg-bleu/15 text-bleu items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 class="mt-5 font-sora font-semibold text-2xl text-bleu-nuit">
          Votre demande a bien été envoyée.
        </h3>
        <p class="mt-3 text-base text-bleu-nuit/75">
          Merci, nous avons bien reçu votre demande de diagnostic. Nous vous répondons sous
          24&nbsp;h ouvrées avec un premier retour sur votre présence web.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          class="mt-6 inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit transition-all duration-200 cursor-pointer"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const inputBase =
    'w-full h-12 px-4 text-base font-inter text-bleu-nuit bg-blanc-casse rounded-xl ring-1 transition-all duration-200 ease-out placeholder:text-bleu-nuit/55';
  const inputOk = 'ring-bleu-nuit/15 focus:ring-2 focus:ring-bleu';
  const inputErr = 'ring-2 ring-red-500 focus:ring-red-500';
  const labelBase = 'block text-sm font-semibold text-bleu-nuit mb-2';
  const errClass = 'mt-1.5 text-xs text-red-600';
  const selectStyle =
    "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\"); background-position: right 1rem center; background-size: 16px; padding-right: 2.5rem;";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      class="bg-blanc-casse rounded-2xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-8 space-y-5"
      aria-label="Formulaire de diagnostic gratuit"
    >
      <div aria-hidden="true" style="position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autocomplete="off" />
        </label>
      </div>

      {/* Nom + Entreprise */}
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label for="df-nom" class={labelBase}>Nom <span class="text-bleu" aria-hidden="true">*</span></label>
          <input id="df-nom" name="nom" type="text" autocomplete="name" required
            aria-invalid={errors.nom ? 'true' : 'false'}
            class={`${inputBase} ${errors.nom ? inputErr : inputOk}`} placeholder="Votre nom" />
          {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
        </div>
        <div>
          <label for="df-entreprise" class={labelBase}>Entreprise <span class="text-bleu" aria-hidden="true">*</span></label>
          <input id="df-entreprise" name="entreprise" type="text" autocomplete="organization" required
            aria-invalid={errors.entreprise ? 'true' : 'false'}
            class={`${inputBase} ${errors.entreprise ? inputErr : inputOk}`} placeholder="Nom de votre activité" />
          {errors.entreprise && <p role="alert" class={errClass}>{errors.entreprise}</p>}
        </div>
      </div>

      {/* Secteur */}
      <div>
        <label for="df-secteur" class={labelBase}>Secteur d'activité <span class="text-bleu" aria-hidden="true">*</span></label>
        <select id="df-secteur" name="secteur" required
          aria-invalid={errors.secteur ? 'true' : 'false'}
          class={`${inputBase} ${errors.secteur ? inputErr : inputOk} appearance-none bg-no-repeat`}
          style={selectStyle} defaultValue="">
          <option value="" disabled>Choisir un secteur…</option>
          {SECTEURS.map((s) => (
            <option value={s.value} key={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.secteur && <p role="alert" class={errClass}>{errors.secteur}</p>}
      </div>

      {/* Avez-vous déjà un site ? */}
      <fieldset>
        <legend class={labelBase}>Avez-vous déjà un site ? <span class="text-bleu" aria-hidden="true">*</span></legend>
        <div class="grid grid-cols-2 gap-2">
          {['oui', 'non'].map((v) => (
            <label key={v} class="relative flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold text-bleu-nuit bg-blanc-casse ring-1 ring-bleu-nuit/15 cursor-pointer transition-all duration-200 hover:ring-bleu-nuit/30 has-[:checked]:bg-bleu-nuit has-[:checked]:text-blanc-casse has-[:checked]:ring-bleu-nuit">
              <input type="radio" name="aSite" value={v} required class="sr-only peer"
                onChange={(ev) => setASite((ev.currentTarget as HTMLInputElement).value)} />
              <span>{v === 'oui' ? 'Oui' : 'Non'}</span>
            </label>
          ))}
        </div>
        {errors.aSite && <p role="alert" class={errClass}>{errors.aSite}</p>}
      </fieldset>

      {/* URL conditionnelle */}
      {aSite === 'oui' && (
        <div>
          <label for="df-url" class={labelBase}>URL du site <span class="text-bleu-nuit/65 font-normal">(optionnel)</span></label>
          <input id="df-url" name="urlSite" type="url"
            class={`${inputBase} ${inputOk}`} placeholder="https://votre-site.re" />
        </div>
      )}

      {/* Lien Insta / Google */}
      <div>
        <label for="df-rezo" class={labelBase}>Lien Instagram ou fiche Google <span class="text-bleu-nuit/65 font-normal">(optionnel)</span></label>
        <input id="df-rezo" name="lienRezo" type="text"
          class={`${inputBase} ${inputOk}`} placeholder="@compte ou lien Google Business" />
      </div>

      {/* Objectif */}
      <div>
        <label for="df-objectif" class={labelBase}>Objectif principal <span class="text-bleu" aria-hidden="true">*</span></label>
        <select id="df-objectif" name="objectif" required
          aria-invalid={errors.objectif ? 'true' : 'false'}
          class={`${inputBase} ${errors.objectif ? inputErr : inputOk} appearance-none bg-no-repeat`}
          style={selectStyle} defaultValue="">
          <option value="" disabled>Choisir un objectif…</option>
          {OBJECTIFS.map((o) => (
            <option value={o.value} key={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.objectif && <p role="alert" class={errClass}>{errors.objectif}</p>}
      </div>

      {/* Téléphone + Email */}
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label for="df-tel" class={labelBase}>Téléphone <span class="text-bleu" aria-hidden="true">*</span></label>
          <input id="df-tel" name="telephone" type="tel" inputMode="tel" autocomplete="tel" required
            aria-invalid={errors.telephone ? 'true' : 'false'}
            class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`} placeholder="+262 692 00 00 00" />
          {errors.telephone ? (
            <p role="alert" class={errClass}>{errors.telephone}</p>
          ) : (
            <p class="mt-1.5 text-xs text-bleu-nuit/70">Format libre. Exemple : 0692 00 00 00.</p>
          )}
        </div>
        <div>
          <label for="df-email" class={labelBase}>Email <span class="text-bleu" aria-hidden="true">*</span></label>
          <input id="df-email" name="email" type="email" autocomplete="email" required
            aria-invalid={errors.email ? 'true' : 'false'}
            class={`${inputBase} ${errors.email ? inputErr : inputOk}`} placeholder="vous@exemple.re" />
          {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
        </div>
      </div>

      {/* Préférence */}
      <fieldset>
        <legend class={labelBase}>Préférence de contact <span class="text-bleu" aria-hidden="true">*</span></legend>
        <div class="grid sm:grid-cols-3 gap-2">
          {PREFERENCES.map((p) => (
            <label key={p.value} class="relative flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold text-bleu-nuit bg-blanc-casse ring-1 ring-bleu-nuit/15 cursor-pointer transition-all duration-200 hover:ring-bleu-nuit/30 has-[:checked]:bg-bleu-nuit has-[:checked]:text-blanc-casse has-[:checked]:ring-bleu-nuit">
              <input type="radio" name="preference" value={p.value} required class="sr-only peer" />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
        {errors.preference && <p role="alert" class={errClass}>{errors.preference}</p>}
      </fieldset>

      {/* Message */}
      <div>
        <label for="df-message" class={labelBase}>Message <span class="text-bleu-nuit/65 font-normal">(optionnel)</span></label>
        <textarea id="df-message" name="message" rows={4}
          class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
          placeholder="Précisez ce que vous aimeriez voir analysé en priorité…"></textarea>
      </div>

      {/* Submit */}
      <div class="pt-2">
        {serverError && (
          <p role="alert" class="mb-3 text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-xl px-4 py-3">
            {serverError}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          class="group relative inline-flex w-full items-center justify-center gap-2 h-14 px-6 text-base font-semibold rounded-full bg-bleu text-bleu-nuit shadow-card hover:bg-bleu-fonce hover:shadow-card-hover active:translate-y-px transition-all duration-200 ease-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {sending ? 'Envoi…' : 'Envoyer ma demande →'}
        </button>
        <p class="mt-3 text-xs text-bleu-nuit/70 text-center leading-relaxed">
          Réponse sous 24&nbsp;h ouvrées. Vos informations servent uniquement à traiter votre
          demande de diagnostic, restent confidentielles et sont conservées 12 mois maximum.{' '}
          <a href="/mentions-legales#donnees" class="underline underline-offset-2 hover:text-bleu">En savoir plus</a>.
        </p>
      </div>
    </form>
  );
}
