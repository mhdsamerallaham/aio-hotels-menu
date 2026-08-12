import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { categories as initialCategories, products as initialProducts } from '../data/menu';
import { supabase } from '../lib/supabase';

const useMenuStore = create(
  persist(
    (set, get) => ({
      categories: initialCategories,
      products: initialProducts,
      isAdminLoggedIn: false,
      isLoadingFromSupabase: false,
      isSupabaseConnected: false,
      supabaseError: null,

      // Admin Auth
      adminLogin: (password) => {
        if (password === 'admin' || password === '1234' || password === 'aio2026') {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminLoggedIn: false }),

      // ── Supabase Integration Methods ──

      // Fetch all categories and products from Supabase
      fetchFromSupabase: async () => {
        set({ isLoadingFromSupabase: true, supabaseError: null });
        try {
          // Fetch Categories
          const { data: dbCategories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

          if (catError) throw catError;

          // Fetch Products
          const { data: dbProducts, error: prodError } = await supabase
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true });

          if (prodError) throw prodError;

          if (dbCategories && dbCategories.length > 0) {
            const formattedCategories = dbCategories.map((c) => ({
              id: c.id,
              name: c.name,
              shortName: c.short_name || c.name,
              icon: c.icon,
              subtitle: c.subtitle,
              badge: c.badge,
            }));

            const formattedProducts = (dbProducts || []).map((p) => ({
              id: p.id,
              category: p.category_id,
              name: p.name,
              description: p.description,
              image: p.image,
              basePrice: Number(p.base_price) || 0,
              sizes: p.sizes || [],
              extras: p.extras || [],
              popular: Boolean(p.popular),
              location: p.location || 'Şişli',
              vatRate: Number(p.vat_rate) || 10,
              status: p.status || 'Active',
              display: p.display !== false,
            }));

            set({
              categories: formattedCategories,
              products: formattedProducts,
              isSupabaseConnected: true,
              isLoadingFromSupabase: false,
            });
            console.log('✅ Successfully loaded menu data from Supabase DB');
          } else {
            // Database tables exist but are empty -> trigger auto-seed
            console.log('⚡ Supabase database empty, triggering auto-seed...');
            set({ isSupabaseConnected: true, isLoadingFromSupabase: false });
            await get().seedSupabaseDatabase();
          }
        } catch (err) {
          console.warn('⚠️ Supabase sync note:', err.message);
          set({
            isSupabaseConnected: false,
            isLoadingFromSupabase: false,
            supabaseError: err.message,
          });
        }
      },

      // Seed local data into Supabase Database
      seedSupabaseDatabase: async () => {
        try {
          set({ isLoadingFromSupabase: true });
          const currentCategories = get().categories.length > 0 ? get().categories : initialCategories;
          const currentProducts = get().products.length > 0 ? get().products : initialProducts;

          // 1. Seed Categories
          for (let idx = 0; idx < currentCategories.length; idx++) {
            const cat = currentCategories[idx];
            await supabase.from('categories').upsert({
              id: cat.id,
              name: cat.name,
              short_name: cat.shortName || cat.name,
              icon: cat.icon,
              subtitle: cat.subtitle,
              badge: cat.badge,
              sort_order: idx,
            });
          }

          // 2. Seed Products
          for (let idx = 0; idx < currentProducts.length; idx++) {
            const prod = currentProducts[idx];
            await supabase.from('products').upsert({
              id: prod.id,
              category_id: prod.category,
              name: prod.name,
              description: prod.description,
              image: prod.image,
              base_price: prod.basePrice,
              sizes: prod.sizes || [],
              extras: prod.extras || [],
              popular: prod.popular || false,
              location: prod.location || 'Şişli',
              vat_rate: prod.vatRate || 10,
              status: prod.status || 'Active',
              display: prod.display !== false,
              sort_order: idx,
            });
          }

          set({ isSupabaseConnected: true, isLoadingFromSupabase: false });
          console.log('🎉 Successfully seeded all categories and products to Supabase!');
          await get().fetchFromSupabase();
        } catch (err) {
          console.error('Failed to seed Supabase database:', err);
          set({ isLoadingFromSupabase: false, supabaseError: err.message });
        }
      },

      // Helper to format string/object fields into proper jsonb format for Supabase
      formatJsonbField: (val) => {
        if (typeof val === 'object' && val !== null) return val;
        return { tr: String(val || ''), en: String(val || '') };
      },

      // ── Product Actions (Local + Supabase Sync) ──
      addProduct: async (newProduct) => {
        const id = newProduct.id || `product-${Date.now()}`;
        const productToAdd = {
          ...newProduct,
          id,
          basePrice: Number(newProduct.basePrice) || 0,
          sizes: newProduct.sizes || [],
          extras: newProduct.extras || [],
        };

        // 1. Local Zustand Update
        set((state) => ({
          products: [productToAdd, ...state.products],
        }));

        // 2. Supabase DB Insert
        try {
          const formattedName = typeof productToAdd.name === 'object' ? productToAdd.name : { tr: productToAdd.name, en: productToAdd.name };
          const formattedDesc = typeof productToAdd.description === 'object' ? productToAdd.description : { tr: productToAdd.description || '', en: productToAdd.description || '' };

          await supabase.from('products').insert({
            id: productToAdd.id,
            category_id: productToAdd.category,
            name: formattedName,
            description: formattedDesc,
            image: productToAdd.image,
            base_price: productToAdd.basePrice,
            sizes: productToAdd.sizes,
            extras: productToAdd.extras,
            popular: productToAdd.popular || false,
            location: productToAdd.location || 'Şişli',
            vat_rate: productToAdd.vatRate || 10,
            status: productToAdd.status || 'Active',
            display: productToAdd.display !== false,
          });
        } catch (err) {
          console.warn('Supabase product insert error:', err);
        }
      },

      updateProduct: async (productId, updatedFields) => {
        // 1. Local Zustand Update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updatedFields } : p
          ),
        }));

        // 2. Supabase DB Update
        try {
          const payload = {};
          if (updatedFields.category !== undefined) payload.category_id = updatedFields.category;
          if (updatedFields.name !== undefined) {
            payload.name = typeof updatedFields.name === 'object' ? updatedFields.name : { tr: updatedFields.name, en: updatedFields.name };
          }
          if (updatedFields.description !== undefined) {
            payload.description = typeof updatedFields.description === 'object' ? updatedFields.description : { tr: updatedFields.description, en: updatedFields.description };
          }
          if (updatedFields.image !== undefined) payload.image = updatedFields.image;
          if (updatedFields.basePrice !== undefined) payload.base_price = updatedFields.basePrice;
          if (updatedFields.sizes !== undefined) payload.sizes = updatedFields.sizes;
          if (updatedFields.extras !== undefined) payload.extras = updatedFields.extras;
          if (updatedFields.popular !== undefined) payload.popular = updatedFields.popular;
          if (updatedFields.display !== undefined) payload.display = updatedFields.display;

          if (Object.keys(payload).length > 0) {
            const { error } = await supabase.from('products').update(payload).eq('id', productId);
            if (error) console.error('Error updating product in Supabase:', error.message);
            else console.log(`✅ Supabase product ${productId} updated successfully.`);
          }
        } catch (err) {
          console.warn('Supabase product update error:', err);
        }
      },

      deleteProduct: async (productId) => {
        // 1. Local Zustand Update
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));

        // 2. Supabase DB Delete
        try {
          await supabase.from('products').delete().eq('id', productId);
        } catch (err) {
          console.warn('Supabase product delete error:', err);
        }
      },

      togglePopular: async (productId) => {
        const product = get().products.find((p) => p.id === productId);
        const newPopular = !product?.popular;

        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, popular: newPopular } : p
          ),
        }));

        try {
          await supabase.from('products').update({ popular: newPopular }).eq('id', productId);
        } catch (err) {
          console.warn('Supabase togglePopular error:', err);
        }
      },

      // Custom Option Groups (Seçim Grupları & Opsiyonlar) Actions Per Product
      addOptionGroupToProduct: (productId, groupObj) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const currentGroups = p.option_groups || p.optionGroups || [];
              const newGroups = [...currentGroups, groupObj];
              supabase.from('products').update({ option_groups: newGroups }).eq('id', productId).then();
              return { ...p, option_groups: newGroups, optionGroups: newGroups };
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      deleteOptionGroupFromProduct: (productId, groupId) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const currentGroups = p.option_groups || p.optionGroups || [];
              const newGroups = currentGroups.filter((g) => g.id !== groupId && g.name !== groupId);
              supabase.from('products').update({ option_groups: newGroups }).eq('id', productId).then();
              return { ...p, option_groups: newGroups, optionGroups: newGroups };
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      addOptionToGroup: (productId, groupId, optionObj) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const currentGroups = p.option_groups || p.optionGroups || [];
              const newGroups = currentGroups.map((g) => {
                if (g.id === groupId || g.name === groupId) {
                  return { ...g, options: [...(g.options || []), optionObj] };
                }
                return g;
              });
              supabase.from('products').update({ option_groups: newGroups }).eq('id', productId).then();
              return { ...p, option_groups: newGroups, optionGroups: newGroups };
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      deleteOptionFromGroup: (productId, groupId, optionIdentifier) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const currentGroups = p.option_groups || p.optionGroups || [];
              const newGroups = currentGroups.map((g) => {
                if (g.id === groupId || g.name === groupId) {
                  const filteredOptions = (g.options || []).filter(
                    (o) => o.id !== optionIdentifier && o.name !== optionIdentifier
                  );
                  return { ...g, options: filteredOptions };
                }
                return g;
              });
              supabase.from('products').update({ option_groups: newGroups }).eq('id', productId).then();
              return { ...p, option_groups: newGroups, optionGroups: newGroups };
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      // Category Actions
      addCategory: async (newCategory) => {
        const id = newCategory.id || newCategory.name.toLowerCase().replace(/\s+/g, '-');
        const catToAdd = {
          ...newCategory,
          id,
          badge: newCategory.badge || 'Specialty',
        };

        set((state) => ({
          categories: [...state.categories, catToAdd],
        }));

        try {
          await supabase.from('categories').insert({
            id: catToAdd.id,
            name: catToAdd.name,
            short_name: catToAdd.shortName || catToAdd.name,
            icon: catToAdd.icon,
            subtitle: catToAdd.subtitle,
            badge: catToAdd.badge,
            sort_order: get().categories.length,
          });
        } catch (err) {
          console.warn('Supabase addCategory error:', err);
        }
      },

      deleteCategory: async (categoryId) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
          products: state.products.filter((p) => p.category !== categoryId),
        }));

        try {
          await supabase.from('categories').delete().eq('id', categoryId);
        } catch (err) {
          console.warn('Supabase deleteCategory error:', err);
        }
      },

      // Reset to original default data
      resetToDefaultMenu: () => {
        set({
          categories: initialCategories,
          products: initialProducts,
        });
      },
    }),
    {
      name: 'aio-menu-storage-v18cat-supabase',
    }
  )
);

export default useMenuStore;
