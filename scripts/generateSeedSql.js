import fs from 'fs';
import path from 'path';
import { categories, products } from '../src/data/menu.js';

function generateSql() {
  let sql = `-- ====================================================\n`;
  sql += `-- AIO Coffee — Supabase Seed SQL Data (12 Categories + Products)\n`;
  sql += `-- ====================================================\n\n`;

  // 1. Categories
  sql += `-- 1. SEED CATEGORIES\n`;
  categories.forEach((cat, idx) => {
    const id = `'${cat.id}'`;
    const name = `'${JSON.stringify(cat.name).replace(/'/g, "''")}'::jsonb`;
    const shortName = `'${JSON.stringify(cat.shortName || cat.name).replace(/'/g, "''")}'::jsonb`;
    const icon = `'${cat.icon}'`;
    const subtitle = `'${JSON.stringify(cat.subtitle || {}).replace(/'/g, "''")}'::jsonb`;
    const badge = `'${JSON.stringify(cat.badge || {}).replace(/'/g, "''")}'::jsonb`;

    sql += `INSERT INTO public.categories (id, name, short_name, icon, subtitle, badge, sort_order)\n`;
    sql += `VALUES (${id}, ${name}, ${shortName}, ${icon}, ${subtitle}, ${badge}, ${idx})\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, icon = EXCLUDED.icon, subtitle = EXCLUDED.subtitle, badge = EXCLUDED.badge;\n\n`;
  });

  // 2. Products
  sql += `-- 2. SEED PRODUCTS\n`;
  products.forEach((prod, idx) => {
    const id = `'${prod.id}'`;
    const categoryId = `'${prod.category}'`;
    const name = `'${JSON.stringify(prod.name).replace(/'/g, "''")}'::jsonb`;
    const description = `'${JSON.stringify(prod.description || {}).replace(/'/g, "''")}'::jsonb`;
    const image = `'${prod.image}'`;
    const basePrice = prod.basePrice || 0;
    const sizes = `'${JSON.stringify(prod.sizes || []).replace(/'/g, "''")}'::jsonb`;
    const extras = `'${JSON.stringify(prod.extras || []).replace(/'/g, "''")}'::jsonb`;
    const popular = prod.popular ? 'true' : 'false';
    const location = `'${prod.location || 'Şişli'}'`;
    const vatRate = prod.vatRate || 10;
    const status = `'${prod.status || 'Active'}'`;
    const display = prod.display !== false ? 'true' : 'false';

    sql += `INSERT INTO public.products (id, category_id, name, description, image, base_price, sizes, extras, popular, location, vat_rate, status, display, sort_order)\n`;
    sql += `VALUES (${id}, ${categoryId}, ${name}, ${description}, ${image}, ${basePrice}, ${sizes}, ${extras}, ${popular}, ${location}, ${vatRate}, ${status}, ${display}, ${idx})\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, image = EXCLUDED.image, base_price = EXCLUDED.base_price, sizes = EXCLUDED.sizes, extras = EXCLUDED.extras, popular = EXCLUDED.popular, display = EXCLUDED.display;\n\n`;
  });

  const outputPath = path.join(process.cwd(), 'supabase_seed.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log('Successfully generated supabase_seed.sql');
}

generateSql();
