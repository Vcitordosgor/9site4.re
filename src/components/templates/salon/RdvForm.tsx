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
 * RdvForm — formulaire de prise de rendez-vous central.
 * 3 groupes numérotés (Vous / Votre demande / Vos préférences),
 * validation front-end, message de succès professionnel.
 */
export default function RdvForm({ prestations, longueurs, creneaux }: Props) {
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
      // simulate success silencieusement
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

    // eslint-disable-next-line no-console
    console.log('[RdvForm] formData =', data);
    setSubmitted(data);
  };

  // ============== ÉTAT DE SUCCÈS ==============
  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        class="bg-salon-blanc rounded-sm p-8 md:p-14 text-center max-w-2xl mx-auto"
        style="box-shadow: 0 1px 3px rgb(42 37 32 / 0.05), 0 24px 48px -16px rgb(42 37 32 / 0.10);"
      >
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-salon-cuivre/10 ring-1 ring-salon-cuivre/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-salon-cuivre" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 class="mt-6 font-playfair font-bold text-salon-encre" style="font-size: clamp(28px, 3.5vw, 40px);">
          Demande envoyée.
        </h3>
        {submitted.nom && (
          <p class="mt-4 text-salon-encre/75 leading-relaxed">
            Merci <strong class="font-semibold text-salon-encre">{submitted.nom}</strong>. Le salon vous recontacte rapidement pour confirmer votre rendez-vous.
          </p>
        )}

        {(submitted.prestation || submitted.date) && (
          <div class="mt-8 pt-8 border-t border-salon-encre/10 max-w-md mx-auto text-left">
            <p class="text-xs uppercase tracking-[0.25em] text-salon-cuivre mb-4">Récapitulatif</p>
            <ul class="space-y-2 text-sm">
              {submitted.prestation && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-encre/55 min-w-[6rem]">Prestation</span>
                  <span class="font-playfair text-salon-encre">{submitted.prestation}</span>
                </li>
              )}
              {submitted.date && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-encre/55 min-w-[6rem]">Date</span>
                  <span class="font-playfair text-salon-encre">{submitted.date}</span>
                </li>
              )}
              {submitted.creneau && (
                <li class="flex items-baseline gap-3">
                  <span class="text-salon-encre/55 min-w-[6rem]">Créneau</span>
                  <span class="font-playfair text-salon-encre capitalize">{submitted.creneau}</span>
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
          class="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-salon-encre/65 hover:text-salon-cuivre transition-colors cursor-pointer"
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
  const inputBase = 'w-full h-12 px-4 text-base font-inter text-salon-encre bg-salon-blanc rounded-sm ring-1 transition-all duration-200 placeholder:text-salon-encre/35';
  const inputOk   = 'ring-salon-encre/15 focus:ring-2 focus:ring-salon-cuivre';
  const inputErr  = 'ring-2 ring-salon-cuivre focus:ring-salon-cuivre';
  const labelBase = 'block text-xs font-semibold uppercase tracking-[0.18em] text-salon-encre/75 mb-2';
  const errClass  = 'mt-1.5 text-xs text-salon-cuivre font-semibold';
  const groupTitle = 'flex items-baseline gap-3 font-playfair text-2xl text-salon-encre';
  const groupNum   = 'font-playfair italic font-bold text-salon-cuivre tabular-nums';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-salon-blanc rounded-sm p-6 md:p-12 space-y-12 max-w-2xl mx-auto"
      style="box-shadow: 0 1px 3px rgb(42 37 32 / 0.05), 0 24px 48px -16px rgb(42 37 32 / 0.10);"
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
        <div class="w-12 h-px bg-salon-laiton -mt-3" aria-hidden="true"></div>

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
                      ? 'bg-salon-cuivre/10 text-salon-cuivre ring-2 ring-salon-cuivre'
                      : 'bg-salon-blanc text-salon-encre ring-1 ring-salon-encre/15 hover:ring-salon-encre/35'
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
        <div class="w-12 h-px bg-salon-laiton -mt-3" aria-hidden="true"></div>

        <div>
          <label for="rdv-prestation" class={labelBase}>Prestation souhaitée</label>
          <select
            id="rdv-prestation" name="prestation" required defaultValue=""
            class={`${inputBase} ${errors.prestation ? inputErr : inputOk} appearance-none bg-no-repeat`}
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232A2520' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 14px; padding-right: 2.5rem;"
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
                      ? 'bg-salon-cuivre/10 text-salon-cuivre ring-2 ring-salon-cuivre'
                      : 'bg-salon-blanc text-salon-encre ring-1 ring-salon-encre/15 hover:ring-salon-encre/35'
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
        <div class="w-12 h-px bg-salon-laiton -mt-3" aria-hidden="true"></div>

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
                      ? 'bg-salon-cuivre/10 text-salon-cuivre ring-2 ring-salon-cuivre'
                      : 'bg-salon-blanc text-salon-encre ring-1 ring-salon-encre/15 hover:ring-salon-encre/35'
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
            Message <span class="lowercase tracking-normal text-salon-encre/55 font-normal">(optionnel)</span>
          </label>
          <textarea id="rdv-message" name="message" rows={3}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Précisions sur votre demande, allergies, préférences…"
          ></textarea>
        </div>
      </fieldset>

      {/* Submit */}
      <div class="pt-4">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-semibold uppercase tracking-[0.2em] rounded-full bg-salon-cuivre text-salon-blanc hover:bg-[#7C3F2A] transition-all cursor-pointer"
          style="box-shadow: 0 8px 24px rgb(181 105 77 / 0.3);"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          Confirmer ma demande
        </button>
        <p class="mt-4 text-xs text-salon-encre/55 text-center leading-relaxed">
          Le salon vous recontacte sous 24h ouvrées pour confirmer la disponibilité.
          <br class="hidden sm:inline" />
          Aucun engagement à ce stade.
        </p>
      </div>
    </form>
  );
}
