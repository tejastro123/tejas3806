-- ============================================
-- Phase 3: Security Hardening
-- Run in: Supabase Dashboard → SQL Editor
-- (This project uses an external Supabase, so the agent cannot
--  apply migrations directly. Run this once to apply the fixes.)
-- ============================================

-- ---------------------------------------------------------
-- 1. Role-based admin checks (replace broad auth.role() = 'authenticated')
-- ---------------------------------------------------------
-- Any signed-in user currently has full write access to every CMS table.
-- Introduce a real role system and rewrite the write policies against it.

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL    ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- IMPORTANT: After running this migration, grant your admin account the
-- 'admin' role manually, e.g.:
--   INSERT INTO public.user_roles (user_id, role)
--   VALUES ('<your-admin-uuid>', 'admin');

-- Rewrite the over-permissive "Admin write" policies on every CMS table.
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'personal_info','social_links','about','experience','projects',
    'skills','services','blog_posts'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin write" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Admin write" ON public.%I FOR ALL TO authenticated
         USING (public.has_role(auth.uid(), ''admin''))
         WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- testimonials: keep the public insert (pending approval) but restrict admin ops
DROP POLICY IF EXISTS "Allow admins to manage all testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING      (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- messages: only admins read/update/delete; public insert is preserved.
DROP POLICY IF EXISTS "Admin all" ON public.messages;
CREATE POLICY "Admins manage messages" ON public.messages
  FOR ALL TO authenticated
  USING      (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blog_posts: keep public read of published rows; restrict admin-read-all to admins.
DROP POLICY IF EXISTS "Admin read all blog" ON public.blog_posts;
CREATE POLICY "Admins read all blog" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------
-- 2. Size constraints on public analytics_events
-- ---------------------------------------------------------
ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS ae_event_type_len,
  DROP CONSTRAINT IF EXISTS ae_event_label_len,
  DROP CONSTRAINT IF EXISTS ae_path_len,
  DROP CONSTRAINT IF EXISTS ae_referrer_len,
  DROP CONSTRAINT IF EXISTS ae_ua_len,
  DROP CONSTRAINT IF EXISTS ae_session_len,
  DROP CONSTRAINT IF EXISTS ae_metadata_size;

ALTER TABLE public.analytics_events
  ADD CONSTRAINT ae_event_type_len  CHECK (char_length(event_type)  <= 50),
  ADD CONSTRAINT ae_event_label_len CHECK (event_label IS NULL OR char_length(event_label) <= 200),
  ADD CONSTRAINT ae_path_len        CHECK (path        IS NULL OR char_length(path)        <= 500),
  ADD CONSTRAINT ae_referrer_len    CHECK (referrer    IS NULL OR char_length(referrer)    <= 500),
  ADD CONSTRAINT ae_ua_len          CHECK (user_agent  IS NULL OR char_length(user_agent)  <= 500),
  ADD CONSTRAINT ae_session_len     CHECK (session_id  IS NULL OR char_length(session_id)  <= 100),
  ADD CONSTRAINT ae_metadata_size   CHECK (metadata    IS NULL OR pg_column_size(metadata) <= 4096);

-- ---------------------------------------------------------
-- 3. Server-side avatar URL allow-list for public testimonials
-- ---------------------------------------------------------
-- Mirrors the client-side check in TestimonialsSection.tsx so attackers
-- cannot bypass it by calling the REST API directly.
CREATE OR REPLACE FUNCTION public.is_allowed_avatar_url(_url TEXT)
RETURNS BOOLEAN
LANGUAGE SQL IMMUTABLE
AS $$
  SELECT _url IS NULL
      OR _url = ''
      OR (
        _url ~* '^https://(www\.|secure\.)?(github\.com|avatars\.githubusercontent\.com|gravatar\.com|lh3\.googleusercontent\.com|media\.licdn\.com)/'
        AND char_length(_url) <= 500
      );
$$;

ALTER TABLE public.testimonials
  DROP CONSTRAINT IF EXISTS testimonials_avatar_allowlist;
ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_avatar_allowlist
  CHECK (public.is_allowed_avatar_url(avatar_url));

-- ---------------------------------------------------------
-- 4. Make sure messages length limits exist (idempotent)
-- ---------------------------------------------------------
ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_name_len,
  DROP CONSTRAINT IF EXISTS messages_email_len,
  DROP CONSTRAINT IF EXISTS messages_message_len;
ALTER TABLE public.messages
  ADD CONSTRAINT messages_name_len    CHECK (char_length(name)    <= 100),
  ADD CONSTRAINT messages_email_len   CHECK (char_length(email)   <= 200),
  ADD CONSTRAINT messages_message_len CHECK (char_length(message) <= 5000);
