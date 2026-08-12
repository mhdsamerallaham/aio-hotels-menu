import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Minus, Sparkles, Coffee, Milk, Droplets, Zap, ShoppingBag, Receipt, MessageSquare, Info } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedProduct } from '../../data/menu';
import { getTranslation } from '../../data/translations';

// Universal bilingual label resolver for options, milks, syrups, shots
const getLocalizedLabel = (item, lang) => {
  if (!item) return '';

  // Handle nested object { name: { tr, en } }
  if (item.name && typeof item.name === 'object') {
    return item.name[lang] || item.name.en || item.name.tr || '';
  }
  // Handle nested string { name: 'Vanilla Syrup' }
  if (item.name && typeof item.name === 'string') {
    return item.name;
  }
  // Handle direct properties { tr: '...', en: '...' }
  if (lang === 'en') {
    return item.en || item.tr || '';
  }
  return item.tr || item.en || '';
};

export default function DrinkCustomizerModal({ product, isOpen, onClose }) {
  const language = useLanguageStore((s) => s.language);
  const addToCart = useCartStore((s) => s.addToCart);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Group extras into distinct categories (Milks, Syrups, Shots, Other Extras)
  const optionGroups = useMemo(() => {
    if (!product) return { milks: [], syrups: [], shots: [], others: [] };

    const allExtras = product.extras || [];

    // Check if product defines explicit milks, syrups, shots arrays
    const explicitMilks = product.milks || [];
    const explicitSyrups = product.syrups || [];
    const explicitShots = product.shots || [];

    if (explicitMilks.length > 0 || explicitSyrups.length > 0 || explicitShots.length > 0) {
      return {
        milks: explicitMilks,
        syrups: explicitSyrups,
        shots: explicitShots,
        others: allExtras,
      };
    }

    // Otherwise automatically categorize allExtras
    const milks = [];
    const syrups = [];
    const shots = [];
    const others = [];

    allExtras.forEach((item) => {
      const nameTr = typeof item.name === 'object' ? item.name.tr : (item.tr || String(item.name || ''));
      const nameEn = typeof item.name === 'object' ? item.name.en : (item.en || nameTr);
      const lower = (nameTr + ' ' + nameEn).toLowerCase();

      if (lower.includes('süt') || lower.includes('milk')) {
        milks.push(item);
      } else if (lower.includes('şurup') || lower.includes('syrup')) {
        syrups.push(item);
      } else if (lower.includes('shot') || lower.includes('espresso')) {
        shots.push(item);
      } else {
        others.push(item);
      }
    });

    // Default milk option if none exists in coffee products
    if (milks.length === 0 && (product.category === 'coffee-rituals' || product.category === 'iced-coffee' || product.category === 'matcha-lounge')) {
      milks.push(
        { name: { tr: 'Standart Süt', en: 'Standard Milk' }, price: 0 },
        { name: { tr: 'Yulaf Sütü', en: 'Oat Milk' }, price: 20 },
        { name: { tr: 'Badem Sütü', en: 'Almond Milk' }, price: 20 },
        { name: { tr: 'Laktozsuz Süt', en: 'Lactose-Free Milk' }, price: 15 }
      );
    }

    return { milks, syrups, shots, others };
  }, [product]);

  // Unique key extractor for milk options
  const getMilkKey = (m) => {
    if (!m) return '';
    return getLocalizedLabel(m, 'tr') + '|' + getLocalizedLabel(m, 'en');
  };

  useEffect(() => {
    if (product) {
      const defaultSizes = product.sizes || [];
      setSelectedSize(defaultSizes.length > 0 ? defaultSizes[0] : null);

      // Default single-choice milk initialized once on product open
      const milksList = optionGroups.milks || [];
      if (milksList.length > 0) {
        setSelectedMilk(milksList[0]);
      } else {
        setSelectedMilk(null);
      }

      setSelectedExtras([]);
      setNotes('');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product?.id]);

  const localized = useMemo(() => {
    if (!product) return null;
    return getLocalizedProduct(product, language);
  }, [product, language]);

  if (!isOpen || !product || !localized) return null;

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exKey = getLocalizedLabel(extra, 'tr');
      const exists = prev.some((e) => getLocalizedLabel(e, 'tr') === exKey);
      if (exists) {
        return prev.filter((e) => getLocalizedLabel(e, 'tr') !== exKey);
      } else {
        return [...prev, extra];
      }
    });
  };

  // Calculate live itemized pricing breakdown
  const basePrice = product.basePrice || 0;
  const sizePrice = selectedSize?.price || 0;
  const milkPrice = selectedMilk?.price || 0;
  const extrasTotalPrice = selectedExtras.reduce((sum, e) => sum + (e.price || 0), 0);

  const unitTotal = basePrice + sizePrice + milkPrice + extrasTotalPrice;
  const grandTotal = unitTotal * quantity;

  const handleAddToCart = () => {
    const combinedExtras = [...selectedExtras];
    if (selectedMilk) {
      combinedExtras.unshift(selectedMilk);
    }

    addToCart(product, selectedSize, combinedExtras, quantity, notes);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-md transition-all duration-300 overflow-y-auto">
      
      {/* ── Modal Shell: Desktop 2-Column Grid (md:grid-cols-12) & Mobile Vertical Stack ── */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col md:grid md:grid-cols-12 my-auto border border-stone-200/90 animate-in fade-in zoom-in-95 duration-200 relative">

        {/* ── Close Button (Top-Right Fixed in Modal Shell) ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-all cursor-pointer flex items-center justify-center border border-white/20 shadow-md z-30"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* ── SECTION 1: 9:16 Portrait Product Media Showcase ── */}
        <div className="md:col-span-5 relative w-full aspect-[9/16] max-h-[460px] md:max-h-none md:h-full bg-stone-950 shrink-0 overflow-hidden">
          <img
            src={localized.image}
            alt={localized.name}
            className="w-full h-full object-cover"
          />

          {/* Smooth gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Handcrafted Ritual Badge on Image */}
          <div className="absolute bottom-5 left-5 right-5 space-y-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#4A1525] text-white rounded-full text-xs font-black uppercase tracking-wider border border-white/20 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span style={{ color: '#FFFFFF' }}>{getTranslation(language, 'handcraftedBadge')}</span>
            </span>
          </div>
        </div>

        {/* ── SECTION 2-8: Scrollable Customization Content Panel ── */}
        <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-white">
          
          {/* Scrollable Container with pb-32 to prevent sticky footer overlap */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 pb-32 sm:pb-36">
            
            {/* ── SECTION 2: Product Name, Base Price & Description ── */}
            <div className="space-y-3 pb-6 border-b border-stone-200/80">
              <div className="flex items-start justify-between gap-4 pr-10">
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-stone-950 leading-tight">
                  {localized.name}
                </h2>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#4A1525] bg-[#F8F2F4] px-3.5 py-1 rounded-xl border border-[#4A1525]/20 shrink-0">
                  ₺{basePrice}
                </span>
              </div>

              <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
                {localized.description}
              </p>
            </div>

            {/* ── SECTION 3: Select Size (Boyut Seçimi) ── */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg text-stone-950 font-black uppercase tracking-wide flex items-center gap-2.5 font-heading">
                    <Coffee className="w-5 h-5 text-[#4A1525]" />
                    <span>{getTranslation(language, 'selectSize')}</span>
                  </h3>
                  <span className="text-xs font-extrabold text-[#4A1525] bg-[#F8F2F4] px-3 py-1 rounded-full border border-[#4A1525]/20 uppercase tracking-wider">
                    {getTranslation(language, 'requiredBadge')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size) => {
                    const label = getLocalizedLabel(size, language);
                    const isSelected = selectedSize && getLocalizedLabel(selectedSize, 'tr') === getLocalizedLabel(size, 'tr');

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[56px] p-4 rounded-2xl border text-center transition-all cursor-pointer press-trigger ${
                          isSelected
                            ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-950 font-black shadow-xs'
                            : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className={`text-sm sm:text-base font-black font-heading ${isSelected ? 'text-[#4A1525]' : 'text-stone-900'}`}>
                          {label}
                        </div>
                        <div className={`text-xs mt-1 font-bold ${isSelected ? 'text-[#4A1525]' : 'text-stone-500'}`}>
                          {size.price > 0 ? `+₺${size.price}` : getTranslation(language, 'standardTag')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 4: Select Milk (Süt Seçimi - Single Select Radio) ── */}
            {optionGroups.milks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg text-stone-950 font-black uppercase tracking-wide flex items-center gap-2.5 font-heading">
                    <Milk className="w-5 h-5 text-[#4A1525]" />
                    <span>{getTranslation(language, 'selectMilk')}</span>
                  </h3>
                  <span className="text-xs font-extrabold text-[#4A1525] bg-[#F8F2F4] px-3 py-1 rounded-full border border-[#4A1525]/20">
                    {getTranslation(language, 'singleSelectBadge')}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {optionGroups.milks.map((milk) => {
                    const label = getLocalizedLabel(milk, language);
                    const mKey = getMilkKey(milk);
                    const selKey = getMilkKey(selectedMilk);
                    const isSelected = selKey !== '' && selKey === mKey;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedMilk(milk)}
                        className={`w-full min-h-[56px] py-4 px-5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-950 font-black shadow-xs'
                            : 'bg-white border-stone-200/90 text-stone-800 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#4A1525] bg-[#4A1525]'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                        </div>
                        <span className={`text-xs sm:text-sm font-black shrink-0 ${isSelected ? 'text-[#4A1525]' : 'text-stone-500'}`}>
                          {milk.price > 0 ? `+₺${milk.price}` : getTranslation(language, 'freeTag')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 5: Select Syrup (Şurup Seçimi) ── */}
            {optionGroups.syrups.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg text-stone-950 font-black uppercase tracking-wide flex items-center gap-2.5 font-heading">
                    <Droplets className="w-5 h-5 text-[#4A1525]" />
                    <span>{getTranslation(language, 'selectSyrup')}</span>
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    {getTranslation(language, 'optionalBadge')}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {optionGroups.syrups.map((syrup) => {
                    const label = getLocalizedLabel(syrup, language);
                    const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(syrup, 'tr'));

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleExtra(syrup)}
                        className={`w-full min-h-[56px] py-4 px-5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-950 font-black shadow-xs'
                            : 'bg-white border-stone-200/90 text-stone-800 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#4A1525] border-[#4A1525] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                        </div>
                        <span className={`text-xs sm:text-sm font-black shrink-0 ${isChecked ? 'text-[#4A1525]' : 'text-stone-500'}`}>
                          +₺{syrup.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 6: Select Extra Shot (Ekstra Shot Seçimi) ── */}
            {optionGroups.shots.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg text-stone-950 font-black uppercase tracking-wide flex items-center gap-2.5 font-heading">
                    <Zap className="w-5 h-5 text-[#4A1525]" />
                    <span>{getTranslation(language, 'selectShot')}</span>
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    {getTranslation(language, 'optionalBadge')}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {optionGroups.shots.map((shot) => {
                    const label = getLocalizedLabel(shot, language);
                    const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(shot, 'tr'));

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleExtra(shot)}
                        className={`w-full min-h-[56px] py-4 px-5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-950 font-black shadow-xs'
                            : 'bg-white border-stone-200/90 text-stone-800 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#4A1525] border-[#4A1525] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                        </div>
                        <span className={`text-xs sm:text-sm font-black shrink-0 ${isChecked ? 'text-[#4A1525]' : 'text-stone-500'}`}>
                          {shot.price > 0 ? `+₺${shot.price}` : getTranslation(language, 'standardTag')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 7: Product Notes / Special Instructions ── */}
            <div className="mt-8 pt-8 border-t border-stone-200/80 space-y-3.5">
              <h3 className="text-base sm:text-lg text-stone-950 font-black uppercase tracking-wide flex items-center gap-2.5 font-heading">
                <MessageSquare className="w-5 h-5 text-[#4A1525]" />
                <span>{getTranslation(language, 'specialNotesTitle')}</span>
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={getTranslation(language, 'specialNotesPlaceholder')}
                rows={3}
                className="w-full p-4 rounded-2xl bg-stone-50/80 border border-stone-200/90 text-stone-900 text-sm font-medium focus:outline-none focus:border-[#4A1525] focus:bg-white focus:ring-2 focus:ring-[#4A1525]/15 transition-all resize-none placeholder:text-stone-400"
              />
            </div>

            {/* ── SECTION 8: Itemized Price Breakdown Summary ── */}
            <div className="mt-8 bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200/90 space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#4A1525] flex items-center gap-2 font-heading">
                  <Receipt className="w-4 h-4 text-[#4A1525]" />
                  <span>{getTranslation(language, 'priceSummaryTitle')}</span>
                </h4>
                <span className="text-xs font-mono font-extrabold text-stone-600">1 x ₺{unitTotal}</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-medium text-stone-700">
                <div className="flex items-center justify-between">
                  <span>{getTranslation(language, 'basePriceLabel')}</span>
                  <span className="font-mono font-bold text-stone-900">₺{basePrice}</span>
                </div>

                {selectedSize && selectedSize.price > 0 && (
                  <div className="flex items-center justify-between text-[#4A1525] font-semibold">
                    <span>+ {getLocalizedLabel(selectedSize, language)}</span>
                    <span className="font-mono">+₺{selectedSize.price}</span>
                  </div>
                )}

                {selectedMilk && selectedMilk.price > 0 && (
                  <div className="flex items-center justify-between text-[#4A1525] font-semibold">
                    <span>+ {getLocalizedLabel(selectedMilk, language)}</span>
                    <span className="font-mono">+₺{selectedMilk.price}</span>
                  </div>
                )}

                {selectedExtras.map((ex) => (
                  <div key={getLocalizedLabel(ex, 'tr')} className="flex items-center justify-between text-[#4A1525] font-semibold">
                    <span>+ {getLocalizedLabel(ex, language)}</span>
                    <span className="font-mono">+₺{ex.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200/80 pt-3 flex items-center justify-between text-sm sm:text-base font-black text-stone-950">
                <span>{getTranslation(language, 'total')} ({quantity} {getTranslation(language, 'quantity')})</span>
                <span className="text-lg sm:text-xl font-mono text-[#4A1525]">₺{grandTotal}</span>
              </div>
            </div>

          </div>

          {/* ── STICKY CART FOOTER BAR ── */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-2xl flex items-center gap-3.5 z-20">
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/90 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-7 text-center text-base sm:text-lg font-black text-stone-900 font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Primary Action CTA */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 py-4 px-5 sm:px-6 rounded-2xl font-black font-heading text-base sm:text-lg flex items-center justify-between shadow-lg transition-all press-trigger cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-[#4A1525] hover:bg-[#360F1B] text-white shadow-[#4A1525]/25'
              }`}
              style={{ color: '#FFFFFF' }}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="font-black" style={{ color: '#FFFFFF' }}>
                  {isAdded ? getTranslation(language, 'addedToCart') : getTranslation(language, 'addToCart')}
                </span>
              </div>

              <span className="font-mono text-base sm:text-lg font-black text-[#4A1525] bg-white px-3 py-1 rounded-xl shadow-xs">
                ₺{grandTotal}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
