import { createClient } from '@supabase/supabase-js';
import { categories, products } from '../src/data/menu.js';

const supabaseUrl = 'https://ykbqyiproqcfgdgjyuve.supabase.co';
const supabaseKey = 'sb_publishable_x20ta_exCr6-s41mvU6Qeg_v5srwvk3';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Starting Supabase Seeding ---');
  
  // 1. Seed Categories
  for (let index = 0; index < categories.length; index++) {
    const cat = categories[index];
    const { data, error } = await supabase.from('categories').upsert({
      id: cat.id,
      name: cat.name,
      short_name: cat.shortName || cat.name,
      icon: cat.icon,
      subtitle: cat.subtitle,
      badge: cat.badge,
      sort_order: index,
    });

    if (error) {
      console.error(`Error inserting category ${cat.id}:`, error.message);
    } else {
      console.log(`Successfully seeded category: ${cat.id}`);
    }
  }

  // 2. Seed Products
  for (let index = 0; index < products.length; index++) {
    const prod = products[index];
    const { data, error } = await supabase.from('products').upsert({
      id: prod.id,
      category_id: prod.category,
      name: prod.name,
      description: prod.description,
      image: prod.image,
      base_price: prod.basePrice,
      sizes: prod.sizes || [],
      extras: prod.extras || [],
      option_groups: prod.option_groups || prod.optionGroups || [],
      popular: prod.popular || false,
      location: prod.location || 'Şişli',
      vat_rate: prod.vatRate || 10,
      status: prod.status || 'Active',
      display: prod.display !== undefined ? prod.display : true,
      sort_order: index,
    });

    if (error) {
      console.error(`Error inserting product ${prod.id}:`, error.message);
    } else {
      console.log(`Successfully seeded product: ${prod.name.tr || prod.id}`);
    }
  }

  console.log('--- Supabase Seeding Complete ---');
}

seed().catch(console.error);
