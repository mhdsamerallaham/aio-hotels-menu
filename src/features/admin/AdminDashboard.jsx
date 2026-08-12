import React from 'react';
import { Coffee, Layers, Star, Database, RefreshCw, Plus, CheckCircle2, Zap } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function AdminDashboard({ onNavigate }) {
  const products = useMenuStore((s) => s.products);
  const categories = useMenuStore((s) => s.categories);
  const isSupabaseConnected = useMenuStore((s) => s.isSupabaseConnected);
  const seedSupabaseDatabase = useMenuStore((s) => s.seedSupabaseDatabase);
  const isLoadingFromSupabase = useMenuStore((s) => s.isLoadingFromSupabase);

  const popularCount = products.filter((p) => p.popular).length;
  const activeCount = products.filter((p) => p.display !== false).length;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400">
              Toplam Ürün
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#F8F2F4] text-[#4A1525] flex items-center justify-center border border-[#4A1525]/15">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-heading text-stone-900">{products.length}</div>
          <p className="text-xs font-bold text-stone-500">
            {activeCount} ürün müşterilere açık
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400">
              Kategoriler
            </span>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-heading text-stone-900">{categories.length}</div>
          <p className="text-xs font-bold text-stone-500">
            Özel kahve ritüeli kategorisi
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400">
              Favori Ürünler
            </span>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Star className="w-5 h-5 fill-amber-500/20" />
            </div>
          </div>
          <div className="text-3xl font-black font-heading text-stone-900">{popularCount}</div>
          <p className="text-xs font-bold text-stone-500">
            Favori rozetli öne çıkan ürünler
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400">
              Bulut Durumu
            </span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black font-heading text-stone-900 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isSupabaseConnected ? 'Aktif Entegre' : 'Çevrimdışı'}</span>
          </div>
          <p className="text-xs font-bold text-stone-500">
            Supabase canlı senkronizasyon
          </p>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operations Hub */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-heading text-stone-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#4A1525]" />
              <span>Hızlı Yönetim İşlemleri</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={() => onNavigate('products')}
              className="p-5 bg-stone-50 hover:bg-[#F8F2F4] border border-stone-200 rounded-2xl text-left space-y-2 group transition-all cursor-pointer"
            >
              <Coffee className="w-6 h-6 text-[#4A1525] group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-base text-stone-900">Ürünleri Yönet</div>
              <p className="text-xs text-stone-500 font-medium">Ürün adı, fiyat, resim, boyut ve ekstraları düzenleyin</p>
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className="p-5 bg-stone-50 hover:bg-amber-50/50 border border-stone-200 rounded-2xl text-left space-y-2 group transition-all cursor-pointer"
            >
              <Layers className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-base text-stone-900">Kategorileri Yönet</div>
              <p className="text-xs text-stone-500 font-medium">Kategori sırası ve rozetlerini özelleştirin</p>
            </button>
          </div>
        </div>

        {/* Supabase Control Hub */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
          <h3 className="text-lg font-black font-heading text-stone-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Veritabanı Senkronizasyonu</span>
          </h3>
          <p className="text-xs font-medium text-stone-600 leading-relaxed">
            Local değişiklikleri Supabase bulut veritabanınıza eşitleyin veya varsayılan menü verilerini yeniden yükleyin.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={seedSupabaseDatabase}
              disabled={isLoadingFromSupabase}
              className="px-5 py-3.5 bg-[#4A1525] hover:bg-[#360F1B] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#4A1525]/20"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingFromSupabase ? 'animate-spin' : ''}`} />
              <span>Veritabanını Yenile (Seed Sync)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
