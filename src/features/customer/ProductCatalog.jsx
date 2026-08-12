import React from 'react';
import ProductCard from './ProductCard';
import useMenuStore from '../../store/menuStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedCategory } from '../../data/menu';
import { getTranslation } from '../../data/translations';
import { SearchX, Star, Coffee } from 'lucide-react';

export default function ProductCatalog({
  products,
  activeCategory,
  activeTab,
  searchQuery,
  onClearSearch,
  onProductClick,
}) {
  const categories = useMenuStore((s) => s.categories);
  const language = useLanguageStore((s) => s.language);

  const currentCategoryObj = categories.find((c) => c.id === activeCategory) || categories[0];
  const localizedCategory = currentCategoryObj ? getLocalizedCategory(currentCategoryObj, language) : null;

  return (
    <div className="space-y-8">
      {/* Search Header */}
      {searchQuery && (
        <div className="bg-[#4A1525]/10 border border-[#4A1525]/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-section-header text-stone-900">
              {getTranslation(language, 'searchResultsFor')}{' '}
              <span className="text-[#4A1525] font-extrabold">"{searchQuery}"</span>
            </h2>
            <p className="text-body-sm text-stone-600 mt-1">
              Found {products.length} coffee rituals matching your query
            </p>
          </div>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-sm font-bold hover:bg-stone-50 cursor-pointer self-start sm:self-auto"
          >
            {getTranslation(language, 'clearSearch')}
          </button>
        </div>
      )}

      {/* Popular Header */}
      {!searchQuery && activeTab === 'popular' && (
        <div className="bg-[#2C0D16] text-white rounded-3xl p-6 sm:p-8 border border-[#4A1525]/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Star className="w-48 h-48 fill-[#4A1525] text-[#4A1525]" />
          </div>
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A1525] text-white rounded-full text-xs font-black uppercase tracking-wider">
              ⭐ GUEST CHOICE 2026
            </span>
            <h2 className="text-hero-title text-white">
              {getTranslation(language, 'popularTitle')}
            </h2>
            <p className="text-body-lg text-stone-300">
              {getTranslation(language, 'popularSubtitle')}
            </p>
          </div>
        </div>
      )}

      {/* Category Header Banner */}
      {!searchQuery && activeTab === 'menu' && localizedCategory && (
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4 sm:gap-5">
            <span className="text-3xl sm:text-4xl p-3.5 sm:p-4 bg-[#4A1525]/10 border border-[#4A1525]/20 rounded-2xl shrink-0">
              {localizedCategory.icon}
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-page-header text-stone-900">
                  {localizedCategory.name}
                </h2>
                {localizedCategory.badge && (
                  <span className="px-3 py-1 bg-[#4A1525] text-white text-xs font-extrabold rounded-lg uppercase tracking-wider">
                    {localizedCategory.badge}
                  </span>
                )}
              </div>
              <p className="text-body-md text-stone-600 mt-1">
                {localizedCategory.subtitle || 'Handcrafted premium hotel lounge offerings'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-[#F8F2F4] border border-[#4A1525]/15 px-4 py-2.5 rounded-2xl">
            <Coffee className="w-5 h-5 text-[#4A1525]" />
            <span className="text-sm font-extrabold text-[#4A1525]">
              {products.length} {getTranslation(language, 'items')}
            </span>
          </div>
        </div>
      )}

      {/* Product Cards Grid — 2 columns per row as requested */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <SearchX className="w-10 h-10" />
          </div>
          <h3 className="text-section-header text-stone-900">
            {getTranslation(language, 'noDrinksFound')}
          </h3>
          <p className="text-body-md text-stone-600">
            {getTranslation(language, 'noDrinksDesc')}
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold font-heading text-sm shadow-md hover:bg-black cursor-pointer"
          >
            {getTranslation(language, 'showFullMenu')}
          </button>
        </div>
      )}
    </div>
  );
}
