import React from 'react';
import { Plus, Trash2, Layers, Coffee } from 'lucide-react';
import useMenuStore from '../../store/menuStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedCategory } from '../../data/menu';

export default function CategoryManagement({ onOpenAddCategory }) {
  const categories = useMenuStore((s) => s.categories);
  const products = useMenuStore((s) => s.products);
  const deleteCategory = useMenuStore((s) => s.deleteCategory);
  const language = useLanguageStore((s) => s.language);

  const getItemCount = (catId) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold font-heading text-stone-900">
            Özel İçecek Kategorileri
          </h2>
          <p className="text-xs font-bold text-stone-500">
            Menü kategorileri, ikonlar ve alt başlık yönetim alanı
          </p>
        </div>

        <button
          onClick={onOpenAddCategory}
          className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360F1B] text-white font-extrabold font-heading text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md shadow-[#4A1525]/20 press-trigger cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const loc = getLocalizedCategory(cat, language);
          const count = getItemCount(cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-3.5 bg-[#F8F2F4] border border-[#4A1525]/15 rounded-2xl">
                    {loc.icon}
                  </span>
                  <span className="px-3 py-1 bg-[#F8F2F4] text-[#4A1525] border border-[#4A1525]/20 text-xs font-black rounded-full uppercase tracking-wider">
                    {count} ürün
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold font-heading text-stone-900">
                    {loc.name}
                  </h3>
                  <p className="text-xs font-bold text-stone-500 mt-1">
                    {loc.subtitle || 'Alt başlık belirtilmedi'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400">
                  ID: {cat.id}
                </span>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Kategoriyi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
