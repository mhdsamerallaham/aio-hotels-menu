import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import useMenuStore from '../../store/menuStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedCategory } from '../../data/menu';

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  const categories = useMenuStore((s) => s.categories);
  const products = useMenuStore((s) => s.products);
  const language = useLanguageStore((s) => s.language);
  const activeBtnRef = useRef(null);

  const getItemCount = (catId) => {
    return products.filter((p) => p.category === catId).length;
  };

  // Auto-scroll active category pill into center view smoothly
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeCategory]);

  return (
    <nav className="customer-category-nav flex items-center relative overflow-hidden" aria-label="Category Navigation">
      
      {/* Right Edge Scroll Hint Gradient Indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-100/90 to-transparent pointer-events-none z-10 flex items-center justify-end pr-1">
        <ChevronRight className="w-5 h-5 text-[#4A1525]/50 animate-pulse" />
      </div>

      <div className="app-max-width w-full">
        <div className="flex items-center gap-3.5 category-scroll-container no-scrollbar py-2 px-1">
          {categories.map((cat) => {
            const locCat = getLocalizedCategory(cat, language);
            const count = getItemCount(cat.id);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-3.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-3xl transition-all duration-200 shrink-0 press-trigger cursor-pointer select-none font-heading font-black text-base sm:text-lg border-2 ${
                  isActive
                    ? 'bg-[#4A1525] text-white border-[#4A1525] shadow-xl shadow-[#4A1525]/30 scale-[1.02]'
                    : 'bg-white text-stone-900 border-stone-200/90 hover:border-[#4A1525]/40 hover:bg-stone-50 shadow-xs'
                }`}
                style={isActive ? { color: '#FFFFFF' } : {}}
              >
                <span className="text-2xl sm:text-3xl leading-none drop-shadow-xs">{locCat.icon}</span>
                <span className="whitespace-nowrap font-extrabold tracking-tight">{locCat.name}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-black ${
                    isActive
                      ? 'bg-white text-[#4A1525] shadow-xs'
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
