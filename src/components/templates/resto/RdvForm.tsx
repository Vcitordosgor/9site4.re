/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface Occasion {
  id: string;
  label: string;
}

interface Creneau {
  id: string;
  label: string;
  horaire: string;
}

interface Props {
  occasions: Occasion[];
  creneaux: Creneau[];
  whatsapp: string;
  restoNom: string;
}

interface FormState {
  nom: string;
  telephone: string;
  email: string;
  couverts: string;
  date: string;
  creneau: string;
  occasion: string;
  message: string;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function buildWhatsAppMessage(data: FormState, restoNom: string, occasionLabel: string): string {
  const lines = [
    `Bonjour ${restoNom},`,
    '',
    'Je souhaite réserver une table :',
    '',
    `• Nom : ${data.nom}`,
    `• Téléphone : ${data.telephone}`,
    `• Email : ${data.email}`,
    '',
    `• Couverts : ${data.couverts}`,
    `• Occasion : ${occasionLabel}`,
    `• Date : ${data.date}`,
    `• Service : ${data.creneau}`,
  ];
  if (data.message) lines.push('', `Message : ${data.message}`);
  lines.push('', 'Merci !');
  return lines.join('\n');
}

/**
 * RdvForm restaurant — formulaire de réservation de table.
 * Champ couverts en stepper (− 2 +), occasion en select, créneau
 * en pills (déjeuner / dîner / dîner tardif).
 *
 * Style : labels Manrope uppercase, inputs avec border-bottom or
 * laiton (différent du salon qui a des box ring, du spa qui a
 * des underline crème sur cacao).
 *
 * À la soumission : ouvre WhatsApp pré-rempli.
 */
export default function RdvForm({ occasions, creneaux, whatsapp, restoNom }: Props) {
  const [couverts, setCouverts] = useState<number>(2);
  const [creneau, setCreneau] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const decCouverts = () => setCouverts((c) => Math.max(1, c - 1));
  const incCouverts = () => setCouverts((c) => Math.min(20, c + 1));

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) {
      const fakeData: FormState = {
        nom: '', telephone: '', email: '',
        couverts: '', date: '', creneau: '', occasion: '', message: '',
      };
      setSubmitted(fakeData);
      return;
    }

