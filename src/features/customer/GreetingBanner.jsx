import React from 'react';
import { Search, X } from 'lucide-react';
import useLanguageStore from '../../store/languageStore';

export default function GreetingBanner({ searchQuery, setSearchQuery }) {
  const language = useLanguageStore((s) => s.language);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'tr') {
      if (hour < 12) return 'Günaydın ☀️';
      if (hour < 18) return 'Tünaydın ☕';
      return 'İyi Akşamlar 🌙';
    } else {
      if (hour < 12) return 'Good Morning ☀️';
      if (hour < 18) return 'Good Afternoon ☕';
      return 'Good Evening 🌙';
    }
  };

  return (
    <div className="bg-stone-900 text-white py-8 sm:py-10 px-4 sm:px-8 rounded-3xl my-6 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl space-y-4 relative z-10">
        <div>
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest block mb-1 font-heading">
            AIO Hotel & Lounge Rituals
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
            {getGreeting()}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-medium mt-1">
            {language === 'tr'
              ? 'Bugün sizin için ne hazırlayalım?'
              : 'What handcrafted drink would you like today?'}
          </p>
        </div>

        {/* Real-time Search Input */}
        <div className="relative pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'tr'
                ? 'Kahve, matcha, cold brew veya tatlı ara...'
                : 'Search coffee, matcha, cold brew, or desserts...'
            }
            className="w-full bg-white text-stone-900 placeholder:text-stone-400 rounded-2xl pl-12 pr-10 py-3.5 text-base font-medium border-2 border-transparent focus:border-amber-500 focus:outline-none transition-all shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
