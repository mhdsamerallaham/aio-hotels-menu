import { create } from 'zustand';
import useLanguageStore from './languageStore';

// WhatsApp number from env — format: country code + number, no leading zero or +
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '905322719155';

const calculateItemPrice = (product, selectedSize, selectedExtras) => {
  const sizePrice = selectedSize?.price || 0;
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  return product.basePrice + sizePrice + extrasPrice;
};

const useCartStore = create((set, get) => ({
  items: [],
  isCartOpen: false,

  // Toggle cart view
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // Add item to cart
  addToCart: (product, selectedSize, selectedExtras, quantity = 1) => {
    const cartItem = {
      id: `${product.id}-${selectedSize?.name || 'default'}-${selectedExtras.map(e => e.name).sort().join(',')}`,
      product,
      selectedSize,
      selectedExtras,
      quantity,
      unitPrice: calculateItemPrice(product, selectedSize, selectedExtras),
    };

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === cartItem.id);

      if (existingIndex >= 0) {
        // Increment quantity of existing item
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { items: updatedItems };
      }

      // Add new item
      return { items: [...state.items, cartItem] };
    });
  },

  // Remove item from cart
  removeFromCart: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  // Update quantity
  updateQuantity: (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  },

  // Clear cart
  clearCart: () => set({ items: [], isCartOpen: false }),

  // Get total price
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  },

  // Get total item count
  getTotalCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  // Generate WhatsApp message in active language
  generateWhatsAppMessage: (langOverride) => {
    const lang = langOverride || useLanguageStore.getState().language || 'tr';
    const { items } = get();
    const total = get().getTotal();

    const isTr = lang === 'tr';

    const itemLines = items.map((item) => {
      const prodName = typeof item.product.name === 'object' ? item.product.name[lang] || item.product.name.tr : item.product.name;
      let line = `${item.quantity}x ${prodName}`;
      const options = [];
      if (item.selectedSize) {
        const sizeName = typeof item.selectedSize.name === 'object' ? item.selectedSize.name[lang] || item.selectedSize.name.tr : item.selectedSize.name;
        options.push(sizeName);
      }
      if (item.selectedExtras.length > 0) {
        options.push(...item.selectedExtras.map((e) => typeof e.name === 'object' ? e.name[lang] || e.name.tr : e.name));
      }
      if (options.length > 0) {
        line += ` (${options.join(', ')})`;
      }
      return line;
    });

    const header = isTr ? '🍹 Yeni Sipariş (AIO Coffee):' : '🍹 New Order (AIO Coffee):';
    const totalText = isTr ? `Toplam Tutar: ₺${total}` : `Total Amount: ₺${total}`;

    return `${header}\n\n${itemLines.join('\n')}\n\n${totalText}`;
  },

  // Get WhatsApp URL with Hotel Name, Room Number & Customer Name
  getWhatsAppURL: (details = {}) => {
    const lang = useLanguageStore.getState().language || 'tr';
    let message = get().generateWhatsAppMessage(lang);

    const isTr = lang === 'tr';

    // Backwards compatibility if string is passed
    const hotelName = typeof details === 'string' ? '' : (details.hotelName || '');
    const roomNumber = typeof details === 'string' ? details : (details.roomNumber || '');
    const customerName = typeof details === 'string' ? '' : (details.customerName || '');

    const metaLines = [];
    if (hotelName.trim()) {
      metaLines.push(isTr ? `🏨 Otel Adı: ${hotelName.trim()}` : `🏨 Hotel Name: ${hotelName.trim()}`);
    }
    if (roomNumber.trim()) {
      metaLines.push(isTr ? `🚪 Oda No: ${roomNumber.trim()}` : `🚪 Room No: ${roomNumber.trim()}`);
    }
    if (customerName.trim()) {
      metaLines.push(isTr ? `👤 Müşteri Adı: ${customerName.trim()}` : `👤 Guest Name: ${customerName.trim()}`);
    }

    if (metaLines.length > 0) {
      message += `\n\n${metaLines.join('\n')}`;
    }

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  },
}));

export default useCartStore;
