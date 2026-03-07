// CONTROLLER — auth flow: signUp, signIn, signOut, getSession; delegates to user.model for profile
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types";
import * as userModel from "@/models/user.model";
import { signUpSchema, loginSchema } from "@/lib/validations/auth";

export type AuthResult =
  | { success: true; profile?: Profile; redirectTo?: string }
  | { success: false; error: string };

export async function signUp(
  supabase: SupabaseClient,
  params: { email: string; password: string; full_name: string; role: UserRole }
): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse(params);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input";
    return { success: false, error: msg };
  }
  const { email, password, full_name, role } = parsed.data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, role },
    },
  });

  if (authError) {
    const msg = authError.message;
    const isRateLimit =
      msg.toLowerCase().includes("rate limit") ||
      msg.toLowerCase().includes("rate_limit") ||
      authError.status === 429;
    if (isRateLimit) {
      return {
        success: false,
        error:
          "Too many sign-up attempts. Please try again in about an hour. For local development, you can disable “Confirm email” in Supabase: Auth → Providers → Email.",
      };
    }
    return { success: false, error: msg };
  }
  if (!authData.user) return { success: false, error: "Sign up failed" };

  // Ensure profile exists and is synced (trigger may have already created it)
  await userModel.createProfile(supabase, {
    id: authData.user.id,
    email: authData.user.email ?? email,
    full_name,
    role,
  });

  return {
    success: true,
    redirectTo: "/dashboard",
  };
}

export async function signIn(
  supabase: SupabaseClient,
  params: { email: string; password: string }
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(params);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input";
    return { success: false, error: msg };
  }
  const { email, password } = parsed.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  if (!data.user) return { success: false, error: "Login failed" };

  const { data: profile } = await userModel.getProfileById(supabase, data.user.id);
  return {
    success: true,
    profile: profile ?? undefined,
    redirectTo: "/dashboard",
  };
}

export async function signOut(supabase: SupabaseClient): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getSession(supabase: SupabaseClient) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) return { session: null, error: error.message };
  return { session, error: null };
}

export async function getCurrentUserProfile(
  supabase: SupabaseClient
): Promise<{ profile: Profile | null; error: string | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { profile: null, error: userError?.message ?? "Not authenticated" };
  const { data: profile, error: profileError } = await userModel.getProfileById(
    supabase,
    user.id
  );
  return {
    profile: profile ?? null,
    error: profileError?.message ?? null,
  };
}
