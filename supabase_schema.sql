-- ============================================================
-- AIO Coffee — Supabase SQL Database Schema & RLS Setup
-- Run this script first in Supabase SQL Editor!
-- ============================================================

-- 1. Create 'categories' table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name JSONB NOT NULL,
    short_name JSONB,
    icon TEXT,
    subtitle JSONB,
    badge JSONB,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'products' table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name JSONB NOT NULL,
    description JSONB,
    image TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sizes JSONB DEFAULT '[]'::jsonb,
    extras JSONB DEFAULT '[]'::jsonb,
    option_groups JSONB DEFAULT '[]'::jsonb,
    popular BOOLEAN DEFAULT false,
    location TEXT DEFAULT 'Şişli',
    vat_rate NUMERIC(5, 2) DEFAULT 10,
    status TEXT DEFAULT 'Active',
    display BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Public Access (Read & Write)
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public All Categories" ON public.categories;
CREATE POLICY "Public All Categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public All Products" ON public.products;
CREATE POLICY "Public All Products" ON public.products FOR ALL USING (true);
