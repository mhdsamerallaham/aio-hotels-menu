import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Minus, Sparkles, Coffee, Milk, Droplets, Zap, ShoppingBag, Receipt, Info } from 'lucide-react';
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

    addToCart(product, selectedSize, combinedExtras, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md transition-all duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-stone-200/90 animate-in fade-in zoom-in-95 duration-200">

        {/* ── 1. Compact Sleek Header Banner ── */}
        <div className="relative w-full h-44 sm:h-52 bg-stone-950 shrink-0 overflow-hidden">
          <img
            src={localized.image}
            alt={localized.name}
            className="w-full h-full object-cover"
          />

          {/* Smooth gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-all cursor-pointer flex items-center justify-center border border-white/20 shadow-md z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#4A1525] text-white rounded-full text-xs font-black uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span style={{ color: '#FFFFFF' }}>{getTranslation(language, 'handcraftedBadge')}</span>
            </span>

            <div className="flex items-end justify-between gap-4">
              <h2
                className="text-2xl sm:text-3xl font-black font-heading text-white drop-shadow-md leading-tight"
                style={{ color: '#FFFFFF' }}
              >
                {localized.name}
              </h2>
              <span className="text-xl sm:text-2xl font-black text-[#FFB800] bg-black/50 px-3 py-1 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
                ₺{basePrice}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Spacious Airy Customization Body ── */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-stone-50/50">
          
          {/* Product Info Card */}
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-[#4A1525] shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-stone-700 font-semibold leading-relaxed">
              {localized.description}
            </p>
          </div>

          {/* ── Section A: Select Size (Boyut Seçimi) ── */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Coffee className="w-4.5 h-4.5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSize')}</span>
                </h3>
                <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 uppercase tracking-wider">
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
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer press-trigger ${
                        isSelected
                          ? 'bg-[#4A1525] text-white border-[#4A1525] shadow-md shadow-[#4A1525]/20 font-bold ring-2 ring-[#4A1525]/30'
                          : 'bg-stone-50/80 text-stone-800 border-stone-200/90 hover:border-stone-400 hover:bg-stone-100/70'
                      }`}
                    >
                      <div
                        className={`text-sm sm:text-base font-black font-heading ${isSelected ? '!text-white' : 'text-stone-900'}`}
                        style={isSelected ? { color: '#FFFFFF' } : {}}
                      >
                        {label}
                      </div>
                      <div className={`text-xs mt-1 font-extrabold ${isSelected ? 'text-[#FFB800]' : 'text-stone-500'}`}>
                        {size.price > 0 ? `+₺${size.price}` : getTranslation(language, 'standardTag')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section B: Select Milk (Süt Seçimi - Single Select Radio) ── */}
          {optionGroups.milks.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Milk className="w-4.5 h-4.5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectMilk')}</span>
                </h3>
                <span className="text-xs font-black text-[#4A1525] bg-[#F8F2F4] px-2.5 py-0.5 rounded-full border border-[#4A1525]/20">
                  {getTranslation(language, 'singleSelectBadge')}
                </span>
              </div>

              <div className="space-y-2.5">
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
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-black shadow-xs'
                          : 'bg-stone-50/70 border-stone-200/90 text-stone-700 hover:border-stone-300 hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#4A1525] bg-[#4A1525]'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#FFB800]" />}
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

          {/* ── Section C: Select Syrup (Şurup Seçimi) ── */}
          {optionGroups.syrups.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Droplets className="w-4.5 h-4.5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSyrup')}</span>
                </h3>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {getTranslation(language, 'optionalBadge')}
                </span>
              </div>

              <div className="space-y-2.5">
                {optionGroups.syrups.map((syrup) => {
                  const label = getLocalizedLabel(syrup, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(syrup, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(syrup)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                          : 'bg-stone-50/70 border-stone-200/90 text-stone-700 hover:border-stone-300 hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-[#4A1525] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#4A1525] shrink-0">
                        +₺{syrup.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section D: Select Extra Shot (Ekstra Shot Seçimi) ── */}
          {optionGroups.shots.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Zap className="w-4.5 h-4.5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectShot')}</span>
                </h3>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {getTranslation(language, 'optionalBadge')}
                </span>
              </div>

              <div className="space-y-2.5">
                {optionGroups.shots.map((shot) => {
                  const label = getLocalizedLabel(shot, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(shot, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(shot)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                          : 'bg-stone-50/70 border-stone-200/90 text-stone-700 hover:border-stone-300 hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-[#4A1525] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#4A1525] shrink-0">
                        {shot.price > 0 ? `+₺${shot.price}` : getTranslation(language, 'standardTag')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section E: Other Extras (Diğer Ekstralar) ── */}
          {optionGroups.others.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider font-heading">
                  {getTranslation(language, 'selectExtras')}
                </h3>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {getTranslation(language, 'optionalBadge')}
                </span>
              </div>

              <div className="space-y-2.5">
                {optionGroups.others.map((extra) => {
                  const label = getLocalizedLabel(extra, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(extra, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                          : 'bg-stone-50/70 border-stone-200/90 text-stone-700 hover:border-stone-300 hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-[#4A1525] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#4A1525] shrink-0">
                        {extra.price > 0 ? `+₺${extra.price}` : getTranslation(language, 'freeTag')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section F: Itemized Live Price Breakdown Summary ── */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl space-y-3 shadow-md border border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-200 flex items-center gap-2 font-heading">
                <Receipt className="w-4 h-4 text-[#FFB800]" />
                <span>{getTranslation(language, 'priceSummaryTitle')}</span>
              </h4>
              <span className="text-xs font-mono font-bold text-stone-400">1 x ₺{unitTotal}</span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-stone-300">
              <div className="flex items-center justify-between">
                <span>{getTranslation(language, 'basePriceLabel')}</span>
                <span className="font-mono">₺{basePrice}</span>
              </div>

              {selectedSize && selectedSize.price > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>+ {getLocalizedLabel(selectedSize, language)}</span>
                  <span className="font-mono">+₺{selectedSize.price}</span>
                </div>
              )}

              {selectedMilk && selectedMilk.price > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>+ {getLocalizedLabel(selectedMilk, language)}</span>
                  <span className="font-mono">+₺{selectedMilk.price}</span>
                </div>
              )}

              {selectedExtras.map((ex) => (
                <div key={getLocalizedLabel(ex, 'tr')} className="flex items-center justify-between text-amber-300">
                  <span>+ {getLocalizedLabel(ex, language)}</span>
                  <span className="font-mono">+₺{ex.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-800 pt-2.5 flex items-center justify-between text-sm sm:text-base font-black text-white">
              <span>{getTranslation(language, 'total')} ({quantity} {getTranslation(language, 'quantity')})</span>
              <span className="text-lg font-mono text-[#FFB800]">₺{grandTotal}</span>
            </div>
          </div>

        </div>

        {/* ── 3. Sticky Action Bar - Quantity & Full-Width CTA ── */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200/90 shrink-0 flex items-center gap-3">
          
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

          {/* Primary CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 py-4 sm:py-4.5 px-5 rounded-2xl font-black font-heading text-base sm:text-lg flex items-center justify-between shadow-lg transition-all press-trigger cursor-pointer ${
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

            <span className="font-mono text-base sm:text-lg font-black text-[#FFB800] bg-black/40 px-3 py-1 rounded-xl">
              ₺{grandTotal}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
