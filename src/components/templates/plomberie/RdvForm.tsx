/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface Probleme {
  id: string;
  label: string;
}

interface Urgence {
  id: string;
  label: string;
  description: string;
}

interface Props {
  problemes: Probleme[];
  urgences: Urgence[];
  whatsapp: string;
  artisanNom: string;
}

interface FormState {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  urgence: string;
  probleme: string;
  description: string;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function buildWhatsAppMessage(data: FormState, artisanNom: string, urgenceLabel: string, problemeLabel: string): string {
  const lines = [
    `Bonjour ${artisanNom},`,
    '',
    'Je souhaite une intervention :',
    '',
    `• Nom : ${data.nom}`,
    `• Téléphone : ${data.telephone}`,
    `• Email : ${data.email}`,
    `• Adresse : ${data.adresse}`,
    '',
    `• Urgence : ${urgenceLabel}`,
    `• Type : ${problemeLabel}`,
  ];
  if (data.description) lines.push('', `Description :`, data.description);
  lines.push('', 'Merci pour votre retour rapide.');
  return lines.join('\n');
}

/**
 * RdvForm plomberie — formulaire de demande d'intervention.
 * Style poster utilitaire :
 * - Labels Archivo uppercase tracking large, bordures noires épaisses
 * - Inputs avec border-2 anthracite (≠ underlines des autres templates)
 * - Sélecteur urgence en grand bouton coloré (très urgent = rouge)
 * - Type de problème en grille de pills outils
 *
 * À la soumission : ouvre WhatsApp pré-rempli + redirige vers
 * appel téléphonique direct si "très urgent".
 */
export default function RdvForm({ problemes, urgences, whatsapp, artisanNom }: Props) {
  const [urgence, setUrgence] = useState<string>('');
  const [probleme, setProbleme] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) {
      const fakeData: FormState = {
        nom: '', telephone: '', email: '', adresse: '',
        urgence: '', probleme: '', description: '',
      };
      setSubmitted(fakeData);
      return;
    }

