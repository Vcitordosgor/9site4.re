/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import siteConfig from '../../data/siteConfig.json';

interface Category {
  id: string;
  nom: string;
}

interface Props {
  categories: Category[];
}

const WHATSAPP_NUMBER = siteConfig.contact.whatsapp;
const CONTACT_EMAIL = siteConfig.contact.email;

function buildMessage(data: FormData, categories: Category[]): string {
  const secteurLabel =
    categories.find((c) => c.id === data.secteur)?.nom ??
    (data.secteur === 'autre' ? 'Autre' : data.secteur);
  const besoinLabel =
    BESOINS.find((b) => b.value === data.besoin)?.label ?? data.besoin;
  const prefLabel =
    PREFERENCES.find((p) => p.value === data.preference)?.label ??
    data.preference;
  const lines = [
    'Bonjour 9site4, je souhaite être recontacté(e).',
    '',
    `Nom : ${data.nom}`,
  ];
  if (data.entreprise) lines.push(`Entreprise : ${data.entreprise}`);
  lines.push(
    `Secteur : ${secteurLabel}`,
    `Téléphone : ${data.telephone}`,
    `Email : ${data.email}`,
    `Besoin : ${besoinLabel}`,
    `Préférence de contact : ${prefLabel}`
  );
  if (data.message) {
    lines.push('', 'Message :', data.message);
  }
  return lines.join('\n');
}

interface FormData {
  nom: string;
  entreprise: string;
  secteur: string;
  telephone: string;
  email: string;
  besoin: string;
  preference: string;
  message: string;
}

const BESOINS = [
  { value: 'creation', label: 'Création complète' },
  { value: 'refonte', label: 'Refonte' },
  { value: 'module', label: 'Juste un formulaire de contact' },
  { value: 'inconnu', label: 'Je ne sais pas encore' },
];

