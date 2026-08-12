import React from 'react';
import { X, Clock, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import useLanguageStore from '../../store/languageStore';
import { getTranslation } from '../../data/translations';

// WhatsApp number — pulled from env, matches cartStore
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '905322719155';


export default function ConciergeModal({ isOpen, onClose }) {
  const language = useLanguageStore((s) => s.language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-section-header text-stone-900 font-extrabold">
                {getTranslation(language, 'contactTitle')}
              </h2>
              <p className="text-xs font-semibold text-stone-500 mt-0.5">
                {getTranslation(language, 'contactSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-stone-900">
                {getTranslation(language, 'serviceHoursTitle')}
              </h4>
              <p className="text-sm font-medium text-stone-600 mt-0.5">
                {getTranslation(language, 'serviceHoursValue')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
            <MapPin className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-stone-900">
                {getTranslation(language, 'roomDeliveryLabel')}
              </h4>
              <p className="text-sm font-medium text-stone-600 mt-0.5">
                {getTranslation(language, 'roomDeliveryValue')}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct Action */}
        <div className="pt-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold font-heading text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 press-trigger"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{getTranslation(language, 'chatWhatsApp')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
