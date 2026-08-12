import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Minus, Sparkles, Coffee, Milk, Droplets, Zap, ShoppingBag } from 'lucide-react';
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

  // Calculate live total unit price
  const sizePrice = selectedSize?.price || 0;
  const milkPrice = selectedMilk?.price || 0;
  const extrasTotalPrice = selectedExtras.reduce((sum, e) => sum + (e.price || 0), 0);

  const unitPrice = product.basePrice + sizePrice + milkPrice + extrasTotalPrice;
  const totalPrice = unitPrice * quantity;

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

            <h2
              className="text-2xl sm:text-3xl font-black font-heading text-white drop-shadow-md leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              {localized.name}
            </h2>
          </div>
        </div>

        {/* ── 2. Spacious Airy Customization Body ── */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          
          {/* Description */}
          <p className="text-sm sm:text-base text-stone-600 font-medium pb-2 leading-relaxed border-b border-stone-100">
            {localized.description}
          </p>

          {/* ── Section A: Select Size (Boyut Seçimi) ── */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Coffee className="w-4 h-4 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSize')}</span>
                </h3>
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
                  {language === 'en' ? 'Required' : 'Zorunlu'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.sizes.map((size) => {
                  const label = getLocalizedLabel(size, language);
                  const isSelected = selectedSize && getLocalizedLabel(selectedSize, 'tr') === getLocalizedLabel(size, 'tr');

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer press-trigger ${
                        isSelected
                          ? 'bg-[#4A1525] text-white border-[#4A1525] shadow-md shadow-[#4A1525]/20 font-bold'
                          : 'bg-stone-50/80 text-stone-800 border-stone-200/90 hover:border-stone-400 hover:bg-stone-100/70'
                      }`}
                    >
                      <div
                        className={`text-sm font-black font-heading ${isSelected ? '!text-white' : 'text-stone-900'}`}
                        style={isSelected ? { color: '#FFFFFF' } : {}}
                      >
                        {label}
                      </div>
                      <div className={`text-xs mt-1 font-bold ${isSelected ? 'text-rose-200' : 'text-stone-500'}`}>
                        {size.price > 0 ? `+₺${size.price}` : (language === 'en' ? 'Standard' : 'Standart')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section B: Select Milk (Süt Seçimi - Single Select Radio) ── */}
          {optionGroups.milks.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Milk className="w-4 h-4 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectMilk')}</span>
                </h3>
                <span className="text-xs font-bold text-[#4A1525] bg-[#F8F2F4] px-2.5 py-0.5 rounded-full border border-[#4A1525]/20">
                  {language === 'en' ? 'Single Select' : 'Tek Seçim'}
                </span>
              </div>

              <div className="space-y-2">
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
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
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
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className={`text-xs font-black shrink-0 ${isSelected ? 'text-[#4A1525]' : 'text-stone-500'}`}>
                        {milk.price > 0 ? `+₺${milk.price}` : (language === 'en' ? 'Free' : 'Ücretsiz')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section C: Select Syrup (Şurup Seçimi) ── */}
          {optionGroups.syrups.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Droplets className="w-4 h-4 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSyrup')}</span>
                </h3>
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
                  {language === 'en' ? 'Optional' : 'İsteğe Bağlı'}
                </span>
              </div>

              <div className="space-y-2">
                {optionGroups.syrups.map((syrup) => {
                  const label = getLocalizedLabel(syrup, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(syrup, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(syrup)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
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
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-sm font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525] shrink-0">
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
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Zap className="w-4 h-4 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectShot')}</span>
                </h3>
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
                  {language === 'en' ? 'Optional' : 'İsteğe Bağlı'}
                </span>
              </div>

              <div className="space-y-2">
                {optionGroups.shots.map((shot) => {
                  const label = getLocalizedLabel(shot, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(shot, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(shot)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
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
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-sm font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525] shrink-0">
                        {shot.price > 0 ? `+₺${shot.price}` : (language === 'en' ? 'Standard' : 'Standart')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section E: Other Extras (Diğer Ekstralar) ── */}
          {optionGroups.others.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base text-stone-900 font-extrabold uppercase tracking-wider font-heading">
                  {getTranslation(language, 'selectExtras')}
                </h3>
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
                  {language === 'en' ? 'Customization' : 'Özel İstek'}
                </span>
              </div>

              <div className="space-y-2">
                {optionGroups.others.map((extra) => {
                  const label = getLocalizedLabel(extra, language);
                  const isChecked = selectedExtras.some((e) => getLocalizedLabel(e, 'tr') === getLocalizedLabel(extra, 'tr'));

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left gap-3 transition-all cursor-pointer ${
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
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-sm font-extrabold text-stone-900 leading-snug break-words">{label}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525] shrink-0">
                        {extra.price > 0 ? `+₺${extra.price}` : (language === 'en' ? 'Free' : 'Ücretsiz')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section F: Quantity Counter Box ── */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <span className="text-base sm:text-lg text-stone-900 font-extrabold font-heading">
              {getTranslation(language, 'quantity')}
            </span>
            <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-8 text-center text-lg font-black text-stone-900 font-mono">
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
          </div>
        </div>

        {/* ── 3. Action Button - Full-Width Pantone 7421 C CTA ── */}
        <div className="p-5 sm:p-6 bg-white border-t border-stone-200/80 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 sm:py-4.5 rounded-2xl font-black font-heading text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition-all press-trigger cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-[#4A1525] hover:bg-[#360F1B] text-white shadow-[#4A1525]/25'
            }`}
            style={{ color: '#FFFFFF' }}
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span style={{ color: '#FFFFFF' }}>
              {isAdded ? getTranslation(language, 'addedToCart') : `${getTranslation(language, 'addToCart')} · ₺${totalPrice}`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
