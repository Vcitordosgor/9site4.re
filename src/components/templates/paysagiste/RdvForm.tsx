/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface TypeIntervention {
  id: string;
  label: string;
}

interface Surface {
  id: string;
  label: string;
  valeur: string;
}

interface Frequence {
  id: string;
  label: string;
  description: string;
}

interface Props {
  typesIntervention: TypeIntervention[];
  surfaces: Surface[];
  frequences: Frequence[];
  whatsapp: string;
  atelierNom: string;
}

interface FormState {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  type: string;
  surface: string;
  frequence: string;
  description: string;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function buildWhatsAppMessage(data: FormState, atelierNom: string, typeLabel: string, surfaceLabel: string, frequenceLabel: string): string {
  const lines = [
    `Bonjour ${atelierNom},`,
    '',
    'Je souhaite un devis :',
    '',
    `• Nom : ${data.nom}`,
    `• Téléphone : ${data.telephone}`,
    `• Email : ${data.email}`,
    `• Adresse : ${data.adresse}`,
    '',
    `• Type d'intervention : ${typeLabel}`,
    `• Surface : ${surfaceLabel}`,
    `• Fréquence souhaitée : ${frequenceLabel}`,
  ];
  if (data.description) lines.push('', `Détails :`, data.description);
  lines.push('', 'Merci pour votre retour.');
  return lines.join('\n');
}

/**
 * RdvForm paysagiste — formulaire de demande de devis.
 * 4 champs structurés (type / surface / fréquence / description) +
 * coordonnées + adresse. Style botanique : labels Outfit small caps,
 * inputs avec ligne fine violette, focus avec halo doux.
 *
 * À la soumission : ouvre WhatsApp pré-rempli avec le récapitulatif.
 */
export default function RdvForm({ typesIntervention, surfaces, frequences, whatsapp, atelierNom }: Props) {
  const [type, setType] = useState<string>('');
  const [surface, setSurface] = useState<string>('');
  const [frequence, setFrequence] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) {
      const fakeData: FormState = {
        nom: '', telephone: '', email: '', adresse: '',
        type: '', surface: '', frequence: '', description: '',
      };
      setSubmitted(fakeData);
      return;
    }

