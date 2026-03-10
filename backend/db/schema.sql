-- Run this exact SQL in your Supabase SQL Editor to set up the database

-- 1. Create queries table
CREATE TABLE IF NOT EXISTS queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  email TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,   -- 'affiliate_click', 'gumroad_sale', 'email_capture'
  keyword TEXT,
  revenue DECIMAL(10,2) DEFAULT 0,
  url TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow public inserts (since our API is server-side with service key or anon key, we'll allow anon inserts for simplicity or you can use service role in backend to bypass RLS)
-- Policy for Anon inserts
CREATE POLICY "Allow public inserts" ON queries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON conversions FOR INSERT TO public WITH CHECK (true);

-- Policy to prevent public reads (only backend / DB owner can read)
CREATE POLICY "Deny public reads" ON queries FOR SELECT TO public USING (false);
CREATE POLICY "Deny public reads" ON conversions FOR SELECT TO public USING (false);
