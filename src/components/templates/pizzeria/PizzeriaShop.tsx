/** @jsxImportSource preact */
import { useState, useMemo, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';

interface MenuItem {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  prix: number;
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
 * PizzeriaShop — Menu + Cart + OrderForm, un seul island Preact.
 * État du panier partagé naturellement via useState (pas besoin de signals).
 */
export default function PizzeriaShop({ info, menu, items, zones, horairesCommande }: Props) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState<'emporter' | 'livraison'>('emporter');
  const categoryKeys = Object.keys(menu);
  const [activeTab, setActiveTab] = useState<string>(categoryKeys[0]);
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

  const addItem = (id: string, name?: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setPulseCart(true);
    setTimeout(() => setPulseCart(false), 600);
    if (name) {
      setFeedback(`+ ${name} ajouté`);
      setTimeout(() => setFeedback(null), 1800);
    }
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

  // Sticky bottom bar mobile (visible quand panier non vide)
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

    // Honeypot
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

    // Génération du message WhatsApp
    const lignesMsg = lines
      .map((l) => `- ${l.qty}× ${l.item.nom}`)
      .join('\n');
    const adresseLine =
      data.type === 'livraison'
        ? `Adresse : ${data.adresse}, ${data.zone}`
        : 'Type : À emporter';
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

  // ============== RENDU ==============
  const inputBase =
    'w-full h-12 px-4 text-base font-inter text-pizza-charbon bg-white rounded-xl ring-1 transition-all duration-200 placeholder:text-pizza-charbon/40';
  const inputOk = 'ring-pizza-charbon/15 focus:ring-2 focus:ring-pizza-tomate';
  const inputErr = 'ring-2 ring-pizza-tomate focus:ring-pizza-tomate';
  const labelBase = 'block text-sm font-semibold text-pizza-charbon mb-2';
  const errClass = 'mt-1.5 text-xs text-pizza-tomate font-semibold';

  return (
    <div>
      {/* ============== MENU (fond blanc, lumineux, lisible) ============== */}
      <section id="menu" class="relative px-6 py-20 md:py-28 bg-pizza-blanc text-pizza-charbon">
        <div class="mx-auto max-w-content">
          <div class="text-center max-w-2xl mx-auto">
            <p class="inline-flex items-center px-3 py-1.5 rounded-full bg-pizza-rouge text-white text-xs font-semibold uppercase tracking-wide">
              Notre carte
            </p>
            <h2 class="mt-4 font-playfair font-bold text-4xl md:text-6xl text-pizza-charbon leading-tight">
              Préparées à la commande
            </h2>
            <p class="mt-5 text-lg text-pizza-charbon/70 leading-relaxed">
              Cuites au feu de bois, prêtes en 25 minutes.
            </p>
          </div>

          {/* Onglets pill — scroll horizontal en mobile */}
          <div class="mt-12 -mx-6 overflow-x-auto scrollbar-none">
            <div class="px-6 flex justify-start md:justify-center gap-2 min-w-max">
              {categoryKeys.map((key) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    aria-pressed={isActive}
                    class={`inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-pizza-rouge text-white shadow-card'
                        : 'bg-pizza-creme text-pizza-charbon ring-1 ring-pizza-charbon/10 hover:bg-pizza-rouge/10 hover:ring-pizza-rouge/30'
                    }`}
                  >
                    {menu[key].titre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catégorie active */}
          {categoryKeys.map((catKey) => {
            if (catKey !== activeTab) return null;
            const catItems = items.filter((i) => i.categorie === catKey);
            // Illustrations SVG par catégorie
            const catIcons: Record<string, string> = {
              classiques: '<circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/><circle cx="24" cy="26" r="3" fill="currentColor" opacity="0.7"/><circle cx="40" cy="30" r="3" fill="currentColor" opacity="0.7"/><circle cx="28" cy="40" r="3" fill="currentColor" opacity="0.7"/>',
              speciales: '<path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" fill="currentColor" opacity="0.85"/>',
              desserts: '<path d="M14 38 Q14 28 32 28 Q50 28 50 38 L48 52 Q48 56 44 56 L20 56 Q16 56 16 52 Z" fill="currentColor" opacity="0.85"/><circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.6"/><circle cx="32" cy="16" r="4" fill="currentColor" opacity="0.7"/><circle cx="42" cy="22" r="4" fill="currentColor" opacity="0.6"/>',
              boissons: '<path d="M22 12 L42 12 L40 50 Q40 56 32 56 Q24 56 24 50 Z" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M22 22 L42 22" stroke="currentColor" stroke-width="1" opacity="0.5"/><ellipse cx="32" cy="22" rx="9" ry="3" fill="currentColor" opacity="0.4"/>',
            };
            const catIcon = catIcons[catKey] || catIcons.classiques;
            return (
              <div key={catKey} class="mt-12 menu-tab-content max-w-3xl mx-auto">
                <div class="flex items-end justify-between mb-2 pb-3 border-b-2 border-pizza-dore/40">
                  <h3 class="font-playfair font-bold text-3xl md:text-4xl text-pizza-rouge">{menu[catKey].titre}</h3>
                  <svg width="48" height="48" viewBox="0 0 64 64" class="text-pizza-dore opacity-80" fill="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: catIcon }} />
                </div>
                <p class="italic text-pizza-charbon/60 text-sm mb-6">{menu[catKey].description}</p>

                <ul class="divide-y divide-pizza-charbon/10">
                  {catItems.map((item) => {
                    const inCart = cart[item.id] || 0;
                    return (
                      <li
                        key={item.id}
                        class="group flex items-start gap-4 py-5 px-3 -mx-3 rounded-xl transition-colors duration-150 md:hover:bg-pizza-creme"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-baseline gap-3">
                            <h4 class="font-playfair font-semibold text-lg text-pizza-charbon">{item.nom}</h4>
                            {inCart > 0 && (
                              <span class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-pizza-rouge text-white text-xs font-bold">
                                ×{inCart}
                              </span>
                            )}
                            {/* Pointillés dorés */}
                            <span class="hidden sm:flex flex-1 mb-1.5 items-center" aria-hidden="true">
                              <span class="w-full border-b border-dotted border-pizza-dore/60"></span>
                            </span>
                            <span class="font-playfair font-bold text-lg text-pizza-rouge whitespace-nowrap shrink-0">{item.prix}€</span>
                          </div>
                          {item.description && (
                            <p class="mt-1.5 text-sm text-pizza-charbon/65 italic leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => addItem(item.id, item.nom)}
                          class="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-pizza-rouge text-white hover:bg-[#A50D26] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-card"
                          aria-label={`Ajouter ${item.nom} au panier`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Feedback flottant */}
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-full bg-pizza-rouge text-white text-sm font-semibold shadow-card-hover animate-feedback"
          >
            {feedback}
          </div>
        )}
      </section>

      {/* ============== COMMANDER (fond crème) ============== */}
      <section id="commander" class="relative px-6 py-20 md:py-28 bg-pizza-creme text-pizza-charbon">
        <div class="mx-auto max-w-content">
          <div class="text-center max-w-2xl mx-auto">
            <p class="inline-flex items-center px-3 py-1.5 rounded-full bg-pizza-tomate text-white text-xs font-semibold uppercase tracking-wide">
              Commander
            </p>
            <h2 class="mt-4 font-playfair font-bold text-4xl md:text-6xl text-pizza-charbon leading-tight">
              Composez votre commande
            </h2>
            <p class="mt-5 text-lg text-pizza-charbon/75 leading-relaxed">
              On vous confirme l'heure exacte par WhatsApp en moins de 5 minutes.
            </p>
          </div>

          <div class="mt-12 grid lg:grid-cols-12 gap-8">
            {/* === Colonne gauche : panier (40%) === */}
            <aside class="lg:col-span-5">
              <div class="bg-white rounded-2xl ring-1 ring-pizza-charbon/10 shadow-card p-6 md:p-7 lg:sticky lg:top-24 border-t-[3px] border-pizza-rouge">
                <h3 class="font-playfair font-bold text-2xl text-pizza-charbon flex items-center gap-2">
                  <span>Votre panier</span>
                  {totalCount > 0 && (
                    <span class={`inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-pizza-tomate text-white text-sm font-bold ${pulseCart ? 'animate-cart-pulse' : ''}`}>
                      {totalCount}
                    </span>
                  )}
                </h3>
                {totalCount === 0 ? (
                  <div class="mt-6 text-center py-8">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" class="mx-auto" aria-hidden="true">
                      <ellipse cx="40" cy="58" rx="32" ry="3" fill="#1A1A1A" opacity="0.08" />
                      <ellipse cx="40" cy="40" rx="30" ry="8" fill="none" stroke="#1A1A1A" stroke-width="1.5" opacity="0.25" />
                      <ellipse cx="40" cy="40" rx="22" ry="5" fill="none" stroke="#1A1A1A" stroke-width="1" opacity="0.18" stroke-dasharray="3 3" />
                      <path d="M28 40 Q32 36 36 40 Q40 44 44 40 Q48 36 52 40" stroke="#C8102E" stroke-width="1.25" fill="none" opacity="0.4" />
                    </svg>
                    <p class="mt-4 font-playfair font-semibold text-pizza-charbon">Votre panier est vide</p>
                    <p class="mt-2 text-sm text-pizza-charbon/65">
                      Ajoutez vos pizzas, desserts et boissons depuis le menu ci-dessus.
                    </p>
                  </div>
                ) : (
                  <>
                    <ul class="mt-5 space-y-4">
                      {lines.map((line) => (
                        <li key={line.item.id} class="pb-4 border-b border-pizza-charbon/10 last:border-b-0 last:pb-0">
                          <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                              <p class="font-playfair font-semibold text-base text-pizza-charbon leading-snug">{line.item.nom}</p>
                              <p class="text-xs text-pizza-charbon/60 mt-0.5">{line.item.prix}€ l'unité</p>
                            </div>
                            <p class="font-playfair font-bold text-pizza-tomate whitespace-nowrap shrink-0">
                              {line.item.prix * line.qty}€
                            </p>
                          </div>
                          <div class="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty - 1)}
                              aria-label={`Retirer ${line.item.nom}`}
                              class="w-8 h-8 flex items-center justify-center rounded-full bg-pizza-creme hover:bg-pizza-tomate hover:text-white text-pizza-charbon font-bold transition-colors cursor-pointer ring-1 ring-pizza-charbon/15"
                            >
                              −
                            </button>
                            <span class="min-w-[2rem] text-center font-semibold tabular-nums text-sm">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty + 1)}
                              aria-label={`Ajouter ${line.item.nom}`}
                              class="w-8 h-8 flex items-center justify-center rounded-full bg-pizza-creme hover:bg-pizza-tomate hover:text-white text-pizza-charbon font-bold transition-colors cursor-pointer ring-1 ring-pizza-charbon/15"
                            >
                              +
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div class="mt-6 pt-5 border-t-2 border-pizza-tomate flex items-baseline justify-between">
                      <span class="text-sm font-semibold uppercase tracking-wide text-pizza-charbon/70">Total estimé</span>
                      <span class="font-playfair font-bold text-4xl text-pizza-tomate">{total}€</span>
                    </div>
                  </>
                )}
              </div>
            </aside>

            {/* === Colonne droite : formulaire (60%) === */}
            <div class="lg:col-span-7">
              <form
                onSubmit={onSubmit}
                noValidate
                class="bg-white rounded-2xl ring-1 ring-pizza-charbon/10 shadow-card p-6 md:p-7 space-y-5"
                aria-label="Formulaire de commande"
              >
                {/* Honeypot */}
                <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
                  <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
                </div>

                <div class="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label for="po-nom" class={labelBase}>Nom <span class="text-pizza-tomate">*</span></label>
                    <input id="po-nom" name="nom" type="text" required autocomplete="name"
                      class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
                      placeholder="Votre nom"
                    />
                    {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
                  </div>
                  <div>
                    <label for="po-tel" class={labelBase}>Téléphone <span class="text-pizza-tomate">*</span></label>
                    <input id="po-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
                      class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
                      placeholder="0692 00 00 00"
                    />
                    {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
                  </div>
                </div>

                {/* Type : à emporter / livraison — cartes cliquables avec icônes */}
                <fieldset>
                  <legend class={labelBase}>Type <span class="text-pizza-tomate">*</span></legend>
                  <div class="grid grid-cols-2 gap-3">
                    {[
                      {
                        v: 'emporter',
                        l: 'À emporter',
                        // Sac/cabas
                        svg: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
                      },
                      {
                        v: 'livraison',
                        l: 'Livraison',
                        // Scooter / vespa
                        svg: '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 18H4a1 1 0 0 1-1-1v-3l2-5h8l4 6v3h-2"/><path d="M14 9V5a1 1 0 0 1 1-1h2"/>',
                      },
                    ].map((opt) => {
                      const isSel = type === opt.v;
                      return (
                        <label
                          key={opt.v}
                          class={`relative flex flex-col items-center justify-center gap-2 h-24 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                            isSel
                              ? 'bg-pizza-tomate/10 text-pizza-tomate ring-2 ring-pizza-tomate'
                              : 'bg-white text-pizza-charbon ring-1 ring-pizza-charbon/15 hover:ring-pizza-charbon/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={opt.v}
                            checked={isSel}
                            onChange={() => setType(opt.v as 'emporter' | 'livraison')}
                            required
                            class="sr-only"
                          />
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: opt.svg }} />
                          <span>{opt.l}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {type === 'livraison' && (
                  <div class="grid sm:grid-cols-3 gap-5">
                    <div class="sm:col-span-2">
                      <label for="po-adr" class={labelBase}>Adresse <span class="text-pizza-tomate">*</span></label>
                      <input id="po-adr" name="adresse" type="text" autocomplete="street-address"
                        class={`${inputBase} ${errors.adresse ? inputErr : inputOk}`}
                        placeholder="N° et nom de rue"
                      />
                      {errors.adresse && <p role="alert" class={errClass}>{errors.adresse}</p>}
                    </div>
                    <div>
                      <label for="po-zone" class={labelBase}>Zone <span class="text-pizza-tomate">*</span></label>
                      <select
                        id="po-zone"
                        name="zone"
                        defaultValue=""
                        class={`${inputBase} ${errors.zone ? inputErr : inputOk} appearance-none bg-no-repeat`}
                        style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231A1A1A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0.75rem center; background-size: 16px; padding-right: 2.25rem;"
                      >
                        <option value="" disabled>Choisir…</option>
                        {zones.map((z) => (<option value={z} key={z}>{z}</option>))}
                      </select>
                      {errors.zone && <p role="alert" class={errClass}>{errors.zone}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label for="po-heure" class={labelBase}>Heure souhaitée <span class="text-pizza-tomate">*</span></label>
                  <select
                    id="po-heure"
                    name="heure"
                    defaultValue=""
                    class={`${inputBase} ${errors.heure ? inputErr : inputOk} appearance-none bg-no-repeat`}
                    style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231A1A1A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 16px; padding-right: 2.5rem;"
                  >
                    <option value="" disabled>Choisir une heure…</option>
                    {horairesCommande.map((h) => (<option value={h} key={h}>{h}</option>))}
                  </select>
                  {errors.heure && <p role="alert" class={errClass}>{errors.heure}</p>}
                </div>

                <div>
                  <label for="po-note" class={labelBase}>Note <span class="text-pizza-charbon/70 font-normal">(allergies, demandes spéciales)</span></label>
                  <textarea id="po-note" name="note" rows={3}
                    class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
                    placeholder="Sans olives, peu de piment…"
                  ></textarea>
                </div>

                <div class="flex items-start gap-3 rounded-xl bg-pizza-bois/10 ring-1 ring-pizza-bois/25 p-4 text-sm text-pizza-charbon leading-relaxed">
                  <span class="flex w-8 h-8 shrink-0 rounded-full bg-pizza-bois/20 text-pizza-bois items-center justify-center mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </span>
                  <p>
                    <strong class="font-semibold">Cliquez sur « Envoyer ma commande sur WhatsApp » pour finaliser.</strong>
                    {' '}Le pizzaiolo vous confirmera l'heure exacte de retrait/livraison directement par message.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={totalCount === 0}
                  class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-base md:text-lg font-playfair font-semibold rounded-full bg-[#075E54] text-white shadow-card hover:bg-[#054039] hover:shadow-card-hover transition-all disabled:bg-pizza-charbon/30 disabled:text-white/60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06a6.79 6.79 0 0 1-2-1.23 7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01a.93.93 0 0 0-.67.31 2.81 2.81 0 0 0-.87 2.08c0 1.23.89 2.41 1.02 2.58.12.17 1.76 2.7 4.27 3.78.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
                  </svg>
                  {totalCount === 0
                    ? 'Ajoutez au moins un produit pour commander'
                    : `Envoyer ma commande sur WhatsApp · ${total}€`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom bar mobile : se cache dans #commander via IO global */}
      {totalCount > 0 && (
        <a
          id="pizzeria-bottom-bar"
          href="#commander"
          class="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 h-16 px-5 bg-pizza-charbon text-white border-t border-pizza-rouge/30 transition-transform duration-300 ease-out"
        >
          <span class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-pizza-rouge text-white text-sm font-bold">
              {totalCount}
            </span>
            <span class="text-sm font-semibold">{total}€</span>
          </span>
          <span class="inline-flex items-center justify-center h-11 px-5 rounded-full bg-pizza-rouge text-white font-semibold">
            Commander
          </span>
        </a>
      )}
    </div>
  );
}
