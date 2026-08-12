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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border-2 border-stone-900 animate-in fade-in zoom-in-95 duration-200">

        {/* ── 1. Hero Aspect Ratio Image Section (9:16 Portrait) ── */}
        <div className="relative w-full aspect-[9/16] max-h-[40vh] sm:max-h-[340px] bg-stone-950 shrink-0 overflow-hidden border-b-2 border-stone-900">
          <img
            src={localized.image}
            alt={localized.name}
            className="w-full h-full object-cover"
          />

          {/* Heavy gradient overlay for 100% crisp title readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/55 to-stone-950/20" />

          {/* Retro OS Style Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white text-stone-900 border-2 border-stone-900 flex items-center justify-center hover:bg-[#FFB800] transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Title Overlay with Amber Badge */}
          <div className="absolute bottom-5 left-5 right-5 space-y-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFB800] text-stone-950 rounded-full text-xs font-black uppercase tracking-wider border-2 border-stone-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>{getTranslation(language, 'handcraftedBadge')}</span>
            </span>

            <h2
              className="text-2xl sm:text-3xl font-black font-heading text-white drop-shadow-md leading-tight tracking-tight"
              style={{ color: '#FFFFFF' }}
            >
              {localized.name}
            </h2>
          </div>
        </div>

        {/* ── 2. Styleguide Customization Body ── */}
        <div className="p-6 sm:p-8 space-y-7 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF9F6]">
          
          {/* Description */}
          <p className="text-sm sm:text-base text-stone-700 font-semibold border-b-2 border-stone-200 pb-4 leading-relaxed">
            {localized.description}
          </p>

          {/* ── Section A: Select Size (Boyut Seçimi) ── */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-black uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Coffee className="w-5 h-5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSize')}</span>
                </h3>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Zorunlu</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => {
                  const sizeName = typeof size.name === 'object' ? size.name[language] || size.name.tr : size.name;
                  const isSelected = selectedSize?.name === size.name;

                  return (
                    <button
                      key={sizeName}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer press-trigger ${
                        isSelected
                          ? 'bg-[#4A1525] text-white border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-4 ring-[#FFB800]'
                          : 'bg-stone-50 text-stone-900 border-stone-300 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <div
                        className={`text-xs sm:text-sm font-black font-heading ${isSelected ? '!text-white' : 'text-stone-900'}`}
                        style={isSelected ? { color: '#FFFFFF' } : {}}
                      >
                        {sizeName}
                      </div>
                      <div className={`text-xs mt-1 font-black ${isSelected ? 'text-[#FFB800]' : 'text-stone-500'}`}>
                        {size.price > 0 ? `+₺${size.price}` : 'Standart'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section B: Select Milk (Süt Seçimi - Single Select Radio) ── */}
          {optionGroups.milks.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-black uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Milk className="w-5 h-5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectMilk')}</span>
                </h3>
                <span className="text-xs font-black text-stone-900 bg-[#FFB800] px-3 py-1 rounded-full border border-stone-900">Tek Seçim</span>
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
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F8F2F4] border-stone-900 text-stone-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-2 ring-[#FFB800]'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-stone-900 bg-[#4A1525]'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#FFB800]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold">{milkName}</span>
                      </div>
                      <span className={`text-xs font-black ${isSelected ? 'text-[#4A1525]' : 'text-stone-600'}`}>
                        {milk.price > 0 ? `+₺${milk.price}` : 'Ücretsiz'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section C: Select Syrup (Şurup Seçimi) ── */}
          {optionGroups.syrups.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-black uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Droplets className="w-5 h-5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectSyrup')}</span>
                </h3>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">İsteğe Bağlı</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.syrups.map((syrup) => {
                  const syrupName = typeof syrup.name === 'object' ? syrup.name[language] || syrup.name.tr : syrup.name;
                  const isChecked = selectedExtras.some((e) => e.name === syrup.name);

                  return (
                    <button
                      key={syrupName}
                      type="button"
                      onClick={() => toggleExtra(syrup)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-stone-900 text-stone-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-2 ring-[#FFB800]'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-stone-900 text-white'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold">{syrupName}</span>
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

          {/* ── Section D: Select Extra Shot (Ekstra Shot Seçimi) ── */}
          {optionGroups.shots.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-black uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Zap className="w-5 h-5 text-[#4A1525]" />
                  <span>{getTranslation(language, 'selectShot')}</span>
                </h3>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">İsteğe Bağlı</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.shots.map((shot) => {
                  const shotName = typeof shot.name === 'object' ? shot.name[language] || shot.name.tr : shot.name;
                  const isChecked = selectedExtras.some((e) => e.name === shot.name);

                  return (
                    <button
                      key={shotName}
                      type="button"
                      onClick={() => toggleExtra(shot)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-stone-900 text-stone-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-2 ring-[#FFB800]'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-stone-900 text-white'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold">{shotName}</span>
                      </div>
                      <span className="text-xs font-black text-[#4A1525]">
                        {shot.price > 0 ? `+₺${shot.price}` : 'Standart'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section E: Other Extras (Diğer Ekstralar) ── */}
          {optionGroups.others.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base text-stone-900 font-black uppercase tracking-wider font-heading">
                  {getTranslation(language, 'selectExtras')}
                </h3>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Özel İstek</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionGroups.others.map((extra) => {
                  const extraName = typeof extra.name === 'object' ? extra.name[language] || extra.name.tr : extra.name;
                  const isChecked = selectedExtras.some((e) => e.name === extra.name);

                  return (
                    <button
                      key={extraName}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F8F2F4] border-stone-900 text-stone-950 font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-2 ring-[#FFB800]'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A1525] border-stone-900 text-white'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#FFB800]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold">{extraName}</span>
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

          {/* ── Section F: Quantity Counter Box ── */}
          <div className="bg-white p-5 rounded-3xl border-2 border-stone-900 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] flex items-center justify-between">
            <span className="text-base sm:text-lg text-stone-950 font-black font-heading uppercase tracking-wide">
              {getTranslation(language, 'quantity')}
            </span>
            <div className="flex items-center gap-3 bg-stone-100 p-2 rounded-2xl border-2 border-stone-900">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 border-2 border-stone-900 flex items-center justify-center font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#FFB800] cursor-pointer transition-all"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <span className="w-9 text-center text-xl font-black text-stone-950 font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-white text-stone-900 border-2 border-stone-900 flex items-center justify-center font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#FFB800] cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. High-Impact CTA Footer Bar ── */}
        <div className="p-5 sm:p-6 bg-white border-t-2 border-stone-900 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 sm:py-4.5 rounded-2xl font-black font-heading text-base sm:text-lg flex items-center justify-between px-6 border-2 border-stone-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all press-trigger cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#4A1525] hover:bg-[#360F1B] text-white'
            }`}
            style={{ color: '#FFFFFF' }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-white stroke-[2.5]" />
              <span className="font-black" style={{ color: '#FFFFFF' }}>
                {isAdded ? getTranslation(language, 'addedToCart') : getTranslation(language, 'addToCart')}
              </span>
            </div>

            {/* Amber Gold Price Pill */}
            <span className="px-4 py-1.5 bg-[#FFB800] text-stone-950 rounded-xl text-base font-black border-2 border-stone-900 shadow-xs font-mono">
              ₺{totalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