    const data: FormState = {
      nom:        ((fd.get('nom')        as string) || '').trim(),
      telephone:  ((fd.get('telephone')  as string) || '').trim(),
      email:      ((fd.get('email')      as string) || '').trim(),
      adresse:    ((fd.get('adresse')    as string) || '').trim(),
      type:       ((fd.get('type')       as string) || '').trim(),
      surface:    ((fd.get('surface')    as string) || '').trim(),
      frequence:  ((fd.get('frequence')  as string) || '').trim(),
      description:((fd.get('description')as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!data.nom)        errs.nom = 'Votre nom est requis.';
    if (!data.telephone)  errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.email)      errs.email = 'Email requis.';
    else if (!emailRegex.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.adresse)    errs.adresse = "Adresse du jardin requise.";
    if (!data.type)       errs.type = "Choisissez le type d'intervention.";
    if (!data.surface)    errs.surface = "Indiquez la surface approximative.";
    if (!data.frequence)  errs.frequence = "Précisez la fréquence souhaitée.";

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const typeLabel      = typesIntervention.find((t) => t.id === data.type)?.label ?? data.type;
    const surfaceLabel   = surfaces.find((s) => s.id === data.surface)?.label ?? data.surface;
    const frequenceLabel = frequences.find((f) => f.id === data.frequence)?.label ?? data.frequence;
    const text = buildWhatsAppMessage(data, atelierNom, typeLabel, surfaceLabel, frequenceLabel);
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
        class="bg-agap-lin p-8 md:p-14 text-center max-w-2xl mx-auto border border-agap-violet/25 rounded-sm"
        style="box-shadow: 0 1px 3px rgb(31 38 24 / 0.05), 0 24px 48px -16px rgb(31 38 24 / 0.12);"
      >
        <span class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-agap-violet/10 ring-1 ring-agap-violet/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-agap-violet" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 class="mt-6 font-cormorant italic text-agap-feuille" style="font-size: clamp(28px, 3.5vw, 40px);">
          Demande envoyée sur WhatsApp.
        </h3>
        {submitted.nom && (
          <p class="mt-4 font-outfit text-agap-feuille/75 leading-[1.7]">
            Merci <strong class="font-semibold text-agap-feuille">{submitted.nom}</strong>. Validez l'envoi dans WhatsApp — Claire vous recontacte sous 48h ouvrées avec un premier rendez-vous de diagnostic.
          </p>
        )}

        {(submitted.type || submitted.surface) && (
          <div class="mt-8 pt-8 border-t border-agap-feuille/10 max-w-md mx-auto text-left">
            <p class="text-[11px] uppercase tracking-[0.32em] text-agap-violet font-outfit font-semibold mb-4">Récapitulatif</p>
            <ul class="space-y-2.5 text-sm font-outfit">
              {submitted.type && (
                <li class="flex items-baseline gap-3">
                  <span class="text-agap-feuille/55 min-w-[6rem]">Intervention</span>
                  <span class="font-cormorant italic text-agap-feuille">{submitted.type}</span>
                </li>
              )}
              {submitted.surface && (
                <li class="flex items-baseline gap-3">
                  <span class="text-agap-feuille/55 min-w-[6rem]">Surface</span>
                  <span class="font-cormorant italic text-agap-feuille">{submitted.surface}</span>
                </li>
              )}
              {submitted.frequence && (
                <li class="flex items-baseline gap-3">
                  <span class="text-agap-feuille/55 min-w-[6rem]">Fréquence</span>
                  <span class="font-cormorant italic text-agap-feuille capitalize">{submitted.frequence}</span>
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
            setType('');
            setSurface('');
            setFrequence('');
          }}
          class="mt-8 inline-flex items-center gap-2 text-xs font-outfit font-semibold uppercase tracking-[0.25em] text-agap-feuille/65 hover:text-agap-violet transition-colors cursor-pointer"
        >
          Nouvelle demande
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 7v5l3 3" />
          </svg>
        </button>
      </div>
    );
  }

  // ============== FORMULAIRE ==============
  // Style line-bottom violette + focus halo doux (différent des autres)
  const inputBase = 'w-full h-12 px-1 text-base font-outfit text-agap-feuille bg-transparent border-0 border-b transition-colors duration-200 placeholder:text-agap-feuille/35 focus:outline-none';
  const inputOk   = 'border-agap-feuille/20 focus:border-agap-violet';
  const inputErr  = 'border-agap-violet';
  const labelBase = 'block text-[10px] font-outfit font-semibold uppercase tracking-[0.32em] text-agap-violet mb-2';
  const errClass  = 'mt-1.5 text-xs text-agap-violet font-outfit font-semibold';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-agap-lin p-6 sm:p-10 md:p-14 max-w-2xl mx-auto border border-agap-violet/15 rounded-sm"
      style="box-shadow: 0 1px 3px rgb(31 38 24 / 0.04), 0 24px 48px -16px rgb(31 38 24 / 0.10);"
      aria-label="Formulaire de demande de devis"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
      </div>

      {/* === I. Votre projet === */}
      <fieldset>
        <legend class="flex items-baseline gap-3 font-cormorant italic text-agap-feuille mb-6" style="font-size: 28px;">
          <span class="font-cormorant italic font-bold text-agap-violet tabular-nums" style="font-size: 22px;">I.</span>
          <span>Votre projet</span>
        </legend>

        <div class="space-y-6">
          <div>
            <label for="agap-type" class={labelBase}>Type d'intervention</label>
            <select
              id="agap-type" name="type" required defaultValue=""
              class={`${inputBase} ${errors.type ? inputErr : inputOk} appearance-none bg-no-repeat cursor-pointer`}
              style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231F2618' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0 center; background-size: 14px; padding-right: 1.75rem;"
              aria-invalid={errors.type ? 'true' : 'false'}
            >
              <option value="" disabled>Choisir une intervention…</option>
              {typesIntervention.map((t) => (
                <option value={t.id} key={t.id}>{t.label}</option>
              ))}
            </select>
            {errors.type && <p role="alert" class={errClass}>{errors.type}</p>}
          </div>

          <div>
            <span class={labelBase}>Surface approximative</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {surfaces.map((opt) => {
                const isSel = surface === opt.id;
                return (
                  <label
                    key={opt.id}
                    class={`relative flex flex-col items-start justify-center gap-0.5 px-3 py-3 cursor-pointer transition-all border ${
                      isSel
                        ? 'bg-agap-violet text-agap-lin border-agap-violet'
                        : 'bg-transparent text-agap-feuille border-agap-feuille/20 hover:border-agap-violet/60'
                    }`}
                  >
                    <input type="radio" name="surface" value={opt.id} checked={isSel}
                      onChange={() => setSurface(opt.id)} required class="sr-only" />
                    <span class="font-cormorant italic font-semibold" style="font-size: 17px;">{opt.label}</span>
                    <span class="text-[10px] font-outfit opacity-85 leading-snug">{opt.valeur}</span>
                  </label>
                );
              })}
            </div>
            {errors.surface && <p role="alert" class={errClass}>{errors.surface}</p>}
          </div>

          <div>
            <span class={labelBase}>Fréquence souhaitée</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {frequences.map((opt) => {
                const isSel = frequence === opt.id;
                return (
                  <label
                    key={opt.id}
                    class={`relative flex flex-col items-start justify-center gap-0.5 px-4 py-3 cursor-pointer transition-all border ${
                      isSel
                        ? 'bg-agap-sauge text-agap-feuille border-agap-sauge-fonce'
                        : 'bg-transparent text-agap-feuille border-agap-feuille/20 hover:border-agap-sauge-fonce/60'
                    }`}
                  >
                    <input type="radio" name="frequence" value={opt.id} checked={isSel}
                      onChange={() => setFrequence(opt.id)} required class="sr-only" />
                    <span class="font-cormorant italic font-semibold" style="font-size: 17px;">{opt.label}</span>
                    <span class="text-[10px] font-outfit opacity-85 leading-snug">{opt.description}</span>
                  </label>
                );
              })}
            </div>
            {errors.frequence && <p role="alert" class={errClass}>{errors.frequence}</p>}
          </div>
        </div>
      </fieldset>

      {/* === II. Vos coordonnées === */}
      <fieldset class="mt-12 space-y-5">
        <legend class="flex items-baseline gap-3 font-cormorant italic text-agap-feuille mb-6" style="font-size: 28px;">
          <span class="font-cormorant italic font-bold text-agap-violet tabular-nums" style="font-size: 22px;">II.</span>
          <span>Vous</span>
        </legend>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="agap-nom" class={labelBase}>Nom</label>
            <input id="agap-nom" name="nom" type="text" required autocomplete="name"
              class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
              placeholder="Marie Dupont"
              aria-invalid={errors.nom ? 'true' : 'false'}
            />
            {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
          </div>
          <div>
            <label for="agap-tel" class={labelBase}>Téléphone</label>
            <input id="agap-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
              class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
              placeholder="0692 00 00 00"
              aria-invalid={errors.telephone ? 'true' : 'false'}
            />
            {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
          </div>
        </div>

        <div>
          <label for="agap-email" class={labelBase}>Email</label>
          <input id="agap-email" name="email" type="email" required autocomplete="email"
            class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            placeholder="vous@exemple.re"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
        </div>

        <div>
          <label for="agap-adresse" class={labelBase}>Adresse du jardin</label>
          <input id="agap-adresse" name="adresse" type="text" required autocomplete="street-address"
            class={`${inputBase} ${errors.adresse ? inputErr : inputOk}`}
            placeholder="14 chemin des Cocotiers, 97436 Saint-Leu"
            aria-invalid={errors.adresse ? 'true' : 'false'}
          />
          {errors.adresse && <p role="alert" class={errClass}>{errors.adresse}</p>}
        </div>

        <div>
          <label for="agap-description" class={labelBase}>
            Décrivez votre projet <span class="lowercase tracking-normal text-agap-feuille/45 font-normal">(optionnel)</span>
          </label>
          <textarea id="agap-description" name="description" rows={4}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="État actuel du terrain, vos envies, contraintes (vue, soleil, vent), inspirations…"
          ></textarea>
        </div>
      </fieldset>

      {/* === SUBMIT === */}
      <div class="mt-12">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-outfit font-semibold uppercase tracking-[0.22em] rounded-full bg-[#25D366] text-white hover:bg-[#1FBE5A] transition-colors cursor-pointer"
          style="box-shadow: 0 8px 24px rgb(37 211 102 / 0.30);"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.24-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
          </svg>
          Envoyer ma demande
        </button>
        <p class="mt-4 text-xs font-outfit text-agap-feuille/55 text-center leading-relaxed">
          Votre demande arrive à l'atelier directement sur WhatsApp.
          <br class="hidden sm:inline" />
          Réponse sous 48h ouvrées. Devis gratuit après diagnostic sur place.
        </p>
      </div>
    </form>
  );
}
