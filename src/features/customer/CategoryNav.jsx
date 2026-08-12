import React from 'react';
import useMenuStore from '../../store/menuStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedCategory } from '../../data/menu';

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  const categories = useMenuStore((s) => s.categories);
  const products = useMenuStore((s) => s.products);
  const language = useLanguageStore((s) => s.language);

  const getItemCount = (catId) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="customer-category-nav">
      <div className="app-max-width">
        <div className="flex items-center gap-3 category-scroll-container no-scrollbar py-1">
          {categories.map((cat) => {
            const locCat = getLocalizedCategory(cat, language);
            const count = getItemCount(cat.id);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl transition-all duration-200 shrink-0 press-trigger cursor-pointer select-none font-heading font-extrabold text-sm sm:text-base shadow-xs ${
                  isActive
                    ? 'bg-[#4A1525] text-white shadow-md shadow-[#4A1525]/25 border border-[#4A1525]'
                    : 'bg-white text-stone-800 hover:bg-stone-100 border border-stone-200/90'
                }`}
                style={isActive ? { color: '#FFFFFF' } : {}}
              >
                <span className="text-xl sm:text-2xl leading-none">{locCat.icon}</span>
                <span className="whitespace-nowrap font-bold tracking-tight">{locCat.name}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    isActive
                      ? 'bg-white text-[#4A1525]'
                      : 'bg-stone-100 text-stone-700 border border-stone-200/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
