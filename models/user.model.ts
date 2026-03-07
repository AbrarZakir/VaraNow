// MODEL — createProfile, getProfileById, getProfileByEmail, updateProfile (Supabase only)
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types";

export async function createProfile(
  supabase: SupabaseClient,
  params: { id: string; email: string; full_name: string; role: UserRole }
): Promise<{ data: Profile | null; error: Error | null }> {
  const { id, email, full_name, role } = params;
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id, email, full_name, role, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    )
    .select()
    .single();
  return { data: data as Profile | null, error: error as Error | null };
}

export async function getProfileById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Profile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return { data: data as Profile | null, error: error as Error | null };
}

export async function getProfileByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<{ data: Profile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();
  return { data: data as Profile | null, error: error as Error | null };
}

export async function updateProfile(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Pick<Profile, "full_name" | "role" | "phone" | "avatar_url">>
): Promise<{ data: Profile | null; error: Error | null }> {
  const { data: updated, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  return { data: updated as Profile | null, error: error as Error | null };
}
