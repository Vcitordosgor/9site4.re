/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface Prestation {
  id: string;
  nom: string;
  prix: number | null;
  duree: string;
}

interface Category {
  titre: string;
  items: Prestation[];
}

interface Longueur {
  id: string;
  label: string;
}

interface Creneau {
  id: string;
  label: string;
  horaire: string;
}

interface Props {
  prestations: Record<string, Category>;
  longueurs: Longueur[];
  creneaux: Creneau[];
  /** Numéro WhatsApp au format international sans + (ex: "262692000000") */
  whatsapp: string;
  /** Nom du salon, utilisé dans le message WA */
  salonNom: string;
}

interface FormData {
  nom: string;
  telephone: string;
  email: string;
  premiereVisite: string;
  prestation: string;
  longueur: string;
  date: string;
  creneau: string;
  message: string;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Construit le texte WhatsApp pré-rempli envoyé au salon
 * (encodé URI-safe par le caller via encodeURIComponent).
 */
function buildWhatsAppMessage(data: FormData, salonNom: string, longueurLabel: string): string {
  const lines = [
    `Bonjour ${salonNom},`,
    '',
    'Je souhaite prendre rendez-vous :',
    '',
    `• Nom : ${data.nom}`,
    `• Téléphone : ${data.telephone}`,
    `• Email : ${data.email}`,
    `• Première visite : ${data.premiereVisite === 'oui' ? 'oui' : 'non'}`,
    '',
    `• Prestation : ${data.prestation}`,
    `• Longueur : ${longueurLabel}`,
    `• Date souhaitée : ${data.date}`,
    `• Créneau : ${data.creneau}`,
  ];
  if (data.message) {
    lines.push('', `Message : ${data.message}`);
  }
  lines.push('', 'Merci !');
  return lines.join('\n');
}

/**
 * RdvForm — formulaire de prise de rendez-vous central.
 * 3 groupes numérotés (Vous / Votre demande / Vos préférences),
 * validation front-end. À l'envoi, ouvre WhatsApp pré-rempli avec
 * le récapitulatif. Pas de backend nécessaire — le salon reçoit
 * la demande directement sur WhatsApp.
 */
export default function RdvForm({ prestations, longueurs, creneaux, whatsapp, salonNom }: Props) {
  const [premiereVisite, setPremiereVisite] = useState<string>('');
  const [longueur, setLongueur] = useState<string>('');
  const [creneau, setCreneau] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot anti-spam
    if ((fd.get('website') as string)?.trim()) {
      const fakeData: FormData = {
        nom: '', telephone: '', email: '', premiereVisite: '',
        prestation: '', longueur: '', date: '', creneau: '', message: '',
      };
      setSubmitted(fakeData);
      return;
    }

    const data: FormData = {
      nom:           ((fd.get('nom')        as string) || '').trim(),
      telephone:     ((fd.get('telephone')  as string) || '').trim(),
      email:         ((fd.get('email')      as string) || '').trim(),
      premiereVisite:((fd.get('premiereVisite') as string) || '').trim(),
      prestation:    ((fd.get('prestation') as string) || '').trim(),
      longueur:      ((fd.get('longueur')   as string) || '').trim(),
      date:          ((fd.get('date')       as string) || '').trim(),
      creneau:       ((fd.get('creneau')    as string) || '').trim(),
      message:       ((fd.get('message')    as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.nom)           errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.telephone)     errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.email)         errs.email = 'Email requis.';
    else if (!emailRegex.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.premiereVisite) errs.premiereVisite = 'Indiquez si c\'est votre première visite.';
    if (!data.prestation)    errs.prestation = 'Choisissez une prestation.';
    if (!data.longueur)      errs.longueur = 'Indiquez la longueur de vos cheveux.';
    if (!data.date)          errs.date = 'Choisissez une date.';
    if (!data.creneau)       errs.creneau = 'Choisissez un créneau.';

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Construit le message WhatsApp et ouvre l'app/onglet
    const longueurLabel = longueurs.find((l) => l.id === data.longueur)?.label ?? data.longueur;
    const text = buildWhatsAppMessage(data, salonNom, longueurLabel);
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
        class="bg-salon-blanc rounded-sm p-8 md:p-14 text-center max-w-2xl mx-auto ring-1 ring-salon-noir/10"
        style="box-shadow: 0 1px 3px rgb(10 10 10 / 0.05), 0 24px 48px -16px rgb(10 10 10 / 0.10);"
      >
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-salon-vert/10 ring-1 ring-salon-vert/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-salon-vert" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 class="mt-6 font-fraunces font-bold text-salon-noir" style="font-size: clamp(28px, 3.5vw, 40px);">
          Message envoyé sur WhatsApp.
        </h3>
        {submitted.nom && (
          <p class="mt-4 text-salon-noir/75 leading-relaxed">
            Merci <strong class="font-semibold text-salon-noir">{submitted.nom}</strong>. Validez l'envoi dans WhatsApp — le salon vous recontacte rapidement pour confirmer le rendez-vous.
          </p>
        )}

        {(submitted.prestation || submitted.date) && (
          <div class="mt-8 pt-8 border-t border-salon-noir/10 max-w-md mx-auto text-left">
            <p class="text-xs uppercase tracking-[0.25em] text-salon-vert mb-4">Récapitulatif</p>
            <ul class="space-y-2 text-sm">
              {submitted.prestation && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-noir/55 min-w-[6rem]">Prestation</span>
                  <span class="font-fraunces text-salon-noir">{submitted.prestation}</span>
                </li>
              )}
              {submitted.date && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-noir/55 min-w-[6rem]">Date</span>
                  <span class="font-fraunces text-salon-noir">{submitted.date}</span>
                </li>
              )}
              {submitted.creneau && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-noir/55 min-w-[6rem]">Créneau</span>
                  <span class="font-fraunces text-salon-noir capitalize">{submitted.creneau}</span>
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
            setPremiereVisite('');
            setLongueur('');
            setCreneau('');
          }}
          class="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-salon-noir/65 hover:text-salon-vert transition-colors cursor-pointer"
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
  const inputBase = 'w-full h-12 px-4 text-base font-dm-sans text-salon-noir bg-salon-blanc rounded-sm ring-1 transition-all duration-200 placeholder:text-salon-noir/35';
  const inputOk   = 'ring-salon-noir/15 focus:ring-2 focus:ring-salon-vert';
  const inputErr  = 'ring-2 ring-salon-vert focus:ring-salon-vert';
  const labelBase = 'block text-xs font-semibold uppercase tracking-[0.18em] text-salon-noir/75 mb-2';
  const errClass  = 'mt-1.5 text-xs text-salon-vert font-semibold';
  const groupTitle = 'flex items-baseline gap-3 font-fraunces text-2xl text-salon-noir';
  const groupNum   = 'font-fraunces italic font-bold text-salon-vert tabular-nums';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-salon-blanc rounded-sm p-6 md:p-12 space-y-12 max-w-2xl mx-auto ring-1 ring-salon-noir/10"
      style="box-shadow: 0 1px 3px rgb(10 10 10 / 0.05), 0 24px 48px -16px rgb(10 10 10 / 0.10);"
      aria-label="Formulaire de prise de rendez-vous"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
      </div>

