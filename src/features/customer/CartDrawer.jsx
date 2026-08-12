import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Hotel, DoorClosed, User, Coffee } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useLanguageStore from '../../store/languageStore';
import { getTranslation } from '../../data/translations';

export default function CartDrawer() {
  const language = useLanguageStore((s) => s.language);
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal());
  const getWhatsAppURL = useCartStore((s) => s.getWhatsAppURL);

  // 3 separate inputs as requested
  const [hotelName, setHotelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const isFormValid = hotelName.trim() !== '' && roomNumber.trim() !== '' && customerName.trim() !== '';

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (!isFormValid) return;
    const url = getWhatsAppURL({
      hotelName,
      roomNumber,
      customerName,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Sliding Sheet */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header — Brand Pantone 7421 C styling */}
          <div className="p-5 sm:p-6 bg-[#4A1525] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black font-heading text-white" style={{ color: '#FFFFFF' }}>
                  {getTranslation(language, 'yourOrder')}
                </h2>
                <p className="text-xs font-bold text-rose-200">
                  {items.length} {getTranslation(language, 'itemsInCart')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 text-rose-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Body: Items + Separate Guest & Hotel Details */}
          <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {items.length > 0 ? (
              <>
                {/* Items List */}
                <div className="space-y-3.5">
                  {items.map((item) => {
                    const prodName = typeof item.product.name === 'object'
                      ? item.product.name[language] || item.product.name.tr
                      : item.product.name;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-stone-200/80 bg-white shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <img
                              src={item.product.image}
                              alt={prodName}
                              className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <h4 className="text-base font-extrabold text-stone-900 font-heading">
                                {prodName}
                              </h4>
                              <p className="text-xs font-black text-[#4A1525] mt-0.5">
                                ₺{item.unitPrice}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Modifiers Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {item.selectedSize && (
                            <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-md text-xs font-bold">
                              {typeof item.selectedSize.name === 'object'
                                ? item.selectedSize.name[language] || item.selectedSize.name.tr
                                : item.selectedSize.name}
                            </span>
                          )}
                          {item.selectedExtras.map((e, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-[#F8F2F4] text-[#4A1525] border border-[#4A1525]/20 rounded-md text-xs font-bold"
                            >
                              + {typeof e.name === 'object' ? e.name[language] || e.name.tr : e.name}
                            </span>
                          ))}
                        </div>

                        {/* Quantity Controls & Line Item Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-black text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white text-stone-900 flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-base font-black font-heading text-stone-900">
                            ₺{item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 3 Separate Inputs Section: Hotel Name, Room Number, Customer Name — Spacious & High Visibility */}
                <div className="bg-[#F8F2F4] p-5 sm:p-6 rounded-3xl border-2 border-[#4A1525]/20 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-1 border-b border-[#4A1525]/15">
                    <Hotel className="w-5 h-5 text-[#4A1525] shrink-0" />
                    <h3 className="text-sm sm:text-base font-extrabold text-[#4A1525] font-heading">
                      {getTranslation(language, 'guestDetailsTitle')}
                    </h3>
                  </div>

                  {/* 1. Hotel Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-[#4A1525]" />
                      <span>{getTranslation(language, 'hotelNameLabel')}</span>
                    </label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder={getTranslation(language, 'hotelNamePlaceholder')}
                      className="w-full bg-white border-2 border-stone-300/80 focus:border-[#4A1525] rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1525]/20 transition-all shadow-xs"
                    />
                  </div>

                  {/* 2. Room Number Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-2">
                      <DoorClosed className="w-4 h-4 text-[#4A1525]" />
                      <span>{getTranslation(language, 'roomNumberLabel')}</span>
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder={getTranslation(language, 'roomNumberPlaceholder')}
                      className="w-full bg-white border-2 border-stone-300/80 focus:border-[#4A1525] rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1525]/20 transition-all shadow-xs"
                    />
                  </div>

                  {/* 3. Customer Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#4A1525]" />
                      <span>{getTranslation(language, 'customerNameLabel')}</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={getTranslation(language, 'customerNamePlaceholder')}
                      className="w-full bg-white border-2 border-stone-300/80 focus:border-[#4A1525] rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1525]/20 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Empty Cart State */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-[#F8F2F4] rounded-full flex items-center justify-center mx-auto text-[#4A1525]">
                  <Coffee className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  {getTranslation(language, 'emptyCartTitle')}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  {getTranslation(language, 'emptyCartSubtitle')}
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#4A1525] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  {getTranslation(language, 'browseMenu')}
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Controls */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200/80 space-y-3 shrink-0">
              {/* Validation Warning Hint */}
              {!isFormValid && (
                <p className="text-xs text-[#4A1525] font-bold text-center bg-[#F8F2F4] border border-[#4A1525]/20 rounded-xl p-2.5">
                  ⚠️ {language === 'tr'
                    ? 'Sipariş vermek için lütfen Otel Adı, Oda Numarası ve Müşteri Adı alanlarını doldurun.'
                    : 'Please fill in Hotel Name, Room Number, and Customer Name to place your order.'}
                </p>
              )}

              {/* Total Summary */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {getTranslation(language, 'totalPrice')}
                </span>
                <span className="text-2xl font-black font-heading text-[#4A1525]">
                  ₺{getTotal}
                </span>
              </div>

              {/* Direct WhatsApp Checkout Button (Disabled when incomplete) */}
              <button
                onClick={handleCheckout}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-2xl font-black font-heading text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/25 press-trigger cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none border border-stone-300'
                }`}
                style={{ color: isFormValid ? '#FFFFFF' : '#A8A29E' }}
              >
                <Send className="w-5 h-5 shrink-0" />
                <span>
                  {getTranslation(language, 'callWaiterOrder')} · ₺{getTotal}
                </span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
