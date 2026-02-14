-- ============================================
-- Supabase Schema for Portfolio Admin Dashboard
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================
-- 1. Personal Info (single row)
CREATE TABLE personal_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  bio_tagline TEXT NOT NULL DEFAULT '',
  bio_short TEXT NOT NULL DEFAULT '',
  bio_long TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- 2. Social Links
CREATE TABLE social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);
-- 3. About
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  fun_facts JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- 4. Experience
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'work',
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  skills TEXT [] DEFAULT '{}',
  sort_order INT DEFAULT 0
);
-- 5. Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT [] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT '',
  demo TEXT DEFAULT '#',
  github TEXT DEFAULT '',
  image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);
-- 6. Skills
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Code2',
  items JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0
);
-- 7. Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'Globe',
  sort_order INT DEFAULT 0
);
-- 8. Blog Posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  read_time TEXT DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  link TEXT DEFAULT '#',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
-- 9. Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  content TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  is_approved BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- 10. Messages (Contact Form)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- Row Level Security (RLS)
-- Public can READ, only authenticated can WRITE
-- ============================================
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Public read policies
CREATE POLICY "Public read" ON personal_info FOR
SELECT USING (true);
CREATE POLICY "Public read" ON social_links FOR
SELECT USING (true);
CREATE POLICY "Public read" ON about FOR
SELECT USING (true);
CREATE POLICY "Public read" ON experience FOR
SELECT USING (true);
CREATE POLICY "Public read" ON projects FOR
SELECT USING (true);
CREATE POLICY "Public read" ON skills FOR
SELECT USING (true);
CREATE POLICY "Public read" ON services FOR
SELECT USING (true);
CREATE POLICY "Public read" ON blog_posts FOR
SELECT USING (true);
CREATE POLICY "Public read" ON testimonials FOR
SELECT USING (is_approved = true);
-- Public can send messages
CREATE POLICY "Public insert" ON messages FOR
INSERT WITH CHECK (true);
-- Allow public to insert new testimonials (pending approval)
CREATE POLICY "Allow public to insert testimonials" ON public.testimonials FOR
INSERT WITH CHECK (true);
-- Admin write policies (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin write" ON personal_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
-- Allow admins to manage all testimonials
CREATE POLICY "Allow admins to manage all testimonials" ON public.testimonials USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all" ON messages FOR ALL USING (auth.role() = 'authenticated');