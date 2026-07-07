/** @jsxImportSource preact */
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import type { ModuleMetierConfig } from '../../lib/moduleMetier/types';
import ModuleMetier, { type DemoSubmitPayload } from './ModuleMetier';
import PhoneMockup, { type Bubble, phoneMockupStyles } from './PhoneMockup';

/**
 * ModuleMetierDemo — orchestrateur de la démo interactive (île unique).
 *
 * 1. Le visiteur choisit un métier (chips) → le VRAI moteur ModuleMetier rend
 *    le formulaire de ce métier (mode "demo", zéro réseau).
 * 2. À la soumission, la timeline signature joue dans la maquette WhatsApp :
 *    connecteur qui pulse → bulle structurée (~400 ms) → réponse du pro (~1,5 s).
 * 3. Changement de métier → reset propre du fil et du formulaire.
 *
 * Aucune donnée n'est envoyée ni conservée (démo). Vocabulaire verrouillé :
 * « demande », « prête à traiter » — jamais « réservation confirmée ».
 */

interface ProInfo {
  name: string;
  status: string;
  initials: string;
}

interface Props {
  configs: ModuleMetierConfig[];
  /** Infos "pro" affichées dans la maquette, par id de métier. */
  pros: Record<string, ProInfo>;
}

const ICONS: Record<string, string> = {
  yoga: 'M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm-7 6 5 2v8h2v-5h0v5h2v-8l5-2-.7-1.9L13 8h-2L5.7 7.1 5 9Z',
  restaurant: 'M11 3v8H9V3H7v8a3 3 0 0 0 3 3v7h2v-7a3 3 0 0 0 3-3V3h-2v8h-2V3h-2Zm8 0c-1.7 0-3 2.2-3 5 0 2.4 1 4.3 2 4.8V21h2V3h-1Z',
  artisan: 'M13.8 8.2 3 19l2 2 10.8-10.8a4 4 0 1 0-2-2ZM7 3 3 5l2 4 2 1 2-2-1-2-1-3Z',
  institut: 'M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.4V22h4V9.4A4 4 0 0 0 12 2Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
  gite: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z',
  coach: 'M20.6 6.6 17.4 3.4a1 1 0 0 0-1.4 1.4L16.6 5l-2 2-1-1-2 2 6 6 2-2-1-1 2-2 .6.6a1 1 0 0 0 1.4-1.4ZM7 13l-2 2-1-1L2 16l6 6 2-2-1-1 2-2-6-6Z',
};

