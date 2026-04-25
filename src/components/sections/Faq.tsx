/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface FaqItem {
  id: string;
  question: string;
  reponse: string;
}

interface Props {
  items: FaqItem[];
}

/**
 * Faq — Astro Island (client:load) accordéon.
 * - tout fermé par défaut
 * - une seule question ouverte à la fois (toggle vers null si on reclique)
 * - aria-expanded sur le bouton, aria-controls + role="region" sur le panneau
 * - animation height auto via grid-template-rows: 0fr → 1fr
 */
export default function Faq({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul class="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `faq-q-${item.id}`;
        const panelId = `faq-a-${item.id}`;
        return (
          <li
            key={item.id}
            class={`bg-blanc-casse rounded-2xl transition-all duration-250 ease-out ${
              isOpen
                ? 'ring-1 ring-bleu-nuit/20 shadow-card'
                : 'ring-1 ring-bleu-nuit/10 hover:ring-bleu-nuit/15'
            }`}
          >
            <h3 class="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                class="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer rounded-2xl"
              >
                <span class="font-sora font-semibold text-base md:text-lg text-bleu-nuit leading-snug">
                  {item.question}
                </span>
                <span
                  class={`flex w-8 h-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                    isOpen
                      ? 'bg-orange text-blanc-casse rotate-45'
                      : 'bg-bleu-nuit/5 text-bleu-nuit'
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              class="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div class="overflow-hidden">
                <p class="px-5 md:px-6 pb-5 md:pb-6 text-base text-bleu-nuit/75 leading-relaxed">
                  {item.reponse}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
