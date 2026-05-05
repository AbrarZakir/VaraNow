-- Fix: Add missing columns, enums, re-apply RLS policies, and set up triggers

-- Create enums if they don't exist
DO $$ BEGIN
  CREATE TYPE public.profile_role AS ENUM ('seeker', 'owner_agent', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.property_type AS ENUM ('buy', 'rent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.property_category AS ENUM ('apartment', 'house', 'land');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'rented');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add missing columns to properties if they don't exist
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS expiry_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Enable RLS (safe to run again)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- is_admin helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop and recreate policies to ensure they exist
-- profiles
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- properties
DROP POLICY IF EXISTS "properties_select_public_available" ON public.properties;
CREATE POLICY "properties_select_public_available"
  ON public.properties FOR SELECT
  TO anon, authenticated
  USING (
    (status = 'available' AND (expiry_at IS NULL OR expiry_at > now()))
    OR (owner_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "properties_insert_owner_or_admin" ON public.properties;
CREATE POLICY "properties_insert_owner_or_admin"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('owner_agent', 'admin')
    )
  );

DROP POLICY IF EXISTS "properties_update_own_or_admin" ON public.properties;
CREATE POLICY "properties_update_own_or_admin"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "properties_delete_own_or_admin" ON public.properties;
CREATE POLICY "properties_delete_own_or_admin"
  ON public.properties FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin());

-- property_images
DROP POLICY IF EXISTS "property_images_select" ON public.property_images;
CREATE POLICY "property_images_select"
  ON public.property_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
      AND (
        (p.status = 'available' AND (p.expiry_at IS NULL OR p.expiry_at > now()))
        OR p.owner_id = auth.uid()
        OR public.is_admin()
      )
    )
  );

DROP POLICY IF EXISTS "property_images_insert_owner_or_admin" ON public.property_images;
CREATE POLICY "property_images_insert_owner_or_admin"
  ON public.property_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
      AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "property_images_delete_owner_or_admin" ON public.property_images;
CREATE POLICY "property_images_delete_owner_or_admin"
  ON public.property_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
      AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

-- bookmarks
DROP POLICY IF EXISTS "bookmarks_select_own" ON public.bookmarks;
CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "bookmarks_insert_own" ON public.bookmarks;
CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "bookmarks_delete_own" ON public.bookmarks;
CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- notifications
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb;
  user_role public.profile_role;
  user_full_name text;
BEGIN
  meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  user_full_name := COALESCE(meta->>'full_name', '');
  user_role := CASE meta->>'role'
    WHEN 'owner_agent' THEN 'owner_agent'::public.profile_role
    WHEN 'admin' THEN 'admin'::public.profile_role
    ELSE 'seeker'::public.profile_role
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    user_full_name,
    user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