    const data: FormState = {
      nom:        ((fd.get('nom')        as string) || '').trim(),
      telephone:  ((fd.get('telephone')  as string) || '').trim(),
      email:      ((fd.get('email')      as string) || '').trim(),
      adresse:    ((fd.get('adresse')    as string) || '').trim(),
      urgence:    ((fd.get('urgence')    as string) || '').trim(),
      probleme:   ((fd.get('probleme')   as string) || '').trim(),
      description:((fd.get('description')as string) || '').trim(),
    };

    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!data.nom)        errs.nom = 'Votre nom est requis.';
    if (!data.telephone)  errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.email)      errs.email = 'Email requis.';
    else if (!emailRegex.test(data.email)) errs.email = "L'adresse email semble invalide.";
    if (!data.adresse)    errs.adresse = 'Adresse d\'intervention requise.';
    if (!data.urgence)    errs.urgence = 'Indiquez le degré d\'urgence.';
    if (!data.probleme)   errs.probleme = 'Choisissez le type de problème.';

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const urgenceLabel = urgences.find((u) => u.id === data.urgence)?.label ?? data.urgence;
    const problemeLabel = problemes.find((p) => p.id === data.probleme)?.label ?? data.probleme;
    const text = buildWhatsAppMessage(data, artisanNom, urgenceLabel, problemeLabel);
    const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(data);
  };

  // ============== ÉTAT DE SUCCÈS ==============
  if (submitted) {
    const isUrgent = submitted.urgence === 'tres-urgent';
    return (
      <div
        role="status"
        aria-live="polite"
        class="bg-bp-blanc border-2 border-bp-anthracite p-8 md:p-12 max-w-3xl mx-auto"
      >
        <div class="flex items-start gap-5">
          <span class="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-bp-jaune border-2 border-bp-anthracite text-bp-anthracite">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <div class="flex-1">
            <p class="text-[10px] font-archivo font-bold uppercase tracking-[0.3em] text-bp-anthracite/60">Demande reçue</p>
            <h3 class="mt-1 font-bebas uppercase text-bp-anthracite leading-tight tracking-wide" style="font-size: clamp(28px, 4vw, 40px);">
              Message envoyé sur WhatsApp.
            </h3>
            {submitted.nom && (
              <p class="mt-3 font-archivo text-bp-anthracite/85 leading-[1.7]">
                Merci <strong class="font-bold">{submitted.nom}</strong>. Validez l'envoi dans WhatsApp — Bernard vous rappelle dans les 15 minutes.
              </p>
            )}
          </div>
        </div>

        {/* Pour les très urgents : encart appel direct rouge */}
        {isUrgent && (
          <div class="mt-8 p-5 md:p-6 bg-bp-rouge text-bp-blanc border-2 border-bp-anthracite">
            <div class="flex items-start gap-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-shrink-0 mt-1">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div class="flex-1">
                <p class="font-bebas uppercase tracking-wide text-bp-blanc" style="font-size: 22px;">Très urgent — appelez directement</p>
                <p class="mt-1 font-archivo text-bp-blanc/90 text-sm leading-relaxed">
                  Pour une fuite active ou une inondation, n'attendez pas WhatsApp.
                </p>
                <a href={`tel:+${whatsapp}`} class="mt-4 inline-flex items-center gap-2 font-archivo font-bold uppercase tracking-[0.18em] text-bp-blanc underline underline-offset-4 decoration-2 hover:no-underline">
                  Appeler Bernard maintenant
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setErrors({});
            setUrgence('');
            setProbleme('');
          }}
          class="mt-8 inline-flex items-center gap-2 text-xs font-archivo font-bold uppercase tracking-[0.22em] text-bp-anthracite/65 hover:text-bp-anthracite transition-colors cursor-pointer"
        >
          Nouvelle demande
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 7v5l3 3" />
          </svg>
        </button>
      </div>
    );
  }

  // ============== FORMULAIRE ==============
  // Style border-2 (différent de tous les autres templates)
  const inputBase = 'w-full h-12 px-4 text-base font-archivo text-bp-anthracite bg-bp-blanc border-2 transition-colors duration-150 placeholder:text-bp-anthracite/40 focus:outline-none';
  const inputOk   = 'border-bp-anthracite/25 focus:border-bp-jaune focus:bg-bp-jaune/5';
  const inputErr  = 'border-bp-rouge';
  const labelBase = 'block text-[10px] font-archivo font-bold uppercase tracking-[0.28em] text-bp-anthracite mb-2';
  const errClass  = 'mt-1.5 text-xs text-bp-rouge font-archivo font-bold uppercase tracking-wide';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      class="bg-bp-blanc border-2 border-bp-anthracite p-6 sm:p-10 md:p-12 max-w-3xl mx-auto"
      aria-label="Formulaire de demande d'intervention"
    >
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
      </div>

      {/* === ÉTAPE 01 — URGENCE === */}
      <fieldset>
        <legend class="flex items-baseline gap-3 font-bebas uppercase tracking-wide text-bp-anthracite mb-5" style="font-size: 28px;">
          <span class="font-bebas text-bp-jaune tabular-nums" style="font-size: 28px;">01</span>
          <span>Quel est le degré d'urgence ?</span>
        </legend>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {urgences.map((opt) => {
            const isSel = urgence === opt.id;
            const isVeryUrgent = opt.id === 'tres-urgent';
            return (
              <label
                key={opt.id}
                class={`relative flex flex-col items-start justify-center gap-1 px-4 py-4 cursor-pointer transition-all border-2 ${
                  isSel
                    ? isVeryUrgent
                      ? 'bg-bp-rouge text-bp-blanc border-bp-rouge'
                      : 'bg-bp-jaune text-bp-anthracite border-bp-anthracite'
                    : 'bg-bp-blanc text-bp-anthracite border-bp-anthracite/25 hover:border-bp-anthracite'
                }`}
              >
                <input type="radio" name="urgence" value={opt.id} checked={isSel}
                  onChange={() => setUrgence(opt.id)} required class="sr-only" />
                <span class="font-bebas uppercase tracking-wide" style="font-size: 22px;">{opt.label}</span>
                <span class="text-xs font-archivo opacity-85 leading-snug">{opt.description}</span>
              </label>
            );
          })}
        </div>
        {errors.urgence && <p role="alert" class={errClass}>{errors.urgence}</p>}
      </fieldset>

      {/* === ÉTAPE 02 — TYPE DE PROBLÈME === */}
      <fieldset class="mt-10">
        <legend class="flex items-baseline gap-3 font-bebas uppercase tracking-wide text-bp-anthracite mb-5" style="font-size: 28px;">
          <span class="font-bebas text-bp-jaune tabular-nums" style="font-size: 28px;">02</span>
          <span>De quoi s'agit-il ?</span>
        </legend>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {problemes.map((opt) => {
            const isSel = probleme === opt.id;
            return (
              <label
                key={opt.id}
                class={`relative flex items-center justify-center px-3 h-12 cursor-pointer transition-all border-2 text-sm font-archivo font-semibold text-center ${
                  isSel
                    ? 'bg-bp-anthracite text-bp-jaune border-bp-anthracite'
                    : 'bg-bp-blanc text-bp-anthracite border-bp-anthracite/25 hover:border-bp-anthracite'
                }`}
              >
                <input type="radio" name="probleme" value={opt.id} checked={isSel}
                  onChange={() => setProbleme(opt.id)} required class="sr-only" />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {errors.probleme && <p role="alert" class={errClass}>{errors.probleme}</p>}
      </fieldset>

      {/* === ÉTAPE 03 — VOS COORDONNÉES === */}
      <fieldset class="mt-10 space-y-5">
        <legend class="flex items-baseline gap-3 font-bebas uppercase tracking-wide text-bp-anthracite mb-5" style="font-size: 28px;">
          <span class="font-bebas text-bp-jaune tabular-nums" style="font-size: 28px;">03</span>
          <span>Vos coordonnées</span>
        </legend>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="bp-nom" class={labelBase}>Nom</label>
            <input id="bp-nom" name="nom" type="text" required autocomplete="name"
              class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
              placeholder="Marie Dupont"
              aria-invalid={errors.nom ? 'true' : 'false'}
            />
            {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
          </div>
          <div>
            <label for="bp-tel" class={labelBase}>Téléphone</label>
            <input id="bp-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
              class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
              placeholder="0692 00 00 00"
              aria-invalid={errors.telephone ? 'true' : 'false'}
            />
            {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
          </div>
        </div>

        <div>
          <label for="bp-email" class={labelBase}>Email</label>
          <input id="bp-email" name="email" type="email" required autocomplete="email"
            class={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            placeholder="vous@exemple.re"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p role="alert" class={errClass}>{errors.email}</p>}
        </div>

        <div>
          <label for="bp-adresse" class={labelBase}>Adresse de l'intervention</label>
          <input id="bp-adresse" name="adresse" type="text" required autocomplete="street-address"
            class={`${inputBase} ${errors.adresse ? inputErr : inputOk}`}
            placeholder="12 rue des Lilas, 97430 Le Tampon"
            aria-invalid={errors.adresse ? 'true' : 'false'}
          />
          {errors.adresse && <p role="alert" class={errClass}>{errors.adresse}</p>}
        </div>

        <div>
          <label for="bp-description" class={labelBase}>
            Décrivez le problème <span class="lowercase tracking-normal text-bp-anthracite/55 font-normal">(optionnel)</span>
          </label>
          <textarea id="bp-description" name="description" rows={4}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Depuis quand ? Quel appareil ? Avez-vous coupé l'eau ? Une photo aide souvent (à envoyer ensuite sur WhatsApp)."
          ></textarea>
        </div>
      </fieldset>

      {/* === SUBMIT === */}
      <div class="mt-10 pt-8 border-t-2 border-bp-anthracite/10">
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-sm font-archivo font-bold uppercase tracking-[0.22em] bg-[#25D366] text-white border-2 border-[#1FBE5A] hover:bg-[#1FBE5A] transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.24-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
          </svg>
          Envoyer la demande
        </button>
        <p class="mt-4 text-xs font-archivo text-bp-anthracite/70 text-center leading-relaxed">
          Votre demande arrive directement chez Bernard via WhatsApp.
          <br class="hidden sm:inline" />
          Rappel sous <strong class="font-bold">15 minutes</strong>. Devis gratuit.
        </p>

        {/* Lien appel direct alternative */}
        <div class="mt-5 text-center">
          <a href="tel:+262692000000" class="inline-flex items-center gap-2 text-xs font-archivo font-bold uppercase tracking-[0.22em] text-bp-anthracite/65 hover:text-bp-anthracite border-b-2 border-bp-anthracite/20 hover:border-bp-jaune pb-1 transition-colors">
            ou appeler directement
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
        </div>
      </div>
    </form>
  );
}
