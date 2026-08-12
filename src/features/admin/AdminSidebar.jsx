import React from 'react';
import { LayoutDashboard, Coffee, Layers, Database, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function AdminSidebar({ activeTab, setActiveTab, onExitAdmin }) {
  const adminLogout = useMenuStore((s) => s.adminLogout);
  const isSupabaseConnected = useMenuStore((s) => s.isSupabaseConnected);

  const handleLogout = () => {
    adminLogout();
    onExitAdmin();
  };

  const navItems = [
    { id: 'dashboard', label: 'Genel Özet', icon: LayoutDashboard },
    { id: 'products', label: 'Ürün Yönetimi', icon: Coffee },
    { id: 'categories', label: 'Kategori Yönetimi', icon: Layers },
    { id: 'database', label: 'Veritabanı Sync', icon: Database },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-white border-r border-stone-200 flex flex-col justify-between p-5 shrink-0 min-h-screen shadow-xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-stone-100 pb-4">
          <img
            src="/images/logo.png"
            alt="AIO Coffee"
            className="h-10 w-auto object-contain"
          />
          <div>
            <h2 className="text-base font-extrabold font-heading text-stone-900 tracking-tight">
              Yönetim Portalı
            </h2>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4A1525]">
              AIO Coffee 2026
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-xs font-black uppercase tracking-wider text-stone-400 mb-2">
            Menü Gezintisi
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold font-heading text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A1525] text-white shadow-md shadow-[#4A1525]/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Status & Logout */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        {/* Supabase connection badge */}
        <div className="px-3.5 py-3 bg-[#F8F2F4] border border-[#4A1525]/15 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs font-extrabold text-[#4A1525]">
              {isSupabaseConnected ? 'Cloud Supabase Active' : 'Yerel Depolama'}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-stone-400" />
            <span>Müşteri Menüsünü Aç</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

