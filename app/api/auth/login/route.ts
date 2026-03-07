import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as authController from "@/controllers/auth.controller";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const email = (formData?.get("email") as string) ?? "";
  const password = (formData?.get("password") as string) ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }
  const supabase = await createClient();
  const result = await authController.signIn(supabase, { email, password });
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    redirectTo: result.redirectTo ?? "/dashboard",
  });
}
