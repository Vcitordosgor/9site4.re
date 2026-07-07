/** @jsxImportSource preact */
import { useRef, useState, useMemo, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ModuleMetierConfig, Field, FieldValues } from '../../lib/moduleMetier/types';
import { formatMessage, interpolate, whatsappUrl } from '../../lib/moduleMetier/formatMessage';

/**
 * ModuleMetier — LE moteur réutilisable.
 *
 * Rend un formulaire entièrement piloté par `config` (un métier = un JSON,
 * zéro code spécifique). Deux modes :
 *   - "demo"       : AUCUN appel réseau. À la soumission, appelle onDemoSubmit
 *                    avec le message formaté (déclenche l'animation du téléphone).
 *   - "production" : POST vers l'endpoint (e-mail au pro = filet de sécurité),
 *                    PUIS ouvre wa.me pré-rempli. Turnstile en production only.
 *
 * Aucune dépendance externe. Aucune logique de stock/calendrier : les dispos
 * type « (6 places) » sont du texte statique venu de la config.
 */

const PHONE_REGEX = /^[+]?[\d\s().-]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface DemoSubmitPayload {
  texte: string;
  reponsePro: string;
  bulleVisiteur?: string;
}

interface Props {
  config: ModuleMetierConfig;
  mode?: 'demo' | 'production';
  /** Endpoint Worker en production. Défaut : /api/module-metier */
  endpoint?: string;
  /** Clé site Turnstile (production only). */
  turnstileSiteKey?: string;
  /** Mode démo : appelé à la soumission validée, sans réseau. */
  onDemoSubmit?: (payload: DemoSubmitPayload) => void;
  /** Notifie le parent d'un reset (changement de métier géré en amont). */
  resetSignal?: number;
}

function seedValues(config: ModuleMetierConfig): FieldValues {
  const v: FieldValues = {};
  for (const c of config.champs) v[c.id] = c.defaut ?? '';
  return v;
}

