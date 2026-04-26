/** @jsxImportSource preact */
import { useState, useMemo, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';

interface MenuItem {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  prix: number;
  photo?: string;
}

interface Category {
  titre: string;
  description: string;
}

interface PizzeriaInfo {
  nom: string;
  whatsapp: string;
}

interface Props {
  info: PizzeriaInfo;
  menu: Record<string, Category>;
  items: MenuItem[];
  zones: string[];
  horairesCommande: string[];
}

interface CartLine {
  item: MenuItem;
  qty: number;
}

const phoneRegex = /^[+]?[\d\s().-]{8,20}$/;

/**
 * PizzeriaShop — Menu (cards photo éditoriales) + Commander (panier + form sobres).
 * Direction trattoria éditoriale : pas de pills flashy, pas de boutons + agressifs.
 * Filtres en text-link sobres, cards avec photo 4:5 portrait, hover discret.
 */
export default function PizzeriaShop({ info, menu, items, zones, horairesCommande }: Props) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState<'emporter' | 'livraison'>('emporter');
  const categoryKeys = Object.keys(menu);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [pulseCart, setPulseCart] = useState(false);

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const item = items.find((i) => i.id === id);
          return item ? { item, qty } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [cart, items]
  );

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.item.prix * l.qty, 0),
    [lines]
  );

  const totalCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  );

  const addItem = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setPulseCart(true);
    setTimeout(() => setPulseCart(false), 600);
  };

  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: qty };
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--cart-count',
      String(totalCount)
    );
  }, [totalCount]);

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (totalCount === 0) return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get('website') as string)?.trim()) return;

    const data = {
      nom: ((fd.get('nom') as string) || '').trim(),
      telephone: ((fd.get('telephone') as string) || '').trim(),
      type: ((fd.get('type') as string) || '').trim(),
      adresse: ((fd.get('adresse') as string) || '').trim(),
      zone: ((fd.get('zone') as string) || '').trim(),
      heure: ((fd.get('heure') as string) || '').trim(),
      note: ((fd.get('note') as string) || '').trim(),
    };

    const errs: Record<string, string> = {};
    if (!data.nom) errs.nom = 'Veuillez indiquer votre nom.';
    if (!data.telephone) errs.telephone = 'Téléphone requis.';
    else if (!phoneRegex.test(data.telephone)) errs.telephone = 'Format de téléphone non reconnu.';
    if (!data.heure) errs.heure = 'Choisissez une heure.';
    if (data.type === 'livraison') {
      if (!data.adresse) errs.adresse = 'Adresse requise pour la livraison.';
      if (!data.zone) errs.zone = 'Choisissez une zone.';
    }

    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }

    const lignesMsg = lines.map((l) => `- ${l.qty}× ${l.item.nom}`).join('\n');
    const adresseLine = data.type === 'livraison' ? `Adresse : ${data.adresse}, ${data.zone}` : 'Type : À emporter';
    const noteLine = data.note ? `\n\nNote : ${data.note}` : '';

    const message = `Bonjour ${info.nom} 🍕

Je voudrais commander :
${lignesMsg}

${data.type === 'livraison' ? 'Type : Livraison' : 'Type : À emporter'}
${data.type === 'livraison' ? adresseLine : ''}
Heure souhaitée : ${data.heure}
Total estimé : ${total}€

Mon nom : ${data.nom}
Mon téléphone : ${data.telephone}${noteLine}`;

    const url = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(message.trim())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Items filtrés selon onglet actif
  const visibleItems = useMemo(
    () => (activeFilter === 'all' ? items : items.filter((i) => i.categorie === activeFilter)),
    [items, activeFilter]
  );

  // Séparation pizzas/desserts (avec photo) vs boissons (compact, sans photo)
  const itemsWithPhoto = visibleItems.filter((i) => i.photo);
  const itemsCompact = visibleItems.filter((i) => !i.photo);

  // ============== STYLES FORM ==============
  const inputBase = 'w-full h-12 px-4 text-base font-inter text-pizza-charbon bg-white rounded-sm ring-1 transition-all duration-200 placeholder:text-pizza-charbon/40';
  const inputOk = 'ring-pizza-charbon/15 focus:ring-2 focus:ring-pizza-rouge';
  const inputErr = 'ring-2 ring-pizza-rouge focus:ring-pizza-rouge';
  const labelBase = 'block text-xs font-semibold uppercase tracking-[0.15em] text-pizza-charbon/70 mb-2';
  const errClass = 'mt-1.5 text-xs text-pizza-rouge font-semibold';

  return (
    <>
      {/* ============================================================
           SECTION CARTE — éditoriale, cards photo
         ============================================================ */}
      <section id="carte" class="relative bg-white px-6 md:px-10 py-24 md:py-32">
        <div class="max-w-content mx-auto">

          {/* Header section */}
          <header class="text-center max-w-2xl mx-auto mb-16">
            <p class="scroll-reveal flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-pizza-rouge">
              <span class="inline-block w-8 h-px bg-pizza-rouge" aria-hidden="true"></span>
              <span>La carte</span>
              <span class="inline-block w-8 h-px bg-pizza-rouge" aria-hidden="true"></span>
            </p>
            <h2 class="scroll-reveal mt-5 font-playfair font-bold text-pizza-charbon leading-tight" style="font-size: clamp(40px, 5vw, 64px);">
              Préparées à la commande,
              <span class="block italic font-medium text-pizza-rouge">cuites au feu de bois.</span>
            </h2>
          </header>

          {/* Filtres : text-links sobres */}
          <nav class="scroll-reveal mb-14 -mx-6 overflow-x-auto scrollbar-none">
            <div class="px-6 flex justify-start md:justify-center gap-x-8 md:gap-x-10 min-w-max" role="group" aria-label="Filtrer la carte">
              {[{ id: 'all', label: 'Toutes' }, ...categoryKeys.map((k) => ({ id: k, label: menu[k].titre }))].map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    aria-pressed={isActive}
                    class={`relative pb-2 text-sm uppercase tracking-[0.2em] font-semibold transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-pizza-charbon' : 'text-pizza-charbon/45 hover:text-pizza-charbon/80'
                    }`}
                  >
                    {f.label}
                    <span
                      class={`absolute left-0 right-0 -bottom-px h-px bg-pizza-rouge origin-left transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Grille items avec photo (pizzas, desserts) */}
          {itemsWithPhoto.length > 0 && (
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
              {itemsWithPhoto.map((item, i) => {
                const inCart = cart[item.id] || 0;
                return (
                  <li key={item.id} class="scroll-reveal group" style={`transition-delay: ${(i % 3) * 80}ms`}>
                    {/* Photo 4:5 portrait */}
                    <div class="relative overflow-hidden rounded-sm bg-pizza-charbon/5" style="aspect-ratio: 4/5;">
                      <img
                        src={item.photo}
                        alt={item.nom}
                        loading="lazy"
                        decoding="async"
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      {/* Badge "Spécialité" pour les spéciales */}
                      {item.categorie === 'speciales' && (
                        <span class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-pizza-rouge text-pizza-creme text-[10px] font-semibold uppercase tracking-[0.2em]">
                          Spécialité
                        </span>
                      )}
                      {/* Badge quantité si en panier */}
                      {inCart > 0 && (
                        <span class="absolute top-4 right-4 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-pizza-charbon text-pizza-creme text-xs font-bold tabular-nums">
                          ×{inCart}
                        </span>
                      )}
                    </div>

                    {/* Détails */}
                    <div class="mt-5 px-1">
                      <div class="flex items-baseline gap-3">
                        <h3 class="font-playfair font-semibold text-xl text-pizza-charbon leading-snug">
                          {item.nom}
                        </h3>
                        <span class="flex-1 mb-1.5 border-b border-dotted border-pizza-dore/50" aria-hidden="true" />
                        <span class="font-playfair font-bold text-xl text-pizza-rouge tabular-nums whitespace-nowrap">
                          {item.prix}€
                        </span>
                      </div>
                      {item.description && (
                        <p class="mt-2 text-sm text-pizza-charbon/70 italic leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
                        class="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-pizza-charbon hover:text-pizza-rouge transition-colors group/btn cursor-pointer"
                        aria-label={`Ajouter ${item.nom} au panier`}
                      >
                        <span class="relative">
                          Ajouter
                          <span class="absolute left-0 right-0 -bottom-0.5 h-px bg-pizza-rouge origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300" aria-hidden="true" />
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Items compacts (boissons) — version "carte des vins" 2 colonnes */}
          {itemsCompact.length > 0 && (
            <div class={itemsWithPhoto.length > 0 ? 'mt-20 pt-16 border-t border-pizza-dore/30' : ''}>
              {itemsWithPhoto.length > 0 && activeFilter === 'all' && (
                <h3 class="font-playfair font-bold text-2xl md:text-3xl text-pizza-charbon mb-8 text-center italic">
                  Boissons
                </h3>
              )}
              <ul class="grid sm:grid-cols-2 gap-x-12 gap-y-3 max-w-3xl mx-auto">
                {itemsCompact.map((item) => {
                  const inCart = cart[item.id] || 0;
                  return (
                    <li key={item.id} class="scroll-reveal group flex items-baseline gap-3 py-3 border-b border-pizza-charbon/10">
                      <span class="font-playfair text-pizza-charbon flex-1 min-w-0">
                        <span class="font-semibold">{item.nom}</span>
                        {item.description && <span class="ml-2 italic text-sm text-pizza-charbon/55">{item.description}</span>}
                      </span>
                      <span class="font-playfair font-bold text-pizza-rouge tabular-nums whitespace-nowrap">
                        {item.prix}€
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
                        class="ml-2 w-8 h-8 flex items-center justify-center rounded-full text-pizza-charbon/40 hover:text-pizza-rouge hover:bg-pizza-rouge/5 transition-all cursor-pointer"
                        aria-label={`Ajouter ${item.nom} au panier`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        {inCart > 0 && (
                          <span class="absolute ml-6 -mt-3 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-pizza-rouge text-pizza-creme text-[9px] font-bold">
                            {inCart}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
           SECTION COMMANDER — refonte au commit 5
         ============================================================ */}
      <section id="commander" class="relative bg-pizza-creme/50 py-24 md:py-32 px-6">
        <div class="max-w-content mx-auto text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-pizza-rouge mb-4">Commander</p>
          <h2 class="font-playfair font-bold text-3xl md:text-5xl text-pizza-charbon">
            <span class="italic font-medium text-pizza-charbon/40">— Refonte au commit suivant —</span>
          </h2>
          {totalCount > 0 && (
            <p class="mt-6 text-pizza-charbon/70">
              {totalCount} article{totalCount > 1 ? 's' : ''} dans votre panier · {total}€
            </p>
          )}
        </div>
      </section>

      {/* Sticky bottom bar mobile */}
      {totalCount > 0 && (
        <a
          id="pizzeria-bottom-bar"
          href="#commander"
          class="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 h-16 px-5 bg-pizza-charbon text-pizza-creme border-t border-pizza-dore/30 transition-transform duration-300 ease-out"
        >
          <span class="flex items-center gap-3">
            <span class={`inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-pizza-rouge text-pizza-creme text-sm font-bold ${pulseCart ? 'animate-cart-pulse' : ''}`}>
              {totalCount}
            </span>
            <span class="text-sm font-semibold tabular-nums">{total}€</span>
          </span>
          <span class="inline-flex items-center justify-center h-11 px-5 rounded-full bg-pizza-rouge text-pizza-creme font-semibold text-sm">
            Commander →
          </span>
        </a>
      )}
    </>
  );
}
