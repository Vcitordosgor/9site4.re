/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface Soin {
  id: string;
  nom: string;
  prix: number;
  duree: string;
}

interface Category {
  titre: string;
  items: Soin[];
}

interface Intention {
  id: string;
  label: string;
}

interface Creneau {
  id: string;
  label: string;
  horaire: string;
}

interface Props {
  soins: Record<string, Category>;
  intentions: Intention[];
  creneaux: Creneau[];
  whatsapp: string;
  spaNom: string;
}

interface FormState {
  nom: string;
  telephone: string;
  email: string;
  soin: string;
  intention: string;
  date: string;
  creneau: string;
  message: string;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Construit le texte WhatsApp pré-rempli envoyé au spa.
 */
function buildWhatsAppMessage(data: FormState, spaNom: string, intentionLabel: string): string {
  const lines = [
    `Bonjour ${spaNom},`,
    '',
    'Je souhaite réserver un soin :',
    '',
    `• Nom : ${data.nom}`,
    `• Téléphone : ${data.telephone}`,
    `• Email : ${data.email}`,
    '',
    `• Soin : ${data.soin}`,
    `• Intention : ${intentionLabel}`,
    `• Date : ${data.date}`,
    `• Créneau : ${data.creneau}`,
  ];
  if (data.message) lines.push('', `Message : ${data.message}`);
  lines.push('', 'Merci !');
  return lines.join('\n');
}

/**
 * RdvForm spa — formulaire de réservation single-column.
 * Style éditorial doux : labels en small-caps Raleway, inputs avec
 * underline plutôt que box (pour différencier du salon qui a des
 * inputs avec ring). À la soumission, ouvre WhatsApp pré-rempli.
 */
export default function RdvForm({ soins, intentions, creneaux, whatsapp, spaNom }: Props) {
  const [intention, setIntention] = useState<string>('');
  const [creneau, setCreneau] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) {
      const fakeData: FormState = {
        nom: '', telephone: '', email: '',
        soin: '', intention: '', date: '', creneau: '', message: '',
      };
      setSubmitted(fakeData);
      return;
    }

    const data: FormState = {
      nom:       ((fd.get('nom')       as string) || '').trim(),
      telephone: ((fd.get('telephone') as string) || '').trim(),
      email:     ((fd.get('email')     as string) || '').trim(),
      soin:      ((fd.get('soin')      as string) || '').trim(),
      intention: ((fd.get('intention') as string) || '').trim(),
      date:      ((fd.get('date')      as string) || '').trim(),
      creneau:   ((fd.get('creneau')   as string) || '').trim(),
      message:   ((fd.get('message')   as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!data.nom)        errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.telephone)  errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.email)      errs.email = 'Email requis.';
    else if (!emailRegex.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.soin)       errs.soin = 'Choisissez un soin.';
    if (!data.intention)  errs.intention = "Choisissez une intention.";
    if (!data.date)       errs.date = 'Choisissez une date.';
    if (!data.creneau)    errs.creneau = 'Choisissez un créneau.';

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const intentionLabel = intentions.find((it) => it.id === data.intention)?.label ?? data.intention;
    const text = buildWhatsAppMessage(data, spaNom, intentionLabel);
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
        class="bg-spa-creme rounded-sm p-8 md:p-14 text-center max-w-2xl mx-auto ring-1 ring-spa-cacao/10"
        style="box-shadow: 0 1px 3px rgb(58 47 38 / 0.05), 0 24px 48px -16px rgb(58 47 38 / 0.15);"
      >
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-spa-terracotta/10 ring-1 ring-spa-terracotta/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-spa-terracotta" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 class="mt-6 font-lora italic text-spa-cacao" style="font-size: clamp(28px, 3.5vw, 40px);">
          Message envoyé sur WhatsApp.
        </h3>
        {submitted.nom && (
          <p class="mt-4 text-spa-cacao/75 font-raleway leading-[1.8]">
            Merci <strong class="font-medium text-spa-cacao not-italic">{submitted.nom}</strong>. Validez l'envoi dans WhatsApp — nous vous recontactons sous 24h pour confirmer votre soin.
          </p>
        )}

