/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';

interface CategoryWithCount {
  id: string;
  nom: string;
  count: number;
}

interface Props {
  categories: CategoryWithCount[];
  totalCount: number;
}

/**
 * FiltersBar — Astro Island (client:load).
 * Filtre client-side : pilote l'affichage des cartes rendues côté serveur
 * via leur attribut data-realisation-categorie. Pas de re-render des cards.
 */
export default function FiltersBar({ categories, totalCount }: Props) {
  const [active, setActive] = useState<string>('all');

  const all: CategoryWithCount[] = [
    { id: 'all', nom: 'Tous', count: totalCount },
    ...categories,
  ];

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      '[data-realisation-categorie]'
    );
    let visibleCount = 0;
    cards.forEach((card) => {
      const cat = card.dataset.realisationCategorie ?? '';
      const visible = active === 'all' || cat === active;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    // Annonce ARIA live
    const live = document.getElementById('realisations-live');
    if (live) {
      const catName =
        active === 'all'
          ? null
          : categories.find((c) => c.id === active)?.nom ?? null;
      live.textContent = catName
        ? `${visibleCount} réalisation${visibleCount > 1 ? 's' : ''} affichée${visibleCount > 1 ? 's' : ''} dans la catégorie ${catName}.`
        : `${visibleCount} réalisation${visibleCount > 1 ? 's' : ''} affichée${visibleCount > 1 ? 's' : ''}.`;
    }
  }, [active, categories]);

  return (
    <div
      role="group"
      aria-label="Filtrer les réalisations par catégorie"
      class="flex flex-wrap gap-2 justify-center"
    >
      {all.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            aria-pressed={isActive}
            class={`group inline-flex items-center gap-2 h-11 px-4 text-sm font-semibold rounded-full whitespace-nowrap cursor-pointer transition-all duration-200 ease-out ${
              isActive
                ? 'bg-bleu-nuit text-blanc-casse shadow-card'
                : 'bg-blanc-casse text-bleu-nuit ring-1 ring-bleu-nuit/15 hover:ring-bleu-nuit/30 hover:-translate-y-0.5'
            }`}
          >
            <span>{cat.nom}</span>
            <span
              class={`text-xs font-medium tabular-nums ${
                isActive ? 'text-blanc-casse/70' : 'text-bleu-nuit/50'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
