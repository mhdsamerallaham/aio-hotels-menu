import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const adminLogin = useMenuStore((s) => s.adminLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = adminLogin(password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Geçersiz yönetici şifresi. (Varsayılan: 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img
            src="/images/logo.png"
            alt="AIO Coffee"
            className="h-12 w-auto object-contain mx-auto mb-2"
          />
          <h2 className="text-2xl font-extrabold font-heading text-[#4A1525]">
            Yönetici Paneli
          </h2>
          <p className="text-sm font-medium text-stone-500">
            Menü, ürün ve stok yönetimi için lütfen şifrenizi girin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
              Yönetici Şifresi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin (Örn: 1234)"
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3.5 text-base font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#4A1525] focus:ring-4 focus:ring-[#4A1525]/10 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#4A1525] hover:bg-[#360F1B] text-white font-extrabold font-heading rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-[#4A1525]/25 press-trigger cursor-pointer transition-colors"
          >
            <span>Giriş Yap</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center">
          <span className="text-xs font-bold text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4A1525]" />
            Güvenli Yönetim Portalı · AIO Coffee 2026
          </span>
        </div>
      </div>
    </div>
  );
}