        {(submitted.soin || submitted.date) && (
          <div class="mt-8 pt-8 border-t border-spa-cacao/10 max-w-md mx-auto text-left">
            <p class="text-xs uppercase tracking-[0.3em] text-spa-terracotta font-raleway font-medium mb-4">Récapitulatif</p>
            <ul class="space-y-2.5 text-sm font-raleway">
              {submitted.soin && (
                <li class="flex items-baseline gap-3">
                  <span class="text-spa-cacao/55 min-w-[5.5rem]">Soin</span>
                  <span class="font-lora italic text-spa-cacao">{submitted.soin}</span>
                </li>
              )}
              {submitted.date && (
                <li class="flex items-baseline gap-3">
                  <span class="text-spa-cacao/55 min-w-[5.5rem]">Date</span>
                  <span class="font-lora italic text-spa-cacao">{submitted.date}</span>
                </li>
              )}
              {submitted.creneau && (
                <li class="flex items-baseline gap-3">
                  <span class="text-spa-cacao/55 min-w-[5.5rem]">Créneau</span>
                  <span class="font-lora italic text-spa-cacao capitalize">{submitted.creneau}</span>
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
            setIntention('');
            setCreneau('');
          }}
          class="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-spa-cacao/65 hover:text-spa-terracotta transition-colors cursor-pointer"
        >
          Faire une autre demande
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 7v5l3 3" />
          </svg>
        </button>
      </div>
    );
  }

  // ============== FORMULAIRE ==============
  // Style underline-only (différent du salon qui utilise des box ring)
  const inputBase = 'w-full h-12 px-1 text-base font-raleway text-spa-creme bg-transparent border-0 border-b transition-colors duration-200 placeholder:text-spa-creme/35 focus:outline-none';
  const inputOk   = 'border-spa-creme/25 focus:border-spa-terracotta';
  const inputErr  = 'border-spa-terracotta';
  const labelBase = 'block text-[10px] font-semibold uppercase tracking-[0.3em] text-spa-creme/70 font-raleway mb-2';
  const errClass  = 'mt-1.5 text-xs text-spa-rose font-raleway font-medium';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-spa-cacao rounded-sm p-6 sm:p-10 md:p-14 max-w-2xl mx-auto"
      style="box-shadow: 0 1px 3px rgb(0 0 0 / 0.10), 0 32px 64px -16px rgb(0 0 0 / 0.30);"
      aria-label="Formulaire de réservation"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
      </div>

      {/* Vous */}
      <fieldset class="space-y-7">
        <legend class="font-lora italic text-spa-creme" style="font-size: 24px;">Vous</legend>

