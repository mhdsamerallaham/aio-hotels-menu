import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Languages, ShoppingBag } from 'lucide-react';
import useLanguageStore from '../../store/languageStore';
import useCartStore from '../../store/cartStore';

// ─────────────────────────────────────────────────────────────
// CustomerHeader — Sticky top shell bar
//
// Responsibilities:
//   • Brand logo (scroll-to-top)
//   • Cart trigger with animated item count badge
//   • Language switcher (TR ↔ EN)
//   • Concierge / Room Service shortcut
//
// Does NOT manage: search (Step 2), navigation (Step 3)
// Does NOT contain: any admin UI
// ─────────────────────────────────────────────────────────────

export default function CustomerHeader({ onOpenConcierge }) {
  const language   = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const openCart  = useCartStore((s) => s.openCart);
  const items     = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Track previous count to trigger badge animation only on increase
  const prevCountRef = useRef(cartCount);
  const badgeKey = useRef(0);

  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      badgeKey.current += 1;
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <header className="customer-header" aria-label="AIO Coffee navigation">
      <div className="app-max-width h-full flex items-center justify-between gap-3">

        {/* ── Brand Logo ─────────────────────────────── */}
        <div className="flex items-center shrink-0 select-none py-1">
          <motion.img
            src="/images/logo.png"
            alt="AIO Coffee"
            className="h-12 sm:h-16 w-auto object-contain cursor-pointer max-h-16"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            draggable={false}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          />
        </div>

        {/* ── Right Controls (High-Impact & Large Touch Targets) ──────────────────────────── */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">

          {/* Hotel Room Service Button */}
          <motion.button
            id="btn-concierge"
            onClick={onOpenConcierge}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="
              flex items-center gap-2
              px-3.5 py-2.5 sm:px-5 sm:py-3
              bg-white hover:bg-[#F8F2F4]
              text-stone-900 hover:text-[#4A1525]
              rounded-2xl sm:rounded-3xl
              text-xs sm:text-base font-extrabold font-heading
              border-2 border-stone-200 shadow-xs
              transition-colors duration-150
              cursor-pointer select-none shrink-0
              h-12 sm:h-14
            "
            aria-label={language === 'tr' ? 'Oda Servisi' : 'Room Service'}
          >
            <BellRing className="w-5 h-5 text-[#4A1525] shrink-0" />
            <span className="inline whitespace-nowrap font-extrabold">
              {language === 'tr' ? 'Oda Servisi' : 'Room Service'}
            </span>
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            id="btn-language-toggle"
            onClick={toggleLanguage}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="
              flex items-center gap-2
              px-3.5 py-2.5 sm:px-4 sm:py-3
              bg-stone-900 hover:bg-black
              text-white
              rounded-2xl sm:rounded-3xl
              text-xs sm:text-base font-black font-heading
              transition-colors duration-150
              cursor-pointer select-none shrink-0
              h-12 sm:h-14
            "
            title="Switch Language / Dili Değiştir"
            aria-label="Switch language"
          >
            <Languages className="w-5 h-5 text-[#F8F2F4] shrink-0" />
            <span className="font-black">{language === 'tr' ? 'TR' : 'EN'}</span>
          </motion.button>

          {/* Cart Trigger ─ Large Prominent Pantone 7421 C Button */}
          <motion.button
            id="btn-open-cart"
            onClick={openCart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="
              relative flex items-center gap-2.5 sm:gap-3
              px-5 py-3 sm:px-7 sm:py-3.5
              bg-[#4A1525] hover:bg-[#360F1B] active:bg-[#2C0D16]
              text-white
              rounded-2xl sm:rounded-3xl
              text-sm sm:text-lg font-black font-heading
              shadow-xl shadow-[#4A1525]/35
              border-2 border-white/20
              transition-all duration-200
              cursor-pointer select-none shrink-0
              h-12 sm:h-14
            "
            aria-label={language === 'tr' ? 'Sepeti Aç' : 'Open Cart'}
            style={{ color: '#FFFFFF' }}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5] shrink-0" />
            </div>

            <span className="font-black text-white text-sm sm:text-base whitespace-nowrap" style={{ color: '#FFFFFF' }}>
              {language === 'tr' ? 'Sepet' : 'Cart'}
            </span>

            {/* Animated count badge */}
            <AnimatePresence mode="wait" initial={false}>
              {cartCount > 0 ? (
                <motion.span
                  key={`cart-count-${badgeKey.current}`}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                  className="
                    inline-flex items-center justify-center
                    min-w-[1.6rem] h-[1.6rem]
                    bg-white text-[#4A1525]
                    rounded-full
                    text-xs sm:text-sm font-black leading-none
                    px-2 shadow-sm border border-stone-200/50
                  "
                  aria-live="polite"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>

        </div>
      </div>
    </header>
  );
}
