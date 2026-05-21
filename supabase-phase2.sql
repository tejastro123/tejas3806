-- ============================================
-- Phase 2: Blog CMS + Analytics
-- Run in: Supabase Dashboard → SQL Editor
-- (Or via Supabase CLI: supabase db push using this as a migration)
-- ============================================

-- --- Blog CMS upgrades -----------------------------------
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

UPDATE blog_posts
SET slug = lower(regexp_replace(coalesce(title, id::text), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique ON blog_posts(slug);

DROP POLICY IF EXISTS "Public read" ON blog_posts;
CREATE POLICY "Public read published" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admin read all blog" ON blog_posts
  FOR SELECT TO authenticated USING (true);

-- --- Analytics events ------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_label TEXT,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_label_idx ON analytics_events(event_label);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read analytics" ON analytics_events
  FOR SELECT TO authenticated USING (true);

-- --- Length limits on user-submitted content -------------
-- If a constraint already exists, drop it first then re-run.
ALTER TABLE messages
  ADD CONSTRAINT messages_name_len CHECK (char_length(name) <= 100),
  ADD CONSTRAINT messages_email_len CHECK (char_length(email) <= 200),
  ADD CONSTRAINT messages_message_len CHECK (char_length(message) <= 5000);

ALTER TABLE testimonials
  ADD CONSTRAINT testimonials_name_len CHECK (char_length(name) <= 100),
  ADD CONSTRAINT testimonials_content_len CHECK (char_length(content) <= 1000),
  ADD CONSTRAINT testimonials_avatar_len CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 500);