        <div>
          <label for="spa-nom" class={labelBase}>Nom</label>
          <input id="spa-nom" name="nom" type="text" required autocomplete="name"
            class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
            placeholder="Marie Dupont"
            aria-invalid={errors.nom ? 'true' : 'false'}
          />
          {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
        </div>

        <div class="grid sm:grid-cols-2 gap-7">
          <div>
            <label for="spa-tel" class={labelBase}>Téléphone</label>
            <input id="spa-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
              class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
              placeholder="0692 00 00 00"
              aria-invalid={errors.telephone ? 'true' : 'false'}
            />
            {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
          </div>
          <div>
            <label for="spa-email" class={labelBase}>Email</label>
            <input id="spa-email" name="email" type="email" required autocomplete="email"
              class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              placeholder="vous@exemple.re"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
          </div>
        </div>
      </fieldset>

      {/* Votre soin */}
      <fieldset class="space-y-7 mt-12">
        <legend class="font-lora italic text-spa-creme" style="font-size: 24px;">Votre soin</legend>

        <div>
          <label for="spa-soin" class={labelBase}>Soin souhaité</label>
          <select
            id="spa-soin" name="soin" required defaultValue=""
            class={`${inputBase} ${errors.soin ? inputErr : inputOk} appearance-none bg-no-repeat cursor-pointer`}
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F5F0E1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0 center; background-size: 14px; padding-right: 1.75rem;"
            aria-invalid={errors.soin ? 'true' : 'false'}
          >
            <option value="" disabled style="color: #3A2F26;">Choisir un soin…</option>
            {Object.values(soins).map((cat) => (
              <optgroup label={cat.titre} key={cat.titre} style="background-color: #F5F0E1; color: #3A2F26;">
                {cat.items.map((item) => (
                  <option value={item.nom} key={item.id} style="background-color: #F5F0E1; color: #3A2F26;">
                    {item.nom} — {item.prix}€ ({item.duree})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.soin && <p role="alert" class={errClass}>{errors.soin}</p>}
        </div>

        <div>
          <span class={labelBase}>Intention</span>
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            {intentions.map((opt) => {
              const isSel = intention === opt.id;
              return (
                <label
                  key={opt.id}
                  class={`relative flex items-center justify-center h-12 px-3 rounded-full text-sm font-raleway font-medium cursor-pointer transition-all text-center ${
                    isSel
                      ? 'bg-spa-terracotta text-spa-blanc'
                      : 'bg-transparent text-spa-creme/85 ring-1 ring-spa-creme/25 hover:ring-spa-creme/55'
                  }`}
                >
                  <input
                    type="radio"
                    name="intention"
                    value={opt.id}
                    checked={isSel}
                    onChange={() => setIntention(opt.id)}
                    required
                    class="sr-only"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {errors.intention && <p role="alert" class={errClass}>{errors.intention}</p>}
        </div>
      </fieldset>

      {/* Quand */}
      <fieldset class="space-y-7 mt-12">
        <legend class="font-lora italic text-spa-creme" style="font-size: 24px;">Quand</legend>

        <div>
          <label for="spa-date" class={labelBase}>Date souhaitée</label>
          <input id="spa-date" name="date" type="date" required min={today}
            class={`${inputBase} ${errors.date ? inputErr : inputOk} cursor-pointer`}
            style="color-scheme: dark;"
            aria-invalid={errors.date ? 'true' : 'false'}
          />
          {errors.date && <p role="alert" class={errClass}>{errors.date}</p>}
        </div>

        <div>
          <span class={labelBase}>Créneau préféré</span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {creneaux.map((opt) => {
              const isSel = creneau === opt.id;
              return (
                <label
                  key={opt.id}
                  class={`relative flex flex-col items-start justify-center gap-0.5 h-16 px-4 rounded-sm cursor-pointer transition-all ${
                    isSel
                      ? 'bg-spa-terracotta text-spa-blanc'
                      : 'bg-transparent text-spa-creme/85 ring-1 ring-spa-creme/25 hover:ring-spa-creme/55'
                  }`}
                >
                  <input type="radio" name="creneau" value={opt.label} checked={isSel}
                    onChange={() => setCreneau(opt.id)} required class="sr-only" />
                  <span class="text-sm font-raleway font-semibold">{opt.label}</span>
                  <span class="text-xs opacity-75 tabular-nums font-raleway">{opt.horaire}</span>
                </label>
              );
            })}
          </div>
          {errors.creneau && <p role="alert" class={errClass}>{errors.creneau}</p>}
        </div>

        <div>
          <label for="spa-message" class={labelBase}>
            Message <span class="lowercase tracking-normal text-spa-creme/45 font-normal">(optionnel)</span>
          </label>
          <textarea id="spa-message" name="message" rows={3}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Allergies, préférences sensorielles, attentes…"
          ></textarea>
        </div>
      </fieldset>

      {/* Submit */}
      <div class="mt-12">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-semibold uppercase tracking-[0.22em] rounded-full bg-[#25D366] text-white hover:bg-[#1FBE5A] transition-colors cursor-pointer"
          style="box-shadow: 0 8px 24px rgb(37 211 102 / 0.30);"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.24-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
          </svg>
          Envoyer sur WhatsApp
        </button>
        <p class="mt-4 text-xs text-spa-creme/55 text-center font-raleway leading-relaxed">
          Votre demande est envoyée directement au spa sur WhatsApp.
          <br class="hidden sm:inline" />
          Réponse sous 24h. Aucun engagement à ce stade.
        </p>
      </div>
    </form>
  );
}
