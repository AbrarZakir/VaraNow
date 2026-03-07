-- VaraNow: Create profile on auth signup (trigger on auth.users)

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
  );
  RETURN NEW;
END;
$$;

-- Trigger on auth.users (runs after a new user is inserted by Supabase Auth)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
