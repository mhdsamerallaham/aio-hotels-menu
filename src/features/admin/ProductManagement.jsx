import React, { useState } from 'react';
import { Edit2, Trash2, Star, Eye, EyeOff, Plus, Coffee, Tag } from 'lucide-react';
import useMenuStore from '../../store/menuStore';
import useLanguageStore from '../../store/languageStore';
import { getLocalizedProduct } from '../../data/menu';

export default function ProductManagement({ searchQuery, onEditProduct, onAddProduct }) {
  const products = useMenuStore((s) => s.products);
  const categories = useMenuStore((s) => s.categories);
  const deleteProduct = useMenuStore((s) => s.deleteProduct);
  const togglePopular = useMenuStore((s) => s.togglePopular);
  const updateProduct = useMenuStore((s) => s.updateProduct);
  const language = useLanguageStore((s) => s.language);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = products.filter((p) => {
    const loc = getLocalizedProduct(p, language);
    const matchesSearch = !searchQuery || loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return catId;
    return typeof cat.name === 'object' ? cat.name[language] || cat.name.tr : cat.name;
  };

  const handleToggleDisplay = (product) => {
    updateProduct(product.id, { display: !(product.display !== false) });
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold font-heading transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#4A1525] text-white shadow-md shadow-[#4A1525]/20'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          Tüm Kategoriler ({products.length})
        </button>

        {categories.map((cat) => {
          const name = typeof cat.name === 'object' ? cat.name[language] || cat.name.tr : cat.name;
          const count = products.filter((p) => p.category === cat.id).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold font-heading transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-[#4A1525] text-white shadow-md shadow-[#4A1525]/20'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{name}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-black ${isActive ? 'bg-white text-[#4A1525]' : 'bg-stone-100 text-stone-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Data Table */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs font-black uppercase tracking-wider">
                <th className="py-4.5 px-6">Ürün</th>
                <th className="py-4.5 px-4">Kategori</th>
                <th className="py-4.5 px-4">Fiyat</th>
                <th className="py-4.5 px-4">Varyantlar</th>
                <th className="py-4.5 px-4">Favori</th>
                <th className="py-4.5 px-4">Durum</th>
                <th className="py-4.5 px-6 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-800">
              {filtered.length > 0 ? (
                filtered.map((product) => {
                  const loc = getLocalizedProduct(product, language);
                  const isDisplayed = product.display !== false;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={loc.image}
                            alt={loc.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0 shadow-xs"
                          />
                          <div>
                            <div className="font-extrabold text-stone-900 font-heading text-base">
                              {loc.name}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1 max-w-xs mt-0.5">
                              {loc.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F2F4] border border-[#4A1525]/15 text-[#4A1525] text-xs font-extrabold rounded-xl">
                          <Tag className="w-3.5 h-3.5 text-[#4A1525]" />
                          <span>{getCategoryName(product.category)}</span>
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-4 px-4 font-black font-heading text-[#4A1525] text-lg">
                        ₺{product.basePrice}
                      </td>

                      {/* Sizes Count */}
                      <td className="py-4 px-4 text-xs font-bold text-stone-600">
                        {product.sizes?.length || 0} boyut seçeneği
                      </td>

                      {/* Popular Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => togglePopular(product.id)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                            product.popular
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                          }`}
                          title="Favori Durumunu Değiştir"
                        >
                          <Star className={`w-4 h-4 ${product.popular ? 'fill-white' : ''}`} />
                        </button>
                      </td>

                      {/* Display Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleDisplay(product)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                            isDisplayed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isDisplayed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isDisplayed ? 'Yayında' : 'Gizli'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer"
                            title="Ürünü Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Ürünü Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-sm font-semibold">
                    Arama kriterlerine uygun ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
