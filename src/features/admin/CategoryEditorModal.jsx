import React, { useState } from 'react';
import { X, Layers, Plus } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function CategoryEditorModal({ isOpen, onClose }) {
  const addCategory = useMenuStore((s) => s.addCategory);

  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('☕');
  const [subtitleTr, setSubtitleTr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [badgeTr, setBadgeTr] = useState('Specialty');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const catPayload = {
      name: { tr: nameTr || 'Yeni Kategori', en: nameEn || nameTr || 'New Category' },
      shortName: { tr: nameTr, en: nameEn || nameTr },
      icon: icon || '☕',
      subtitle: { tr: subtitleTr, en: subtitleEn || subtitleTr },
      badge: { tr: badgeTr, en: badgeTr },
    };

    addCategory(catPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F2F4] text-[#4A1525] flex items-center justify-center font-bold border border-[#4A1525]/15">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-heading text-stone-900">
                Yeni Kategori Ekle
              </h2>
              <p className="text-xs font-bold text-stone-500">
                Menü için yeni bir içecek kategorisi oluşturun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Kategori İkonu (Emoji)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="☕"
              required
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-2xl font-bold text-center text-stone-900 focus:outline-none focus:border-[#4A1525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Kategori Adı (TR 🇹🇷)</label>
            <input
              type="text"
              value={nameTr}
              onChange={(e) => setNameTr(e.target.value)}
              placeholder="Örn: Cold Brew & Refreshers"
              required
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#4A1525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Kategori Adı (EN 🇬🇧)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Cold Brew & Refreshers"
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#4A1525]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Alt Başlık Açıklaması</label>
            <input
              type="text"
              value={subtitleTr}
              onChange={(e) => setSubtitleTr(e.target.value)}
              placeholder="Özel soğuk demlenmiş lezzetler..."
              className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1525]"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360F1B] text-white rounded-2xl font-extrabold font-heading text-xs sm:text-sm shadow-md shadow-[#4A1525]/20 cursor-pointer transition-colors"
              style={{ color: '#FFFFFF' }}
            >
              Kategori Oluştur
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