const PREFERENCES = [
  { value: 'telephone', label: 'Téléphone' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

// Format français large : +262, 0692, espaces, points, tirets, parenthèses
const PHONE_REGEX = /^[+]?[\d\s().-]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * ContactForm — Astro Island (client:load).
 * - 8 champs, validation HTML5 + JS supplémentaire pour tel/email
 * - honeypot caché (name="website")
 * - sur soumission valide : console.log(formData) + message de succès + reset
 * - aucun envoi réel (front uniquement à ce stade)
 */
export default function ContactForm({ categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedChannel, setSubmittedChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [lastMessage, setLastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e as unknown as { submitter?: HTMLElement | null }).submitter
      ?? (e.nativeEvent as SubmitEvent | undefined)?.submitter
      ?? null;
    const fd = new FormData(form);
    const channelFromSubmitter =
      submitter instanceof HTMLButtonElement && submitter.name === 'channel'
        ? submitter.value
        : null;

    if ((fd.get('website') as string)?.trim()) {
      setSubmitted(true);
      form.reset();
      return;
    }

    const data: FormData = {
      nom: ((fd.get('nom') as string) || '').trim(),
      entreprise: ((fd.get('entreprise') as string) || '').trim(),
      secteur: ((fd.get('secteur') as string) || '').trim(),
      telephone: ((fd.get('telephone') as string) || '').trim(),
      email: ((fd.get('email') as string) || '').trim(),
      besoin: ((fd.get('besoin') as string) || '').trim(),
      preference: ((fd.get('preference') as string) || '').trim(),
      message: ((fd.get('message') as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.nom) errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.secteur) errs.secteur = 'Veuillez choisir un secteur.';
    if (!data.telephone) {
      errs.telephone = 'Veuillez indiquer un numéro de téléphone.';
    } else if (!PHONE_REGEX.test(data.telephone)) {
      errs.telephone = 'Format de téléphone non reconnu (ex. +262 692 00 00 00).';
    }
    if (!data.email) {
      errs.email = 'Veuillez indiquer une adresse email.';
    } else if (!EMAIL_REGEX.test(data.email)) {
      errs.email = "L'adresse email semble invalide.";
    }
    if (!data.besoin) errs.besoin = 'Veuillez choisir un besoin principal.';
    if (!data.preference) {
      errs.preference = 'Veuillez choisir une préférence de contact.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Focus sur le premier champ en erreur (skill §8 focus-management)
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }

    const message = buildMessage(data, categories);
    const channel = (channelFromSubmitter || (fd.get('channel') as string) || 'whatsapp') as 'whatsapp' | 'email';
    setServerError(null);

    if (channel === 'whatsapp') {
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setLastMessage(message);
      setSubmittedChannel('whatsapp');
      setSubmitted(true);
      form.reset();
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as Record<string, unknown>));
        const code = (body as { error?: string }).error ?? `http_${res.status}`;
        const detail = (body as { detail?: string }).detail;
        setServerError(
          code === 'validation'
            ? 'Certains champs sont invalides.'
            : `L'envoi a échoué [${code}${detail ? ` — ${detail}` : ''}]. Réessayez ou utilisez WhatsApp.`
        );
        return;
      }
      setLastMessage(message);
      setSubmittedChannel('email');
      setSubmitted(true);
      form.reset();
    } catch {
      setServerError("Impossible d'envoyer le message (réseau). Réessayez ou utilisez WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  // ===== ÉTAT DE SUCCÈS =====
  if (submitted) {
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Demande de contact — 9site4'
    )}&body=${encodeURIComponent(lastMessage)}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lastMessage)}`;
    return (
      <div
        role="status"
        aria-live="polite"
        class="bg-blanc-casse rounded-2xl ring-1 ring-bleu-nuit/10 shadow-card p-8 text-center"
      >
        <div class="mx-auto flex w-14 h-14 rounded-full bg-orange/15 text-orange items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 class="mt-5 font-sora font-semibold text-2xl text-bleu-nuit">
          {submittedChannel === 'email' ? 'Message envoyé' : 'WhatsApp ouvert'}
        </h3>
        <p class="mt-3 text-base text-bleu-nuit/75">
          {submittedChannel === 'email'
            ? 'Merci ! Votre message vient d\'être envoyé. Nous revenons vers vous très vite.'
            : 'Validez l\'envoi du message pré-rempli dans WhatsApp pour finaliser votre demande.'}
        </p>
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full bg-bleu text-blanc-casse hover:bg-bleu-nuit transition-all duration-200"
          >
            Rouvrir WhatsApp
          </a>
          <a
            href={mailtoUrl}
            class="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full bg-bleu-nuit/5 text-bleu-nuit ring-1 ring-bleu-nuit/15 hover:ring-bleu-nuit/30 transition-all duration-200"
          >
            Envoyer par email
          </a>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          class="mt-4 inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit transition-all duration-200 cursor-pointer"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  // ===== FORMULAIRE =====
  const inputBase =
    'w-full h-12 px-4 text-base font-inter text-bleu-nuit bg-blanc-casse rounded-xl ring-1 transition-all duration-200 ease-out placeholder:text-bleu-nuit/40';
  const inputOk = 'ring-bleu-nuit/15 focus:ring-2 focus:ring-orange';
  const inputErr = 'ring-2 ring-red-500 focus:ring-red-500';
  const labelBase = 'block text-sm font-semibold text-bleu-nuit mb-2';
  const errClass = 'mt-1.5 text-xs text-red-600';

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      class="bg-blanc-casse rounded-2xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-8 space-y-5"
      aria-label="Formulaire de contact"
    >
      {/* Honeypot anti-spam */}
      <div
        aria-hidden="true"
        style="position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;"
      >
        <label>
          Ne pas remplir
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autocomplete="off"
          />
        </label>
      </div>

      {/* Nom + Entreprise */}
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label for="cf-nom" class={labelBase}>
            Nom <span class="text-orange" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-nom"
            name="nom"
            type="text"
            autocomplete="name"
            required
            aria-required="true"
            aria-invalid={errors.nom ? 'true' : 'false'}
            aria-describedby={errors.nom ? 'cf-nom-err' : undefined}
            class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
            placeholder="Votre nom"
          />
          {errors.nom && (
            <p id="cf-nom-err" role="alert" class={errClass}>
              {errors.nom}
            </p>
          )}
        </div>
        <div>
          <label for="cf-entreprise" class={labelBase}>
            Entreprise <span class="text-bleu-nuit/65 font-normal">(optionnel)</span>
          </label>
          <input
            id="cf-entreprise"
            name="entreprise"
            type="text"
            autocomplete="organization"
            class={`${inputBase} ${inputOk}`}
            placeholder="Nom de votre activité"
          />
        </div>
      </div>

      {/* Secteur */}
      <div>
        <label for="cf-secteur" class={labelBase}>
          Secteur d'activité <span class="text-orange" aria-hidden="true">*</span>
        </label>
        <select
          id="cf-secteur"
          name="secteur"
          required
          aria-required="true"
          aria-invalid={errors.secteur ? 'true' : 'false'}
          aria-describedby={errors.secteur ? 'cf-secteur-err' : undefined}
          class={`${inputBase} ${errors.secteur ? inputErr : inputOk} appearance-none bg-no-repeat`}
          style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230B1437' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 16px; padding-right: 2.5rem;"
          defaultValue=""
        >
          <option value="" disabled>Choisir un secteur…</option>
          {categories.map((c) => (
            <option value={c.id} key={c.id}>
              {c.nom}
            </option>
          ))}
          <option value="autre">Autre</option>
        </select>
        {errors.secteur && (
          <p id="cf-secteur-err" role="alert" class={errClass}>
            {errors.secteur}
          </p>
        )}
      </div>

      {/* Téléphone + Email */}
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label for="cf-tel" class={labelBase}>
            Téléphone <span class="text-orange" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-tel"
            name="telephone"
            type="tel"
            inputMode="tel"
            autocomplete="tel"
            required
            aria-required="true"
            aria-invalid={errors.telephone ? 'true' : 'false'}
            aria-describedby={errors.telephone ? 'cf-tel-err' : 'cf-tel-help'}
            class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
            placeholder="+262 692 00 00 00"
          />
          {errors.telephone ? (
            <p id="cf-tel-err" role="alert" class={errClass}>
              {errors.telephone}
            </p>
          ) : (
            <p id="cf-tel-help" class="mt-1.5 text-xs text-bleu-nuit/70">
              Format libre. Exemple : 0692 00 00 00.
            </p>
          )}
        </div>
        <div>
          <label for="cf-email" class={labelBase}>
            Email <span class="text-orange" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autocomplete="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            placeholder="vous@exemple.re"
          />
          {errors.email && (
            <p id="cf-email-err" role="alert" class={errClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Besoin principal */}
      <div>
        <label for="cf-besoin" class={labelBase}>
          Besoin principal <span class="text-orange" aria-hidden="true">*</span>
        </label>
        <select
          id="cf-besoin"
          name="besoin"
          required
          aria-required="true"
          aria-invalid={errors.besoin ? 'true' : 'false'}
          aria-describedby={errors.besoin ? 'cf-besoin-err' : undefined}
          class={`${inputBase} ${errors.besoin ? inputErr : inputOk} appearance-none bg-no-repeat`}
          style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230B1437' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 16px; padding-right: 2.5rem;"
          defaultValue=""
        >
          <option value="" disabled>Choisir un besoin…</option>
          {BESOINS.map((b) => (
            <option value={b.value} key={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        {errors.besoin && (
          <p id="cf-besoin-err" role="alert" class={errClass}>
            {errors.besoin}
          </p>
        )}
      </div>

      {/* Préférence de contact (radio) */}
      <fieldset
        aria-describedby={errors.preference ? 'cf-pref-err' : undefined}
      >
        <legend class={labelBase}>
          Préférence de contact <span class="text-orange" aria-hidden="true">*</span>
        </legend>
        <div class="grid sm:grid-cols-3 gap-2">
          {PREFERENCES.map((p) => (
            <label
              key={p.value}
              class="relative flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold text-bleu-nuit bg-blanc-casse ring-1 ring-bleu-nuit/15 cursor-pointer transition-all duration-200 hover:ring-bleu-nuit/30 has-[:checked]:bg-bleu-nuit has-[:checked]:text-blanc-casse has-[:checked]:ring-bleu-nuit"
            >
              <input
                type="radio"
                name="preference"
                value={p.value}
                required
                class="sr-only peer"
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
        {errors.preference && (
          <p id="cf-pref-err" role="alert" class={errClass}>
            {errors.preference}
          </p>
        )}
      </fieldset>

      {/* Message libre */}
      <div>
        <label for="cf-message" class={labelBase}>
          Message <span class="text-bleu-nuit/65 font-normal">(optionnel)</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
          placeholder="Quelques mots sur votre projet…"
        ></textarea>
      </div>

      {/* Submit — deux canaux d'envoi */}
      <div class="pt-2">
        {serverError && (
          <p role="alert" class="mb-3 text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-xl px-4 py-3">
            {serverError}
          </p>
        )}
        <div class="grid sm:grid-cols-2 gap-3">
          <button
            type="submit"
            name="channel"
            value="whatsapp"
            disabled={sending}
            class="group relative inline-flex items-center justify-center gap-2 h-14 px-6 text-base font-semibold rounded-full bg-[#25D366] text-white shadow-card hover:bg-[#1ebe57] hover:shadow-card-hover active:translate-y-px transition-all duration-200 ease-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.11 4.91A10 10 0 0 0 4.06 18.2L3 22l3.91-1.03A10 10 0 1 0 19.11 4.91Zm-7.1 15.4a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-2.32.61.62-2.26-.2-.31a8.3 8.3 0 1 1 6.44 3.3Zm4.55-6.22c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.98-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.39-1.72c-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.83-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.13.16 1.7 2.6 4.12 3.65.58.25 1.02.4 1.37.51.57.18 1.1.16 1.51.1.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z"/>
            </svg>
            Envoyer par WhatsApp
          </button>
          <button
            type="submit"
            name="channel"
            value="email"
            disabled={sending}
            aria-busy={sending}
            class="group relative inline-flex items-center justify-center gap-2 h-14 px-6 text-base font-semibold rounded-full bg-bleu text-blanc-casse shadow-card hover:bg-bleu-nuit hover:shadow-card-hover active:translate-y-px transition-all duration-200 ease-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            )}
            {sending ? 'Envoi…' : 'Envoyer par mail'}
          </button>
        </div>
        <p class="mt-3 text-xs text-bleu-nuit/70 text-center leading-relaxed">
          Choisissez le canal qui vous convient. Le message sera pré-rempli avec
          les informations du formulaire — vous pourrez le relire avant l'envoi.
          Vos données restent confidentielles et sont conservées 12 mois maximum.
          {' '}
          <a href="/mentions-legales#donnees" class="underline underline-offset-2 hover:text-orange">
            En savoir plus
          </a>.
        </p>
      </div>
    </form>
  );
}