export default function ModuleMetier({
  config,
  mode = 'demo',
  endpoint = '/api/module-metier',
  turnstileSiteKey,
  onDemoSubmit,
  resetSignal,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FieldValues>(() => seedValues(config));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const mountedAt = useMemo(() => Date.now(), []);

  // Reseed quand la config change (changement de métier) ou reset demandé.
  useEffect(() => {
    setValues(seedValues(config));
    setErrors({});
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id, resetSignal]);

  const setField = (id: string, val: string) =>
    setValues((prev) => ({ ...prev, [id]: val }));

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const c of config.champs) {
      const val = (values[c.id] ?? '').trim();
      if (c.requis && !val) {
        errs[c.id] = 'Ce champ est requis.';
        continue;
      }
      if (val && c.type === 'tel' && !PHONE_REGEX.test(val)) {
        errs[c.id] = 'Numéro non reconnu (ex. 0692 00 00 00).';
      }
      if (val && c.type === 'email' && !EMAIL_REGEX.test(val)) {
        errs[c.id] = 'Adresse e-mail invalide.';
      }
    }
    return errs;
  }

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    const { texte, html } = formatMessage(config, values);
    const reponsePro = interpolate(config.reponsePro, values);

    // ===== MODE DÉMO : aucun réseau =====
    if (mode === 'demo') {
      onDemoSubmit?.({ texte, reponsePro, bulleVisiteur: config.bulleVisiteur });
      return;
    }

    // ===== MODE PRODUCTION =====
    // Honeypot + time-trap
    const fd = new FormData(form);
    if ((fd.get('website') as string)?.trim() || Date.now() - mountedAt < 1500) {
      onDemoSubmit?.({ texte, reponsePro, bulleVisiteur: config.bulleVisiteur });
      return;
    }

    let turnstileToken = '';
    if (turnstileSiteKey) {
      turnstileToken = (fd.get('cf-turnstile-response') as string) || '';
      if (!turnstileToken) {
        setServerError('Merci de valider le contrôle anti-robot.');
        return;
      }
    }

    setServerError(null);
    setSending(true);
    try {
      // 1) E-mail au pro = filet de sécurité (envoyé AVANT WhatsApp).
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metier: config.id,
          label: config.label,
          texte,
          html,
          destination: config.destination,
          turnstileToken,
          website: (fd.get('website') as string) || '',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const code = (body as { error?: string }).error ?? `http_${res.status}`;
        setServerError(`L'envoi a échoué [${code}]. Réessayez dans un instant.`);
        return;
      }
      // 2) Ouvre WhatsApp pré-rempli (le visiteur envoie depuis SON WhatsApp).
      const url = whatsappUrl(config, texte);
      if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener');
      onDemoSubmit?.({ texte, reponsePro, bulleVisiteur: config.bulleVisiteur });
    } catch {
      setServerError("Impossible d'envoyer la demande (réseau). Réessayez.");
    } finally {
      setSending(false);
    }
  };

  // ---- styles (thème sombre home) ----
  const inputBase =
    'w-full h-11 px-3.5 text-base rounded-xl bg-surface-deep text-blanc-casse ring-1 transition-all duration-200 placeholder:text-blanc-casse/40';
  const inputOk = 'ring-white/15 focus:ring-2 focus:ring-bleu';
  const inputErr = 'ring-2 ring-red-400 focus:ring-red-400';
  const labelBase = 'block text-sm font-semibold text-blanc-casse mb-1.5';
  const errClass = 'mt-1 text-xs text-red-300';

  const renderField = (c: Field) => {
    const err = errors[c.id];
    const cls = `${inputBase} ${err ? inputErr : inputOk}`;
    const common = {
      'data-field': c.id,
      'aria-invalid': err ? ('true' as const) : ('false' as const),
      'aria-describedby': err ? `mm-${c.id}-err` : undefined,
    };

    switch (c.type) {
      case 'textarea':
        return (
          <textarea
            {...common}
            id={`mm-${c.id}`}
            rows={3}
            placeholder={c.placeholder}
            value={values[c.id] ?? ''}
            onInput={(e) => setField(c.id, (e.target as HTMLTextAreaElement).value)}
            class={`${cls} h-auto py-2.5 resize-y`}
          />
        );
      case 'select':
        return (
          <select
            {...common}
            id={`mm-${c.id}`}
            value={values[c.id] ?? ''}
            onInput={(e) => setField(c.id, (e.target as HTMLSelectElement).value)}
            class={`${cls} appearance-none`}
            style="background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fefefa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;);background-repeat:no-repeat;background-position:right .85rem center;background-size:15px;padding-right:2.25rem;"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {(c.options ?? []).map((o) => (
              <option value={o} key={o}>
                {o}
              </option>
            ))}
          </select>
        );
      case 'chips':
        return (
          <div role="radiogroup" aria-label={c.label} class="flex flex-wrap gap-2" data-field={c.id} tabIndex={-1}>
            {(c.options ?? []).map((o) => {
              const active = values[c.id] === o;
              return (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={active ? 'true' : 'false'}
                  onClick={() => setField(c.id, o)}
                  class={`px-3.5 h-10 rounded-full text-sm font-medium ring-1 transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-bleu text-bleu-nuit ring-bleu'
                      : 'bg-surface-deep text-blanc-casse/85 ring-white/15 hover:ring-white/30'
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        );
      default:
        return (
          <input
            {...common}
            id={`mm-${c.id}`}
            type={c.type}
            inputMode={c.type === 'tel' ? 'tel' : undefined}
            placeholder={c.placeholder}
            value={values[c.id] ?? ''}
            onInput={(e) => setField(c.id, (e.target as HTMLInputElement).value)}
            class={cls}
          />
        );
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate class="space-y-4" aria-label={config.tag}>
      {/* Honeypot */}
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autocomplete="off" />
        </label>
      </div>

      {config.champs.map((c) => (
        <div key={c.id}>
          <label for={`mm-${c.id}`} class={labelBase}>
            {c.label}{' '}
            {c.requis ? (
              <span class="text-bleu" aria-hidden="true">
                *
              </span>
            ) : (
              <span class="text-blanc-casse/50 font-normal">(facultatif)</span>
            )}
          </label>
          {renderField(c)}
          {errors[c.id] && (
            <p id={`mm-${c.id}-err`} role="alert" class={errClass}>
              {errors[c.id]}
            </p>
          )}
        </div>
      ))}

      {mode === 'production' && turnstileSiteKey && (
        <div class="cf-turnstile" data-sitekey={turnstileSiteKey} />
      )}

      {serverError && (
        <p role="alert" class="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-400/30 rounded-xl px-3.5 py-2.5">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        class="inline-flex w-full items-center justify-center gap-2 h-12 px-5 text-base font-semibold rounded-full bg-bleu text-bleu-nuit hover:bg-bleu-fonce active:translate-y-px transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {sending ? 'Envoi…' : config.cta}
      </button>
    </form>
  );
}
