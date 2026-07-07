/** @jsxImportSource preact */
import type { JSX } from 'preact';

/**
 * PhoneMockup — maquette WhatsApp CSS pure (aucune lib, aucune image externe).
 * 100 % présentationnel : l'orchestrateur (ModuleMetierDemo) gère la timeline
 * d'animation en ajoutant les messages ; chaque bulle s'anime à l'apparition.
 *
 * L'animation est LA signature de la section : elle respecte prefers-reduced-motion
 * (bulles affichées sans transition). Aucun autre effet décoratif.
 */

export type Bubble =
  | { id: string; side: 'visitor'; kind: 'text'; content: string; time?: string }
  | { id: string; side: 'visitor'; kind: 'structured'; content: string; time?: string }
  | { id: string; side: 'pro'; kind: 'text'; content: string; time?: string }
  | { id: string; side: 'pro'; kind: 'typing' };

interface Props {
  proName: string;
  proStatus: string;
  proInitials: string;
  bubbles: Bubble[];
}

const check = (
  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true" class="inline-block align-[-1px]">
    <path d="M1 5.5 4.5 9 10 2.2" stroke="#4fc3f7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6 5.5 9.5 9 15 2.2" stroke="#4fc3f7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

function TypingDots() {
  return (
    <span class="mm-typing" aria-label="En train d'écrire">
      <span></span>
      <span></span>
      <span></span>
    </span>
  );
}

function StructuredBubble({ content, time }: { content: string; time?: string }) {
  // La 1re ligne (en-tête 📋) et la dernière (✅) sont mises en valeur.
  const lines = content.split('\n');
  return (
    <div class="text-[13px] leading-snug text-[#0b141a]">
      {lines.map((l, i) => {
        if (l === '') return <div key={i} class="h-1.5" />;
        if (l.startsWith('📋')) {
          return (
            <div key={i} class="font-semibold text-[11px] tracking-wide text-[#128C7E] mb-0.5">
              {l}
            </div>
          );
        }
        if (l.startsWith('✅')) {
          return (
            <div key={i} class="mt-1 font-semibold text-[#128C7E]">
              {l}
            </div>
          );
        }
        const [label, ...rest] = l.split(' : ');
        if (rest.length) {
          return (
            <div key={i}>
              <span class="text-[#5b6b73]">{label} :</span>{' '}
              <span class="font-medium">{rest.join(' : ')}</span>
            </div>
          );
        }
        return (
          <div key={i} class="font-medium">
            {l}
          </div>
        );
      })}
      {time && (
        <div class="text-right text-[10px] text-[#667781] mt-1 -mb-0.5">
          {time} {check}
        </div>
      )}
    </div>
  );
}

export default function PhoneMockup({ proName, proStatus, proInitials, bubbles }: Props) {
  return (
    <div class="mm-phone mx-auto w-full max-w-[340px]" aria-hidden="false">
      <div class="rounded-[2.2rem] bg-[#0b141a] p-2.5 ring-1 ring-white/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
        <div class="rounded-[1.7rem] overflow-hidden bg-[#0b141a]">
          {/* Barre WhatsApp */}
          <div class="flex items-center gap-3 bg-[#075E54] px-4 py-3">
            <div class="grid place-items-center w-9 h-9 rounded-full bg-[#128C7E] text-white text-sm font-semibold">
              {proInitials}
            </div>
            <div class="min-w-0">
              <div class="text-white text-sm font-semibold leading-tight truncate">{proName}</div>
              <div class="text-[11px] text-[#a7d8cf] leading-tight">{proStatus}</div>
            </div>
            <svg class="ml-auto text-white/80" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 15.5A3.5 3.5 0 0 0 15.5 12v-6a3.5 3.5 0 1 0-7 0v6a3.5 3.5 0 0 0 3.5 3.5Zm5-3.5a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" />
            </svg>
          </div>

          {/* Fil de discussion */}
          <div
            class="mm-thread px-3 py-4 space-y-2 min-h-[360px] max-h-[420px] overflow-y-auto"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {bubbles.map((b) => {
              if (b.kind === 'typing') {
                return (
                  <div key={b.id} class="mm-bubble-in flex justify-start">
                    <div class="rounded-2xl rounded-tl-sm bg-white px-3 py-2.5 shadow-sm">
                      <TypingDots />
                    </div>
                  </div>
                );
              }
              const visitor = b.side === 'visitor';
              const wrap = visitor ? 'justify-end' : 'justify-start';
              const bubbleCls = visitor
                ? 'bg-[#dcf8c6] rounded-2xl rounded-tr-sm'
                : 'bg-white rounded-2xl rounded-tl-sm';
              return (
                <div key={b.id} class={`mm-bubble-in flex ${wrap}`}>
                  <div class={`${bubbleCls} px-3 py-2 max-w-[85%] shadow-sm`}>
                    {b.kind === 'structured' ? (
                      <StructuredBubble content={b.content} time={b.time} />
                    ) : (
                      <div class="text-[13px] leading-snug text-[#0b141a]">
                        {b.content}
                        {b.time && (
                          <span class="text-[10px] text-[#667781] ml-2 align-baseline">
                            {b.time} {visitor ? check : null}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles locaux (animation signature + fond WhatsApp). Injectés une fois.
export const phoneMockupStyles: JSX.CSSProperties | string = `
.mm-thread{background-color:#e5ddd5;background-image:linear-gradient(rgba(229,221,213,.92),rgba(229,221,213,.92));}
.mm-bubble-in{animation:mm-bubble-rise .34s cubic-bezier(.22,1,.36,1) backwards;}
@keyframes mm-bubble-rise{from{opacity:0;transform:translateY(10px) scale(.98);}to{opacity:1;transform:none;}}
.mm-typing{display:inline-flex;gap:4px;align-items:center;height:14px;}
.mm-typing span{width:6px;height:6px;border-radius:50%;background:#9aa6ac;display:inline-block;animation:mm-typing-blink 1.2s infinite ease-in-out;}
.mm-typing span:nth-child(2){animation-delay:.2s;}
.mm-typing span:nth-child(3){animation-delay:.4s;}
@keyframes mm-typing-blink{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-2px);}}
@media (prefers-reduced-motion: reduce){
  .mm-bubble-in{animation:none!important;}
  .mm-typing span{animation:none!important;opacity:.6;}
}
`;
