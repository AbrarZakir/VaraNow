import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as authController from "@/controllers/auth.controller";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const email = (formData?.get("email") as string) ?? "";
  const password = (formData?.get("password") as string) ?? "";
  const full_name = (formData?.get("full_name") as string) ?? "";
  const role = (formData?.get("role") as "seeker" | "owner_agent") ?? "seeker";
  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "Email, password, and full name are required" },
      { status: 400 }
    );
  }
  const supabase = await createClient();
  const result = await authController.signUp(supabase, {
    email,
    password,
    full_name,
    role,
  });
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    redirectTo: result.redirectTo ?? "/dashboard",
  });
}
