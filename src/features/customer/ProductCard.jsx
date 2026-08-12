import React from 'react';
import { Plus } from 'lucide-react';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedProduct } from '../../data/menu';
import { getTranslation } from '../../data/translations';

export default function ProductCard({ product, onClick }) {
  const language = useLanguageStore((s) => s.language);
  const localized = getLocalizedProduct(product, language);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200/90 rounded-3xl p-3 sm:p-5 flex flex-col justify-between hover:border-[#4A1525]/40 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer group select-none relative"
    >
      <div>
        {/* High Resolution Imagery (9:16 aspect ratio as requested) */}
        <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
          <img
            src={localized.image}
            alt={localized.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {product.popular && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#4A1525] text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md border border-white/20">
              ⭐ {getTranslation(language, 'popularTag')}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 px-0.5">
          <h3 className="text-sm sm:text-lg font-extrabold font-heading text-stone-900 group-hover:text-[#4A1525] transition-colors leading-tight line-clamp-1">
            {localized.name}
          </h3>
          <p className="text-xs text-stone-500 font-medium line-clamp-2 min-h-[2.25rem] leading-snug">
            {localized.description}
          </p>
        </div>
      </div>

      {/* Footer Pricing & Full Width Centered Add Button */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">
            {getTranslation(language, 'total')}
          </span>
          <span className="text-base sm:text-xl font-black font-heading text-[#4A1525]">
            ₺{product.basePrice}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full py-2.5 sm:py-3 bg-[#4A1525] hover:bg-[#360F1B] active:bg-[#2C0D16] text-white font-extrabold font-heading rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#4A1525]/20 press-trigger cursor-pointer min-h-[40px] sm:min-h-[44px] transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{getTranslation(language, 'add')}</span>
        </button>
      </div>
    </div>
  );
}

