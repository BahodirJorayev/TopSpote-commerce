import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// SUPABASE TABLE SQL (run in Supabase SQL Editor):
// ==========================================
// CREATE TABLE topspot_listings (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   title TEXT NOT NULL,
//   category TEXT NOT NULL,
//   category_name TEXT NOT NULL,
//   daily_price INTEGER NOT NULL DEFAULT 0,
//   hourly_price INTEGER NOT NULL DEFAULT 0,
//   owner_name TEXT NOT NULL,
//   phone TEXT NOT NULL,
//   address TEXT DEFAULT '',
//   lat DOUBLE PRECISION,
//   lng DOUBLE PRECISION,
//   description TEXT DEFAULT '',
//   image_url TEXT DEFAULT '',
//   receipt_url TEXT DEFAULT '',
//   tariff TEXT DEFAULT 'standard' CHECK (tariff IN ('standard','vip','top')),
//   status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved')),
//   created_at TIMESTAMPTZ DEFAULT now()
// );
//
// -- RLS (Row Level Security)
// ALTER TABLE topspot_listings ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Anyone can read approved" ON topspot_listings FOR SELECT USING (status = 'approved');
// CREATE POLICY "Anyone can insert" ON topspot_listings FOR INSERT WITH CHECK (true);