      {/* ============ GROUPE 1 — VOUS ============ */}
      <fieldset class="space-y-5">
        <legend class={groupTitle}>
          <span class={groupNum}>01</span>
          <span class="italic">Vous</span>
        </legend>
        <div class="w-12 h-px bg-salon-vert-clair -mt-3" aria-hidden="true"></div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="rdv-nom" class={labelBase}>Nom</label>
            <input id="rdv-nom" name="nom" type="text" required autocomplete="name"
              class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
              placeholder="Marie Dupont"
              aria-invalid={errors.nom ? 'true' : 'false'}
            />
            {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
          </div>
          <div>
            <label for="rdv-tel" class={labelBase}>Téléphone</label>
            <input id="rdv-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
              class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
              placeholder="0692 00 00 00"
              aria-invalid={errors.telephone ? 'true' : 'false'}
            />
            {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
          </div>
        </div>

        <div>
          <label for="rdv-email" class={labelBase}>Email</label>
          <input id="rdv-email" name="email" type="email" required autocomplete="email"
            class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            placeholder="vous@exemple.re"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
        </div>

        <div>
          <span class={labelBase}>Première visite ?</span>
          <div class="grid grid-cols-2 gap-3">
            {[{ v: 'oui', l: 'Oui, première fois' }, { v: 'non', l: 'Non, je suis déjà venu(e)' }].map((opt) => {
              const isSel = premiereVisite === opt.v;
              return (
                <label
                  key={opt.v}
                  class={`relative flex items-center justify-center h-14 px-4 rounded-sm text-sm font-medium cursor-pointer transition-all text-center ${
                    isSel
                      ? 'bg-salon-vert/10 text-salon-vert ring-2 ring-salon-vert'
                      : 'bg-salon-blanc text-salon-noir ring-1 ring-salon-noir/15 hover:ring-salon-noir/35'
                  }`}
                >
                  <input
                    type="radio"
                    name="premiereVisite"
                    value={opt.v}
                    checked={isSel}
                    onChange={() => setPremiereVisite(opt.v)}
                    required
                    class="sr-only"
                  />
                  <span>{opt.l}</span>
                </label>
              );
            })}
          </div>
          {errors.premiereVisite && <p role="alert" class={errClass}>{errors.premiereVisite}</p>}
        </div>
      </fieldset>

      {/* ============ GROUPE 2 — VOTRE DEMANDE ============ */}
      <fieldset class="space-y-5">
        <legend class={groupTitle}>
          <span class={groupNum}>02</span>
          <span class="italic">Votre demande</span>
        </legend>
        <div class="w-12 h-px bg-salon-vert-clair -mt-3" aria-hidden="true"></div>

        <div>
          <label for="rdv-prestation" class={labelBase}>Prestation souhaitée</label>
          <select
            id="rdv-prestation" name="prestation" required defaultValue=""
            class={`${inputBase} ${errors.prestation ? inputErr : inputOk} appearance-none bg-no-repeat`}
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230A0A0A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 14px; padding-right: 2.5rem;"
            aria-invalid={errors.prestation ? 'true' : 'false'}
          >
            <option value="" disabled>Choisir une prestation…</option>
            {Object.values(prestations).map((cat) => (
              <optgroup label={cat.titre} key={cat.titre}>
                {cat.items.map((item) => (
                  <option value={item.nom} key={item.id}>
                    {item.nom}{item.prix !== null ? ` — ${item.prix}€` : ' — sur devis'}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.prestation && <p role="alert" class={errClass}>{errors.prestation}</p>}
        </div>

        <div>
          <span class={labelBase}>Longueur des cheveux</span>
          <div class="grid grid-cols-3 gap-3">
            {longueurs.map((opt) => {
              const isSel = longueur === opt.id;
              return (
                <label
                  key={opt.id}
                  class={`relative flex flex-col items-center justify-center gap-2 h-24 rounded-sm text-sm font-medium cursor-pointer transition-all ${
                    isSel
                      ? 'bg-salon-vert/10 text-salon-vert ring-2 ring-salon-vert'
                      : 'bg-salon-blanc text-salon-noir ring-1 ring-salon-noir/15 hover:ring-salon-noir/35'
                  }`}
                >
                  <input type="radio" name="longueur" value={opt.id} checked={isSel}
                    onChange={() => setLongueur(opt.id)} required class="sr-only" />
                  {/* Mini silhouettes simplifiées */}
                  <svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" aria-hidden="true">
                    <circle cx="14" cy="8" r="5" />
                    {opt.id === 'courts' && <path d="M9 13 Q9 18 14 18 Q19 18 19 13" />}
                    {opt.id === 'mi-longs' && <path d="M8 13 Q8 22 14 22 Q20 22 20 13 Q19 17 18 18 L10 18 Q9 17 8 13z" />}
                    {opt.id === 'longs' && <path d="M7 13 Q7 28 14 28 Q21 28 21 13 Q20 22 19 24 L9 24 Q8 22 7 13z" />}
                  </svg>
                  <span class="uppercase tracking-[0.15em] text-xs">{opt.label}</span>
                </label>
              );
            })}
          </div>
          {errors.longueur && <p role="alert" class={errClass}>{errors.longueur}</p>}
        </div>
      </fieldset>

      {/* ============ GROUPE 3 — VOS PRÉFÉRENCES ============ */}
      <fieldset class="space-y-5">
        <legend class={groupTitle}>
          <span class={groupNum}>03</span>
          <span class="italic">Vos préférences</span>
        </legend>
        <div class="w-12 h-px bg-salon-vert-clair -mt-3" aria-hidden="true"></div>

        <div>
          <label for="rdv-date" class={labelBase}>Date souhaitée</label>
          <input id="rdv-date" name="date" type="date" required min={today}
            class={`${inputBase} ${errors.date ? inputErr : inputOk}`}
            aria-invalid={errors.date ? 'true' : 'false'}
          />
          {errors.date && <p role="alert" class={errClass}>{errors.date}</p>}
        </div>

        <div>
          <span class={labelBase}>Créneau préféré</span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {creneaux.map((opt) => {
              const isSel = creneau === opt.id;
              return (
                <label
                  key={opt.id}
                  class={`relative flex flex-col items-start justify-center gap-1 h-16 px-4 rounded-sm cursor-pointer transition-all ${
                    isSel
                      ? 'bg-salon-vert/10 text-salon-vert ring-2 ring-salon-vert'
                      : 'bg-salon-blanc text-salon-noir ring-1 ring-salon-noir/15 hover:ring-salon-noir/35'
                  }`}
                >
                  <input type="radio" name="creneau" value={opt.label} checked={isSel}
                    onChange={() => setCreneau(opt.id)} required class="sr-only" />
                  <span class="text-sm font-semibold">{opt.label}</span>
                  <span class="text-xs opacity-65 tabular-nums">{opt.horaire}</span>
                </label>
              );
            })}
          </div>
          {errors.creneau && <p role="alert" class={errClass}>{errors.creneau}</p>}
        </div>

        <div>
          <label for="rdv-message" class={labelBase}>
            Message <span class="lowercase tracking-normal text-salon-noir/55 font-normal">(optionnel)</span>
          </label>
          <textarea id="rdv-message" name="message" rows={3}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Précisions sur votre demande, allergies, préférences…"
          ></textarea>
        </div>
      </fieldset>

      {/* Submit — envoie sur WhatsApp */}
      <div class="pt-4">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-semibold uppercase tracking-[0.2em] rounded-full bg-[#25D366] text-white hover:bg-[#1FBE5A] transition-all cursor-pointer"
          style="box-shadow: 0 8px 24px rgb(37 211 102 / 0.35);"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.24-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
          </svg>
          Envoyer sur WhatsApp
        </button>
        <p class="mt-4 text-xs text-salon-noir/55 text-center leading-relaxed">
          Votre demande est envoyée directement au salon sur WhatsApp.
          <br class="hidden sm:inline" />
          Réponse sous 24h ouvrées. Aucun engagement à ce stade.
        </p>
      </div>
    </form>
  );
}
