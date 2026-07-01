/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import siteConfig from '../../data/siteConfig.json';
import realisations from '../../data/realisations.json';
import { trackEvent } from '../../lib/tracking';
import {
  getRecommendation,
  SECTEUR_LABELS,
  PRIORITE_LABELS,
  CONTACT_LABELS,
  PRESENCE_LABELS,
  ELEMENT_LABELS,
  URGENCE_LABELS,
  SUITE_LABELS,
  type Answers,
  type SectorKey,
  type PriorityKey,
  type ContactKey,
  type PresenceKey,
  type ElementKey,
  type UrgencyKey,
  type NextStepKey,
} from '../../lib/siteRecommendation';

const WHATSAPP_NUMBER = siteConfig.contact.whatsapp;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
const TOTAL_STEPS = 7;

type RealisationItem = { slug: string; nom: string; thumbnail: string; sector: string; shortDescription: string };

const SECTEUR_KEYS = Object.keys(SECTEUR_LABELS) as SectorKey[];
const PRIORITE_KEYS = Object.keys(PRIORITE_LABELS) as PriorityKey[];
const CONTACT_KEYS = Object.keys(CONTACT_LABELS) as ContactKey[];
const PRESENCE_KEYS = Object.keys(PRESENCE_LABELS) as PresenceKey[];
const ELEMENT_KEYS = Object.keys(ELEMENT_LABELS) as ElementKey[];
const URGENCE_KEYS = Object.keys(URGENCE_LABELS) as UrgencyKey[];
const SUITE_KEYS = Object.keys(SUITE_LABELS) as NextStepKey[];

interface Draft {
  secteur?: SectorKey;
  priorite?: PriorityKey;
  contact?: ContactKey;
  presence?: PresenceKey;
  elements: ElementKey[];
  urgence?: UrgencyKey;
  suite?: NextStepKey;
}

const PREFERENCES = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telephone', label: 'Téléphone' },
  { value: 'email', label: 'Email' },
];

