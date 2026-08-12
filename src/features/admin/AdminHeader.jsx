import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function AdminHeader({
  activeTab,
  onOpenAddProduct,
  onOpenAddCategory,
  searchQuery,
  setSearchQuery
}) {
  const fetchFromSupabase = useMenuStore((s) => s.fetchFromSupabase);
  const isLoadingFromSupabase = useMenuStore((s) => s.isLoadingFromSupabase);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Genel Yönetim Özeti';
      case 'products':
        return 'Ürün Kataloğu Yönetimi';
      case 'categories':
        return 'Kategori Yapısı & Sıralama';
      case 'database':
        return 'Veritabanı Sync & Bulut Entegrasyonu';
      default:
        return 'Yönetici Paneli';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-stone-900 tracking-tight">
          {getTabTitle()}
        </h1>
        <p className="text-xs font-bold text-stone-400 mt-0.5">
          AIO Coffee Otel Lounge & İçecek Servis Yönetimi
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        {activeTab === 'products' && (
          <div className="relative w-64 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#4A1525]"
            />
          </div>
        )}

        {/* Sync Trigger */}
        <button
          onClick={fetchFromSupabase}
          disabled={isLoadingFromSupabase}
          className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-stone-200"
          title="Verileri Yenile / Sync"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingFromSupabase ? 'animate-spin text-[#4A1525]' : ''}`} />
        </button>

        {/* Primary Creation Actions */}
        {activeTab === 'products' && (
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360F1B] text-white font-extrabold font-heading text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md shadow-[#4A1525]/20 press-trigger cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Yeni Ürün Ekle</span>
          </button>
        )}

        {activeTab === 'categories' && (
          <button
            onClick={onOpenAddCategory}
            className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360F1B] text-white font-extrabold font-heading text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md shadow-[#4A1525]/20 press-trigger cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Yeni Kategori Ekle</span>
          </button>
        )}
      </div>
    </header>
  );
}

