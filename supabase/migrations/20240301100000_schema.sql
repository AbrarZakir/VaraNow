-- VaraNow: Enums and tables (profiles, properties, property_images, bookmarks, notifications)

-- Enums
CREATE TYPE public.profile_role AS ENUM ('seeker', 'owner_agent', 'admin');
CREATE TYPE public.property_type AS ENUM ('buy', 'rent');
CREATE TYPE public.property_category AS ENUM ('apartment', 'house', 'land');
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'rented');

-- Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role public.profile_role NOT NULL DEFAULT 'seeker',
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles; id matches auth.users(id).';

-- Properties
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type public.property_type NOT NULL,
  category public.property_category NOT NULL,
  price numeric(14, 2) NOT NULL CHECK (price >= 0),
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  address text NOT NULL,
  area_sqft numeric(10, 2) NOT NULL CHECK (area_sqft >= 0),
  bedrooms int NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms int NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  status public.property_status NOT NULL DEFAULT 'available',
  expiry_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_category ON public.properties(category);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_expiry_at ON public.properties(expiry_at);
CREATE INDEX idx_properties_location ON public.properties(latitude, longitude);
CREATE INDEX idx_properties_price ON public.properties(price);

COMMENT ON TABLE public.properties IS 'Listings; public listing queries should filter status = available AND expiry_at > now() in model layer.';

-- Property images
CREATE TABLE public.property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);

-- Bookmarks
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id)
);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_property_id ON public.bookmarks(property_id);

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read_at);

-- Updated_at trigger for profiles and properties
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
