import React, { useState } from 'react';
import useMenuStore from '../../store/menuStore';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import ProductEditorModal from './ProductEditorModal';
import CategoryEditorModal from './CategoryEditorModal';
import { Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminSaaSApp({ onExitAdmin }) {
  const isAdminLoggedIn = useMenuStore((s) => s.isAdminLoggedIn);
  const isSupabaseConnected = useMenuStore((s) => s.isSupabaseConnected);
  const seedSupabaseDatabase = useMenuStore((s) => s.seedSupabaseDatabase);
  const isLoadingFromSupabase = useMenuStore((s) => s.isLoadingFromSupabase);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex font-body antialiased">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddProduct={handleOpenAddProduct}
          onOpenAddCategory={() => setIsCategoryModalOpen(true)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'dashboard' && (
            <AdminDashboard onNavigate={setActiveTab} />
          )}

          {activeTab === 'products' && (
            <ProductManagement
              searchQuery={searchQuery}
              onEditProduct={handleOpenEditProduct}
              onAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManagement
              onOpenAddCategory={() => setIsCategoryModalOpen(true)}
            />
          )}

          {activeTab === 'database' && (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-6 max-w-3xl shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F8F2F4] text-[#4A1525] flex items-center justify-center font-bold border border-[#4A1525]/15">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold font-heading text-stone-900">
                    Supabase Bulut Veritabanı Sync
                  </h2>
                  <p className="text-xs font-bold text-stone-500 mt-0.5">
                    Canlı senkronizasyon ve varsayılan veri yükleme merkezi
                  </p>
                </div>
              </div>

              <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-600 uppercase">Bağlantı Durumu</span>
                  <span className={`px-3 py-1 text-xs font-black rounded-full uppercase ${isSupabaseConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {isSupabaseConnected ? 'Bağlandı & Aktif' : 'Yerel Depolama (Offline)'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Ürünler ve kategoriler Supabase PostgreSQL tablosu ile otomatik senkronize edilir.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={seedSupabaseDatabase}
                  disabled={isLoadingFromSupabase}
                  className="px-6 py-3.5 bg-[#4A1525] hover:bg-[#360F1B] text-white rounded-2xl font-extrabold font-heading text-xs sm:text-sm flex items-center gap-2.5 shadow-md shadow-[#4A1525]/20 cursor-pointer press-trigger transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFromSupabase ? 'animate-spin' : ''}`} />
                  <span>Varsayılan Verileri (Seed) Yükle</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product & Category Modals */}
      <ProductEditorModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      <CategoryEditorModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
