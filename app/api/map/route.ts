import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await propertyController.listForMap(supabase);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
