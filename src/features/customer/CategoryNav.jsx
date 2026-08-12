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
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const locCat = getLocalizedCategory(cat, language);
            const count = getItemCount(cat.id);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-200 shrink-0 press-trigger cursor-pointer select-none font-heading font-extrabold text-sm ${
                  isActive
                    ? 'bg-[#4A1525] text-white shadow-md shadow-[#4A1525]/20'
                    : 'bg-white text-stone-700 hover:bg-stone-100/80 border border-stone-200/80'
                }`}
              >
                <span className="text-lg leading-none">{locCat.icon}</span>
                <span className="whitespace-nowrap">{locCat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    isActive
                      ? 'bg-white text-[#4A1525]'
                      : 'bg-stone-100 text-stone-600'
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
