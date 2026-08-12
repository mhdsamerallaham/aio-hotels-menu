import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Minus, Sparkles, Coffee, Milk, Droplets, Zap, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedProduct } from '../../data/menu';
import { getTranslation } from '../../data/translations';

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
      const name = typeof item.name === 'object' ? item.name.tr + ' ' + item.name.en : String(item.name);
      const lower = name.toLowerCase();

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

    // Default milk option if none exists in product
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
    if (typeof m.name === 'object') return m.name.tr || m.name.en || '';
    return m.tr || m.name || String(m);
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
      const exists = prev.some((e) => e.name === extra.name);
      if (exists) {
        return prev.filter((e) => e.name !== extra.name);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200">

        {/* Header Hero Image (9:16 Aspect Ratio) */}
        <div className="relative w-full aspect-[9/16] max-h-[42vh] sm:max-h-[360px] bg-stone-950 shrink-0 overflow-hidden">
          <img
            src={localized.image}
            alt={localized.name}
            className="w-full h-full object-cover"
          />

          {/* Heavy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/20" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer border border-white/20 shadow-lg z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-5 left-5 right-5 space-y-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A1525] !text-white rounded-full text-xs font-black uppercase tracking-wider shadow-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span style={{ color: '#FFFFFF' }}>{getTranslation(language, 'handcraftedBadge')}</span>
            </span>

            <h2
              className="text-2xl sm:text-3xl font-black font-heading !text-white drop-shadow-lg leading-tight tracking-tight"
              style={{ color: '#FFFFFF' }}
            >
              {localized.name}
            </h2>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-6 sm:p-8 space-y-7 overflow-y-auto custom-scrollbar flex-1">
          {/* Description */}
          <p className="text-sm sm:text-base text-stone-600 font-medium border-b border-stone-100 pb-4 leading-relaxed">
            {localized.description}
          </p>

          {/* 1. Boyut Seçimi (Sizes) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3.5">
              <h3 className="text-base sm:text-lg text-stone-900 font-extrabold flex items-center gap-2 font-heading">
                <Coffee className="w-5 h-5 text-[#4A1525]" />
                <span>{getTranslation(language, 'selectSize')}</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => {
                  const sizeName = typeof size.name === 'object' ? size.name[language] || size.name.tr : size.name;
                  const isSelected = selectedSize?.name === size.name;

                  return (
                    <button
                      key={sizeName}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer press-trigger ${isSelected
                        ? 'bg-[#4A1525] text-white border-[#4A1525] shadow-md shadow-[#4A1525]/20'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-400'
                        }`}
                    >
                      <div className={`text-xs sm:text-sm font-black font-heading ${isSelected ? '!text-white' : ''}`} style={isSelected ? { color: '#FFFFFF' } : {}}>
                        {sizeName}
                      </div>
                      <div className={`text-xs mt-1 font-extrabold ${isSelected ? 'text-rose-200' : 'text-stone-500'}`}>
                        {size.price > 0 ? `+₺${size.price}` : 'Standart'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Süt Seçimi (Milks — Single Select Radio) */}
          {optionGroups.milks.length > 0 && (
            <div className="space-y-3.5 border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg text-stone-900 font-extrabold flex items-center gap-2 font-heading">
                  <Milk className="w-5 h-5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectMilk')}</span>
                </h3>
                <span className="text-xs font-extrabold text-[#4A1525] bg-[#F8F2F4] px-2.5 py-1 rounded-full">Tek Seçim</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.milks.map((milk) => {
                  const milkName = typeof milk.name === 'object' ? milk.name[language] || milk.name.tr : (milk.tr || milk.name);
                  const mKey = getMilkKey(milk);
                  const selKey = getMilkKey(selectedMilk);
                  const isSelected = selKey !== '' && selKey === mKey;

                  return (
                    <button
                      key={milkName}
                      type="button"
                      onClick={() => setSelectedMilk(milk)}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                            ? 'border-[#4A1525] bg-[#4A1525]'
                            : 'border-stone-300 bg-white'
                            }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold">{milkName}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525]">
                        {milk.price > 0 ? `+₺${milk.price}` : 'Ücretsiz'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Şurup Seçimi (Syrups) */}
          {optionGroups.syrups.length > 0 && (
            <div className="space-y-3.5 border-t border-stone-100 pt-5">
              <h3 className="text-base sm:text-lg text-stone-900 font-extrabold flex items-center gap-2 font-heading">
                <Droplets className="w-5 h-5 text-[#4A1525]" />
                <span>{getTranslation(language, 'selectSyrup')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.syrups.map((syrup) => {
                  const syrupName = typeof syrup.name === 'object' ? syrup.name[language] || syrup.name.tr : syrup.name;
                  const isChecked = selectedExtras.some((e) => e.name === syrup.name);

                  return (
                    <button
                      key={syrupName}
                      type="button"
                      onClick={() => toggleExtra(syrup)}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${isChecked
                        ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${isChecked
                            ? 'bg-[#4A1525] border-[#4A1525] text-white'
                            : 'border-stone-300 bg-white'
                            }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{syrupName}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525]">
                        +₺{syrup.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Ekstra Shot Seçimi (Shots) */}
          {optionGroups.shots.length > 0 && (
            <div className="space-y-3.5 border-t border-stone-100 pt-5">
              <h3 className="text-base sm:text-lg text-stone-900 font-extrabold flex items-center gap-2 font-heading">
                <Zap className="w-5 h-5 text-[#4A1525]" />
                <span>{getTranslation(language, 'selectShot')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.shots.map((shot) => {
                  const shotName = typeof shot.name === 'object' ? shot.name[language] || shot.name.tr : shot.name;
                  const isChecked = selectedExtras.some((e) => e.name === shot.name);

                  return (
                    <button
                      key={shotName}
                      type="button"
                      onClick={() => toggleExtra(shot)}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${isChecked
                        ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${isChecked
                            ? 'bg-[#4A1525] border-[#4A1525] text-white'
                            : 'border-stone-300 bg-white'
                            }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{shotName}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525]">
                        +₺{shot.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Diğer Ekstralar (Others) */}
          {optionGroups.others.length > 0 && (
            <div className="space-y-3.5 border-t border-stone-100 pt-5">
              <h3 className="text-base sm:text-lg text-stone-900 font-extrabold font-heading">
                {getTranslation(language, 'selectExtras')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.others.map((extra) => {
                  const extraName = typeof extra.name === 'object' ? extra.name[language] || extra.name.tr : extra.name;
                  const isChecked = selectedExtras.some((e) => e.name === extra.name);

                  return (
                    <button
                      key={extraName}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${isChecked
                        ? 'bg-[#F8F2F4] border-2 border-[#4A1525] text-stone-900 font-extrabold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${isChecked
                            ? 'bg-[#4A1525] border-[#4A1525] text-white'
                            : 'border-stone-300 bg-white'
                            }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{extraName}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525]">
                        {extra.price > 0 ? `+₺${extra.price}` : 'Ücretsiz'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between border-t border-stone-100 pt-6">
            <span className="text-base sm:text-lg text-stone-900 font-extrabold font-heading">
              {getTranslation(language, 'quantity')}
            </span>
            <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-black text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button - Centered Full-Width Pantone 7421 C CTA */}
        <div className="p-5 sm:p-6 bg-white border-t border-stone-200/80 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 sm:py-4.5 rounded-2xl font-black font-heading text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition-all press-trigger cursor-pointer ${isAdded
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
