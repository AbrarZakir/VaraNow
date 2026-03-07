-- VaraNow: Row Level Security policies

-- Helper: true when current user has admin role (used in multiple policies)
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

-- Profiles: read all (for display), update own row; admin can update any
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Properties: seekers/public see available+non-expired; owners see own; admin sees all
-- INSERT: only owner_agent or admin, and owner_id must be self
-- UPDATE/DELETE: own rows or admin
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_select_public_available"
  ON public.properties FOR SELECT
  TO anon, authenticated
  USING (
    (status = 'available' AND (expiry_at IS NULL OR expiry_at > now()))
    OR (owner_id = auth.uid())
    OR public.is_admin()
  );

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

CREATE POLICY "properties_update_own_or_admin"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "properties_delete_own_or_admin"
  ON public.properties FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin());

-- Property images: visibility same as parent property; only owner/admin can insert/update/delete
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "property_images_update_owner_or_admin"
  ON public.property_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
      AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
      AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

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

-- Bookmarks: CRUD only own rows
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Notifications: user sees only own; mark read only own. INSERT via service role only (no policy = no insert for anon/authenticated)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
