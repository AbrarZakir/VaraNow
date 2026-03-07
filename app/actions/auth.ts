"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import * as authController from "@/controllers/auth.controller";

export type AuthActionState = { error?: string; redirectTo?: string };

export async function signUpAction(formData: FormData): Promise<AuthActionState> {
  const supabase = await createClient();
  const result = await authController.signUp(supabase, {
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
    full_name: (formData.get("full_name") as string) ?? "",
    role: (formData.get("role") as "seeker" | "owner_agent") ?? "seeker",
  });
  if (!result.success) return { error: result.error };
  return { redirectTo: result.redirectTo ?? "/dashboard" };
}

export async function loginAction(formData: FormData): Promise<AuthActionState> {
  const supabase = await createClient();
  const result = await authController.signIn(supabase, {
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
  });
  if (!result.success) return { error: result.error };
  return { redirectTo: result.redirectTo ?? "/dashboard" };
}

export async function signOutAction(_formData?: FormData): Promise<void> {
  const supabase = await createClient();
  await authController.signOut(supabase);
  redirect("/login");
}