    const data: FormState = {
      nom:       ((fd.get('nom')       as string) || '').trim(),
      telephone: ((fd.get('telephone') as string) || '').trim(),
      email:     ((fd.get('email')     as string) || '').trim(),
      couverts:  String(couverts),
      date:      ((fd.get('date')      as string) || '').trim(),
      creneau:   ((fd.get('creneau')   as string) || '').trim(),
      occasion:  ((fd.get('occasion')  as string) || '').trim(),
      message:   ((fd.get('message')   as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!data.nom)        errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.telephone)  errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.email)      errs.email = 'Email requis.';
    else if (!emailRegex.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.date)       errs.date = 'Choisissez une date.';
    if (!data.creneau)    errs.creneau = 'Choisissez un service.';
    if (!data.occasion)   errs.occasion = "Indiquez l'occasion de votre venue.";

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const occasionLabel = occasions.find((o) => o.id === data.occasion)?.label ?? data.occasion;
    const text = buildWhatsAppMessage(data, restoNom, occasionLabel);
    const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(data);
  };

  // ============== ÉTAT DE SUCCÈS ==============
  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        class="bg-resto-blanc rounded-sm p-8 md:p-14 text-center max-w-2xl mx-auto ring-1 ring-resto-or/30"
        style="box-shadow: 0 1px 3px rgb(19 26 54 / 0.05), 0 24px 48px -16px rgb(19 26 54 / 0.18);"
      >
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-resto-bleu-roi/10 ring-1 ring-resto-bleu-roi/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-resto-bleu-roi" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 class="mt-6 font-bodoni italic text-resto-bleu-encre" style="font-size: clamp(28px, 3.5vw, 40px);">
          Demande envoyée sur WhatsApp.
        </h3>
        {submitted.nom && (
          <p class="mt-4 font-manrope text-resto-bleu-encre/75 leading-[1.7]">
            Merci <strong class="font-semibold text-resto-bleu-encre">{submitted.nom}</strong>. Validez l'envoi dans WhatsApp — nous confirmons votre table sous quelques heures.
          </p>
        )}

        {(submitted.couverts || submitted.date) && (
          <div class="mt-8 pt-8 border-t border-resto-bleu-encre/10 max-w-md mx-auto text-left">
            <p class="text-[11px] uppercase tracking-[0.32em] text-resto-bleu-roi font-manrope font-semibold mb-4">Récapitulatif</p>
            <ul class="space-y-2.5 text-sm font-manrope">
              {submitted.couverts && (
                <li class="flex items-baseline gap-3">
                  <span class="text-resto-bleu-encre/55 min-w-[6rem]">Couverts</span>
                  <span class="font-bodoni italic text-resto-bleu-encre">{submitted.couverts}</span>
                </li>
              )}
              {submitted.date && (
                <li class="flex items-baseline gap-3">
                  <span class="text-resto-bleu-encre/55 min-w-[6rem]">Date</span>
                  <span class="font-bodoni italic text-resto-bleu-encre">{submitted.date}</span>
                </li>
              )}
              {submitted.creneau && (
                <li class="flex items-baseline gap-3">
                  <span class="text-resto-bleu-encre/55 min-w-[6rem]">Service</span>
                  <span class="font-bodoni italic text-resto-bleu-encre capitalize">{submitted.creneau}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setErrors({});
            setCouverts(2);
            setCreneau('');
          }}
          class="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] font-manrope text-resto-bleu-encre/65 hover:text-resto-bleu-roi transition-colors cursor-pointer"
        >
          Nouvelle réservation
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 7v5l3 3" />
          </svg>
        </button>
      </div>
    );
  }

  // ============== FORMULAIRE ==============
  // Style border-bottom only (différent salon box ring, spa underline crème)
  const inputBase = 'w-full h-12 px-1 text-base font-manrope text-resto-bleu-encre bg-transparent border-0 border-b transition-colors duration-200 placeholder:text-resto-bleu-encre/35 focus:outline-none';
  const inputOk   = 'border-resto-bleu-encre/25 focus:border-resto-bleu-roi';
  const inputErr  = 'border-resto-bleu-roi';
  const labelBase = 'block text-[10px] font-semibold uppercase tracking-[0.32em] text-resto-bleu-roi font-manrope mb-2';
  const errClass  = 'mt-1.5 text-xs text-resto-bleu-roi font-manrope font-semibold';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-resto-blanc-casse rounded-sm p-6 sm:p-10 md:p-14 max-w-2xl mx-auto ring-1 ring-resto-or/30"
      style="box-shadow: 0 1px 3px rgb(19 26 54 / 0.05), 0 24px 48px -16px rgb(19 26 54 / 0.20);"
      aria-label="Formulaire de réservation de table"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
      </div>

      {/* Vous */}
      <fieldset class="space-y-6">
        <legend class="font-bodoni italic text-resto-bleu-encre" style="font-size: 26px;">
          <span class="font-bodoni font-bold text-resto-bleu-roi tabular-nums mr-2 not-italic" style="font-size: 16px;">I.</span>Vous
        </legend>

        <div>
          <label for="resto-nom" class={labelBase}>Nom</label>
          <input id="resto-nom" name="nom" type="text" required autocomplete="name"
            class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
            placeholder="Marie Dupont"
            aria-invalid={errors.nom ? 'true' : 'false'}
          />
          {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          <div>
            <label for="resto-tel" class={labelBase}>Téléphone</label>
            <input id="resto-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
              class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
              placeholder="0692 00 00 00"
              aria-invalid={errors.telephone ? 'true' : 'false'}
            />
            {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
          </div>
          <div>
            <label for="resto-email" class={labelBase}>Email</label>
            <input id="resto-email" name="email" type="email" required autocomplete="email"
              class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              placeholder="vous@exemple.re"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
          </div>
        </div>
      </fieldset>

      {/* Votre table */}
      <fieldset class="space-y-6 mt-12">
        <legend class="font-bodoni italic text-resto-bleu-encre" style="font-size: 26px;">
          <span class="font-bodoni font-bold text-resto-bleu-roi tabular-nums mr-2 not-italic" style="font-size: 16px;">II.</span>Votre table
        </legend>

        {/* Couverts en stepper */}
        <div>
          <span class={labelBase}>Nombre de couverts</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick={decCouverts}
              aria-label="Diminuer le nombre de couverts"
              class="w-12 h-12 flex items-center justify-center rounded-full ring-1 ring-resto-bleu-encre/20 text-resto-bleu-encre hover:bg-resto-bleu-roi hover:text-resto-blanc-casse hover:ring-resto-bleu-roi transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={couverts <= 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span class="flex-1 text-center font-bodoni italic text-resto-bleu-encre tabular-nums" style="font-size: 32px;" aria-live="polite">
              {couverts}
              <span class="ml-1 font-manrope not-italic text-resto-bleu-encre/55 text-base normal-case tracking-normal">{couverts > 1 ? 'personnes' : 'personne'}</span>
            </span>
            <button
              type="button"
              onClick={incCouverts}
              aria-label="Augmenter le nombre de couverts"
              class="w-12 h-12 flex items-center justify-center rounded-full ring-1 ring-resto-bleu-encre/20 text-resto-bleu-encre hover:bg-resto-bleu-roi hover:text-resto-blanc-casse hover:ring-resto-bleu-roi transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={couverts >= 20}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <p class="mt-2 text-xs font-manrope italic text-resto-bleu-encre/55">
            Au-delà de 8 couverts, contactez-nous directement par téléphone.
          </p>
        </div>

        {/* Date */}
        <div>
          <label for="resto-date" class={labelBase}>Date souhaitée</label>
          <input id="resto-date" name="date" type="date" required min={today}
            class={`${inputBase} ${errors.date ? inputErr : inputOk} cursor-pointer`}
            aria-invalid={errors.date ? 'true' : 'false'}
          />
          {errors.date && <p role="alert" class={errClass}>{errors.date}</p>}
        </div>

        {/* Service en pills */}
        <div>
          <span class={labelBase}>Service</span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {creneaux.map((opt) => {
              const isSel = creneau === opt.id;
              return (
                <label
                  key={opt.id}
                  class={`relative flex flex-col items-start justify-center gap-0.5 h-16 px-4 rounded-sm cursor-pointer transition-all ${
                    isSel
                      ? 'bg-resto-bleu-roi text-resto-blanc-casse ring-1 ring-resto-bleu-roi'
                      : 'bg-transparent text-resto-bleu-encre ring-1 ring-resto-bleu-encre/20 hover:ring-resto-bleu-encre/45'
                  }`}
                >
                  <input type="radio" name="creneau" value={opt.label} checked={isSel}
                    onChange={() => setCreneau(opt.id)} required class="sr-only" />
                  <span class="text-sm font-manrope font-semibold">{opt.label}</span>
                  <span class="text-xs opacity-75 tabular-nums font-manrope">{opt.horaire}</span>
                </label>
              );
            })}
          </div>
          {errors.creneau && <p role="alert" class={errClass}>{errors.creneau}</p>}
        </div>

        {/* Occasion */}
        <div>
          <label for="resto-occasion" class={labelBase}>Occasion</label>
          <select
            id="resto-occasion" name="occasion" required defaultValue=""
            class={`${inputBase} ${errors.occasion ? inputErr : inputOk} appearance-none bg-no-repeat cursor-pointer`}
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23131A36' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0 center; background-size: 14px; padding-right: 1.75rem;"
            aria-invalid={errors.occasion ? 'true' : 'false'}
          >
            <option value="" disabled>Choisir une occasion…</option>
            {occasions.map((o) => (
              <option value={o.id} key={o.id}>{o.label}</option>
            ))}
          </select>
          {errors.occasion && <p role="alert" class={errClass}>{errors.occasion}</p>}
        </div>

        {/* Message */}
        <div>
          <label for="resto-message" class={labelBase}>
            Message <span class="lowercase tracking-normal text-resto-bleu-encre/45 font-normal">(optionnel)</span>
          </label>
          <textarea id="resto-message" name="message" rows={3}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Allergies, régime particulier, préférence de table, surprise…"
          ></textarea>
        </div>
      </fieldset>

      {/* Submit WhatsApp */}
      <div class="mt-12">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-semibold uppercase tracking-[0.22em] font-manrope rounded-full bg-[#25D366] text-white hover:bg-[#1FBE5A] transition-colors cursor-pointer"
          style="box-shadow: 0 8px 24px rgb(37 211 102 / 0.30);"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.24-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
          </svg>
          Envoyer la demande
        </button>
        <p class="mt-4 text-xs text-resto-bleu-encre/55 text-center font-manrope leading-relaxed">
          Votre demande arrive directement au restaurant via WhatsApp.
          <br class="hidden sm:inline" />
          Confirmation rapide. Annulation gratuite jusqu'à 24h avant.
        </p>
      </div>
    </form>
  );
}
