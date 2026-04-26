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
      {/* ============== MENU (fond charbon, onglets, items en lignes) ============== */}
      <section id="menu" class="relative px-6 py-20 md:py-28 bg-pizza-charbon text-white">
        <div class="mx-auto max-w-content">
          <div class="text-center max-w-2xl mx-auto">
            <p class="inline-flex items-center px-3 py-1.5 rounded-full bg-pizza-tomate text-white text-xs font-semibold uppercase tracking-wide">
              Notre carte
            </p>
            <h2 class="mt-4 font-playfair font-bold text-4xl md:text-6xl leading-tight">
              Préparées à la commande
            </h2>
            <p class="mt-5 text-lg text-white/70 leading-relaxed">
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
                        ? 'bg-pizza-tomate text-white shadow-card'
                        : 'bg-white/5 text-white/70 ring-1 ring-white/10 hover:text-white hover:ring-white/30'
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
            return (
              <div key={catKey} class="mt-12 menu-tab-content">
                <p class="text-center italic text-white/60 mb-8">{menu[catKey].description}</p>
                <ul class="max-w-3xl mx-auto divide-y divide-white/10">
                  {catItems.map((item) => {
                    const inCart = cart[item.id] || 0;
                    return (
                      <li
                        key={item.id}
                        class="group flex items-center gap-4 py-5 px-3 -mx-3 rounded-xl transition-colors duration-150 md:hover:bg-white/[0.04]"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-baseline gap-3 flex-wrap">
                            <h4 class="font-playfair font-semibold text-lg md:text-xl text-white">{item.nom}</h4>
                            {inCart > 0 && (
                              <span class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-pizza-tomate text-white text-xs font-bold">
                                ×{inCart}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p class="mt-1 text-sm text-white/65 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <span class="font-playfair font-bold text-lg md:text-xl text-pizza-bois whitespace-nowrap shrink-0">{item.prix}€</span>
                        <button
                          type="button"
                          onClick={() => addItem(item.id, item.nom)}
                          class="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-pizza-tomate text-white hover:bg-[#A50D26] active:scale-95 transition-all cursor-pointer shadow-card"
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
            class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-full bg-pizza-tomate text-white text-sm font-semibold shadow-card-hover animate-feedback"
          >
            {feedback}
          </div>
        )}
      </section>

      {/* ============== COMMANDER ============== */}
      <section id="commander" class="relative px-6 py-20 md:py-28 bg-pizza-charbon text-pizza-creme">
        <div class="mx-auto max-w-content">
          <div class="text-center max-w-2xl mx-auto">
            <p class="inline-flex items-center px-3 py-1.5 rounded-full bg-pizza-bois text-pizza-charbon text-xs font-semibold uppercase tracking-wide">
              Commander
            </p>
            <h2 class="mt-4 font-playfair font-bold text-4xl md:text-6xl leading-tight">
              Composez votre commande
            </h2>
            <p class="mt-5 text-lg text-pizza-creme/80 leading-relaxed">
              On vous confirme l'heure exacte par WhatsApp en moins de 5 minutes.
            </p>
          </div>

          <div class="mt-12 grid lg:grid-cols-12 gap-8">
            {/* === Colonne gauche : panier === */}
            <aside class="lg:col-span-5">
              <div class="bg-pizza-creme text-pizza-charbon rounded-2xl shadow-card-hover p-6 md:p-7 lg:sticky lg:top-24">
                <h3 class="font-playfair font-bold text-2xl text-pizza-charbon">
                  Votre panier {totalCount > 0 && (
                    <span class="ml-2 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-pizza-tomate text-white text-sm font-bold align-middle">{totalCount}</span>
                  )}
                </h3>
                {totalCount === 0 ? (
                  <p class="mt-6 text-sm text-pizza-charbon/65 italic">
                    Votre panier est vide. Ajoutez vos pizzas, desserts et boissons depuis le menu ci-dessus.
                  </p>
                ) : (
                  <>
                    <ul class="mt-5 space-y-3 divide-y divide-pizza-charbon/10">
                      {lines.map((line) => (
                        <li key={line.item.id} class="pt-3 first:pt-0 flex items-start gap-3">
                          <div class="flex-1 min-w-0">
                            <p class="font-playfair font-semibold text-base text-pizza-charbon">{line.item.nom}</p>
                            <p class="text-xs text-pizza-charbon/60">{line.item.prix}€ pièce</p>
                          </div>
                          <div class="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty - 1)}
                              aria-label={`Retirer ${line.item.nom}`}
                              class="w-7 h-7 flex items-center justify-center rounded-full bg-pizza-charbon/10 hover:bg-pizza-tomate hover:text-white text-pizza-charbon font-bold transition-colors cursor-pointer"
                            >
                              −
                            </button>
                            <span class="min-w-[1.75rem] text-center font-semibold tabular-nums">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.item.id, line.qty + 1)}
                              aria-label={`Ajouter ${line.item.nom}`}
                              class="w-7 h-7 flex items-center justify-center rounded-full bg-pizza-charbon/10 hover:bg-pizza-tomate hover:text-white text-pizza-charbon font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <p class="ml-3 font-playfair font-bold text-pizza-tomate whitespace-nowrap shrink-0">
                            {line.item.prix * line.qty}€
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div class="mt-6 pt-4 border-t-2 border-pizza-bois/40 flex items-baseline justify-between">
                      <span class="text-sm font-semibold uppercase tracking-wide text-pizza-charbon/70">Total estimé</span>
                      <span class="font-playfair font-bold text-3xl text-pizza-tomate">{total}€</span>
                    </div>
                  </>
                )}
              </div>
            </aside>

            {/* === Colonne droite : formulaire === */}
            <div class="lg:col-span-7">
              <form
                onSubmit={onSubmit}
                noValidate
                class="bg-pizza-creme text-pizza-charbon rounded-2xl shadow-card-hover p-6 md:p-7 space-y-5"
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

                {/* Type : à emporter / livraison */}
                <fieldset>
                  <legend class={labelBase}>Type <span class="text-pizza-tomate">*</span></legend>
                  <div class="grid sm:grid-cols-2 gap-2">
                    {[
                      { v: 'emporter', l: 'À emporter' },
                      { v: 'livraison', l: 'Livraison' },
                    ].map((opt) => (
                      <label
                        key={opt.v}
                        class="relative flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold text-pizza-charbon bg-white ring-1 ring-pizza-charbon/15 cursor-pointer transition-all hover:ring-pizza-charbon/30 has-[:checked]:bg-pizza-charbon has-[:checked]:text-pizza-creme has-[:checked]:ring-pizza-charbon"
                      >
                        <input
                          type="radio"
                          name="type"
                          value={opt.v}
                          checked={type === opt.v}
                          onChange={() => setType(opt.v as 'emporter' | 'livraison')}
                          required
                          class="sr-only"
                        />
                        <span>{opt.l}</span>
                      </label>
                    ))}
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

                <div class="rounded-xl bg-pizza-bois/15 ring-1 ring-pizza-bois/30 p-4 text-sm text-pizza-charbon leading-relaxed">
                  <strong class="font-semibold">⚠️ Cliquez sur « Envoyer ma commande sur WhatsApp » pour finaliser.</strong>
                  {' '}Le pizzaiolo vous confirmera l'heure exacte de retrait/livraison directement par message.
                </div>

                <button
                  type="submit"
                  disabled={totalCount === 0}
                  class="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-lg font-semibold rounded-full bg-[#075E54] text-white shadow-card hover:bg-[#054039] hover:shadow-card-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

      {/* Sticky bottom bar mobile (panier non vide) */}
      {totalCount > 0 && (
        <a
          href="#commander"
          class="md:hidden fixed bottom-4 inset-x-4 z-40 flex items-center justify-between gap-3 h-14 px-5 rounded-full bg-pizza-tomate text-white shadow-card-hover hover:bg-[#A50D26] transition-all"
        >
          <span class="font-semibold">Voir mon panier</span>
          <span class="flex items-center gap-2">
            <span class="font-bold">{total}€</span>
            <span class="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-white text-pizza-tomate text-sm font-bold">
              {totalCount}
            </span>
          </span>
        </a>
      )}
    </div>
  );
}