function now(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ModuleMetierDemo({ configs, pros }: Props) {
  const [activeId, setActiveId] = useState(configs[0]?.id ?? '');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [pulsing, setPulsing] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seq = useRef(0);

  const config = configs.find((c) => c.id === activeId) ?? configs[0];
  const pro = pros[activeId] ?? { name: 'Le pro', status: 'en ligne', initials: '?' };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const introBubbles = useCallback(
    (cfg: ModuleMetierConfig): Bubble[] =>
      cfg.bulleVisiteur
        ? [{ id: `intro-${cfg.id}`, side: 'visitor', kind: 'text', content: cfg.bulleVisiteur }]
        : [],
    []
  );

  // Reset du fil à chaque changement de métier.
  useEffect(() => {
    clearTimers();
    setPulsing(false);
    setBubbles(introBubbles(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => () => clearTimers(), []);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const handleDemoSubmit = (payload: DemoSubmitPayload) => {
    clearTimers();
    seq.current += 1;
    const s = seq.current;
    const structured: Bubble = {
      id: `struct-${s}`,
      side: 'visitor',
      kind: 'structured',
      content: payload.texte,
      time: now(),
    };
    const reply: Bubble = {
      id: `reply-${s}`,
      side: 'pro',
      kind: 'text',
      content: payload.reponsePro,
      time: now(),
    };
    const typing: Bubble = { id: `typing-${s}`, side: 'pro', kind: 'typing' };

    if (reduced) {
      setBubbles((prev) => [...prev, structured, reply]);
      return;
    }

    // Timeline signature.
    setPulsing(true);
    timers.current.push(
      setTimeout(() => {
        setBubbles((prev) => [...prev, structured]);
        setPulsing(false);
      }, 400)
    );
    timers.current.push(
      setTimeout(() => setBubbles((prev) => [...prev, typing]), 1150)
    );
    timers.current.push(
      setTimeout(() => {
        setBubbles((prev) => [...prev.filter((b) => b.kind !== 'typing'), reply]);
      }, 1900)
    );
  };

  const onChipKey = (e: KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + configs.length) % configs.length;
    setActiveId(configs[next].id);
    const el = document.getElementById(`mm-chip-${configs[next].id}`);
    el?.focus();
  };

  return (
    <div>
      <style>{phoneMockupStyles}</style>

      {/* Sélecteur de métier */}
      <div
        role="tablist"
        aria-label="Choisir une activité"
        class="flex flex-wrap justify-center gap-2 mb-8"
      >
        {configs.map((c, i) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              id={`mm-chip-${c.id}`}
              role="tab"
              aria-selected={active ? 'true' : 'false'}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveId(c.id)}
              onKeyDown={(e) => onChipKey(e, i)}
              class={`inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium ring-1 transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-bleu text-bleu-nuit ring-bleu'
                  : 'bg-surface text-blanc-casse/85 ring-white/15 hover:ring-white/30'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={ICONS[c.id] ?? ICONS.yoga} />
              </svg>
              {c.titre}
            </button>
          );
        })}
      </div>

      {/* 2 colonnes desktop : formulaire + connecteur + téléphone */}
      <div class="grid lg:grid-cols-[1fr_auto_minmax(320px,380px)] gap-6 lg:gap-4 items-start">
        {/* Carte live : le VRAI moteur */}
        <div class="card-dark rounded-2xl p-5 md:p-6">
          <div class="text-[11px] font-semibold tracking-[0.14em] text-bleu mb-1">
            {config.tag}
          </div>
          <h3 class="font-sora font-semibold text-xl text-blanc-casse mb-1">{config.titre}</h3>
          <p class="text-sm text-blanc-casse/70 mb-5">{config.sousTitre}</p>
          <ModuleMetier
            config={config}
            mode="demo"
            onDemoSubmit={handleDemoSubmit}
            resetSignal={resetSignal}
          />
        </div>

        {/* Connecteur (desktop) — pulse pendant l'envoi */}
        <div class="hidden lg:flex flex-col items-center justify-center self-center h-full pt-16" aria-hidden="true">
          <div class={`mm-connector ${pulsing ? 'mm-connector-on' : ''}`}>
            <span class="mm-dot" />
            <span class="mm-dot" />
            <span class="mm-dot" />
          </div>
        </div>

        {/* Maquette téléphone */}
        <div>
          <PhoneMockup
            proName={pro.name}
            proStatus={pro.status}
            proInitials={pro.initials}
            bubbles={bubbles}
          />
        </div>
      </div>

      <style>{`
        .mm-connector{display:flex;flex-direction:row;gap:8px;align-items:center;}
        .mm-connector .mm-dot{width:8px;height:8px;border-radius:50%;background:rgba(145,166,255,.35);transition:background .2s;}
        .mm-connector-on .mm-dot{animation:mm-flow 1.1s ease-in-out;background:#91a6ff;}
        .mm-connector-on .mm-dot:nth-child(2){animation-delay:.12s;}
        .mm-connector-on .mm-dot:nth-child(3){animation-delay:.24s;}
        @keyframes mm-flow{0%,100%{transform:scale(1);box-shadow:none;}40%{transform:scale(1.5);box-shadow:0 0 12px 2px rgba(145,166,255,.6);}}
        @media (prefers-reduced-motion: reduce){.mm-connector-on .mm-dot{animation:none;}}
      `}</style>
    </div>
  );
}