export default function SiteRecommender() {
  const [step, setStep] = useState<Step>(0);
  const [started, setStarted] = useState(false);
  const [draft, setDraft] = useState<Draft>({ elements: [] });

  const [lead, setLead] = useState({
    nom: '',
    entreprise: '',
    telephone: '',
    email: '',
    preference: '',
    message: '',
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const mountedAt = useMemo(() => Date.now(), []);

  const recommendation = useMemo(() => {
    if (!draft.secteur || !draft.priorite || !draft.contact || !draft.presence || !draft.urgence || !draft.suite) {
      return null;
    }
    return getRecommendation({
      secteur: draft.secteur,
      priorite: draft.priorite,
      contact: draft.contact,
      presence: draft.presence,
      elements: draft.elements,
      urgence: draft.urgence,
      suite: draft.suite,
    });
  }, [draft]);

  function trackStart() {
    if (started) return;
    setStarted(true);
    trackEvent({
      name: 'site_recommender_start',
      category: 'engagement',
      source: 'site_recommender',
      page_type: 'trouver_site_adapte',
    });
  }

  function next(stepCompleted: number, sector?: SectorKey) {
    trackEvent({
      name: 'site_recommender_step_complete',
      category: 'engagement',
      label: `step_${stepCompleted}`,
      source: 'site_recommender',
      sector,
      page_type: 'trouver_site_adapte',
    });
    setStep((s) => Math.min(TOTAL_STEPS, (s + 1) as Step) as Step);
  }

  function back() {
    setStep((s) => Math.max(0, (s - 1) as Step) as Step);
  }

  function pickAndAdvance<K extends keyof Draft>(key: K, value: Draft[K], stepIndex: number) {
    setDraft((d) => ({ ...d, [key]: value }));
    trackStart();
    const sector = key === 'secteur' ? (value as SectorKey) : draft.secteur;
    next(stepIndex, sector);
  }

  function toggleElement(el: ElementKey) {
    setDraft((d) => {
      const has = d.elements.includes(el);
      return { ...d, elements: has ? d.elements.filter((x) => x !== el) : [...d.elements, el] };
    });
  }

  const matchingRealisations = useMemo<RealisationItem[]>(() => {
    if (!recommendation) return [];
    const all = realisations as RealisationItem[];
    return recommendation.matchingRealisationSlugs
      .map((slug) => all.find((r) => r.slug === slug))
      .filter((r): r is RealisationItem => !!r);
  }, [recommendation]);

  if (step === 7 && recommendation) {
    return (
      <ResultView
        recommendation={recommendation}
        matchingRealisations={matchingRealisations}
        sectorLabel={SECTEUR_LABELS[draft.secteur as SectorKey]}
        lead={lead}
        setLead={setLead}
        leadErrors={leadErrors}
        setLeadErrors={setLeadErrors}
        sending={sending}
        setSending={setSending}
        serverError={serverError}
        setServerError={setServerError}
        submitted={submitted}
        setSubmitted={setSubmitted}
        mountedAt={mountedAt}
        draft={draft}
        onRestart={() => {
          setStep(0);
          setStarted(false);
          setDraft({ elements: [] });
          setSubmitted(false);
          setServerError(null);
        }}
      />
    );
  }

  return (
    <div class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-10">
      <Progress step={step} />

      {step === 0 && (
        <Question title="Quel est votre secteur d'activité ?" subtitle="Choisissez ce qui correspond le mieux.">
          <OptionList
            options={SECTEUR_KEYS.map((k) => ({ value: k, label: SECTEUR_LABELS[k] }))}
            selected={draft.secteur}
            onPick={(v) => pickAndAdvance('secteur', v as SectorKey, 1)}
          />
        </Question>
      )}

      {step === 1 && (
        <Question title="Quelle est votre priorité aujourd'hui ?" subtitle="Une seule réponse — celle qui compte le plus pour vous.">
          <OptionList
            options={PRIORITE_KEYS.map((k) => ({ value: k, label: PRIORITE_LABELS[k] }))}
            selected={draft.priorite}
            onPick={(v) => pickAndAdvance('priorite', v as PriorityKey, 2)}
          />
        </Question>
      )}

      {step === 2 && (
        <Question title="Comment vos clients vous contactent-ils le plus souvent ?" subtitle="Le type de contact que votre site doit faciliter.">
          <OptionList
            options={CONTACT_KEYS.map((k) => ({ value: k, label: CONTACT_LABELS[k] }))}
            selected={draft.contact}
            onPick={(v) => pickAndAdvance('contact', v as ContactKey, 3)}
          />
        </Question>
      )}

      {step === 3 && (
        <Question title="Avez-vous déjà une présence en ligne ?" subtitle="Pour adapter la recommandation à votre point de départ.">
          <OptionList
            options={PRESENCE_KEYS.map((k) => ({ value: k, label: PRESENCE_LABELS[k] }))}
            selected={draft.presence}
            onPick={(v) => pickAndAdvance('presence', v as PresenceKey, 4)}
          />
        </Question>
      )}

      {step === 4 && (
        <Question title="Quels éléments aimeriez-vous mettre en avant ?" subtitle="Plusieurs choix possibles.">
          <div class="grid sm:grid-cols-2 gap-2">
            {ELEMENT_KEYS.map((k) => {
              const checked = draft.elements.includes(k);
              return (
                <label
                  key={k}
                  class={`relative flex items-center gap-3 h-14 px-4 rounded-xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-200 ring-1 ${
                    checked
                      ? 'bg-bleu-nuit text-blanc-casse ring-bleu-nuit'
                      : 'bg-blanc-casse text-bleu-nuit ring-bleu-nuit/15 hover:ring-bleu-nuit/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    checked={checked}
                    onChange={() => toggleElement(k)}
                  />
                  <span
                    aria-hidden="true"
                    class={`flex w-5 h-5 items-center justify-center rounded-md ring-1 ${
                      checked ? 'bg-bleu ring-bleu' : 'bg-transparent ring-bleu-nuit/30'
                    }`}
                  >
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-blanc-casse">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span>{ELEMENT_LABELS[k]}</span>
                </label>
              );
            })}
          </div>
          <NavFooter
            canBack
            canNext={draft.elements.length > 0}
            onBack={back}
            onNext={() => {
              trackStart();
              next(5, draft.secteur);
            }}
          />
        </Question>
      )}

      {step === 5 && (
        <Question title="Quel est votre niveau d'urgence ?" subtitle="Pour caler la suite à votre rythme.">
          <OptionList
            options={URGENCE_KEYS.map((k) => ({ value: k, label: URGENCE_LABELS[k] }))}
            selected={draft.urgence}
            onPick={(v) => pickAndAdvance('urgence', v as UrgencyKey, 6)}
          />
        </Question>
      )}

      {step === 6 && (
        <Question title="Que préférez-vous comme suite ?" subtitle="Vous restez libre — aucune obligation.">
          <OptionList
            options={SUITE_KEYS.map((k) => ({ value: k, label: SUITE_LABELS[k] }))}
            selected={draft.suite}
            onPick={(v) => pickAndAdvance('suite', v as NextStepKey, 7)}
          />
        </Question>
      )}

      {step > 0 && step < 7 && step !== 4 && (
        <div class="mt-8 flex justify-start">
          <button
            type="button"
            onClick={back}
            class="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit transition-colors cursor-pointer"
          >
            <span aria-hidden="true">←</span> Retour
          </button>
        </div>
      )}
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  const displayed = Math.min(step + 1, TOTAL_STEPS);
  const pct = Math.round(((step) / TOTAL_STEPS) * 100);
  return (
    <div class="mb-8">
      <div class="flex items-center justify-between text-xs font-semibold text-bleu-nuit/70 mb-2">
        <span>Étape {displayed} / {TOTAL_STEPS}</span>
        <span>{pct}%</span>
      </div>
      <div class="h-1.5 w-full rounded-full bg-bleu-nuit/10 overflow-hidden">
        <div class="h-full bg-bleu transition-all duration-300" style={`width:${pct}%`}></div>
      </div>
    </div>
  );
}

function Question({ title, subtitle, children }: { title: string; subtitle?: string; children: preact.ComponentChildren }) {
  return (
    <div>
      <h2 class="font-sora font-bold text-2xl md:text-3xl text-bleu-nuit leading-tight">{title}</h2>
      {subtitle && <p class="mt-2 text-sm md:text-base text-bleu-nuit/70">{subtitle}</p>}
      <div class="mt-6">{children}</div>
    </div>
  );
}

function OptionList<T extends string>({
  options,
  selected,
  onPick,
}: {
  options: { value: T; label: string }[];
  selected?: T;
  onPick: (v: T) => void;
}) {
  return (
    <div class="grid sm:grid-cols-2 gap-2">
      {options.map((o) => {
        const isSel = selected === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            class={`group relative text-left h-auto min-h-14 px-5 py-3 rounded-xl text-sm md:text-base font-semibold cursor-pointer transition-all duration-200 ring-1 ${
              isSel
                ? 'bg-bleu-nuit text-blanc-casse ring-bleu-nuit'
                : 'bg-blanc-casse text-bleu-nuit ring-bleu-nuit/15 hover:ring-bleu-nuit/40 hover:bg-bleu-nuit/[0.02]'
            }`}
          >
            <span class="flex items-center justify-between gap-3">
              <span>{o.label}</span>
              <span aria-hidden="true" class={isSel ? 'text-bleu' : 'text-bleu-nuit/30 group-hover:text-bleu-nuit/60'}>→</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NavFooter({
  canBack,
  canNext,
  onBack,
  onNext,
}: {
  canBack: boolean;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div class="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canBack}
        class="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <span aria-hidden="true">←</span> Retour
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        class="inline-flex items-center gap-2 h-12 px-6 text-sm md:text-base font-semibold rounded-full bg-bleu-nuit text-blanc-casse hover:bg-black shadow-card hover:shadow-card-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        Continuer
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function ResultView(props: {
  recommendation: ReturnType<typeof getRecommendation>;
  matchingRealisations: RealisationItem[];
  sectorLabel: string;
  lead: { nom: string; entreprise: string; telephone: string; email: string; preference: string; message: string };
  setLead: (l: typeof props.lead) => void;
  leadErrors: Record<string, string>;
  setLeadErrors: (e: Record<string, string>) => void;
  sending: boolean;
  setSending: (b: boolean) => void;
  serverError: string | null;
  setServerError: (s: string | null) => void;
  submitted: boolean;
  setSubmitted: (b: boolean) => void;
  mountedAt: number;
  draft: Draft;
  onRestart: () => void;
}) {
  const {
    recommendation: rec,
    matchingRealisations,
    sectorLabel,
    lead,
    setLead,
    leadErrors,
    setLeadErrors,
    sending,
    setSending,
    serverError,
    setServerError,
    submitted,
    setSubmitted,
    mountedAt,
    draft,
    onRestart,
  } = props;

  useMemoOnce(() => {
    trackEvent({
      name: 'site_recommender_result_view',
      category: 'engagement',
      source: 'site_recommender',
      sector: draft.secteur,
      page_type: 'trouver_site_adapte',
    });
  });

  function update<K extends keyof typeof lead>(key: K, value: string) {
    setLead({ ...lead, [key]: value });
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (Date.now() - mountedAt < 1500) return;
    const fd = new FormData(form);
    if ((fd.get('website') as string)?.trim()) {
      setSubmitted(true);
      return;
    }

    const errs: Record<string, string> = {};
    if (!lead.nom.trim()) errs.nom = 'Indiquez votre nom.';
    if (lead.email && !EMAIL_REGEX.test(lead.email)) errs.email = "L'adresse email semble invalide.";
    if (!lead.email && !lead.telephone) errs.email = 'Indiquez au moins un email ou un téléphone.';
    setLeadErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError(null);
    setSending(true);
    try {
      const res = await fetch('/api/site-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: {
            secteur: draft.secteur,
            priorite: draft.priorite,
            contact: draft.contact,
            presence: draft.presence,
            elements: draft.elements,
            urgence: draft.urgence,
            suite: draft.suite,
          },
          lead: {
            nom: lead.nom.trim(),
            entreprise: lead.entreprise.trim(),
            telephone: lead.telephone.trim(),
            email: lead.email.trim(),
            preference: lead.preference.trim(),
            message: lead.message.trim(),
          },
          startTime: mountedAt,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        const code = body.error ?? `http_${res.status}`;
        setServerError(
          code === 'validation'
            ? 'Certains champs sont invalides.'
            : `L'envoi a échoué [${code}${body.detail ? ` — ${body.detail}` : ''}]. Vous pouvez nous écrire directement sur WhatsApp.`
        );
        return;
      }
      trackEvent({
        name: 'site_recommender_form_submit',
        category: 'conversion',
        source: 'site_recommender',
        sector: draft.secteur,
        page_type: 'trouver_site_adapte',
      });
      setSubmitted(true);
    } catch {
      setServerError("Impossible d'envoyer la demande (réseau). Vous pouvez nous écrire directement sur WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  const waMessage = useMemo(() => {
    const lines = [
      `Bonjour 9site4, je viens de l'outil "Trouver le site adapté".`,
      ``,
      `Activité : ${sectorLabel}`,
      `Recommandation : ${rec.recommendedSiteType}`,
      `Module : ${rec.recommendedModule}`,
      `Priorité : ${rec.priority}`,
      `Suite souhaitée : ${rec.recommendedNextStep}`,
    ];
    if (lead.nom) lines.push(``, `Nom : ${lead.nom}`);
    if (lead.entreprise) lines.push(`Entreprise : ${lead.entreprise}`);
    if (lead.message) lines.push(``, `Message : ${lead.message}`);
    return lines.join('\n');
  }, [rec, sectorLabel, lead]);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  if (submitted) {
    return (
      <div class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-8 md:p-12 text-center">
        <div class="mx-auto flex w-14 h-14 rounded-full bg-bleu/15 text-bleu items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 class="mt-5 font-sora font-semibold text-2xl text-bleu-nuit">Votre demande a bien été envoyée.</h3>
        <p class="mt-3 text-base text-bleu-nuit/75 max-w-xl mx-auto">
          Merci. Nous avons reçu votre recommandation personnalisée. Notre équipe revient vers vous rapidement avec une proposition adaptée à votre activité.
        </p>
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/realisations" class="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full bg-bleu text-bleu-nuit hover:bg-bleu-fonce transition-all">Voir nos réalisations</a>
          <button
            type="button"
            onClick={onRestart}
            class="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit cursor-pointer transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const inputBase =
    'w-full h-12 px-4 text-base font-inter text-bleu-nuit bg-blanc-casse rounded-xl ring-1 transition-all duration-200 placeholder:text-bleu-nuit/55';
  const inputOk = 'ring-bleu-nuit/15 focus:ring-2 focus:ring-bleu';
  const inputErr = 'ring-2 ring-red-500 focus:ring-red-500';
  const labelBase = 'block text-sm font-semibold text-bleu-nuit mb-2';
  const errClass = 'mt-1.5 text-xs text-red-600';

  return (
    <div class="space-y-8">
      <div class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-10">
        <p class="inline-flex items-center gap-2 font-roboto-mono text-[11px] uppercase tracking-[0.28em] text-bleu font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-bleu"></span> Votre recommandation
        </p>
        <h2 class="mt-4 font-sora font-bold text-2xl md:text-3xl text-bleu-nuit leading-tight">
          {rec.profile}
        </h2>
        <p class="mt-2 text-base md:text-lg text-bleu-nuit/75 leading-relaxed">{rec.explanation}</p>

        <dl class="mt-6 grid sm:grid-cols-2 gap-4">
          <SummaryRow label="Type de site" value={rec.recommendedSiteType} />
          <SummaryRow label="Module métier" value={rec.recommendedModule} />
          <SummaryRow label="Priorité" value={rec.priority} />
          <SummaryRow label="Suite recommandée" value={rec.recommendedNextStep} />
        </dl>
      </div>

      <div class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-10">
        <h3 class="font-sora font-semibold text-xl md:text-2xl text-bleu-nuit">Votre site pourrait inclure</h3>
        <ul class="mt-5 grid sm:grid-cols-2 gap-3">
          {rec.suggestedPages.map((p) => (
            <li key={p} class="flex items-center gap-3 rounded-xl px-4 py-3 ring-1 ring-bleu-nuit/10 bg-bleu-nuit/[0.02]">
              <span class="flex w-7 h-7 items-center justify-center rounded-lg bg-bleu/15 text-bleu shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span class="text-sm md:text-base font-semibold text-bleu-nuit">{p}</span>
            </li>
          ))}
        </ul>
        {rec.suggestedCTAs.length > 0 && (
          <div class="mt-6">
            <p class="text-xs uppercase tracking-wider font-semibold text-bleu-nuit/60">Appels à l'action conseillés</p>
            <div class="mt-3 flex flex-wrap gap-2">
              {rec.suggestedCTAs.map((c) => (
                <span key={c} class="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-bleu-nuit text-blanc-casse text-xs font-semibold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {matchingRealisations.length > 0 && (
        <div class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-10">
          <h3 class="font-sora font-semibold text-xl md:text-2xl text-bleu-nuit">Réalisations proches</h3>
          <p class="mt-2 text-sm text-bleu-nuit/70">Des sites 9site4 conçus pour des activités similaires.</p>
          <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingRealisations.map((r) => (
              <a
                key={r.slug}
                href={`/realisations/${r.slug}`}
                class="group rounded-2xl ring-1 ring-bleu-nuit/10 overflow-hidden hover:ring-bleu transition-all"
                data-track-event="site_recommender_cta_click"
                data-track-category="navigation"
                data-track-source="site_recommender_realisations"
                data-track-target={`/realisations/${r.slug}`}
                data-track-page-type="trouver_site_adapte"
              >
                <div class="aspect-[4/3] overflow-hidden bg-bleu-nuit/5">
                  <img src={r.thumbnail} alt={r.nom} loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div class="p-4">
                  <p class="font-sora font-semibold text-base text-bleu-nuit">{r.nom}</p>
                  <p class="mt-1 text-xs text-bleu-nuit/65 leading-snug">{r.shortDescription}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        noValidate
        class="bg-blanc-casse rounded-3xl ring-1 ring-bleu-nuit/10 shadow-card p-6 md:p-10 space-y-5"
        aria-label="Recevoir cette recommandation"
      >
        <div>
          <h3 class="font-sora font-semibold text-xl md:text-2xl text-bleu-nuit">Recevoir cette recommandation</h3>
          <p class="mt-2 text-sm md:text-base text-bleu-nuit/70">Indiquez vos coordonnées pour recevoir un retour personnalisé. Sans engagement.</p>
        </div>

        <div aria-hidden="true" style="position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;">
          <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="sr-nom" class={labelBase}>Nom <span class="text-bleu" aria-hidden="true">*</span></label>
            <input id="sr-nom" type="text" autocomplete="name" required
              value={lead.nom}
              onInput={(e) => update('nom', (e.currentTarget as HTMLInputElement).value)}
              aria-invalid={leadErrors.nom ? 'true' : 'false'}
              class={`${inputBase} ${leadErrors.nom ? inputErr : inputOk}`}
              placeholder="Votre nom" />
            {leadErrors.nom && <p role="alert" class={errClass}>{leadErrors.nom}</p>}
          </div>
          <div>
            <label for="sr-entreprise" class={labelBase}>Entreprise <span class="text-bleu-nuit/65 font-normal">(optionnel)</span></label>
            <input id="sr-entreprise" type="text" autocomplete="organization"
              value={lead.entreprise}
              onInput={(e) => update('entreprise', (e.currentTarget as HTMLInputElement).value)}
              class={`${inputBase} ${inputOk}`}
              placeholder="Nom de votre activité" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="sr-tel" class={labelBase}>Téléphone</label>
            <input id="sr-tel" type="tel" inputMode="tel" autocomplete="tel"
              value={lead.telephone}
              onInput={(e) => update('telephone', (e.currentTarget as HTMLInputElement).value)}
              class={`${inputBase} ${inputOk}`}
              placeholder="+262 692 00 00 00" />
          </div>
          <div>
            <label for="sr-email" class={labelBase}>Email</label>
            <input id="sr-email" type="email" autocomplete="email"
              value={lead.email}
              onInput={(e) => update('email', (e.currentTarget as HTMLInputElement).value)}
              aria-invalid={leadErrors.email ? 'true' : 'false'}
              class={`${inputBase} ${leadErrors.email ? inputErr : inputOk}`}
              placeholder="vous@exemple.re" />
            {leadErrors.email && <p role="alert" class={errClass}>{leadErrors.email}</p>}
          </div>
        </div>

        <fieldset>
          <legend class={labelBase}>Préférence de contact</legend>
          <div class="grid sm:grid-cols-3 gap-2">
            {PREFERENCES.map((p) => (
              <label key={p.value} class="relative flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold text-bleu-nuit bg-blanc-casse ring-1 ring-bleu-nuit/15 cursor-pointer transition-all hover:ring-bleu-nuit/30 has-[:checked]:bg-bleu-nuit has-[:checked]:text-blanc-casse has-[:checked]:ring-bleu-nuit">
                <input type="radio" name="preference" value={p.value} class="sr-only peer"
                  checked={lead.preference === p.value}
                  onChange={() => update('preference', p.value)} />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label for="sr-message" class={labelBase}>Message <span class="text-bleu-nuit/65 font-normal">(optionnel)</span></label>
          <textarea id="sr-message" rows={3}
            value={lead.message}
            onInput={(e) => update('message', (e.currentTarget as HTMLTextAreaElement).value)}
            class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
            placeholder="Une précision sur votre projet…"></textarea>
        </div>

        {serverError && (
          <div class="rounded-xl bg-red-50 ring-1 ring-red-200 px-4 py-3">
            <p role="alert" class="text-sm text-red-700">{serverError}</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1ebe57] hover:underline"
            >
              Envoyer sur WhatsApp →
            </a>
          </div>
        )}

        <div class="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit" disabled={sending} aria-busy={sending}
            class="inline-flex items-center justify-center gap-2 h-14 px-6 text-base font-semibold rounded-full bg-bleu text-bleu-nuit shadow-card hover:bg-bleu-fonce hover:shadow-card-hover transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex-1"
          >
            {sending ? 'Envoi…' : 'Recevoir ma recommandation'}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track-event="site_recommender_cta_click"
            data-track-category="conversion"
            data-track-source="site_recommender_whatsapp"
            data-track-page-type="trouver_site_adapte"
            class="inline-flex items-center justify-center gap-2 h-14 px-6 text-base font-semibold rounded-full bg-[#25D366] text-white hover:bg-[#1ebe57] shadow-card hover:shadow-card-hover transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.11 4.91A10 10 0 0 0 4.06 18.2L3 22l3.91-1.03A10 10 0 1 0 19.11 4.91Zm-7.1 15.4a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-2.32.61.62-2.26-.2-.31a8.3 8.3 0 1 1 6.44 3.3Z" /></svg>
            WhatsApp
          </a>
        </div>
        <p class="text-xs text-bleu-nuit/65 text-center leading-relaxed">
          Sans engagement. Vos données restent confidentielles.{' '}
          <a href="/mentions-legales#donnees" class="underline underline-offset-2 hover:text-bleu">En savoir plus</a>.
        </p>
      </form>

      <div class="text-center">
        <button
          type="button"
          onClick={onRestart}
          class="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-full text-bleu-nuit/70 hover:text-bleu-nuit cursor-pointer transition-colors"
        >
          ← Recommencer le parcours
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div class="rounded-xl ring-1 ring-bleu-nuit/10 bg-bleu-nuit/[0.02] px-4 py-3">
      <dt class="text-xs uppercase tracking-wider font-semibold text-bleu-nuit/60">{label}</dt>
      <dd class="mt-1 text-sm md:text-base font-semibold text-bleu-nuit">{value}</dd>
    </div>
  );
}

function useMemoOnce(fn: () => void) {
  useMemo(fn, []);
}
