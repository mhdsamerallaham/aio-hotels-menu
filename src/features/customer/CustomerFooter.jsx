import React from 'react';
import { Coffee, Clock, BellRing, Hotel } from 'lucide-react';
import useLanguageStore from '../../store/languageStore';

export default function CustomerFooter() {
  const language = useLanguageStore((s) => s.language);

  return (
    <footer className="bg-[#2C0D16] text-white border-t border-[#4A1525] relative overflow-hidden" role="contentinfo">
      {/* Subtle ambient lighting */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4A1525]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="app-max-width py-10 sm:py-12 relative z-10 space-y-8">
        
        {/* Main Clean Row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-8 border-b border-[#4A1525]/70 text-center md:text-left">
          
          {/* Brand & Room Service Info */}
          <div className="space-y-3 max-w-md">
            <div className="flex justify-center md:justify-start">
              <img
                src="/images/logo.png"
                alt="AIO Coffee"
                className="h-12 sm:h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
              {language === 'tr'
                ? 'Sadece Otel Oda Hizmeti. Özel kahve ritüelleri ve gurme lezzetler odanıza servis edilir.'
                : 'Hotel Room Service Only. Craft coffee rituals & gourmet delicacies delivered directly to your room.'}
            </p>
          </div>

          {/* Quick Key Cards: Hours & Hotel Service */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-white text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-3 bg-[#4A1525] px-4 py-3 rounded-2xl border border-white/20 shadow-sm">
              <Clock className="w-4 h-4 text-white shrink-0" />
              <span className="text-white">09:00 - 22:00 Lounge & Bar</span>
            </div>

            <div className="flex items-center gap-3 bg-[#4A1525] px-4 py-3 rounded-2xl border border-white/20 shadow-sm">
              <Hotel className="w-4 h-4 text-white shrink-0" />
              <span className="text-white">
                {language === 'tr' ? 'Sadece Otel Oda Hizmeti' : 'Hotel Room Service Only'}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white font-heading">
          <p className="text-white font-medium">© 2026 AIO Coffee. All rights reserved.</p>
          <p className="font-extrabold text-white tracking-wide">
            Made by <a href="https://samer.life" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-rose-200 transition-colors">samer.life</a>
          </p>
        </div>

      </div>
    </footer>
  );
}
