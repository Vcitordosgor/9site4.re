/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface Category {
  id: string;
  nom: string;
}

interface Props {
  categories: Category[];
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
  { value: 'module', label: 'Juste un module de contact' },
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
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot anti-spam : si rempli, on simule un succès silencieux
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

    // eslint-disable-next-line no-console
    console.log('[ContactForm] formData =', data);
    setSubmitted(true);
    form.reset();
  };

  // ===== ÉTAT DE SUCCÈS =====
  if (submitted) {
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
          Merci !
        </h3>
        <p class="mt-3 text-base text-bleu-nuit/75">
          On vous recontacte rapidement.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          class="mt-6 inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full bg-bleu-nuit/5 text-bleu-nuit ring-1 ring-bleu-nuit/15 hover:ring-bleu-nuit/30 transition-all duration-200 cursor-pointer"
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

      {/* Submit */}
      <div class="pt-2">
        <button
          type="submit"
          class="group relative inline-flex w-full items-center justify-center gap-2 h-14 px-8 text-lg font-semibold rounded-full bg-orange text-bleu-nuit shadow-card hover:bg-[#E07F00] hover:shadow-card-hover active:translate-y-px transition-all duration-200 ease-out cursor-pointer"
        >
          Envoyer ma demande
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <p class="mt-3 text-xs text-bleu-nuit/70 text-center">
          En soumettant ce formulaire, vous acceptez d'être recontacté(e) au sujet de votre projet.
        </p>
      </div>
    </form>
  );
}
