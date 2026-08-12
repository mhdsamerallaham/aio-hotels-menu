import React, { useState, useEffect, useMemo } from 'react';
import useMenuStore from '../store/menuStore';
import useLanguageStore from '../store/languageStore';
import CustomerHeader from '../features/customer/CustomerHeader';
import CategoryNav from '../features/customer/CategoryNav';
import ProductCatalog from '../features/customer/ProductCatalog';
import DrinkCustomizerModal from '../features/customer/DrinkCustomizerModal';
import CartDrawer from '../features/customer/CartDrawer';
import ConciergeModal from '../features/customer/ConciergeModal';
import CustomerFooter from '../features/customer/CustomerFooter';
import AdminSaaSApp from '../features/admin/AdminSaaSApp';
import { getLocalizedProduct } from '../data/menu';

// ─────────────────────────────────────────────────────────────
// AppShell — Root application shell
//
// Responsibilities:
//   • Route between customer app and admin panel
//   • Manage global customer UI state
//   • Render the single customer layout: Header → CategoryNav → Main → Footer
//   • Render overlays: Product Customizer, Cart Drawer, Concierge Modal
//
// Admin is accessed exclusively via the /admin URL path.
// There is NO admin button visible to customers anywhere in this shell.
// ─────────────────────────────────────────────────────────────

export default function AppShell() {
  const categories       = useMenuStore((s) => s.categories);
  const products         = useMenuStore((s) => s.products);
  const fetchFromSupabase = useMenuStore((s) => s.fetchFromSupabase);
  const language         = useLanguageStore((s) => s.language);

  // ── Customer UI State ──────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState(
    () => categories[0]?.id || 'coffee-rituals'
  );
  const [searchQuery,      setSearchQuery]     = useState('');
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isConciergeOpen,  setIsConciergeOpen]  = useState(false);

  // ── Admin routing state ────────────────────────────────────
  const [isAdminMode, setIsAdminMode] = useState(false);

  // ── Bootstrap: Supabase sync ───────────────────────────────
  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  // ── Sync active category when categories reload ───────────
  useEffect(() => {
    if (
      categories.length > 0 &&
      !categories.some((c) => c.id === activeCategory)
    ) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // ── Admin routing — URL-only, no customer-visible trigger ─
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      setIsAdminMode(path === '/admin' || path.startsWith('/admin/'));
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  // ── Filtered products (category or search) ────────────────
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      return products.filter((p) => {
        const loc = getLocalizedProduct(p, language);
        return (
          loc.name.toLowerCase().includes(query) ||
          loc.description.toLowerCase().includes(query)
        );
      });
    }

    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory, searchQuery, language]);

  // ── Handlers ──────────────────────────────────────────────
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsCustomizerOpen(true);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
  };

  const handleExitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminMode(false);
  };

  // ── Admin mode renders separately ─────────────────────────
  if (isAdminMode) {
    return <AdminSaaSApp onExitAdmin={handleExitAdmin} />;
  }

  // ── Customer experience ────────────────────────────────────
  return (
    <div className="customer-root">

      {/* ① Sticky Header — logo, cart trigger, language, concierge */}
      <CustomerHeader
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* ② Sticky Category Pills — below header */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* ③ Main Content Area */}
      <main className="customer-main" id="main-content">
        <div className="app-max-width py-8 sm:py-10 pb-safe-large">
          <ProductCatalog
            products={filteredProducts}
            activeCategory={activeCategory}
            activeTab="menu"
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      {/* ④ Footer — Pantone 7421 C dark luxury footer */}
      <CustomerFooter />

      {/* ── Overlays ─────────────────────────────────────────── */}

      {/* Product Customizer / Detail Sheet */}
      <DrinkCustomizerModal
        product={selectedProduct}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          // Small delay before clearing product to prevent flicker during close animation
          setTimeout(() => setSelectedProduct(null), 300);
        }}
      />

      {/* Cart Drawer — self-contained, reads cartStore directly */}
      <CartDrawer />

      {/* Concierge / Room Service Info Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

    </div>
  );
}
