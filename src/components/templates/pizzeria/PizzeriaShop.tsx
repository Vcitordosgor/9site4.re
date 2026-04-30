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
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

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
    setJustAddedId(id);
    setTimeout(() => setPulseCart(false), 600);
    setTimeout(() => setJustAddedId((curr) => (curr === id ? null : curr)), 700);
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

  // Regroupement par catégorie pour affichage structuré (utile quand filtre = "all")
  const itemsByCategory = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const item of visibleItems) {
      (map[item.categorie] ??= []).push(item);
    }
    return map;
  }, [visibleItems]);

  // Composant ligne item — réutilisé partout (rendu uniforme)
  const renderItem = (item: MenuItem) => {
    const inCart = cart[item.id] || 0;
    const isJustAdded = justAddedId === item.id;
    return (
      <li key={item.id} class="group py-5 first:pt-0 border-b border-pizza-charbon/10 last:border-b-0">
        <div class="flex items-baseline gap-3">
          <h4 class="font-playfair font-semibold text-lg text-pizza-charbon leading-snug">
            {item.nom}
          </h4>
          <span class="flex-1 mb-1.5 border-b border-dotted border-pizza-dore/55" aria-hidden="true" />
          <span class="font-playfair font-bold text-lg text-pizza-rouge tabular-nums whitespace-nowrap">
            {item.prix}€
          </span>
        </div>
        {item.description && (
          <p class="mt-1.5 text-sm text-pizza-charbon/70 italic leading-relaxed pr-2">
            {item.description}
          </p>
        )}
        <div class="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => addItem(item.id)}
            aria-label={`Ajouter ${item.nom} au panier`}
            class={`group/btn relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer ${
              isJustAdded ? 'text-pizza-rouge' : 'text-pizza-charbon/80 hover:text-pizza-rouge'
            }`}
          >
            <span class="relative">
              {isJustAdded ? 'Ajouté' : 'Ajouter'}
              <span
                class={`absolute left-0 right-0 -bottom-0.5 h-px bg-pizza-rouge origin-left transition-transform duration-300 ${
                  isJustAdded ? 'scale-x-100' : 'scale-x-0 group-hover/btn:scale-x-100'
                }`}
                aria-hidden="true"
              />
            </span>
            {isJustAdded ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            )}
          </button>
          {inCart > 0 && (
            <span
              class={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-pizza-charbon text-pizza-creme text-[11px] font-bold tabular-nums tracking-normal transition-transform duration-300 ${
                isJustAdded ? 'scale-110' : 'scale-100'
              }`}
              aria-label={`${inCart} dans le panier`}
            >
              ×{inCart}
            </span>
          )}
        </div>
      </li>
    );
  };

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

          {/* Carte format restaurant : par catégorie quand "Toutes", sinon liste plate */}
          <div class="max-w-5xl mx-auto space-y-16">
            {categoryKeys.map((catKey) => {
              const catItems = itemsByCategory[catKey];
              if (!catItems || catItems.length === 0) return null;
              return (
                <section key={catKey} class="scroll-reveal">
                  {/* Titre de catégorie + filet doré */}
                  <header class="mb-8 text-center">
                    <h3 class="font-playfair font-bold text-pizza-charbon italic" style="font-size: clamp(28px, 3vw, 36px);">
                      {menu[catKey].titre}
                    </h3>
                    <p class="mt-2 text-sm text-pizza-charbon/55 italic">
                      {menu[catKey].description}
                    </p>
                    <div class="mt-5 mx-auto w-12 h-px bg-pizza-dore" aria-hidden="true" />
                  </header>

                  {/* Items en 2 colonnes desktop, 1 col mobile */}
                  <ul class="grid md:grid-cols-2 gap-x-12 gap-y-0">
                    {catItems.map((item) => renderItem(item))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
           SECTION COMMANDER — utilitaire sobre, focus conversion
         ============================================================ */}
      <section id="commander" class="relative bg-pizza-creme/40 py-24 md:py-32 px-6 md:px-10 border-y border-pizza-dore/30">
        <div class="max-w-content mx-auto">
          <header class="text-center max-w-2xl mx-auto mb-14">
            <p class="scroll-reveal flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-pizza-rouge">
              <span class="inline-block w-8 h-px bg-pizza-rouge" aria-hidden="true"></span>
              <span>Commander</span>
              <span class="inline-block w-8 h-px bg-pizza-rouge" aria-hidden="true"></span>
            </p>
            <h2 class="scroll-reveal mt-5 font-playfair font-bold text-pizza-charbon leading-tight" style="font-size: clamp(36px, 4.5vw, 56px);">
              On vous confirme par WhatsApp.
            </h2>
            <p class="scroll-reveal mt-4 text-pizza-charbon/70 leading-relaxed">
              Composez votre commande, on confirme l'heure exacte de retrait ou de livraison en moins de 5 minutes.
            </p>
          </header>

          <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* === Panier (5 cols desktop) === */}
            <aside class="lg:col-span-5">
              <div class="bg-white rounded-sm p-7 md:p-8 ring-1 ring-pizza-charbon/10 lg:sticky lg:top-24"
                   style="box-shadow: 0 1px 3px rgb(28 26 23 / 0.04);">
                <h3 class="flex items-baseline justify-between gap-2">
                  <span class="font-playfair font-semibold text-2xl text-pizza-charbon">Votre table</span>
                  {totalCount > 0 && (
                    <span class="text-sm uppercase tracking-[0.18em] text-pizza-charbon/50 tabular-nums">
                      {totalCount} article{totalCount > 1 ? 's' : ''}
                    </span>
                  )}
                </h3>

                {totalCount === 0 ? (
                  <div class="mt-8 text-center py-10">
                    {/* Illustration assiette vide minimale */}
                    <svg width="72" height="72" viewBox="0 0 80 80" fill="none" class="mx-auto" aria-hidden="true">
                      <ellipse cx="40" cy="62" rx="30" ry="2.5" fill="#1C1A17" opacity="0.06" />
                      <ellipse cx="40" cy="42" rx="32" ry="9" fill="none" stroke="#1C1A17" stroke-width="1.25" opacity="0.30" />
                      <ellipse cx="40" cy="42" rx="22" ry="5.5" fill="none" stroke="#B89766" stroke-width="0.75" opacity="0.55" stroke-dasharray="2 3" />
                    </svg>
                    <p class="mt-5 font-playfair italic text-pizza-charbon/70" style="font-size: 17px;">
                      Votre panier est vide.
                    </p>
                    <p class="mt-2 text-sm text-pizza-charbon/70">
                      Ajoutez vos plats depuis la carte ci-dessus.
                    </p>
                  </div>
                ) : (
                  <>
                    <ul class="mt-6 divide-y divide-pizza-charbon/10">
                      {lines.map((line) => (
                        <li key={line.item.id} class="py-4 first:pt-0 last:pb-0">
                          <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                              <p class="font-playfair font-semibold text-pizza-charbon leading-snug">{line.item.nom}</p>
                              <p class="text-xs text-pizza-charbon/55 mt-0.5 tabular-nums">{line.item.prix}€ × {line.qty}</p>
                            </div>
                            <p class="font-playfair font-bold text-pizza-rouge tabular-nums whitespace-nowrap shrink-0">
                              {line.item.prix * line.qty}€
                            </p>
                          </div>
                          <div class="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty - 1)}
                              aria-label={`Retirer ${line.item.nom}`}
                              class="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-pizza-creme hover:bg-pizza-rouge hover:text-pizza-creme text-pizza-charbon transition-colors cursor-pointer ring-1 ring-pizza-charbon/10"
                            >
                              −
                            </button>
                            <span class="min-w-[2rem] text-center font-semibold tabular-nums text-sm">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty + 1)}
                              aria-label={`Ajouter ${line.item.nom}`}
                              class="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-pizza-creme hover:bg-pizza-rouge hover:text-pizza-creme text-pizza-charbon transition-colors cursor-pointer ring-1 ring-pizza-charbon/10"
                            >
                              +
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div class="mt-6 pt-5 border-t-2 border-pizza-dore flex items-baseline justify-between">
                      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-pizza-charbon/65">Total estimé</span>
                      <span class="font-playfair font-bold text-pizza-rouge tabular-nums" style="font-size: 36px;">{total}€</span>
                    </div>
                  </>
                )}
              </div>
            </aside>

            {/* === Formulaire (7 cols desktop) === */}
            <div class="lg:col-span-7">
              <form
                onSubmit={onSubmit}
                noValidate
                class="bg-white rounded-sm p-6 md:p-8 ring-1 ring-pizza-charbon/10 space-y-6"
                style="box-shadow: 0 1px 3px rgb(28 26 23 / 0.04);"
                aria-label="Formulaire de commande"
              >
                {/* Honeypot */}
                <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">
                  <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autocomplete="off" /></label>
                </div>

                <div class="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label for="po-nom" class={labelBase}>Nom</label>
                    <input id="po-nom" name="nom" type="text" required autocomplete="name"
                      class={`${inputBase} ${errors.nom ? inputErr : inputOk}`}
                      placeholder="Marie Dupont"
                    />
                    {errors.nom && <p role="alert" class={errClass}>{errors.nom}</p>}
                  </div>
                  <div>
                    <label for="po-tel" class={labelBase}>Téléphone</label>
                    <input id="po-tel" name="telephone" type="tel" inputMode="tel" required autocomplete="tel"
                      class={`${inputBase} ${errors.telephone ? inputErr : inputOk}`}
                      placeholder="0692 00 00 00"
                    />
                    {errors.telephone && <p role="alert" class={errClass}>{errors.telephone}</p>}
                  </div>
                </div>

                {/* Type : à emporter / livraison — radios sobres */}
                <fieldset>
                  <legend class={labelBase}>Type de commande</legend>
                  <div class="grid grid-cols-2 gap-3">
                    {[
                      { v: 'emporter', l: 'À emporter' },
                      { v: 'livraison', l: 'Livraison' },
                    ].map((opt) => {
                      const isSel = type === opt.v;
                      return (
                        <label
                          key={opt.v}
                          class={`relative flex items-center justify-center h-14 rounded-sm text-sm font-semibold cursor-pointer transition-all ${
                            isSel
                              ? 'bg-pizza-rouge/8 text-pizza-rouge ring-2 ring-pizza-rouge'
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
                          <span class="uppercase tracking-[0.15em]">{opt.l}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {type === 'livraison' && (
                  <div class="grid sm:grid-cols-3 gap-5">
                    <div class="sm:col-span-2">
                      <label for="po-adr" class={labelBase}>Adresse</label>
                      <input id="po-adr" name="adresse" type="text" autocomplete="street-address"
                        class={`${inputBase} ${errors.adresse ? inputErr : inputOk}`}
                        placeholder="N° et nom de rue"
                      />
                      {errors.adresse && <p role="alert" class={errClass}>{errors.adresse}</p>}
                    </div>
                    <div>
                      <label for="po-zone" class={labelBase}>Zone</label>
                      <select
                        id="po-zone" name="zone" defaultValue=""
                        class={`${inputBase} ${errors.zone ? inputErr : inputOk} appearance-none bg-no-repeat`}
                        style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231C1A17' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0.75rem center; background-size: 14px; padding-right: 2.25rem;"
                      >
                        <option value="" disabled>Choisir…</option>
                        {zones.map((z) => (<option value={z} key={z}>{z}</option>))}
                      </select>
                      {errors.zone && <p role="alert" class={errClass}>{errors.zone}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label for="po-heure" class={labelBase}>Heure souhaitée</label>
                  <select
                    id="po-heure" name="heure" defaultValue=""
                    class={`${inputBase} ${errors.heure ? inputErr : inputOk} appearance-none bg-no-repeat`}
                    style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231C1A17' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 1rem center; background-size: 14px; padding-right: 2.5rem;"
                  >
                    <option value="" disabled>Choisir une heure…</option>
                    {horairesCommande.map((h) => (<option value={h} key={h}>{h}</option>))}
                  </select>
                  {errors.heure && <p role="alert" class={errClass}>{errors.heure}</p>}
                </div>

                <div>
                  <label for="po-note" class={labelBase}>Note <span class="lowercase tracking-normal text-pizza-charbon/65 font-normal">(optionnel)</span></label>
                  <textarea id="po-note" name="note" rows={3}
                    class={`${inputBase} ${inputOk} h-auto py-3 resize-y`}
                    placeholder="Allergies, préférences, demandes spéciales…"
                  ></textarea>
                </div>

                {/* Mention info — sobre */}
                <p class="flex items-start gap-3 text-sm text-pizza-charbon/65 leading-relaxed">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5 text-pizza-dore" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <span>
                    Cliquez sur <strong class="font-semibold text-pizza-charbon">« Envoyer sur WhatsApp »</strong> pour finaliser. Le pizzaiolo confirmera l'heure exacte par message.
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={totalCount === 0}
                  class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-base font-semibold uppercase tracking-[0.18em] rounded-sm bg-pizza-charbon text-pizza-creme hover:bg-pizza-rouge transition-all disabled:bg-pizza-charbon/25 disabled:text-pizza-creme/60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83 8.25 8.25 0 0 1-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06a6.79 6.79 0 0 1-2-1.23 7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01a.93.93 0 0 0-.67.31 2.81 2.81 0 0 0-.87 2.08c0 1.23.89 2.41 1.02 2.58.12.17 1.76 2.7 4.27 3.78.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
                  </svg>
                  {totalCount === 0 ? 'Ajoutez un plat pour commander' : `Envoyer · ${total}€`}
                </button>
              </form>
            </div>
          </div>
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
