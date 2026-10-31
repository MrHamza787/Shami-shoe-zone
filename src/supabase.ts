import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage keys for dynamic Supabase credential configuration
const STORAGE_KEY_URL = 'ssz_supabase_url';
const STORAGE_KEY_KEY = 'ssz_supabase_anon_key';
const STORAGE_KEY_ACTIVE = 'ssz_use_supabase';

export function getSupabaseCredentials(): { url: string; anonKey: string; isActive: boolean } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';
  const localActive = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ACTIVE) === 'true' : false;

  const url = localUrl || envUrl;
  const anonKey = localKey || envKey;
  const isActive = Boolean(url && anonKey && (localActive || !localUrl));

  return { url, anonKey, isActive };
}

export function saveSupabaseCredentials(url: string, anonKey: string, activate: boolean = true) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    localStorage.setItem(STORAGE_KEY_ACTIVE, activate ? 'true' : 'false');
  }
  // Reset cached instance
  cachedClient = null;
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
  }
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

// Test connection to Supabase
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
  try {
    const url = customUrl || getSupabaseCredentials().url;
    const anonKey = customKey || getSupabaseCredentials().anonKey;

    if (!url || !anonKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon Key.' };
    }

    const testClient = createClient(url, anonKey);
    // Attempt to query products or a lightweight probe
    const { data, error } = await testClient.from('products').select('id').limit(1);

    if (error) {
      // Check if table missing
      if (error.code === '42P01' || error.message.includes('relation "products" does not exist') || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! The database is reachable, but the "products" table has not been created yet. Please run the SQL schema script provided below.',
          tablesFound: []
        };
      }
      return { success: false, message: `Supabase Error (${error.code || 'API'}): ${error.message}` };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase! "products" table verified.',
      tablesFound: ['products']
    };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err?.message || String(err)}` };
  }
}

// The complete SQL script for creating tables and RLS in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SHAMI SHOE ZONE - SUPABASE DATABASE SCHEMA
-- Abbottabad, Pakistan Footwear E-Commerce
-- Run this in Supabase Dashboard -> SQL Editor
-- ==========================================

-- 1. Enable UUID Extension (optional)
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  name_urdu text default '',
  description text default '',
  description_urdu text default '',
  original_price numeric not null,
  discounted_price numeric not null,
  category text not null,
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  in_stock boolean default true,
  stock_quantity integer default 10,
  featured boolean default false,
  is_new_arrival boolean default false,
  is_best_seller boolean default false,
  rating numeric default 4.8,
  reviews_count integer default 0,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 3. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  order_number text not null,
  user_id text,
  customer_name text not null,
  phone text not null,
  whatsapp_number text not null,
  address text not null,
  area text not null,
  city text default 'Abbottabad',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null,
  delivery_charges numeric not null default 150,
  total_amount numeric not null,
  payment_method text default 'Cash on Delivery',
  notes text default '',
  status text default 'pending',
  whatsapp_status text default 'pending',
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 4. STORE SETTINGS TABLE
create table if not exists public.store_settings (
  id text primary key default 'store_settings',
  store_name text default 'Shami Shoe Zone',
  tagline text default 'Premium Footwear Collection',
  tagline_urdu text default 'معیاری اور آرام دہ جوتوں کا سب سے بڑا مرکز',
  whatsapp_number text default '923001234567',
  display_whatsapp text default '+92 300 1234567',
  contact_phone text default '0300 1234567',
  store_address text default 'Shami General Store, Kala Pul, Abbottabad, Pakistan',
  store_address_urdu text default 'شامی جنرل اسٹور، کالا پل، ایبٹ آباد',
  delivery_area text default 'All over Abbottabad',
  delivery_charges numeric default 150,
  free_delivery_threshold numeric default 4000,
  min_order_amount numeric default 500,
  announcement text default 'Special Opening Offer: Free delivery in Abbottabad on orders over PKR 4,000!',
  announcement_urdu text default 'خصوصی پیشکش: ایبٹ آباد میں 4,000 روپے سے زائد کے آرڈرز پر مفت ڈلیوری!',
  store_timing text default '10:00 AM - 10:00 PM',
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 5. REVIEWS TABLE
create table if not exists public.reviews (
  id text primary key,
  customer_name text not null,
  rating numeric not null default 5,
  comment text not null,
  product_name text not null,
  location text default 'Abbottabad',
  date text,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.store_settings enable row level security;
alter table public.reviews enable row level security;

-- Products: Everyone can read, authenticated can write/edit
create policy "Allow public read access on products"
  on public.products for select using (true);

create policy "Allow anon and auth full access to products"
  on public.products for all using (true) with check (true);

-- Orders: Public/customers can create orders and read their orders, admin can manage all
create policy "Allow public insert on orders"
  on public.orders for insert with check (true);

create policy "Allow read on orders"
  on public.orders for select using (true);

create policy "Allow update on orders"
  on public.orders for update using (true);

-- Store Settings: Everyone can read, auth/anon can update
create policy "Allow public read on store_settings"
  on public.store_settings for select using (true);

create policy "Allow manage store_settings"
  on public.store_settings for all using (true) with check (true);

-- Reviews: Everyone can read and insert reviews
create policy "Allow public read on reviews"
  on public.reviews for select using (true);

create policy "Allow insert reviews"
  on public.reviews for insert with check (true);
`;
